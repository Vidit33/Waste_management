import React, { useState } from "react";

export default function WasteCard() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (!image) {
      alert("Upload image first");
      return;
    }

    setLoading(true);
    setResult(null);

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
      setResult(data);
    } catch (error) {
      alert("Server error occurred");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6">

      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Smart Waste Detection Demo
      </h1>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={runAnalysis}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>

      {result && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg text-center">

          <p className="text-lg">
            Waste Detected:{" "}
            <b>
              {result.before.waste_detected ? "Yes" : "No"}
            </b>
          </p>

          <p>Clutter Score: {result.before.clutter_score}</p>

          <p>
            Cleaning Triggered:{" "}
            {result.cleaning_action.cleaning_triggered ? "Yes" : "No"}
          </p>

          <p>
            Cleaning Successful:{" "}
            {result.verification.cleaning_successful ? "Yes" : "No"}
          </p>

        </div>
      )}
    </div>
  );
}
