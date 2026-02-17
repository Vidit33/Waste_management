from flask import Blueprint, request, jsonify
import logging
import pandas as pd
import requests
from app.config import EMBER_API_KEY

energy_bp = Blueprint("energy", __name__)
logger = logging.getLogger(__name__)

BASE_URL = "https://api.ember-energy.org/v1"

REGION_CODE_MAP = {
    "INDIA": "IND",
    "IND": "IND",
}

RENEWABLE_SERIES = {
    "Solar",
    "Wind",
    "Hydro",
    "Bioenergy",
    "Other renewables",
    "Renewables",
}

FOSSIL_SERIES = {
    "Coal",
    "Oil",
    "Gas",
}


def fetch_data(endpoint, params):
    url = f"{BASE_URL}/{endpoint}"
    payload = dict(params)
    if EMBER_API_KEY:
        payload["api_key"] = EMBER_API_KEY
    response = requests.get(url, params=payload, timeout=15)
    if response.status_code != 200:
        logger.error("Ember API error %s from %s: %s", response.status_code, url, response.text)
        return pd.DataFrame()
    return pd.DataFrame(response.json().get("data", []))


def _normalize_value_column(df, target_name):
    for candidate in ["value", target_name]:
        if candidate in df.columns:
            df = df.rename(columns={candidate: target_name})
            return df
    return df


def _format_date(df):
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"])
        df["date"] = df["date"].dt.strftime("%Y-%m")
    return df


def get_combined_data(region="IND", start="2025-01", end="2025-08"):
    # Demand
    demand_df = fetch_data(
        "electricity-demand/monthly",
        {"entity_code": region, "start_date": start, "end_date": end},
    )
    if not demand_df.empty:
        demand_df = _normalize_value_column(demand_df, "demand_twh")
        demand_df = demand_df[["date", "demand_twh"]]

    # Generation
    gen_df = fetch_data(
        "electricity-generation/monthly",
        {"entity_code": region, "start_date": start, "end_date": end},
    )
    if not gen_df.empty:
        gen_df = _normalize_value_column(gen_df, "generation_twh")

    # Emissions
    co2_df = fetch_data(
        "power-sector-emissions/monthly",
        {"entity_code": region, "start_date": start, "end_date": end},
    )
    if not co2_df.empty:
        co2_df = _normalize_value_column(co2_df, "emissions_mtco2")

    total_gen_df = pd.DataFrame()
    if not gen_df.empty and "series" in gen_df.columns:
        total_gen_df = gen_df[gen_df["series"] == "Total generation"][["date", "generation_twh"]]

    total_co2_df = pd.DataFrame()
    if not co2_df.empty and "series" in co2_df.columns:
        total_co2_df = co2_df[co2_df["series"] == "Total generation"][["date", "emissions_mtco2"]]

    merged = demand_df if not demand_df.empty else pd.DataFrame(columns=["date"])
    if not total_gen_df.empty:
        merged = merged.merge(total_gen_df, on="date", how="outer")
    if not total_co2_df.empty:
        merged = merged.merge(total_co2_df, on="date", how="outer")

    merged = _format_date(merged)
    return merged.sort_values("date")


def build_energy_mix(gen_df):
    if gen_df.empty or "series" not in gen_df.columns:
        return [], None, None

    gen_df = gen_df.copy()
    gen_df = _normalize_value_column(gen_df, "generation_twh")
    gen_df["date"] = pd.to_datetime(gen_df["date"])
    latest_date = gen_df["date"].max()
    latest = gen_df[gen_df["date"] == latest_date]

    total = latest[latest["series"] == "Total generation"]["generation_twh"].sum()
    if not total or total == 0:
        return [], None, None

    mix_entries = []
    color_map = {
        "Coal": "#ef4444",
        "Gas": "#f97316",
        "Oil": "#a16207",
        "Solar": "#facc15",
        "Wind": "#22c55e",
        "Hydro": "#38bdf8",
        "Nuclear": "#a855f7",
        "Bioenergy": "#10b981",
        "Other renewables": "#14b8a6",
    }

    renewable_total = 0.0
    fossil_total = 0.0

    for _, row in latest.iterrows():
        series = row.get("series")
        if series == "Total generation":
            continue
        value = float(row.get("generation_twh", 0))
        if value <= 0:
            continue
        mix_entries.append({
            "source": series,
            "value": round(value, 2),
            "color": color_map.get(series, "#94a3b8"),
        })
        if series in RENEWABLE_SERIES:
            renewable_total += value
        if series in FOSSIL_SERIES:
            fossil_total += value

    renewable_share = round((renewable_total / total) * 100, 2) if total else None
    fossil_dependency = round((fossil_total / total) * 100, 2) if total else None

    return mix_entries, renewable_share, fossil_dependency


@energy_bp.route("/api/energy", methods=["GET", "POST"])
def get_energy():
    req = request.get_json(silent=True) or {}
    region_name = (request.args.get("region") or req.get("region") or "India").upper()
    region = REGION_CODE_MAP.get(region_name, region_name)
    start = request.args.get("start_date") or req.get("start_date") or "2025-01"
    end = request.args.get("end_date") or req.get("end_date") or "2025-08"

    try:
        df = get_combined_data(region, start, end)
        trend = df.to_dict(orient="records")

        gen_df = fetch_data(
            "electricity-generation/monthly",
            {"entity_code": region, "start_date": start, "end_date": end},
        )
        energy_mix, renewable_share, fossil_dependency = build_energy_mix(gen_df)

        latest = df.dropna(subset=["date"]).tail(1)
        latest_row = latest.iloc[0] if not latest.empty else {}

        demand = float(latest_row.get("demand_twh", 0)) if latest_row is not None else 0
        generation = float(latest_row.get("generation_twh", 0)) if latest_row is not None else 0
        emissions = float(latest_row.get("emissions_mtco2", 0)) if latest_row is not None else 0
        carbon_intensity = round(emissions / generation, 2) if generation else None

        peak_period = (
            df.loc[df["demand_twh"].idxmax(), "date"]
            if not df.empty and "demand_twh" in df.columns
            else None
        )

        suggestion = "Energy demand is stable."
        if renewable_share is not None and renewable_share < 30:
            suggestion = "Increase renewable uptake and shift non-critical loads off-peak."
        elif demand and generation and demand > generation:
            suggestion = "Demand exceeds generation. Consider load shifting and storage support."

        return jsonify({
            "trend": trend,
            "summary": {
                "region": region,
                "demand": round(demand, 2) if demand else None,
                "generation": round(generation, 2) if generation else None,
                "renewable_share": renewable_share,
                "fossil_dependency": fossil_dependency,
                "carbon_intensity": carbon_intensity,
                "peak_period": peak_period,
                "suggestion": suggestion,
            },
            "energy_mix": energy_mix,
            "emissions_trend": [
                {"month": item.get("date"), "emissions": item.get("emissions_mtco2")}
                for item in trend
            ],
        })
    except Exception:
        logger.exception("Energy API failure for region=%s", region)
        return jsonify({"error": "Energy service unavailable"}), 500