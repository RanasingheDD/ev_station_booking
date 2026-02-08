import { useEffect, useState } from "react";
import type { Station } from "../../models/station_model";

interface Props {
  onClose: () => void;
  stations: (Station & { distance: number })[];
}

interface Message {
  from: "user" | "bot";
  text: string;
}

const ChatBot = ({ stations, onClose }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg: Message = { from: "user", text: input };
    const botMsg: Message = {
      from: "bot",
      text: "For assistance, contact the administrator at info@nextgensolutions.com",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput(""); // clear input
  };

  const nearestStation = stations.length
    ? stations.reduce((prev, curr) =>
        curr.distance < prev.distance ? curr : prev
      )
    : null;

  const [ ,setPopupOpen] = useState(!!nearestStation);

  // Auto open popup when nearest station changes
  useEffect(() => {
    if (nearestStation) {
      setPopupOpen(true);

      // Auto close after 5 seconds
      const timer = setTimeout(() => setPopupOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [nearestStation]);

  return (
    <div className="flex flex-col h-full text-white p-3 bg-slate-900 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span>🤖 Bot Ghost</span>
        <button onClick={onClose}>✖</button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {/* Nearest station info */}
        {nearestStation && (
          <div className="p-3 bg-slate-700 bg-opacity-20 rounded-2xl shadow-lg">
            <p className="text-sm">📍 Nearest EV Station</p>
            <p className="font-bold text-lg">⚡ {nearestStation.name}</p>
            <p className="text-sm">📏 {nearestStation.distance.toFixed(2)} km away</p>

            {/* Little cloud pointer */}
           <div className="absolute -bottom-2 left-6 w-4 h-4 bg-slate-900 bg-opacity-20 rotate-45"></div>
          </div>
        )}

        {/* User and bot messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${
              msg.from === "user"
                ? "bg-green-600 self-end text-white"
                : "bg-slate-700 self-start text-green-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg text-white bg-slate-700 bg-opacity-20 focus:outline-none"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
