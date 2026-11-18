import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { user, lang } = useAuth();

  const hi = lang === "hi";

  const words = {
    welcome: hi ? "वापसी पर स्वागत है" : "Welcome back",

    chatTitle: hi ? "AI स्वास्थ्य सहायक" : "AI Health Assistant",
    chatDescription: hi
      ? "अपने स्वास्थ्य से जुड़े सवाल पूछें।"
      : "Ask questions about your health.",

    reportTitle: hi ? "स्वास्थ्य रिपोर्ट" : "Health Reports",
    reportDescription: hi
      ? "अपनी स्वास्थ्य रिपोर्ट देखें।"
      : "View your health reports.",

    remindersTitle: hi ? "रिमाइंडर" : "Reminders",
    reminderDescription: hi
      ? "अपनी दवाओं और स्वास्थ्य के लिए रिमाइंडर सेट करें।"
      : "Set reminders for medicines and health.",

    weight: hi ? "वजन (kg)" : "Weight (kg)",
    bloodSugar: hi ? "ब्लड शुगर (mg/dL)" : "Blood Sugar (mg/dL)",
    systolicBP: hi ? "सिस्टोलिक BP" : "Systolic BP",
    diastolicBP: hi ? "डायस्टोलिक BP" : "Diastolic BP",
    heartRate: hi ? "हार्ट रेट (bpm)" : "Heart Rate (bpm)",

    value: hi ? "मान दर्ज करें" : "Enter value",
    save: hi ? "सेव करें" : "Save",
    healthRecords: hi ? "आपके स्वास्थ्य रिकॉर्ड" : "Your Health Records",
    date: hi ? "तारीख" : "Date",
    type: hi ? "प्रकार" : "Type",
    noRecords: hi
      ? "अभी कोई स्वास्थ्य रिकॉर्ड उपलब्ध नहीं है।"
      : "No health records available yet."
  };

  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    type: "Weight (kg)",
    value: ""
  });

  const load = () => {
    api.get("/measurements").then((r) => {
      setItems(r.data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();

    await api.post("/measurements", {
      type: form.type,
      value: Number(form.value)
    });

    setForm({
      ...form,
      value: ""
    });

    load();
  };

  const types = [
    ["Weight (kg)", "weight"],
    ["Blood Sugar (mg/dL)", "bloodSugar"],
    ["Systolic BP", "systolicBP"],
    ["Diastolic BP", "diastolicBP"],
    ["Heart Rate (bpm)", "heartRate"]
  ];

  const translateType = (type) => {
    const found = types.find(([value]) => value === type);

    return found ? words[found[1]] : type;
  };

  return (
    <div className="dashboard">

      {/* Welcome Heading */}
      <h2>
        {words.welcome}, {user?.name} 👋
      </h2>

      {/* Dashboard Cards */}
      <div className="grid">

        <Link className="card tile" to="/chat">
          <span>🤖</span>
          <b>{words.chatTitle}</b>
          <span>{words.chatDescription}</span>
        </Link>

        <Link className="card tile" to="/reports">
          <span>📄</span>
          <b>{words.reportTitle}</b>
          <span>{words.reportDescription}</span>
        </Link>

        <Link className="card tile" to="/reminders">
          <span>⏰</span>
          <b>{words.remindersTitle}</b>
          <span>{words.reminderDescription}</span>
        </Link>

      </div>

      {/* Add Health Measurement */}
      <form className="card row" onSubmit={add}>

        <select
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value
            })
          }
        >
          {types.map(([value, key]) => (
            <option key={value} value={value}>
              {words[key]}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="any"
          placeholder={words.value}
          value={form.value}
          onChange={(e) =>
            setForm({
              ...form,
              value: e.target.value
            })
          }
          required
        />

        <button type="submit">
          {words.save}
        </button>

      </form>

      {/* Health Records */}
      <div className="card">

        <h3>{words.healthRecords}</h3>

        <table>
          <thead>
            <tr>
              <th>{words.date}</th>
              <th>{words.type}</th>
              <th>{words.value}</th>
            </tr>
          </thead>

          <tbody>
            {items.map((m) => (
              <tr key={m.id}>

                <td>
                  {new Date(m.createdAt).toLocaleString(
                    hi ? "hi-IN" : "en-IN"
                  )}
                </td>

                <td>
                  {translateType(m.type)}
                </td>

                <td>{m.value}</td>

              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="muted">
            {words.noRecords}
          </p>
        )}

      </div>

    </div>
  );
}
