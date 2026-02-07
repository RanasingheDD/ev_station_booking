// import { useEffect, useState } from "react";
// import botImg from "/chatbot.png";
// import ChatBot from "./chatbot";
// import type { Station } from "../../models/station_model";

// interface Props {
//   stations: (Station & { distance: number })[];
// }

// const ChatbotToggle = ({ stations }: Props) => {
//   const [open, setOpen] = useState(false);

//   // ✅ Auto open when stations are received
//   useEffect(() => {
//     if (stations.length > 0) {
//       setOpen(true);
//     }
//   }, [stations]);

//   return (
//     <>
//       {/* Robot Icon */}
//       <div
//         className="fixed bottom-5 left-5 cursor-pointer z-50"
//         onClick={() => setOpen(!open)}
//       >
//         <img
//           src={botImg}
//           alt="chatbot"
//           className="w-16 h-16 animate-bounce"
//         />
//       </div>

//       {/* Chatbot Window */}
//       {open && (
//         <div className="fixed bottom-24 left-5 w-[320px] h-[400px] bg-slate-900 rounded-xl shadow-xl z-50">
//           <ChatBot stations={stations} onClose={() => setOpen(false)} />
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatbotToggle;

import { useEffect, useMemo, useState } from "react";
import botImg from "/chatbot.png";
import ChatBot from "./chatbot";
import type { Station } from "../../models/station_model";

interface Props {
  stations: (Station & { distance: number })[];
}

const ChatbotToggle = ({ stations }: Props) => {
  const [open, setOpen] = useState(false);

  // find nearest station
  const nearestStation = useMemo(() => {
    if (!stations.length) return null;
    return stations.reduce((prev, curr) =>
      curr.distance < prev.distance ? curr : prev
    );
  }, [stations]);

  // auto open + auto close after few seconds
  useEffect(() => {
    if (!nearestStation) return;

    setOpen(true);

    // auto close after 5 seconds
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000); // 👈 change time (ms)

    return () => clearTimeout(timer);
  }, [nearestStation]);

  return (
    <>
      {/* Robot Icon */}
      <div
        className="fixed bottom-5 left-5 cursor-pointer z-50"
        onClick={() => setOpen(!open)}
      >
        <img
          src={botImg}
          alt="chatbot"
          className="w-16 h-16 animate-bounce"
        />
      </div>

      {/* Chatbot Window */}
      {open && nearestStation && (
        <div className="fixed bottom-55 left-5 w-[200px] h-[20px] bg-black-100 rounded-xl shadow-xl z-50 transition-all duration-300">
          <ChatBot
            stations={[nearestStation]}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default ChatbotToggle;
