import { Settings, ArrowLeft, Hammer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnderDevelopment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg">

        {/* Rotating Cogs Animation */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Big Cog - Clockwise */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Settings
              size={120}
              className="text-[#1A2236] animate-spin"
              style={{ animationDuration: '4s' }}
            />
          </div>

          {/* Small Cog - Counter Clockwise */}
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
            <Settings
              size={64}
              className="text-green-500 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '3s' }}
            />
          </div>

          {/* Hammer Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Hammer size={32} className="text-gray-400 -ml-2 -mt-2" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Work in Progress
        </h1>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          We're currently building this feature to make your EV experience even better.
          Stay tuned for updates!
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E1424] text-green-400 font-medium rounded-xl border border-green-500/20 hover:border-green-500 hover:bg-green-500/10 transition-all duration-200 group shadow-lg shadow-green-900/10"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>
      </div>
    </div>
  );
}

export default UnderDevelopment;