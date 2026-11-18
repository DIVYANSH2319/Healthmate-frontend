import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { user, lang } = useAuth();
  const hi = lang === "hi";

  const words = {
    greeting: hi ? "नमस्ते" : "Hello",
    welcome: hi ? "आपका स्वास्थ्य, हमारी प्राथमिकता!" : "Your Health, Our Priority!",
    subtitle: hi
      ? "हर दिन एक नई शुरुआत है। स्वस्थ रहें, खुश रहें और मुस्कुराते रहें।"
      : "Every day is a fresh start. Stay healthy, stay happy and keep smiling.",

    wellness: hi ? "आपका वेलनेस स्पेस" : "YOUR WELLNESS SPACE",

    chat: hi ? "AI स्वास्थ्य सहायक" : "AI Health Assistant",
    chatDesc: hi
      ? "अपने स्वास्थ्य से जुड़े सवाल पूछें और जानकारी पाएं।"
      : "Ask health questions and get helpful information.",

    report: hi ? "स्वास्थ्य रिपोर्ट" : "Health Reports",
    reportDesc: hi
      ? "अपने स्वास्थ्य रिकॉर्ड एक जगह देखें।"
      : "Keep track of your health records in one place.",

    reminder: hi ? "मेडिसिन रिमाइंडर" : "Medicine Reminders",
    reminderDesc: hi
      ? "अपने रिमाइंडर व्यवस्थित रखें।"
      : "Keep your health reminders organized.",

    quick: hi ? "स्वास्थ्य मापदंड जोड़ें" : "Add Health Measurements",
    weight: hi ? "वजन (kg)" : "Weight (kg)",
    sugar: hi ? "ब्लड शुगर (mg/dL)" : "Blood Sugar (mg/dL)",
    systolic: hi ? "सिस्टोलिक BP" : "Systolic BP",
    diastolic: hi ? "डायस्टोलिक BP" : "Diastolic BP",
    heart: hi ? "हार्ट रेट (bpm)" : "Heart Rate (bpm)",

    value: hi ? "मान दर्ज करें" : "Enter value",
    save: hi ? "रिकॉर्ड सेव करें" : "Save Record",

    records: hi ? "आपके स्वास्थ्य रिकॉर्ड" : "Your Health Records",
    date: hi ? "तारीख" : "Date",
    type: hi ? "प्रकार" : "Type",
    noRecords: hi
      ? "अभी कोई रिकॉर्ड उपलब्ध नहीं है।"
      : "No records available yet.",

    footer: hi
      ? "छोटे-छोटे कदम, बेहतर स्वास्थ्य की ओर!"
      : "Small steps lead to a healthier you!"
  };

  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    type: "Weight (kg)",
    value: ""
  });

  const [loading, setLoading] = useState(false);

  const types = [
    ["Weight (kg)", words.weight],
    ["Blood Sugar (mg/dL)", words.sugar],
    ["Systolic BP", words.systolic],
    ["Diastolic BP", words.diastolic],
    ["Heart Rate (bpm)", words.heart]
  ];

  const load = async () => {
    try {
      const response = await api.get("/measurements");
      setItems(response.data);
    } catch (error) {
      console.error("Unable to load measurements:", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/measurements", {
        type: form.type,
        value: Number(form.value)
      });

      setForm({
        ...form,
        value: ""
      });

      await load();
    } catch (error) {
      alert(
        hi
          ? "रिकॉर्ड सेव नहीं हो पाया। दोबारा कोशिश करें।"
          : "Unable to save record. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const translateType = (type) => {
    const found = types.find(([value]) => value === type);
    return found ? found[1] : type;
  };

  return (
    <div className="hm-dashboard">

      {/* HERO SECTION */}
      <section className="hm-hero">

        <div className="hm-hero-content">

          <span className="hm-eyebrow">
            🌿 {words.wellness}
          </span>

          <h1>
            {words.greeting}, {user?.name || "Friend"}!
            <br />
            <span>{words.welcome}</span>
          </h1>

          <p>{words.subtitle}</p>

          <div className="hm-hero-badge">
            💚 {words.footer}
          </div>

        </div>

        <div className="hm-hero-art">
          <div className="hm-floating-icon hm-float-one">🌿</div>
          <div className="hm-floating-icon hm-float-two">✨</div>
          <div className="hm-hero-emoji">🌱</div>
          <div className="hm-hero-caption">
            {hi ? "स्वस्थ जीवन, खुशहाल जीवन" : "Healthy Life, Happy Life"}
          </div>
        </div>

      </section>

      {/* FEATURE CARDS */}
      <section className="hm-features">

        <Link to="/chat" className="hm-feature-card hm-chat-card">

          <div className="hm-card-art hm-robot">
            🤖
            <span className="hm-art-sparkle">✨</span>
          </div>

          <div>
            <span className="hm-card-label">
              {hi ? "स्मार्ट सहायक" : "SMART ASSISTANT"}
            </span>

            <h3>{words.chat}</h3>
            <p>{words.chatDesc}</p>

            <span className="hm-card-link">
              {hi ? "चैट शुरू करें →" : "Start Chat →"}
            </span>
          </div>

        </Link>

        <Link to="/reports" className="hm-feature-card hm-report-card">

          <div className="hm-card-art hm-report-art">
            📋
            <span className="hm-art-pill">💊</span>
          </div>

          <div>
            <span className="hm-card-label">
              {hi ? "स्वास्थ्य जानकारी" : "HEALTH INSIGHTS"}
            </span>

            <h3>{words.report}</h3>
            <p>{words.reportDesc}</p>

            <span className="hm-card-link">
              {hi ? "रिपोर्ट देखें →" : "View Reports →"}
            </span>
          </div>

        </Link>

        <Link to="/reminders" className="hm-feature-card hm-reminder-card">

          <div className="hm-card-art hm-medicine-art">
            💊
            <span className="hm-art-sparkle">✚</span>
          </div>

          <div>
            <span className="hm-card-label">
              {hi ? "दैनिक स्वास्थ्य" : "DAILY WELLNESS"}
            </span>

            <h3>{words.reminder}</h3>
            <p>{words.reminderDesc}</p>

            <span className="hm-card-link">
              {hi ? "रिमाइंडर देखें →" : "View Reminders →"}
            </span>
          </div>

        </Link>

      </section>

      {/* MEASUREMENT SECTION */}
      <section className="hm-section">

        <div className="hm-section-heading">
          <div>
            <span className="hm-section-tag">
              📊 {hi ? "ट्रैक योर हेल्थ" : "TRACK YOUR HEALTH"}
            </span>

            <h2>{words.quick}</h2>
          </div>

          <span className="hm-heading-icon">💚</span>
        </div>

        <form className="hm-measure-form" onSubmit={add}>

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value
              })
            }
          >
            {types.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
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

          <button type="submit" disabled={loading}>
            {loading ? "..." : `＋ ${words.save}`}
          </button>

        </form>

      </section>

      {/* HEALTH RECORDS */}
      <section className="hm-records">

        <div className="hm-section-heading">
          <div>
            <span className="hm-section-tag">
              📁 {hi ? "आपका डेटा" : "YOUR DATA"}
            </span>

            <h2>{words.records}</h2>
          </div>

          <span className="hm-record-count">
            {items.length} {hi ? "रिकॉर्ड" : "Records"}
          </span>
        </div>

        {items.length > 0 ? (

          <div className="hm-table-wrapper">

            <table className="hm-table">

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

                    <td>{translateType(m.type)}</td>

                    <td className="hm-value">
                      {m.value}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        ) : (

          <div className="hm-empty">
            <span>🌷</span>
            <p>{words.noRecords}</p>
          </div>

        )}

      </section>

      {/* FOOTER MESSAGE */}
      <div className="hm-dashboard-footer">
        🌿 {words.footer} 💚
      </div>

    </div>
  );
}
