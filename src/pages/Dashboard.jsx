import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: "Weight (kg)", value: "" });

  const load = () => api.get("/measurements").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post("/measurements", { type: form.type, value: Number(form.value) });
    setForm({ ...form, value: "" });
    load();
  };

  return (
    <div>
      <h2>Namaste, {user.name} 👋</h2>
      <div className="grid">
        <Link className="card tile" to="/chat">🤖<b>AI Chat</b><span>Health sawal poochho</span></Link>
        <Link className="card tile" to="/reports">📄<b>Report Analyzer</b><span>PDF upload karo</span></Link>
        <Link className="card tile" to="/reminders">⏰<b>Reminders</b><span>Dawai ka time</span></Link>
      </div>

      <form className="card row" onSubmit={add}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option>Weight (kg)</option><option>Blood Sugar (mg/dL)</option>
          <option>Systolic BP</option><option>Diastolic BP</option><option>Heart Rate (bpm)</option>
        </select>
        <input type="number" step="any" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
        <button>Save</button>
      </form>

      <div className="card">
        <h3>Health history</h3>
        <table>
          <thead><tr><th>Date</th><th>Type</th><th>Value</th></tr></thead>
          <tbody>
            {items.map((m) => <tr key={m.id}><td>{new Date(m.createdAt).toLocaleString()}</td><td>{m.type}</td><td>{m.value}</td></tr>)}
          </tbody>
        </table>
        {items.length === 0 && <p className="muted">Abhi koi record nahi hai.</p>}
      </div>
    </div>
  );
}
