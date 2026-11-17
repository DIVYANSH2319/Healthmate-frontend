import { useEffect, useState } from "react";
import api from "../api.js";

export default function Reminders() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ medicine: "", time: "08:00" });

  const load = () => api.get("/reminders").then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post("/reminders", form);
    setForm({ medicine: "", time: "08:00" });
    load();
  };
  const done = async (id) => { await api.patch(`/reminders/${id}/complete`); load(); };
  const remove = async (id) => { await api.delete(`/reminders/${id}`); load(); };

  return (
    <div>
      <form className="card row" onSubmit={add}>
        <input placeholder="Medicine name (as prescribed)" value={form.medicine} onChange={(e) => setForm({ ...form, medicine: e.target.value })} required />
        <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
        <button>Add</button>
      </form>
      <div className="card">
        <h3>My reminders</h3>
        {list.length === 0 && <p className="muted">Abhi koi reminder nahi hai.</p>}
        {list.map((r) => (
          <div key={r.id} className={`item ${r.completed ? "done" : ""}`}>
            <span>💊 {r.medicine} — {r.time}</span>
            <span>
              {!r.completed && <button onClick={() => done(r.id)}>✔ Done</button>}
              <button className="ghost" onClick={() => remove(r.id)}>🗑</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
