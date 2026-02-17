// File: src/components/Air.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaWind,
  FaTemperatureHigh,
  FaTint,
  FaEye,
  FaMapMarkerAlt,
  FaExclamationTriangle
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



function Air() {
  const [city, setCity] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [forecastData, setForecastData] = useState();

  const fetchAirData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/air", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      const result = await res.json();
      setAqiData(result);

      const forecastRes = await axios.get("http://localhost:5000/api/airForecast", {
      params: { city }
      });
      setForecastData(forecastRes.data);

    } catch (error) {
      console.error("Error fetching AQI data:", error);
    }
  };




  useEffect(() => {
    fetchAirData();
  }, [city]);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAirData(); // This triggers fetch
  };
  function getAQIClass(aqi) {
    switch (aqi) {
      case 1:
        
        return "bg-green-200 text-green-600";
      case 2:
        return "bg-yellow-200 text-yellow-700";
      case 3:
        return "bg-orange-200 text-orange-600";
      case 4:
        return "bg-red-200 text-red-600";
      case 5:
        return "bg-purple-200 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans mt-16">
      {/* City Input */}
      <div className="mb-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="mb-6 max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., Jaipur)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
          />
          <button
          type="submit"
          className="px-4  bg-purple-600 text-white text-lg rounded-md hover:bg-purple-700"
          >Search</button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="col-span-2 bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-purple-500" /> {city} City Map
          </h2>
          <div className="w-full h-96 rounded-xl overflow-hidden">
            {/* <iframe
              src={`http://localhost:5000/map/air?city=${encodeURIComponent(
                city
              )}`}
              title="Air Quality Map"
              className="w-full h-full border-0 rounded-md"
            /> */}
            <div dangerouslySetInnerHTML={{ __html: aqiData?.map_html }} />

          </div>
        </div>

        {/* AQI Section */}
        <div className="bg-white border rounded-lg p-4 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-2">Air Quality Index</h2>
          <div className={`w-32 h-32 border-[2px] rounded-full flex items-center justify-center text-3xl font-bold ${getAQIClass(aqiData?.aqi)}`}>
            {aqiData?.aqi || "--"}
          </div>
          <p className={`mt-2 text-md font-medium ${getAQIClass(aqiData?.aqi)}`}>
            {aqiData?.aqi_text || ""}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {aqiData?.city || "City"}, India
          </p>

          {/* Pollutants */}
          <div className="mt-4 w-full">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Pollutants
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-7 text-sm">
              {aqiData?.components &&
                Object.entries(aqiData.components).map(([key, value]) => (
                  <div className="flex justify-between w-full" key={key}>
                    <span className="text-purple-600 font-medium">
                      {key.toUpperCase()}
                    </span>
                    <span className="font-medium text-gray-600">
                      {value.toFixed(2)} μg/m³
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weather + Advisory Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Weather Analysis</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-orange-500">
                <FaTemperatureHigh /> Temperature
              </span>
              <span>{aqiData?.temperature}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-blue-500">
                <FaTint /> Humidity
              </span>
              <span>{aqiData?.humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-green-500">
                <FaWind /> Wind
              </span>
              <span>{aqiData?.wind_speed} km/h</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-purple-500">
                <FaEye /> Condition
              </span>
              <span>{aqiData?.weather?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg">
          
          <h3 className="font-semibold text-yellow-800 mb-1 flex items-center gap-2"><FaExclamationTriangle />Health Advice</h3>
          <p className="text-sm text-yellow-900">

            {aqiData?.suggestion}
          </p>
        </div>

        {/* <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-1">Travel Advisory</h3>
          <p className="text-sm text-yellow-900">
            
          </p>
        </div> */}

        <div className="bg-white p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">3-Day AQI Forecast</h3>
          <ul className="text-sm space-y-2">
            {forecastData?.map((item, index) => (
              <li className="flex justify-between" key={index}>
                <span>{item.date_str}</span>
                <span className= {`px-2 py-1 rounded-full ${getAQIClass(item.aqi_range)}`}>
                  {item.exp_aqi}
                
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Forecast Graph */}
      <div className="bg-white mt-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          AQI Forecast (Next 3 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={forecastData}>
            <XAxis dataKey="date_str" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="exp_aqi" stroke="#a855f7" strokeWidth={2} />
          </LineChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Air;
