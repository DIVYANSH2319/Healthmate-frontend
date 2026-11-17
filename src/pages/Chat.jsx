import { useEffect, useRef, useState } from "react";
import api from "../api.js";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! Main HealthMate hoon. General health sawal pooch sakte ho. Main diagnosis nahi karta." },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [sending, setSending] = useState(false);
  const bottom = useRef(null);

  useEffect(() => bottom.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = async (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || sending) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput(""); setSending(true);
    try {
      const { data } = await api.post("/chat", { sessionId, message: q });
      setSessionId(data.sessionId);
      setMessages((m) => [...m, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "⚠️ AI abhi available nahi hai. Thodi der baad try karo.", error: true }]);
    } finally { setSending(false); }
  };

  return (
    <div className="card chat">
      <div className="chat-window">
        {messages.map((m, i) => <div key={i} className={`bubble ${m.role} ${m.error ? "err" : ""}`}>{m.text}</div>)}
        {sending && <div className="bubble ai">Typing...</div>}
        <div ref={bottom} />
      </div>
      <form className="chat-input" onSubmit={send}>
        <input value={input} maxLength={500} onChange={(e) => setInput(e.target.value)} placeholder="Ask a health question..." />
        <button disabled={sending}>Send</button>
      </form>
    </div>
  );
}
