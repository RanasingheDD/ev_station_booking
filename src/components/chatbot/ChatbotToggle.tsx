import { useEffect, useMemo, useState } from "react";
import botImg from "/chatbot.png";
import ChatBot from "./ChatBot";
import type { Station } from "../../models/station_model";

interface Props {
  stations: (Station & { distance: number })[];
}

const ChatbotToggle = ({ stations }: Props) => {
  const [chatOpen, setChatOpen] = useState(false);       // For manual chat window
  const [popupOpen, setPopupOpen] = useState(false);     // For automatic nearest station popup

  // Find nearest station
  const nearestStation = useMemo(() => {
    if (!stations.length) return null;
    return stations.reduce((prev, curr) =>
      curr.distance < prev.distance ? curr : prev
    );
  }, [stations]);

  // Auto-show nearest station popup
  useEffect(() => {
    if (!nearestStation) return;

    setPopupOpen(true); // show popup automatically

    const timer = setTimeout(() => setPopupOpen(false), 5000); // hide after 5s
    return () => clearTimeout(timer);
  }, [nearestStation]);

  return (
    <>
      {/* Robot Icon for manual chat */}
      <div
        className="fixed bottom-5 left-5 cursor-pointer z-50"
        onClick={() => setChatOpen(!chatOpen)}
      >
        <img src={botImg} alt="chatbot" className="w-16 h-16 animate-bounce" />
      </div>

      {/* Automatic Nearest Station Popup */}
      {popupOpen && nearestStation && (
        <div className="fixed bottom-24 left-5 w-[300px] p-4 bg-slate-700 bg-opacity-90 text-green-200 rounded-2xl shadow-lg z-50">
          <p className="text-sm mb-1">📍 Nearest EV Station</p>
          <p className="font-bold text-lg">⚡ {nearestStation.name}</p>
          <p className="text-sm">📏 {nearestStation.distance.toFixed(2)} km away</p>
        </div>
      )}

      {/* Manual Chat Interface */}
      {chatOpen && (
        <div className="fixed bottom-24 left-5 w-[320px] h-[400px] bg-slate-900 rounded-xl shadow-xl z-50 transition-all duration-300">
          <ChatBot stations={stations} onClose={() => setChatOpen(false)} />
        </div>
      )}
    </>
  );
};

export default ChatbotToggle;
