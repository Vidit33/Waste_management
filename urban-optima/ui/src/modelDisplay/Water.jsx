import React, { useEffect, useState } from "react";
import {
  FaTint,
  FaChartPie,
  FaTachometerAlt,
  FaWater,
  FaExclamationTriangle,
  FaFaucet,
  FaHandsHelping,
  FaRecycle,
  FaCloudSun,
} from "react-icons/fa";

function Water() {
  const [area, setArea] = useState("");
  const [data, setData] = useState(null);

  const fetchWaterData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area }),
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching water data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWaterData();
  };

  // Determine color based on usage level
  const getUsageColor = (percentage) => {
    if (percentage <= 50) return "text-green-600 bg-green-100";
    if (percentage <= 80) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans mt-16">
      {/* Area Input */}
      <div className="mb-6 max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="mb-6 max-w-md mx-auto flex gap-2"
        >
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter area name (e.g., Malviya Nagar)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 bg-purple-600 text-white text-lg rounded-md hover:bg-purple-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Water Overview */}
        <div className="col-span-2 bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaWater className="text-purple-500" /> Water Usage Overview
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <FaTint className="text-purple-600 text-2xl mb-2 mx-auto" />
              <p className="text-lg font-bold">{data?.total_usage || "--"} L</p>
              <p className="text-sm text-gray-600">Total Usage</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <FaChartPie className="text-blue-500 text-2xl mb-2 mx-auto" />
              <p className="text-lg font-bold">{data?.needed || "--"} L</p>
              <p className="text-sm text-gray-600">Required Water</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <FaTachometerAlt className="text-green-600 text-2xl mb-2 mx-auto" />
              <p className="text-lg font-bold">
                {data?.consumed || "--"} L
              </p>
              <p className="text-sm text-gray-600">Consumed</p>
            </div>
          </div>

          {/* Consumption Progress */}
          {data && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaFaucet className="text-purple-500" /> Consumption Status
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${data?.consumption_percentage || 0}%` }}
                ></div>
              </div>
              <p
                className={`mt-2 text-sm font-semibold text-center p-1 rounded-md ${
                  getUsageColor(data?.consumption_percentage)
                }`}
              >
                {data?.consumption_percentage
                  ? `${data.consumption_percentage}% of water consumed`
                  : "No data yet"}
              </p>
            </div>
          )}
        </div>

        {/* Right Section: Smart Insights */}
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FaExclamationTriangle /> Smart Suggestion
          </h3>
          <p className="text-sm leading-relaxed">{data?.suggestion || "Enter an area to get water management insights."}</p>
        </div>
      </div>

      {/* Sustainability Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FaHandsHelping className="text-green-500" /> How to Preserve Water
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Fix leaking taps and pipes promptly.</li>
            <li>Use efficient irrigation systems.</li>
            <li>Collect and reuse rainwater.</li>
            <li>Use low-flow fixtures in homes and offices.</li>
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FaRecycle className="text-blue-500" /> Reduce Wastage
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Monitor daily usage patterns via smart meters.</li>
            <li>Run washing machines and dishwashers only when full.</li>
            <li>Recycle greywater for non-potable use.</li>
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FaCloudSun className="text-purple-500" /> Coping with Scarcity
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Adopt drought-tolerant landscaping.</li>
            <li>Use stored or treated wastewater for public use.</li>
            <li>Spread community awareness on water conservation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Water;
