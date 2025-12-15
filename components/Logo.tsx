import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M50 5L15 20V45C15 70 50 95 50 95C50 95 85 70 85 45V20L50 5ZM40 70L25 55L32 48L40 56L68 28L75 35L40 70Z" 
      />
    </svg>
  );
};

export default Logo;