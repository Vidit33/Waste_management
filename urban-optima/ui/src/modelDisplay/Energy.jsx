// File: src/components/Energy.jsx
import React, { useState, useEffect } from "react";
import { FaBolt, FaLeaf, FaCloud, FaIndustry, FaChartPie, FaSlidersH, FaExclamationTriangle } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function Energy() {
  const [region, setRegion] = useState("India");
  const [energyData, setEnergyData] = useState(null);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetchTrendData();
  }, [region]);

  const fetchTrendData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/energy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region }),
      });
      const result = await res.json();
      setTrendData(result.trend);
    } catch (error) {
      console.error("Error fetching energy data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16 font-sans">
      {/* Region Selector */}
      <div className="mb-6 max-w-md mx-auto flex gap-2">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
        >
          <option value="India">India</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Maharashtra">Maharashtra</option>
          {/* Add more states/cities */}
        </select>
        <button
          onClick={fetchTrendData}
          className="px-4 bg-purple-600 text-white text-lg rounded-md hover:bg-purple-700"
        >
          Load
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg flex flex-col items-center">
          <FaBolt className="text-purple-500 text-2xl mb-2" />
          <p className="text-lg font-bold">{energyData?.demand || "--"} MWh</p>
          <p className="text-xs text-gray-500">Total Demand</p>
        </div>
        <div className="bg-white p-4 rounded-lg flex flex-col items-center">
          <FaIndustry className="text-purple-500 text-2xl mb-2" />
          <p className="text-lg font-bold">{energyData?.generation || "--"} MWh</p>
          <p className="text-xs text-gray-500">Total Generation</p>
        </div>
        <div className="bg-white p-4 rounded-lg flex flex-col items-center">
          <FaLeaf className="text-green-500 text-2xl mb-2" />
          <p className="text-lg font-bold">{energyData?.renewable_share || "--"}%</p>
          <p className="text-xs text-gray-500">Renewable Share</p>
        </div>
        <div className="bg-white p-4 rounded-lg flex flex-col items-center">
          <FaCloud className="text-red-500 text-2xl mb-2" />
          <p className="text-lg font-bold">{energyData?.carbon_intensity || "--"}</p>
          <p className="text-xs text-gray-500">Carbon Intensity</p>
        </div>
        <div className="bg-white p-4 rounded-lg flex flex-col items-center">
          <FaChartPie className="text-blue-500 text-2xl mb-2" />
          <p className="text-lg font-bold">{energyData?.fossil_dependency || "--"}%</p>
          <p className="text-xs text-gray-500">Fossil Dependency</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Mix Pie Chart */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaChartPie className="text-purple-500" /> Energy Mix
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={energyData?.energy_mix}
                dataKey="value"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                label
              >
                {energyData?.energy_mix?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Demand vs Supply Chart */}
        <div className="bg-white border rounded-lg p-4 mt-6">
          <h2 className="text-xl font-semibold mb-2">Demand vs Generation vs Emissions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="demand_twh" stroke="#00C9C9" strokeWidth={2} name="Demand" />
              <Line type="monotone" dataKey="generation_twh" stroke="#F39C12" strokeWidth={2} name="Generation" />
              <Line type="monotone" dataKey="emissions_mtco2" stroke="#E74C3C" strokeWidth={2} name="Emissions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Emissions & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Power Sector Emissions</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={energyData?.emissions_trend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="emissions" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaSlidersH className="text-purple-500" /> Scenario Simulator
          </h2>
          <p className="text-sm text-gray-500 mb-2">Increase Solar/Wind Capacity:</p>
          <input type="range" min="0" max="100" step="5" className="w-full" />
          <div className="mt-3 text-sm">
            <p>Estimated Renewable Share: <span className="font-bold">{energyData?.simulated_share || "--"}%</span></p>
            <p>Avoided Emissions: <span className="font-bold text-green-600">{energyData?.avoided_emissions || "--"} ktCO₂</span></p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg">
          
          <h3 className="font-semibold text-yellow-800 mb-1 flex items-center gap-2"><FaExclamationTriangle />Smart Suggestion</h3>
          <p className="text-sm text-yellow-900">  
          
          </p>
        </div>
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg">
          
          <h3 className="font-semibold text-green-800 mb-1 flex items-center gap-2">Contribute As Individual</h3>
          <p className="text-sm text-yellow-900">  
          
          </p>
        </div>
      </div>
    </div>
  );
}

export default Energy;
