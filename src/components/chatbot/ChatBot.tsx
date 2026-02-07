// import type { Station } from "../../models/station_model";

// interface Props {
//   onClose: () => void;
//   stations: (Station & { distance: number })[];
// }

// const ChatBot = ({ onClose, stations }: Props) => {
//   return (
//     <div className="flex flex-col h-full text-white">
//       {/* Header */}
//       <div className="flex justify-between items-center p-3 bg-slate-800 rounded-t-xl">
//         <span>🤖 EV Echo Bot</span>
//         <button onClick={onClose}>✖</button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-3 overflow-y-auto space-y-2">
//         <p>Hello! Here are nearby EV stations:</p>
//         {stations.length === 0 && <p>No stations found.</p>}
//         {stations
//           .sort((a, b) => a.distance - b.distance) // nearest first
//           .map((station) => (
//             <div
//               key={station.id}
//               className="bot-message bg-slate-700 p-2 rounded-md"
//             >
//               ⚡ {station.name} — {station.distance.toFixed(2)} km away
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default ChatBot;

// import { useEffect, useMemo, useState } from "react";
// import type { Station } from "../../models/station_model";

// interface Props {
//   onClose: () => void;
//   stations: (Station & { distance: number })[];
// }

// const ChatBot = ({ onClose, stations }: Props) => {
//   const [showResult, setShowResult] = useState(false);

//   // Find nearest station
//   const nearestStation = useMemo(() => {
//     if (!stations || stations.length === 0) return null;

//     return stations.reduce((nearest, station) =>
//       station.distance < nearest.distance ? station : nearest
//     );
//   }, [stations]);

//   // Simulate chatbot delay
//   useEffect(() => {
//     setShowResult(false);

//     const timer = setTimeout(() => {
//       setShowResult(true);
//     }, 1000); // 1 second delay

//     return () => clearTimeout(timer);
//   }, [stations]);

//   return (
//     <div className="flex flex-col h-full text-white">
//       {/* Header */}
//       <div className="flex justify-between items-center p-3 bg-slate-800 rounded-t-xl">
//         <span>🤖 EV Echo Bot</span>
//         <button onClick={onClose}>✖</button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-3 overflow-y-auto space-y-2">
//         <div className="bot-message bg-slate-700 p-2 rounded-md">
//           👋 Hi! Let me find the nearest EV charging station for you...
//         </div>

//         {!showResult && (
//           <div className="bot-message bg-slate-600 p-2 rounded-md animate-pulse">
//             🔍 Searching nearby stations...
//           </div>
//         )}

//         {showResult && !nearestStation && (
//           <div className="bot-message bg-red-600 p-2 rounded-md">
//             ❌ Sorry, I couldn't find any nearby EV stations.
//           </div>
//         )}

//         {showResult && nearestStation && (
//           <div className="bot-message bg-green-600 p-2 rounded-md">
//             📍 <b>Nearest EV Station:</b><br />
//             ⚡ {nearestStation.name}<br />
//             📏 {nearestStation.distance.toFixed(2)} km away
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatBot;

import type { Station } from "../../models/station_model";

interface Props {
  onClose: () => void;
  stations: (Station & { distance: number })[];
}

const ChatBot = ({ onClose, stations }: Props) => {
  const station = stations[0]; // only nearest one

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header
      <div className="flex justify-between items-center p-3 bg-green-200 rounded-t-xl">
        <span>🤖 EV Echo Bot</span>
        <button onClick={onClose}>✖</button>
      </div> */}

      {/* Message */}
      <div className="flex-1 p-3 space-y-2">
        {!station && <p>No stations found.</p>}

        {station && (
          <div className="relative w-[300px] h-[120px] bg-slate-700 text-green-200 bg-opacity-10 p-4 rounded-2xl shadow-lg max-w-xs">
            {/* Little cloud pointer */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-slate-700 bg-opacity-20 rotate-45"></div>

            <p className="text-sm mb-1">📍 Nearest EV Station</p>
            <p className="font-bold text-lg">⚡ {station.name}</p>
            <p className="text-sm">📏 {station.distance.toFixed(2)} km away</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;

