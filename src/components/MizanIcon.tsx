import { motion } from 'motion/react';

interface MizanIconProps {
  className?: string;
  strokeColor?: string;
  dotColor?: string;
  strokeWidth?: number;
}

export default function MizanIcon({
  className = "w-10 h-10",
  strokeColor = "currentColor",
  dotColor = "#B08D57",
  strokeWidth = 14,
}: MizanIconProps) {
  return (
    <svg 
      viewBox="0 0 512 512" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        fill="none" 
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <path d="M256 118 L368 256 L256 394 L144 256 Z" />
        <path d="M256 174 L322 256 L256 338 L190 256 Z" />
      </motion.g>
      <motion.circle 
        cx="256" 
        cy="256" 
        r="20" 
        fill={dotColor}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.6 }}
      />
    </svg>
  );
}
