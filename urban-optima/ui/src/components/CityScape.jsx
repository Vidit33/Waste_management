import React from "react";

export default function CityscapeBackdrop() {
  return (
    
    <div className="absolute top-80 inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-full max-w-4xl h-64">
        <div className="max-w-7xl mx-auto text-center relative opacity-80">
          {/* Cityscape Backdrop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-full max-w-4xl h-64">

              {/* Stylized city silhouette */}
              <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 800 200" fill="none">
                <defs>
                  <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Building silhouettes */}
                {/* ...your <rect> and <line> elements... */}

                {/* (All building rectangles and lines copied from your version above) */}
                <rect x="50" y="120" width="40" height="80" fill="url(#buildingGradient)" />
                <rect x="100" y="80" width="50" height="120" fill="url(#buildingGradient)" />
                <rect x="160" y="100" width="35" height="100" fill="url(#buildingGradient)" />
                <rect x="205" y="60" width="60" height="140" fill="url(#buildingGradient)" />
                <rect x="275" y="90" width="45" height="110" fill="url(#buildingGradient)" />
                <rect x="330" y="70" width="40" height="130" fill="url(#buildingGradient)" />
                <rect x="380" y="110" width="55" height="90" fill="url(#buildingGradient)" />
                <rect x="445" y="85" width="35" height="115" fill="url(#buildingGradient)" />
                <rect x="490" y="95" width="50" height="105" fill="url(#buildingGradient)" />
                <rect x="550" y="75" width="45" height="125" fill="url(#buildingGradient)" />
                <rect x="605" y="105" width="40" height="95" fill="url(#buildingGradient)" />
                <rect x="655" y="125" width="35" height="75" fill="url(#buildingGradient)" />
                <rect x="700" y="140" width="50" height="60" fill="url(#buildingGradient)" />

                {/* Windows */}
                {/* ...window rectangles... */}
                <rect x="55" y="130" width="8" height="6" fill="#fbbf24" opacity="0.8" />
                <rect x="67" y="130" width="8" height="6" fill="#fbbf24" opacity="0.8" />
                <rect x="55" y="145" width="8" height="6" fill="#3b82f6" opacity="0.6" />
                <rect x="67" y="145" width="8" height="6" fill="#fbbf24" opacity="0.8" />

                <rect x="110" y="90" width="10" height="8" fill="#fbbf24" opacity="0.8" />
                <rect x="125" y="90" width="10" height="8" fill="#3b82f6" opacity="0.6" />
                <rect x="110" y="110" width="10" height="8" fill="#fbbf24" opacity="0.8" />
                <rect x="125" y="110" width="10" height="8" fill="#fbbf24" opacity="0.8" />
                <rect x="110" y="130" width="10" height="8" fill="#3b82f6" opacity="0.6" />

                <rect x="215" y="70" width="12" height="10" fill="#fbbf24" opacity="0.8" />
                <rect x="235" y="70" width="12" height="10" fill="#fbbf24" opacity="0.8" />
                <rect x="215" y="95" width="12" height="10" fill="#3b82f6" opacity="0.6" />
                <rect x="235" y="95" width="12" height="10" fill="#fbbf24" opacity="0.8" />

                {/* Antennas */}
                <line x1="225" y1="60" x2="225" y2="45" stroke="#a855f7" strokeWidth="2" />
                <circle cx="225" cy="45" r="3" fill="#a855f7" />
                <line x1="350" y1="70" x2="350" y2="50" stroke="#a855f7" strokeWidth="2" />
                <circle cx="350" cy="50" r="3" fill="#a855f7" />

                {/* Data lines */}
                <line x1="225" y1="45" x2="350" y2="50" stroke="#8b5cf6" strokeWidth="1" opacity="0.6" />
                <line x1="350" y1="50" x2="500" y2="85" stroke="#8b5cf6" strokeWidth="1" opacity="0.6" />
                <line x1="120" y1="80" x2="225" y2="45" stroke="#8b5cf6" strokeWidth="1" opacity="0.6" />
              </svg>

              {/* Floating particles */}
              <div className="absolute inset-0">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-purple-500 rounded-full"
                    style={{
                      left: `${20 + (i * 7) % 60}%`,
                      top: `${30 + (i * 11) % 40}%`,
                      animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  ></div>
                ))}
              </div>

              {/* Holographic grid */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full grid grid-cols-8 grid-rows-4 gap-4">
                  {Array.from({ length: 32 }, (_, i) => (
                    <div
                      key={i}
                      className="border border-purple-400/20"
                      style={{
                        animation: `pulse ${2 + (i % 4)}s infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
