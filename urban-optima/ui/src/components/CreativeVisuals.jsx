import { useEffect, useState } from 'react';

export default function CreativeVisuals() {
  const [animationState, setAnimationState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-80 overflow-hidden top-14">
      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-purple-500/50 to-indigo-500/30 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-36 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/60 rounded-full blur-sm animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 left-32 w-20 h-20 bg-gradient-to-br from-purple-500/60 to-purple-300/30 rounded-full blur-sm animate-pulse" style={{animationDelay: '1s'}}></div>

        {/* Floating data particles */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-600 rounded-full animate-ping"
            style={{
              left: `${10 + (i * 5) % 80}%`,
              top: `${20 + (i * 7) % 60}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`
            }}
          ></div>
        ))}

        {/* Interconnected network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Dynamic connecting lines */}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <line
                x1={`${15 + i * 12}%`}
                y1={`${25 + (i % 3) * 25}%`}
                x2={`${25 + i * 12}%`}
                y2={`${40 + ((i + 1) % 3) * 25}%`}
                stroke="url(#networkGradient)"
                strokeWidth="2"
                className="animate-pulse"
                style={{animationDelay: `${i * 0.5}s`}}
              />
              <circle
                cx={`${15 + i * 12}%`}
                cy={`${25 + (i % 3) * 25}%`}
                r="3"
                fill="#a855f7"
                className="animate-pulse"
                style={{animationDelay: `${i * 0.5}s`}}
              />
            </g>
          ))}
        </svg>

        {/* Floating geometric shapes */}
        <div className="absolute top-24 left-1/4 transform -translate-x-1/2">
          <div className={`w-16 h-16 border-2 border-purple-400/50 rotate-45 transition-all duration-1000 ${animationState === 0 ? 'scale-100' : animationState === 1 ? 'scale-110 rotate-90' : 'scale-95 rotate-180'}`}></div>
        </div>

        <div className="absolute bottom-32 right-1/3 transform translate-x-1/2">
          <div className={`w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 transition-all duration-1000 ${animationState === 0 ? 'rotate-0' : animationState === 1 ? 'rotate-45 scale-110' : 'rotate-90 scale-125'}`}></div>
        </div>

        <div className="absolute top-16 right-1/4">
          <div className={`w-8 h-20 bg-gradient-to-b from-purple-400/40 to-transparent transition-all duration-1000 ${animationState === 0 ? 'skew-x-0' : animationState === 1 ? 'skew-x-12' : 'skew-x-6 scale-110'}`}></div>
        </div>

        {/* Floating hexagons */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 border border-purple-400/30"
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                  transform: `rotate(${i * 60}deg) translateY(-40px)`,
                  animation: `spin ${6 + i}s linear infinite`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Pulsing central core */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-purple-500/60 rounded-full animate-ping"></div>
          <div className="absolute inset-0 w-6 h-6 bg-purple-400/80 rounded-full animate-pulse"></div>
        </div>

        {/* Spiral elements */}
        <div className="absolute bottom-16 left-16">
          <div className="relative w-16 h-16">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-purple-400/20 rounded-full"
                style={{
                  animation: `spin ${8 + i * 2}s linear infinite ${i * 0.5}s`,
                  transform: `scale(${1 - i * 0.2})`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Floating data streams */}
        <div className="absolute top-8 right-12">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-gradient-to-b from-purple-400/60 to-transparent"
              style={{
                height: `${40 + i * 10}px`,
                left: `${i * 8}px`,
                animation: `pulse ${1.5 + i * 0.3}s infinite alternate`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
