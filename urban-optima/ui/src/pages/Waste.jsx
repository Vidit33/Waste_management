import React, { useState } from "react";

export default function Waste() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runFullCycle = async () => {
    if (!beforeImage || !afterImage) {
      alert("Please upload both images.");
      return;
    }

    setLogs([]);
    setResult(null);
    setLoading(true);

    // STEP 1 — Scanning
    setLogs((prev) => [...prev, "🔍 Scanning area for waste..."]);
    await sleep(1000);

    // Call backend
    const formData = new FormData();
    formData.append("before", beforeImage);
    formData.append("after", afterImage);

    let data;

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/waste/full-cycle",
        {
          method: "POST",
          body: formData,
        }
      );

      data = await response.json();
    } catch (error) {
      console.error(error);
      alert("Server error occurred.");
      setLoading(false);
      return;
    }

    // If waste detected → show cleaning protocol
    if (data.before.waste_detected) {
      setLogs((prev) => [
        ...prev,
        "⚠ Waste detected in monitored zone.",
      ]);
      await sleep(1000);

      setLogs((prev) => [
        ...prev,
        "🚨 Cleaning protocol triggered.",
      ]);
      await sleep(1000);

      setLogs((prev) => [
        ...prev,
        "🤖 Autonomous cleaning unit dispatched.",
      ]);
      await sleep(1500);
    } else {
      setLogs((prev) => [
        ...prev,
        "✅ Area already clean. No cleaning required.",
      ]);
      await sleep(1000);
    }

    setLogs((prev) => [
      ...prev,
      "🧪 Performing post-cleaning verification...",
    ]);
    await sleep(1200);

    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-slate-50">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">
        Smart AI Waste Monitoring System
      </h1>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Upload Before Image
          </h2>
          <input
            type="file"
            onChange={(e) => setBeforeImage(e.target.files[0])}
          />
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Upload After Image
          </h2>
          <input
            type="file"
            onChange={(e) => setAfterImage(e.target.files[0])}
          />
        </div>
      </div>

      {/* Run Button */}
      <div className="text-center mb-10">
        <button
          onClick={runFullCycle}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition transform"
        >
          {loading ? "Running AI Cleaning Protocol..." : "Run Cleaning Analysis"}
        </button>
      </div>

      {/* SYSTEM LOG PANEL */}
      {logs.length > 0 && (
        <div className="bg-black text-green-400 font-mono p-6 rounded-xl shadow-lg mb-8 space-y-2">
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      )}

      {/* FINAL RESULT SECTION */}
      {result && (
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">
                Before Analysis
              </h2>
              <p>
                Waste Detected:{" "}
                <span className="font-bold">
                  {result.before.waste_detected ? "Yes" : "No"}
                </span>
              </p>
              <p>Clutter Score: {result.before.clutter_score}</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">
                After Analysis
              </h2>
              <p>
                Waste Detected:{" "}
                <span className="font-bold">
                  {result.after.waste_detected ? "Yes" : "No"}
                </span>
              </p>
              <p>Clutter Score: {result.after.clutter_score}</p>
            </div>

          </div>

          <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-xl shadow-md text-center">
            <h2 className="text-lg font-semibold mb-3">
              Cleaning Verification
            </h2>

            {result.verification.cleaning_successful ? (
              <p className="text-green-700 font-bold text-xl">
                Cleaning Successful ✅
              </p>
            ) : (
              <p className="text-red-600 font-bold text-xl">
                Cleaning Failed ❌
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
