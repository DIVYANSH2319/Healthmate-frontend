// ================= DEMO MODE: nakli backend (data localStorage mein) =================
// Kal backend ready hone par is file ko purane axios wale code se badal dena.

const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (status, message) => { throw { response: { status, data: { message } } }; };

// Pehle se ek demo account bana hota hai
if (!read("users", null)) {
  write("users", [{ name: "Divyy", email: "demo@healthmate.ai", password: "demo12345" }]);
}
const me = () => (localStorage.getItem("token") || "").replace("demo-", ""); // current user email
const key = (name) => `${name}:${me()}`; // har user ka data alag (ownership check jaisa)

// ---------- AI chatbot (keyword based demo) ----------
const DISCLAIMER_EN = "\n\n⚠️ This is general educational information, not a diagnosis. Please consult a doctor.";
const DISCLAIMER_HI = "\n\n⚠️ यह केवल सामान्य जानकारी है, निदान नहीं। कृपया डॉक्टर से सलाह लें।";
const EMERGENCY = /chest pain|can'?t breathe|difficulty breathing|unconscious|stroke|suicid|seizure|heavy bleeding|सीने में दर्द|सांस नहीं|बेहोश|seene me dard/i;

const TOPICS = [
  { k: /fever|bukhar|बुखार/i,
    en: "Fever is the body's response to infection. Rest, drink plenty of fluids and monitor temperature. See a doctor if it goes above 103°F (39.4°C), lasts more than 3 days, or comes with rash, stiff neck or breathing trouble.",
    hi: "बुखार शरीर का संक्रमण से लड़ने का तरीका है। आराम करें, खूब पानी पिएँ और तापमान देखते रहें। अगर बुखार 103°F से ऊपर हो, 3 दिन से ज़्यादा रहे, या साँस की तकलीफ़/चकत्ते हों तो डॉक्टर को दिखाएँ।" },
  { k: /headache|sir dard|सिर दर्द|सिरदर्द/i,
    en: "Common headache causes: dehydration, stress, lack of sleep, screen time. Try water, rest in a dark quiet room and a short walk. See a doctor if the headache is sudden and severe, or comes with vision changes or weakness.",
    hi: "सिरदर्द के आम कारण: पानी की कमी, तनाव, नींद की कमी, ज़्यादा स्क्रीन टाइम। पानी पिएँ, अँधेरे शांत कमरे में आराम करें। अचानक तेज़ दर्द, नज़र में बदलाव या कमज़ोरी हो तो तुरंत डॉक्टर से मिलें।" },
  { k: /cold|cough|khansi|sardi|खांसी|खाँसी|सर्दी/i,
    en: "For a common cold or cough: rest, warm fluids, steam inhalation and honey-ginger tea can ease symptoms. If a cough lasts over 2 weeks, or you have high fever or breathlessness, please get checked.",
    hi: "सर्दी-खाँसी में आराम करें, गुनगुना पानी/काढ़ा पिएँ और भाप लें। खाँसी 2 हफ़्ते से ज़्यादा रहे या तेज़ बुखार/साँस फूलने लगे तो जाँच करवाएँ।" },
  { k: /sugar|diabet|glucose|शुगर|मधुमेह/i,
    en: "Typical fasting blood sugar is about 70–99 mg/dL. 100–125 is considered prediabetic range and 126+ on repeat tests may indicate diabetes. Only a doctor can diagnose. Balanced diet, daily walking and regular checks help.",
    hi: "खाली पेट सामान्य शुगर लगभग 70–99 mg/dL होती है। 100–125 प्री-डायबिटीज़ की रेंज मानी जाती है और बार-बार 126+ आने पर डायबिटीज़ हो सकती है। पुष्टि केवल डॉक्टर कर सकते हैं।" },
  { k: /\bbp\b|blood pressure|pressure|रक्तचाप|ब्लड प्रेशर/i,
    en: "Normal blood pressure is roughly below 120/80 mmHg. Reduce salt, stay active, manage stress and sleep well. Repeated readings above 140/90 should be reviewed by a doctor.",
    hi: "सामान्य ब्लड प्रेशर लगभग 120/80 mmHg से कम होता है। नमक कम करें, सक्रिय रहें, तनाव और नींद का ध्यान रखें। बार-बार 140/90 से ऊपर आए तो डॉक्टर को दिखाएँ।" },
  { k: /hemoglobin|haemoglobin|anemia|anaemia|खून की कमी|हीमोग्लोबिन/i,
    en: "Hemoglobin carries oxygen in blood. Typical range: ~12–15 g/dL (women) and ~13–17 g/dL (men). Low levels may cause tiredness. Iron-rich foods (spinach, lentils, jaggery) and vitamin C help, but find the cause with a doctor.",
    hi: "हीमोग्लोबिन खून में ऑक्सीजन ले जाता है। सामान्य रेंज: महिलाओं में ~12–15 और पुरुषों में ~13–17 g/dL। कम होने पर थकान हो सकती है। पालक, दाल, गुड़ और विटामिन C मदद करते हैं, पर कारण डॉक्टर से पता करें।" },
  { k: /cholesterol|कोलेस्ट्रॉल/i,
    en: "Total cholesterol under 200 mg/dL is generally desirable. Less fried food, more fibre, regular exercise and not smoking all help.",
    hi: "टोटल कोलेस्ट्रॉल 200 mg/dL से कम अच्छा माना जाता है। तला-भुना कम खाएँ, फाइबर बढ़ाएँ, नियमित व्यायाम करें।" },
  { k: /sleep|neend|insomnia|नींद/i,
    en: "Most adults need 7–9 hours of sleep. Keep a fixed sleep time, avoid screens and caffeine before bed, and keep the room dark and cool.",
    hi: "ज़्यादातर वयस्कों को 7–9 घंटे की नींद चाहिए। सोने का समय तय रखें, सोने से पहले स्क्रीन और कैफ़ीन से बचें।" },
  { k: /stress|anxiety|tension|तनाव|चिंता/i,
    en: "For stress: deep breathing, short walks, regular sleep and talking to someone you trust can help. If it affects daily life for weeks, please speak to a mental-health professional.",
    hi: "तनाव में गहरी साँसें, छोटी वॉक, नियमित नींद और किसी भरोसेमंद से बात करना मदद करता है। कई हफ़्तों तक असर रहे तो विशेषज्ञ से मिलें।" },
  { k: /water|hydrat|paani|पानी/i,
    en: "Most people do well with about 2–3 litres of fluids a day, more in hot weather or exercise. Pale yellow urine is a good sign.",
    hi: "ज़्यादातर लोगों के लिए दिन में लगभग 2–3 लीटर पानी ठीक रहता है, गर्मी या व्यायाम में ज़्यादा। हल्का पीला पेशाब अच्छा संकेत है।" },
  { k: /diet|food|khana|weight|exercise|workout|आहार|खाना|वज़न/i,
    en: "A balanced plate: half vegetables/fruits, a quarter whole grains, a quarter protein (dal, eggs, paneer). Aim for ~30 minutes of activity most days.",
    hi: "संतुलित थाली: आधी सब्ज़ी/फल, एक चौथाई साबुत अनाज, एक चौथाई प्रोटीन (दाल, अंडा, पनीर)। रोज़ लगभग 30 मिनट की गतिविधि रखें।" },
];

function chatReply(msg) {
  const hindi = /[\u0900-\u097F]/.test(msg);
  if (EMERGENCY.test(msg)) {
    return hindi
      ? "🚨 यह आपात स्थिति हो सकती है। कृपया तुरंत 112 पर कॉल करें या नज़दीकी अस्पताल जाएँ। इंतज़ार न करें।"
      : "🚨 This could be an emergency. Please call your local emergency number (112 in India) or go to the nearest hospital right now. Do not wait.";
  }
  const t = TOPICS.find((x) => x.k.test(msg));
  if (t) return hindi ? t.hi + DISCLAIMER_HI : t.en + DISCLAIMER_EN;
  return hindi
    ? "मैं सामान्य स्वास्थ्य जानकारी दे सकता हूँ, जैसे बुखार, सिरदर्द, शुगर, BP, नींद, आहार। अपना सवाल थोड़ा विस्तार से पूछें।" + DISCLAIMER_HI
    : "I can share general health info on topics like fever, headache, cold, sugar, BP, cholesterol, sleep, stress and diet. Please ask in a bit more detail." + DISCLAIMER_EN;
}

// ---------- Medicine reminder pop-up (jab time aayega) ----------
const fired = new Set();
function toast(text) {
  const d = document.createElement("div");
  d.textContent = text;
  d.style.cssText = "position:fixed;top:16px;right:16px;z-index:9999;background:#2563eb;color:#fff;padding:14px 18px;border-radius:10px;box-shadow:0 4px 14px #0004;font-weight:600";
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 8000);
}
setInterval(() => {
  if (!me()) return;
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5);
  read(key("reminders"), []).forEach((r) => {
    const id = `${now.toDateString()}-${r.id}`;
    if (!r.completed && r.time === hhmm && !fired.has(id)) {
      fired.add(id);
      toast(`💊 Time to take: ${r.medicine}`);
    }
  });
}, 15000);

// ---------- Nakli REST API ----------
async function handle(method, url, body) {
  await wait(400);

  if (method === "post" && url === "/auth/register") {
    const users = read("users", []);
    const email = (body.email || "").toLowerCase();
    if (users.some((u) => u.email === email)) fail(409, "Ye email pehle se registered hai.");
    users.push({ name: body.name, email, password: body.password });
    write("users", users);
    return { token: "demo-" + email, name: body.name };
  }
  if (method === "post" && url === "/auth/login") {
    const u = read("users", []).find((x) => x.email === (body.email || "").toLowerCase() && x.password === body.password);
    if (!u) fail(401, "Email ya password galat hai.");
    return { token: "demo-" + u.email, name: u.name };
  }

  if (!me()) fail(401, "Login required");

  if (method === "post" && url === "/chat") {
    await wait(500);
    const sessions = read(key("chats"), []);
    const sessionId = body.sessionId || Date.now();
    const reply = chatReply(body.message);
    sessions.push({ sessionId, q: body.message, a: reply, at: new Date().toISOString() });
    write(key("chats"), sessions);
    return { sessionId, reply };
  }

  if (method === "post" && url === "/reports") {
    await wait(1200);
    const results = [
      { test: "Hemoglobin", value: "11.2 (Low)", unit: "g/dL", range: "12.0 - 15.0" },
      { test: "WBC Count", value: "7,500 (Normal)", unit: "cells/µL", range: "4,000 - 11,000" },
      { test: "Platelets", value: "2.4 (Normal)", unit: "lakh/µL", range: "1.5 - 4.1" },
      { test: "Fasting Blood Sugar", value: "108 (High)", unit: "mg/dL", range: "70 - 99" },
      { test: "Total Cholesterol", value: "185 (Normal)", unit: "mg/dL", range: "< 200" },
    ];
    const explanation =
      "[DEMO SAMPLE] Hemoglobin thoda kam hai, isse thakaan ho sakti hai. Fasting blood sugar normal se thodi upar hai. WBC, platelets aur cholesterol normal range mein hain. Ye sirf samjhane ke liye hai, diagnosis nahi. Kripya apne doctor se confirm karein. (Asli project mein ye values PDF se Apache PDFBox backend nikalega.)";
    const reports = read(key("reports"), []);
    reports.push({ id: Date.now(), results, explanation, at: new Date().toISOString() });
    write(key("reports"), reports);
    return { results, explanation };
  }

  if (url === "/reminders" || url.startsWith("/reminders/")) {
    const list = read(key("reminders"), []);
    if (method === "get") return list;
    if (method === "post") {
      list.push({ id: Date.now(), medicine: body.medicine, time: body.time, completed: false });
      write(key("reminders"), list);
      return {};
    }
    const id = Number(url.split("/")[2]);
    if (method === "patch") {
      write(key("reminders"), list.map((r) => (r.id === id ? { ...r, completed: true } : r)));
      return {};
    }
    if (method === "delete") {
      write(key("reminders"), list.filter((r) => r.id !== id));
      return {};
    }
  }

  if (url === "/measurements") {
    const list = read(key("measurements"), []);
    if (method === "get") return [...list].reverse(); // naya sabse upar
    if (method === "post") {
      list.push({ id: Date.now(), type: body.type, value: body.value, createdAt: new Date().toISOString() });
      write(key("measurements"), list);
      return {};
    }
  }

  fail(404, "Not found");
}

const api = {
  get: async (url) => ({ data: await handle("get", url) }),
  post: async (url, body) => ({ data: await handle("post", url, body) }),
  patch: async (url, body) => ({ data: await handle("patch", url, body) }),
  delete: async (url) => ({ data: await handle("delete", url) }),
};

export default api;
