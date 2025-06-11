export function ComputerBrainIcon({ className = "w-64 h-64" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 400 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Laptop base */}
      <rect 
        x="50" 
        y="180" 
        width="300" 
        height="100" 
        rx="8" 
        fill="var(--neutral-card)" 
        stroke="var(--text)" 
        strokeWidth="3"
      />
      {/* Laptop screen */}
      <rect 
        x="70" 
        y="40" 
        width="260" 
        height="160" 
        rx="12" 
        fill="var(--neutral-card)" 
        stroke="var(--text)" 
        strokeWidth="3"
      />
      {/* Screen inner */}
      <rect 
        x="85" 
        y="55" 
        width="230" 
        height="130" 
        rx="6" 
        fill="var(--primary)" 
        opacity="0.1"
      />
      
      {/* Mind map brain in center */}
      <circle cx="200" cy="120" r="25" fill="var(--secondary)" stroke="var(--text)" strokeWidth="2"/>
      
      {/* Mind map nodes */}
      <circle cx="140" cy="90" r="12" fill="var(--accent)" stroke="var(--text)" strokeWidth="2"/>
      <circle cx="260" cy="90" r="12" fill="var(--primary)" stroke="var(--text)" strokeWidth="2"/>
      <circle cx="120" cy="140" r="12" fill="var(--secondary)" stroke="var(--text)" strokeWidth="2"/>
      <circle cx="280" cy="140" r="12" fill="var(--accent)" stroke="var(--text)" strokeWidth="2"/>
      <circle cx="160" cy="170" r="10" fill="var(--primary)" stroke="var(--text)" strokeWidth="2"/>
      <circle cx="240" cy="170" r="10" fill="var(--secondary)" stroke="var(--text)" strokeWidth="2"/>
      
      {/* Connecting lines */}
      <path 
        d="M175 120 L152 102 M225 120 L248 102 M185 135 L132 140 M215 135 L268 140 M190 140 L170 165 M210 140 L230 165" 
        stroke="var(--text)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Keyboard */}
      <rect x="90" y="200" width="220" height="40" rx="4" fill="var(--neutral-bg)" stroke="var(--text)" strokeWidth="1"/>
      {/* Keys */}
      <rect x="95" y="210" width="8" height="6" rx="1" fill="var(--text)" opacity="0.3"/>
      <rect x="108" y="210" width="8" height="6" rx="1" fill="var(--text)" opacity="0.3"/>
      <rect x="121" y="210" width="8" height="6" rx="1" fill="var(--text)" opacity="0.3"/>
      <rect x="160" y="210" width="80" height="6" rx="1" fill="var(--text)" opacity="0.3"/>
      
      {/* Trackpad */}
      <rect x="180" y="225" width="40" height="25" rx="3" fill="var(--neutral-bg)" stroke="var(--text)" strokeWidth="1"/>
      
      {/* Floating doodle elements */}
      <circle cx="30" cy="50" r="4" fill="var(--secondary)" opacity="0.6"/>
      <circle cx="370" cy="70" r="3" fill="var(--accent)" opacity="0.6"/>
      <circle cx="40" cy="200" r="3" fill="var(--primary)" opacity="0.6"/>
      <circle cx="360" cy="180" r="4" fill="var(--secondary)" opacity="0.6"/>
    </svg>
  );
}