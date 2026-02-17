import React, { useState } from "react";

export default function Waste() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runFullCycle = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setLogs([]);
    setResult(null);
    setLoading(true);

    setLogs(["🔍 AI scanning area for waste..."]);
    await sleep(1000);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/waste/full-cycle",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("SERVER RESPONSE:", data);

      if (data.waste_detected) {
        setLogs((prev) => [
          ...prev,
          "⚠ Waste detected in monitored zone.",
        ]);
        await sleep(800);

        setLogs((prev) => [
          ...prev,
          "🚨 Cleaning protocol triggered.",
        ]);
        await sleep(800);

        setLogs((prev) => [
          ...prev,
          "🤖 Autonomous cleaning unit dispatched.",
        ]);
        await sleep(1200);

        setLogs((prev) => [
          ...prev,
          "🧪 Performing post-cleaning verification...",
        ]);
        await sleep(1000);
      } else {
        setLogs((prev) => [
          ...prev,
          "✅ Area already clean. No cleaning required.",
        ]);
        await sleep(800);
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Server error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-slate-50">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">
        Smart AI Waste Monitoring System
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Upload Area Image
        </h2>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <div className="text-center mb-10">
        <button
          onClick={runFullCycle}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition transform"
        >
          {loading ? "Running AI Cleaning Protocol..." : "Run Cleaning Analysis"}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="bg-black text-green-400 font-mono p-6 rounded-xl shadow-lg mb-8 space-y-2">
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      )}

      {result && (
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-3">
          <p>
            Waste Detected: <b>{result.waste_detected ? "Yes" : "No"}</b>
          </p>
          <p>
            Clutter Score: <b>{result.clutter_score}</b>
          </p>
          <p>
            Cleaning Triggered: <b>{result.cleaning_triggered ? "Yes" : "No"}</b>
          </p>
          <p className="text-xl font-bold">
            {result.cleaning_successful
              ? "Cleaning Successful ✅"
              : "Cleaning Failed ❌"}
          </p>
        </div>
      )}
    </div>
  );
}
