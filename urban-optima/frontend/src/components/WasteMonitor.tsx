import { useState } from "react";

const API = "http://127.0.0.1:5000";

const WasteMonitor = () => {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (endpoint: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    await fetch(`${API}${endpoint}`, {
      method: "POST",
      body: formData,
    });
  };

  const handleVerify = async () => {
    if (!beforeFile || !afterFile) {
      alert("Please upload both BEFORE and AFTER images");
      return;
    }

    setLoading(true);

    await uploadImage("/api/upload-before", beforeFile);
    await uploadImage("/api/upload-after", afterFile);

    const res = await fetch(`${API}/api/verify-cleaning`);
    const data = await res.json();

    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #444" }}>
      <h2>Waste Detection & Cleaning Verification</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Before Cleaning Image:</label><br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>After Cleaning Image:</label><br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
        />
      </div>

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify Cleaning"}
      </button>

      {result && (
        <pre style={{ marginTop: "20px", textAlign: "left" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default WasteMonitor;
