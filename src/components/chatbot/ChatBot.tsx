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

  // const handleSend = () => {
  //   if (!input.trim()) return;

  //   const userText = input.toLowerCase();

  //   const userMsg: Message = { from: "user", text: input };
  //   setMessages(prev => [...prev, userMsg, { from: "bot", text: "Typing..." }]);
  //   setInput("");

  //   // Bot thinking delay (2 seconds)
  //   setTimeout(() => {
  //     let botReply = "For assistance, contact the administrator at info@nextgensolutions.com";

  //     if (userText.includes("hi") || userText.includes("hello")) {
  //       botReply = "Hi 👋 How can I help you today?";
  //     } 
  //     else if (userText.includes("nearest")) {
  //       if (nearestStation) {
  //         botReply = `Your nearest EV station is ${nearestStation.name}, about ${nearestStation.distance.toFixed(
  //           2
  //         )} km away ⚡`;
  //       } else {
  //         botReply = "Sorry, I couldn't find a nearby station.";
  //       }
  //     } 
  //     else if (userText.includes("book")) {
  //       botReply = "You can book a charging slot from the booking page 🗓️";
  //     } 
  //     else if (userText.includes("help")) {
  //       botReply = "I can help you find the nearest EV station, booking details, and charging info.";
  //     }

  //     const botMsg: Message = { from: "bot", text: botReply };
  //     setMessages((prev) => [...prev, botMsg]);
  //   }, 2000); // ⏱ 2 seconds delay
  // };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.toLowerCase();

    // Add user message + typing indicator
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: "Typing..." }
    ]);

    setInput("");

    setTimeout(() => {
      let botReply = "For assistance, contact the administrator at admin@evhub.com";

      if (userText.includes("hi") || userText.includes("hello")) {
        botReply = "Hi 👋 I'm GhostBot 🤖, your EV station assistant. How can I help you today?";
      }else if(userText.includes("book") || userText.includes("booking")) {
        botReply = "You can book a charging slot from the booking page 🗓️. Just click the 'Book Now' button on the station details.";
      }else if (userText.includes("how are you") || userText.includes("how's it going")) {
        botReply = "I'm doing great! Thanks for asking. How can I assist you today?";
      }else if (userText.includes("ev station") || userText.includes("charging station")) {
        botReply = "EV stations are locations where you can charge your electric vehicle. I can help you find the nearest ones and provide details about them!";
      }else if (
        userText.includes("who are you") ||
        userText.includes("about you") ||
        userText.includes("your name")
      ) {
        botReply = "I'm GhostBot 🤖, a smart assistant that helps you find nearby EV charging stations, booking info, and charging guidance.";
      }
      else if (userText.includes("what can you do") || userText.includes("help")) {
        botReply = "I can help you find the nearest EV station, guide you with bookings, and answer basic questions about EV charging ⚡";
      }
      else if (userText.includes("nearest")) {
        if (nearestStation) {
          botReply = `Your nearest EV station is ${nearestStation.name}, about ${nearestStation.distance.toFixed(2)} km away ⚡`;
        } else {
          botReply = "Sorry, I couldn't find a nearby station.";
        }
      }else if (userText.includes("How to charge") || userText.includes("charging process")) {
        botReply = "To charge your EV, simply drive to the station, plug in your charger, and follow the on-screen instructions. You can also book a slot in advance for a smoother experience!";
      }else if (userText.includes("contact support") || userText.includes("customer service")) {
        botReply = "You can contact our support team at admin@evhub.com";
      }else if (userText.includes("thanks")) {
        botReply = "You're welcome 😄 Happy charging!";
      }

      // Replace "Typing..." with real message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: "bot", text: botReply };
        return updated;
      });

    }, 2000);
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
