def calculate_wqi(ph, turbidity, tds, dissolved_oxygen, temperature):
    wqi = (
        0.2 * ph +
        0.2 * turbidity +
        0.2 * tds +
        0.2 * dissolved_oxygen +
        0.2 * temperature
    )
    return round(wqi, 2)


def classify_wqi(wqi):
    if wqi < 50:
        return "Good"
    elif wqi < 100:
        return "Moderate"
    else:
        return "Poor"
