import { useState } from "react";
import api from "../api.js";

const MAX_MB = 5;

export default function Reports() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pick = (e) => {
    const f = e.target.files[0];
    setError(""); setResult(null);
    if (!f) return;
    // Frontend validation (backend pe bhi validation zaroor hogi)
    if (f.type !== "application/pdf") return setError("Sirf PDF allowed hai.");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`File ${MAX_MB}MB se chhoti honi chahiye.`);
    setFile(f);
  };

  const upload = async () => {
    const fd = new FormData();
    fd.append("file", file);
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/reports", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(data); // { results:[{test,value,unit,range}], explanation }
    } catch (err) {
      setError(err.response?.data?.message || "Report analyze nahi ho paayi.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="card">
        <h3>Upload medical report (PDF)</h3>
        <input type="file" accept="application/pdf" onChange={pick} />
        <button onClick={upload} disabled={!file || loading}>{loading ? "Analyzing..." : "Analyze"}</button>
        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <>
          <div className="card">
            <h3>Extracted values (original report se match kar lena)</h3>
            <table>
              <thead><tr><th>Test</th><th>Value</th><th>Unit</th><th>Normal range</th></tr></thead>
              <tbody>
                {result.results.map((r, i) => (
                  <tr key={i}><td>{r.test}</td><td>{r.value}</td><td>{r.unit}</td><td>{r.range || "-"}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>Simple explanation</h3>
            <p>{result.explanation}</p>
            <p className="muted">AI galat bhi ho sakta hai. Doctor se zaroor confirm karo.</p>
          </div>
        </>
      )}
    </div>
  );
}  report.js

    </div>
  );
}
