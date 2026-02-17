import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SustainablityCard() {
  const [data, setData] = useState(null);

//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/api/overall-data')
//       .then(res => res.json())
//       .then(setData)
//       .catch(err => console.error('Error fetching sustainability data:', err));
//   }, []);
    useEffect(() => {
    const mockData = {
      overall_score: 78,
      status: "Needs Improvement",
      air: 95,            // AQI
      traffic: 60,        // % congestion
      energy: 35,         // % renewable
      water: 150          // L/person/day
    };

    // Simulate async fetch
    setTimeout(() => setData(mockData), 500);
  }, []);

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center w-64">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-b from-purple-100 to-green-100 border border-slate-500 rounded-xl shadow-md  p-6 w-72 text-center mr-8"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-green-700 mb-2">City Sustainability Index</h3>

      {/* Animated score */}
      <motion.h1
        key={data.overall_score}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-green-800"
      >
        {data.overall_score}
      </motion.h1>
      <p
        className={`mt-1 font-semibold ${
          data.status === 'Sustainable'
            ? 'text-green-600'
            : data.status === 'Needs Improvement'
            ? 'text-yellow-500'
            : 'text-red-500'
        }`}
      >
        {data.status}
      </p>

      <div className="mt-4 text-left text-gray-700 text-sm space-y-1">
        <p><strong>Air:</strong> AQI {data.air}</p>
        <p><strong>Traffic:</strong> {data.traffic}% congestion</p>
        <p><strong>Energy:</strong> {data.energy}% renewable</p>
        <p><strong>Water:</strong> {data.water} L/person/day</p>
      </div>

      <p className="text-xs text-gray-500 mt-3 italic">
        Tip: Increase renewables & reduce AQI for a higher score 🌎
      </p>
    </motion.div>
  );
}


