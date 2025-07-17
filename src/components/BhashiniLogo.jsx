"use client";

const BhashiniLogo = ({ className = "w-12 h-12", color = "currentColor" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#bhashiniGradient)"
        stroke="white"
        strokeWidth="2"
      />
      
      {/* Devanagari "भा" stylized */}
      <g transform="translate(25, 30)">
        {/* भ character stylized */}
        <path
          d="M10 15 L10 35 M10 25 L25 25 M25 15 L25 35 M25 25 C30 20, 35 25, 35 30 C35 35, 30 40, 25 35"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* आ character stylized */}
        <path
          d="M40 15 L40 35 M40 25 L50 25 M50 15 C55 15, 60 20, 60 25 C60 30, 55 35, 50 35 L40 35"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Top line (शिरोरेखा) */}
        <line
          x1="5"
          y1="15"
          x2="65"
          y2="15"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      
      {/* Decorative elements */}
      <circle cx="20" cy="25" r="2" fill="white" opacity="0.7" />
      <circle cx="80" cy="75" r="2" fill="white" opacity="0.7" />
      <circle cx="75" cy="25" r="1.5" fill="white" opacity="0.5" />
      <circle cx="25" cy="75" r="1.5" fill="white" opacity="0.5" />
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="bhashiniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="50%" stopColor="#F7931E" />
          <stop offset="100%" stopColor="#FFD23F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BhashiniLogo;
