import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaHospital, FaRoad, FaTachometerAlt, FaClock, FaExclamationTriangle, FaCloudSun, FaWater, FaThermometerHalf, FaArrowRight } from 'react-icons/fa';


const Traffic = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState({}); 

  const fetchTrafficData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });
      const result = await res.json();
      setData(result);  // ✅ Now React can update the values!
    } catch (error) {
      console.error("Error fetching traffic:", error);
    }
  };
  
  const origin = encodeURIComponent(data.from);
  const destination = encodeURIComponent(data.to);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 mt-16">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Grid: Map and Route Info */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-purple-400 p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaMapMarkerAlt /> Route Information
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              fetchTrafficData();
            }}>
              <input
                type="text"
                placeholder="Enter Pickup Location"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mb-2 w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Enter Destination"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              /> 
              <button type='submit' onClick={fetchTrafficData} className="bg-purple-600 text-white p-2 rounded mt-2 w-full active:bg-purple-700 ">Get Route Info</button> 
            </form>
          </div>
          <div className="bg-white rounded-lg border border-purple-400 p-4 flex flex-col items-center justify-center">
            <div className="w-full h-80 bg-blue-100 rounded-md flex flex-col items-center justify-center text-sm text-gray-700">
           <iframe
              src={`http://localhost:5000/map?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
              title="Traffic Map"
              className="w-full h-full border-0 rounded-md"
            />
            </div>
          </div>
        </div>
        {/* Right Grid: Metrics, Traffic, Weather, Suggestion */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-purple-400 p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaRoad /> Travel Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl font-bold">{data.distance}</p>
                <p className="text-xs text-gray-600">km Distance</p>
              </div>
              <div>
                <p className="text-xl font-bold">{data.speed}</p>
                <p className="text-xs text-gray-600">km/h Speed</p>
              </div>
              <div>
                <p className="text-xl font-bold">{data.eta}</p>
                <p className="text-xs text-gray-600">min ETA</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-600">{data.delay}%</p>
                <p className="text-xs text-gray-600">Traffic Delay</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-purple-400 p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaTachometerAlt /> Traffic Status
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-sm">Traffic Level</p>
              <p className="text-sm text-red-500 font-semibold"></p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${data.delay}%` }}></div>
            </div>
          </div>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg">
            <h3 className="font-bold mb-1 flex items-center gap-2">
              <FaExclamationTriangle /> Smart Suggestion
            </h3>
            <p>{data.suggestion}</p>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Traffic;


