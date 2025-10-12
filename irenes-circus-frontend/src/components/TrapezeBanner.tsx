import React from "react";

type TrapezeBannerProps = {
  className?: string;
};

const TrapezeBanner: React.FC<TrapezeBannerProps> = ({ className }) => {
  return (
    <div className={`w-full flex items-center justify-center ${className ?? ""}`}>
      <svg
        viewBox="0 0 1200 160"
        className="w-full max-w-5xl"
        role="img"
        aria-label="Animated trapeze banner"
      >
        <defs>
          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Decorative divider removed to avoid a double-line look */}

        {/* Top rig beam */}
        <line x1="200" y1="30" x2="1000" y2="30" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

        {/* Swinging trapeze group */}
        <g filter="url(#shadow)" transform="translate(600,30)" className="trapeze-pivot">
          {/* Ropes */}
          <line x1="-80" y1="0" x2="-40" y2="90" stroke="#D4AF37" strokeWidth="2" />
          <line x1="80" y1="0" x2="40" y2="90" stroke="#D4AF37" strokeWidth="2" />
          {/* Bar */}
          <rect x="-60" y="90" width="120" height="8" rx="4" fill="#1E1E1E" stroke="#D4AF37" strokeWidth="2" />
          {/* Performer silhouette */}
          <circle cx="0" cy="62" r="9" fill="#1E1E1E" stroke="#D4AF37" strokeWidth="2" />
          <path d="M -6 72 Q 0 88 10 96" stroke="#1E1E1E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 6 72 Q 0 88 -10 96" stroke="#1E1E1E" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>

        <style>
          {`
            @keyframes pivotSwing {
              0% { transform: translate(600px,30px) rotate(-7deg); }
              50% { transform: translate(600px,30px) rotate(7deg); }
              100% { transform: translate(600px,30px) rotate(-7deg); }
            }
            .trapeze-pivot { transform-origin: 0 0; animation: pivotSwing 5.2s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) { .trapeze-pivot { animation: none; } }
          `}
        </style>
      </svg>
    </div>
  );
};

export default TrapezeBanner;


