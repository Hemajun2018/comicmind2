export function BrainIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hand-drawn brain illustration */}
      <path 
        d="M32 8c6 0 11 3 14 7 2 3 2 7 1 10 3 2 5 5 5 9 0 3-1 6-3 8 1 2 1 4 0 6-1 3-4 5-7 6-2 4-6 7-11 7-3 0-6-1-8-3-2 2-5 3-8 3-5 0-9-3-11-7-3-1-6-3-7-6-1-2-1-4 0-6-2-2-3-5-3-8 0-4 2-7 5-9-1-3-1-7 1-10 3-4 8-7 14-7z" 
        fill="var(--secondary)" 
        stroke="var(--text)" 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
      {/* Brain details */}
      <path 
        d="M20 25c3-2 7-2 10 0M34 25c3-2 7-2 10 0M18 35c2-1 4-1 6 0M40 35c2-1 4-1 6 0M25 45c2-1 5-1 7 0M32 45c2-1 5-1 7 0" 
        stroke="var(--text)" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      {/* Cute eyes */}
      <circle cx="26" cy="30" r="2" fill="var(--text)" />
      <circle cx="38" cy="30" r="2" fill="var(--text)" />
      {/* Smile */}
      <path 
        d="M28 38c2 2 6 2 8 0" 
        stroke="var(--text)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}