import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicLoaderProps {
  onComplete: () => void;
  onExitStart?: () => void;
}

export default function CinematicLoader({ onComplete, onExitStart }: CinematicLoaderProps) {
  const [iconVisible, setIconVisible] = useState(false);
  const [dropState, setDropState] = useState<'idle' | 'falling' | 'landed'>('idle');
  const [glowActive, setGlowActive] = useState(false);
  const [shivering, setShivering] = useState(false);
  const [revealText, setRevealText] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Play a beautiful, glassy resonance "tink" sound
  const playTinkSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.Q.setValueAtTime(4.0, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };

  useEffect(() => {
    // 1. Draw the geometric diamond outlines immediately
    const timerIcon = setTimeout(() => {
      setIconVisible(true);
    }, 100);

    // 2. Start the golden drop fall
    const timerDrop = setTimeout(() => {
      setDropState('falling');
    }, 600);

    // 3. Drop lands exactly in center, triggers sound, shiver, and core gold dot glow
    const timerLanded = setTimeout(() => {
      setDropState('landed');
      playTinkSound();
      setGlowActive(true);
      setShivering(true);
      
      // Stop structural shiver quickly
      setTimeout(() => setShivering(false), 250);
    }, 900);

    // 4. Reveal "mizan." wordmark and elegant subtext
    const timerText = setTimeout(() => {
      setRevealText(true);
    }, 1150);

    // 5. Gentle hold, then begin a smooth scale-fade exit transition
    const timerExit = setTimeout(() => {
      setIsExiting(true);
      if (onExitStart) onExitStart();
    }, 1900);

    // 6. Loader unmount callback (exactly matched to let the 750ms transition complete buttery-smooth)
    const timerComplete = setTimeout(() => {
      onComplete();
    }, 2680);

    return () => {
      clearTimeout(timerIcon);
      clearTimeout(timerDrop);
      clearTimeout(timerLanded);
      clearTimeout(timerText);
      clearTimeout(timerExit);
      clearTimeout(timerComplete);
    };
  }, [onComplete, onExitStart]);

  // Ambient stardust floating in a dark room
  const dustParticles = [
    { id: 1, size: 2.5, top: '20%', left: '25%', delay: 0, duration: 5 },
    { id: 2, size: 1.5, top: '45%', left: '15%', delay: 1, duration: 6 },
    { id: 3, size: 3.0, top: '15%', left: '75%', delay: 0.5, duration: 7 },
    { id: 4, size: 2.0, top: '75%', left: '85%', delay: 1.5, duration: 5 },
    { id: 5, size: 2.5, top: '65%', left: '20%', delay: 2, duration: 6.5 },
    { id: 6, size: 1.5, top: '80%', left: '50%', delay: 0.8, duration: 7 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        id="cinematic-loader"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? 1.02 : 1,
        }}
        transition={{ 
          duration: 0.95, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#110e0c] select-none overflow-hidden"
      >
        {/* Subtle Luxury Linen Texture Overlay */}
        <div className="absolute inset-0 paper-texture-overlay opacity-[0.12] pointer-events-none" />

        {/* Soft Golden Halo behind the symbol */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

        {/* Floating stardust */}
        <div className="absolute inset-0 pointer-events-none">
          {dustParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ 
                opacity: [0, 0.35, 0.35, 0],
                y: -40,
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut"
              }}
              className="absolute bg-gold/25 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                top: p.top,
                left: p.left,
              }}
            />
          ))}
        </div>

        {/* Sacred Geometry Space */}
        <div className="relative w-64 h-64 flex items-center justify-center z-10">
          
          {/* Falling Drop of Intention */}
          <AnimatePresence>
            {dropState === 'falling' && (
              <motion.div
                initial={{ y: -80, opacity: 0, scale: 0.5 }}
                animate={{ 
                  y: 0, 
                  opacity: [0, 1, 1],
                  scale: [0.5, 1, 0.7]
                }}
                exit={{ 
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.32, 0, 0.67, 0] // Accelerating gravitational pull
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-20 z-20 flex flex-col items-center"
              >
                {/* Perfect golden liquid drop */}
                <div className="w-2.5 h-3.5 rounded-t-full rounded-b-[45%] bg-gold relative shadow-[0_0_10px_rgba(223,186,107,0.6)]">
                  <div className="absolute top-0.5 left-0.5 w-0.5 h-1.5 bg-white/70 rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Mizan Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: iconVisible ? 1 : 0, 
              scale: isExiting ? 1.12 : (iconVisible ? 1 : 0.95),
              x: shivering ? [0, -2, 2, -1.5, 1.5, 0] : 0,
              y: shivering ? [0, -1, 1, -0.5, 0.5, 0] : 0,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 110, 
              damping: 20,
              x: { duration: 0.25, ease: "linear" },
              y: { duration: 0.25, ease: "linear" }
            }}
            className="w-40 h-40 relative flex items-center justify-center"
          >
            {/* Dynamic Gold Ripple/Pulse upon drop impact */}
            <AnimatePresence>
              {glowActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [0.4, 1.3, 1.6]
                  }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="absolute w-36 h-36 rounded-full border border-gold/45 blur-[2px] pointer-events-none z-0"
                />
              )}
            </AnimatePresence>

            {/* Glowing Golden Aura representing alignment */}
            <AnimatePresence>
              {glowActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ 
                    opacity: [0, 0.8, 0.45],
                    scale: [0.7, 1.15, 1.0]
                  }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="absolute w-24 h-24 rounded-full bg-gold/20 blur-xl pointer-events-none mix-blend-screen z-0"
                />
              )}
            </AnimatePresence>

            {/* Official Mizan SVG Symbol, rendered in responsive high fidelity */}
            <svg 
              viewBox="0 0 512 512" 
              className="w-full h-full select-none relative z-10"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer and Inner Diamond Outlines */}
              <motion.g 
                stroke="#dfba6b" 
                strokeWidth={14} 
                fill="none" 
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={iconVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.2 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <path d="M256 118 L368 256 L256 394 L144 256 Z" />
                <path d="M256 174 L322 256 L256 338 L190 256 Z" />
              </motion.g>

              {/* Central Golden Dot represents the perfect center of balance */}
              <motion.circle 
                cx="256" 
                cy="256" 
                r="18" 
                fill="#dfba6b"
                initial={{ scale: 0, opacity: 0 }}
                animate={glowActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 10, delay: 0.05 }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Wordmark and Editorial Subtitle Reveal */}
        <div className="h-20 flex flex-col items-center justify-center mt-2 z-10 overflow-hidden">
          <AnimatePresence>
            {revealText && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
                  }
                }}
                className="flex flex-col items-center space-y-1.5 text-center"
              >
                {/* Mizan Wordmark Reveal via horizontal mask wipe */}
                <motion.h1
                  variants={{
                    hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0, y: 10 },
                    visible: { 
                      clipPath: 'inset(0 0% 0 0)', 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
                    }
                  }}
                  className="font-serif text-3xl sm:text-4xl text-parchment font-medium tracking-wide"
                >
                 Mizan<span className="text-gold">.</span>
                </motion.h1>

                {/* Subtitle reveal */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { 
                      opacity: 0.7, 
                      y: 0,
                      transition: { duration: 0.7, ease: "easeOut" } 
                    }
                  }}
                  className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sand font-medium"
                >
                  Built with intention.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

