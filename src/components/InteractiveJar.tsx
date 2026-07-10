import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Sun, Feather, RefreshCw } from 'lucide-react';
import { versesAndHadiths, reflectionPrompts, VerseOrHadith, ReflectionPrompt } from '../data/reminders';

interface DropType {
  id: string;
  label: string;
  icon: any;
  color: string;
  shadowColor: string;
  reflection: string;
}

const DROP_TYPES: DropType[] = [
  {
    id: 'charity',
    label: 'A Silent Charity',
    icon: Sparkles,
    color: 'bg-clay text-ivory',
    shadowColor: 'rgba(160, 77, 42, 0.4)',
    reflection: 'You secretly eased someone’s burden today.'
  },
  {
    id: 'smile',
    label: 'A Sincere Smile',
    icon: Sun,
    color: 'bg-gold text-walnut',
    shadowColor: 'rgba(218, 165, 32, 0.4)',
    reflection: 'You brought warmth into another heart.'
  },
  {
    id: 'prayer',
    label: 'A Hidden Prayer',
    icon: Heart,
    color: 'bg-terracotta text-ivory',
    shadowColor: 'rgba(193, 99, 61, 0.4)',
    reflection: 'You prayed in secret for someone’s relief.'
  },
  {
    id: 'kindness',
    label: 'An Act of Kindness',
    icon: Feather,
    color: 'bg-olive text-ivory',
    shadowColor: 'rgba(107, 142, 35, 0.4)',
    reflection: 'You spoke gently or cleared a path today.'
  }
];

// Apple/Awwwards-grade rolling number counter for satisfying feedback
function RollingCounter({ value }: { value: number }) {
  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden h-4 min-w-[12px] align-middle">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="font-semibold text-walnut font-sans"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function InteractiveJar() {
  const [drops, setDrops] = useState<number>(3); // initial level
  const [activeVerse, setActiveVerse] = useState<VerseOrHadith>(versesAndHadiths[0]);
  const [activePrompt, setActivePrompt] = useState<ReflectionPrompt>(reflectionPrompts[0]);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [ripple, setRipple] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Ceremonial sequence state variables
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [ceremonyStep, setCeremonyStep] = useState<'idle' | 'rising' | 'floating' | 'impact' | 'settling'>('idle');
  const [floatingDrop, setFloatingDrop] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    shadowColor: string;
  } | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);
  const [jarVibrating, setJarVibrating] = useState<boolean>(false);
  const [jarGlow, setJarGlow] = useState<boolean>(false);
  const [shadowScale, setShadowScale] = useState<number>(1);

  // Play natural pentatonic sine/triangle wave synthesizer chime (general interaction)
  const playTranquilChime = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      const scale = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
      const randomFreq = scale[Math.floor(Math.random() * scale.length)];
      
      osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (err) {}
  };

  // Apple-grade physical model synthesizer of a hollow ceramic jar being struck
  const playCeramicClink = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Impact Clink: sharp, glassy, high-frequency clay contact click
      const oscImpact = ctx.createOscillator();
      const gainImpact = ctx.createGain();
      oscImpact.type = 'sine';
      oscImpact.frequency.setValueAtTime(1480, ctx.currentTime);
      oscImpact.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + 0.04);
      
      gainImpact.gain.setValueAtTime(0, ctx.currentTime);
      gainImpact.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.004);
      gainImpact.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
      
      // Resonating clay belly: hollow, organic chamber vibration
      const oscBody = ctx.createOscillator();
      const gainBody = ctx.createGain();
      oscBody.type = 'triangle';
      oscBody.frequency.setValueAtTime(435, ctx.currentTime);
      
      gainBody.gain.setValueAtTime(0, ctx.currentTime);
      gainBody.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.012);
      gainBody.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);
      
      // Warm, resonant lowpass filter with higher resonance (acoustic chamber simulation)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(920, ctx.currentTime);
      filter.Q.setValueAtTime(4.0, ctx.currentTime); // warm ring
      
      oscImpact.connect(filter);
      oscBody.connect(filter);
      
      filter.connect(gainImpact);
      filter.connect(gainBody);
      
      gainImpact.connect(ctx.destination);
      gainBody.connect(ctx.destination);
      
      oscImpact.start();
      oscBody.start();
      
      oscImpact.stop(ctx.currentTime + 0.1);
      oscBody.stop(ctx.currentTime + 0.45);
    } catch (err) {}
  };

  const handleAddDrop = (type: DropType) => {
    if (ceremonyStep !== 'idle') return;

    setSelectedCardId(type.id);
    setCeremonyStep('rising');
    playTranquilChime(); // Gentle feedback on initial click

    // Allow card to elegantly rise and begin glowing before the drop materializes
    setTimeout(() => {
      const container = document.getElementById('interactive-jar-experience');
      const card = document.getElementById(`add-drop-${type.id}`);
      const mouth = document.getElementById('jar-mouth-target');

      if (container && card && mouth) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const mouthRect = mouth.getBoundingClientRect();

        // Start coordinate calculations relative to the absolute container
        const startX = (cardRect.left + cardRect.width / 2) - containerRect.left;
        const startY = (cardRect.top + cardRect.height / 2) - containerRect.top - 15;

        const endX = (mouthRect.left + mouthRect.width / 2) - containerRect.left;
        const endY = (mouthRect.top + mouthRect.height / 2) - containerRect.top;

        setFloatingDrop({
          startX,
          startY,
          endX,
          endY,
          color: type.color,
          shadowColor: type.shadowColor
        });
        setCeremonyStep('floating');
      } else {
        // Safe graceful fallback if layout coordinates aren't ready
        setDrops(prev => Math.min(prev + 1, 10));
        setRipple(true);
        setTimeout(() => setRipple(false), 800);
        setSelectedCardId(null);
        setCeremonyStep('idle');
      }
    }, 450);
  };

  // Triggered when the floating drop reaches the jar neck perfectly
  const handleDropImpact = () => {
    setCeremonyStep('impact');
    playCeramicClink(); // satisfying clink sound
    
    // Physical feedback
    setJarVibrating(true);
    setRipple(true);
    setJarGlow(true);
    setShadowScale(0.91); // Shadow tightens organically on impact

    // Generate burst of tiny upwards floating golden embers
    const burstParticles = Array.from({ length: 9 }).map((_, i) => ({
      id: Math.random(),
      x: (Math.random() - 0.5) * 55, // Horizontal dispersion
      y: (Math.random() - 1.0) * 35 - 15, // Upward vertical thrust
      scale: Math.random() * 0.7 + 0.3
    }));
    setParticles(burstParticles);

    // Update level
    setDrops(prev => Math.min(prev + 1, 10));

    // Quietly advance to next scripture and journaling prompt
    const verseIndex = (versesAndHadiths.indexOf(activeVerse) + 1) % versesAndHadiths.length;
    const promptIndex = (reflectionPrompts.indexOf(activePrompt) + 1) % reflectionPrompts.length;
    setActiveVerse(versesAndHadiths[verseIndex]);
    setActivePrompt(reflectionPrompts[promptIndex]);
    setIsSaved(false);
    setReflectionText('');

    setFloatingDrop(null);

    // Short physical vibration duration
    setTimeout(() => {
      setJarVibrating(false);
    }, 240);

    // Fade glow and restore shadow depth
    setTimeout(() => {
      setCeremonyStep('settling');
      setJarGlow(false);
      setShadowScale(1);
      setRipple(false);
    }, 750);

    // Complete transition and restore grid cards to active state
    setTimeout(() => {
      setSelectedCardId(null);
      setCeremonyStep('idle');
      setParticles([]);
    }, 1300);
  };

  const handleSaveReflection = (e: FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    setIsSaved(true);
    playTranquilChime();
  };

  return (
    <div 
      id="interactive-jar-experience" 
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative"
    >
      {/* Floating ceremonial drop layer (Coordinates calculated dynamically in React) */}
      <AnimatePresence>
        {floatingDrop && (
          <motion.div
            initial={{ 
              x: floatingDrop.startX, 
              y: floatingDrop.startY, 
              scale: 0.5, 
              opacity: 0 
            }}
            animate={{ 
              x: floatingDrop.endX - 10, // offset half width of drop
              y: floatingDrop.endY - 20, 
              scale: 1, 
              opacity: [0, 1, 1, 0.95]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.15, 
              ease: [0.22, 1, 0.36, 1] // Custom highly dampened floating ease-out
            }}
            onAnimationComplete={handleDropImpact}
            className="absolute pointer-events-none z-30 flex items-center justify-center"
            style={{ left: 0, top: 0 }}
          >
            {/* The physical glowing droplet */}
            <div 
              className={`w-5 h-7 rounded-t-full rounded-b-[45%] ${floatingDrop.color} flex items-center justify-center relative`}
              style={{ boxShadow: `0 0 20px ${floatingDrop.shadowColor}` }}
            >
              {/* Internal glint accent */}
              <div className="absolute top-1 left-1.5 w-1.5 h-3 bg-white/80 rounded-full rotate-12" />
            </div>
            {/* Ambient soft pulse halo */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -inset-2 rounded-full ${floatingDrop.color} opacity-40 blur-md -z-10`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Writing Side */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-8 order-2 lg:order-1">
        <div className="space-y-4">
          <span className="font-mono text-xs tracking-[0.2em] text-bronze uppercase block">
            Interactive Experience
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-walnut leading-tight italic">
            Begin with a single drop.
          </h2>
          <p className="font-sans text-base text-coffee/90 max-w-xl leading-relaxed font-normal">
            Click one of the intents below to place a virtual deed into the ceramic jar. 
            Experience the soft physical sound of giving, reflect on the scripture revealed, 
            and write a quiet reflection.
          </p>
        </div>

        {/* Dynamic focus-shifting buttons grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl relative">
          {DROP_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedCardId === type.id;
            const isAnySelected = selectedCardId !== null;
            const isInactive = isAnySelected && !isSelected;

            return (
              <motion.button
                key={type.id}
                id={`add-drop-${type.id}`}
                onClick={() => handleAddDrop(type)}
                disabled={isAnySelected}
                animate={{
                  y: isSelected ? -8 : 0,
                  opacity: isInactive ? 0.35 : 1,
                  scale: isSelected ? 1.03 : 1,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                className={`flex items-center space-x-3 p-4 rounded-xl border text-left transition-all duration-300 select-none cursor-pointer outline-none relative ${
                  isSelected 
                    ? 'border-terracotta bg-white shadow-[0_12px_32px_rgba(193,99,61,0.15)] z-20' 
                    : 'border-sand bg-white/60 hover:bg-white hover:border-bronze shadow-sm'
                }`}
              >
                {/* Active pulsating/glowing icon wrapper */}
                <motion.div 
                  animate={isSelected ? {
                    scale: [1, 1.15, 1],
                    boxShadow: [
                      '0 0 0 rgba(193,99,61,0)',
                      `0 0 14px ${type.shadowColor}`,
                      '0 0 0 rgba(193,99,61,0)'
                    ]
                  } : {}}
                  transition={{ duration: 0.9, repeat: isSelected ? Infinity : 0 }}
                  className={`p-2.5 rounded-lg ${type.color} shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-walnut transition-colors duration-300">
                    {type.label}
                  </p>
                  <p className="font-sans text-xs text-coffee/95 truncate">
                    {isSelected ? 'Focusing intent...' : 'Drop inside'}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Editorial Text Card */}
        <div className="border border-sand bg-parchment/70 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden max-w-xl shadow-tactile">
          <div className="absolute top-0 right-0 p-3 opacity-30">
            <span className="font-serif text-8xl text-sand select-none leading-none">”</span>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVerse.reference}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] tracking-wider text-terracotta uppercase border border-terracotta/30 px-2 py-0.5 rounded">
                  {activeVerse.type === 'quran' ? 'Al-Qur’an' : 'Hadith'}
                </span>
                <span className="font-mono text-[10px] text-walnut/90">
                  {activeVerse.reference}
                </span>
              </div>
              <p className="font-serif text-xl sm:text-2xl text-right text-walnut leading-relaxed font-normal tracking-wide" dir="rtl">
                {activeVerse.text}
              </p>
              <p className="font-sans text-sm text-walnut/90 leading-relaxed font-normal italic">
                “{activeVerse.translation}”
              </p>
            </motion.div>
          </AnimatePresence>

          <hr className="border-t border-sand/60" />

          {/* Interactive Journaling Prompt */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive"></span>
              <span className="font-mono text-[11px] text-coffee/90 font-semibold uppercase tracking-wider">
                Daily Reflection Prompt
              </span>
            </div>
            <p className="font-serif text-lg text-walnut italic leading-relaxed">
              {activePrompt.question}
            </p>

            <AnimatePresence mode="wait">
              {!isSaved ? (
                <motion.form
                  key="form"
                  onSubmit={handleSaveReflection}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Write a private, sincere note here..."
                    className="w-full p-3 text-sm font-sans bg-white border border-sand rounded-xl focus:outline-none focus:border-bronze min-h-[80px] resize-none transition-all placeholder:text-coffee/75 text-walnut"
                  />
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-coffee/85 font-medium">Only visible to you.</span>
                    <button
                      type="submit"
                      disabled={!reflectionText.trim()}
                      className="px-4 py-2 bg-walnut text-ivory text-xs font-sans font-medium rounded-lg hover:bg-terracotta transition-all duration-300 disabled:opacity-40 cursor-pointer"
                    >
                      Record Drop Reflection
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-olive/10 border border-olive/20 rounded-xl flex items-start space-x-3"
                >
                  <div className="p-1 rounded-full bg-olive text-ivory mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-semibold text-olive">Reflection Saved</h4>
                    <p className="font-sans text-xs text-walnut/90 mt-1 leading-relaxed">
                      Your quiet note is folded into your local Sadaqah Jar. Just like a physical paper scroll placed inside.
                    </p>
                    <button
                      onClick={() => setIsSaved(false)}
                      className="mt-2 text-xs font-sans text-bronze underline flex items-center space-x-1 hover:text-walnut cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 animate-spin-slow" />
                      <span>Write another</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Visual Jar Side */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 space-y-6 relative z-20">
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] flex items-center justify-center">
          {/* Subtle Ambient Sunlight Glow behind the jar */}
          <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-full bg-gold/15 blur-3xl mix-blend-multiply pointer-events-none" />

          {/* Invisible target anchor for calculating flying drop coordinates */}
          <div 
            id="jar-mouth-target" 
            className="absolute top-[13.5%] left-1/2 -translate-x-1/2 w-4 h-4 pointer-events-none z-30" 
          />

          {/* Ceramic Jar Frame with physical vibration translation */}
          <motion.div 
            animate={jarVibrating ? {
              x: [0, -2.5, 2.5, -1.8, 1.8, -0.8, 0.8, 0],
              y: [0, 1.2, -1.2, 0.8, -0.8, 0],
            } : {}}
            transition={{ duration: 0.26, ease: "linear" }}
            className="relative w-full h-full"
          >
            {/* Floating impact particles rising from mouth target */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
                  animate={{ 
                    x: p.x, 
                    y: p.y, 
                    opacity: 0, 
                    scale: 0 
                  }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-[13.5%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold/90 blur-[0.5px] z-30 pointer-events-none"
                />
              ))}
            </AnimatePresence>

            {/* The Outer Ceramic Jar Shape using highly custom SVG and gradients */}
            <svg viewBox="0 0 300 400" className="w-full h-full filter drop-shadow-xl select-none">
              <defs>
                {/* Clay Material Gradient */}
                <linearGradient id="clay-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a04d2a" />
                  <stop offset="40%" stopColor="#c1633d" />
                  <stop offset="65%" stopColor="#d17a54" />
                  <stop offset="85%" stopColor="#b55832" />
                  <stop offset="100%" stopColor="#8d3d1e" />
                </linearGradient>

                {/* Glaze Speckle Pattern */}
                <pattern id="speckle-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="0.6" fill="#f7f3eb" opacity="0.35" />
                  <circle cx="15" cy="12" r="0.8" fill="#413530" opacity="0.25" />
                  <circle cx="18" cy="2" r="0.5" fill="#faf7f2" opacity="0.4" />
                </pattern>

                {/* Mask for liquid level inside */}
                <clipPath id="jar-interior-clip">
                  <path d="M 150,55 C 190,55 195,50 205,80 C 220,130 255,160 255,240 C 255,330 220,355 150,355 C 80,355 45,330 45,240 C 45,160 80,130 95,80 C 105,50 110,55 150,55 Z" />
                </clipPath>

                {/* Gold Rim Gradient */}
                <linearGradient id="gold-rim-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#aa8337" />
                  <stop offset="50%" stopColor="#dfba6b" />
                  <stop offset="100%" stopColor="#9a752a" />
                </linearGradient>

                {/* Liquid Level Gradient */}
                <linearGradient id="liquid-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(197, 160, 89, 0.1)" />
                  <stop offset="60%" stopColor="rgba(197, 160, 89, 0.4)" />
                  <stop offset="100%" stopColor="rgba(250, 247, 242, 0.75)" />
                </linearGradient>
              </defs>

              {/* Liquid / Deeds Level inside the jar */}
              <g clipPath="url(#jar-interior-clip)">
                {/* Simulated Deed Waves */}
                <motion.path
                  animate={ripple ? {
                    y: [260 - (drops * 18), 245 - (drops * 18), 260 - (drops * 18)],
                    d: [
                      `M -50,260 Q 50,${250 - (drops * 2)} 150,260 T 350,260 L 350,400 L -50,400 Z`,
                      `M -50,260 Q 50,${265 - (drops * 2)} 150,260 T 350,260 L 350,400 L -50,400 Z`,
                      `M -50,260 Q 50,${250 - (drops * 2)} 150,260 T 350,260 L 350,400 L -50,400 Z`
                    ]
                  } : {
                    y: 260 - (drops * 18),
                    d: `M -50,260 Q 50,250 150,260 T 350,260 L 350,400 L -50,400 Z`
                  }}
                  transition={{ duration: ripple ? 0.8 : 3, repeat: ripple ? 0 : Infinity, ease: "easeInOut" }}
                  fill="url(#liquid-grad)"
                />

                {/* Ceramic warm interior golden glow */}
                <AnimatePresence>
                  {jarGlow && (
                    <motion.circle
                      key="golden-belly-glow"
                      initial={{ opacity: 0, r: 0 }}
                      animate={{ opacity: 0.55, r: 130 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      cx="150"
                      cy="230"
                      fill="url(#gold-rim-grad)"
                      className="mix-blend-screen pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Small floating sparkles (light points) inside the jar */}
                {Array.from({ length: drops }).map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={100 + (i * 12) + (Math.sin(i) * 15)}
                    cy={320 - (i * 10) - (Math.cos(i) * 10)}
                    r={3 + (i % 3)}
                    fill="#c5a059"
                    opacity={0.6 + (i % 4) * 0.1}
                    animate={{
                      y: [0, -6, 0],
                      opacity: [0.5, 0.9, 0.5]
                    }}
                    transition={{
                      duration: 2 + (i % 3),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                ))}
              </g>

              {/* Raw Clay Base shadow (shrinks and darkens dynamically on vibration) */}
              <motion.ellipse 
                cx="150" 
                cy="358" 
                rx={70 * shadowScale} 
                ry={12 * shadowScale} 
                fill="#2c221e" 
                opacity={0.3 * shadowScale} 
                animate={{
                  rx: 70 * shadowScale,
                  ry: 12 * shadowScale,
                  opacity: 0.3 * shadowScale
                }}
                transition={{ type: "spring", stiffness: 180, damping: 15 }}
              />

              {/* Main Clay Body */}
              <path
                d="M 150,55 C 190,55 195,50 205,80 C 220,130 255,160 255,240 C 255,330 220,355 150,355 C 80,355 45,330 45,240 C 45,160 80,130 95,80 C 105,50 110,55 150,55 Z"
                fill="url(#clay-grad)"
              />

              {/* Handcrafted glazes and textures overlay */}
              <path
                d="M 150,55 C 190,55 195,50 205,80 C 220,130 255,160 255,240 C 255,330 220,355 150,355 C 80,355 45,330 45,240 C 45,160 80,130 95,80 C 105,50 110,55 150,55 Z"
                fill="url(#speckle-pattern)"
              />

              {/* Organic highlight to convey ceramic gloss */}
              <path
                d="M 95,80 C 80,130 45,160 45,240 C 45,290 55,315 80,335 C 70,310 60,270 60,240 C 60,165 90,135 102,90 C 103,85 101,80 95,80 Z"
                fill="#faf7f2"
                opacity="0.12"
              />

              {/* Subtle natural shadow on the right */}
              <path
                d="M 150,355 C 220,355 255,330 255,240 C 255,160 220,130 205,80 C 201,68 198,60 192,57 C 208,70 230,130 230,240 C 230,320 200,345 150,355 Z"
                fill="#2c221e"
                opacity="0.25"
              />

              {/* Handmade wooden neck rim */}
              <ellipse cx="150" cy="55" rx="42" ry="10" fill="url(#gold-rim-grad)" />
              <ellipse cx="150" cy="55" rx="36" ry="8" fill="#2c221e" />

              {/* Geometric Motif Engraved on Ceramic Jar (Official Mizan SVG Icon adapted) */}
              <g transform="translate(150, 200) scale(0.25) translate(-256, -256)" opacity="0.22" stroke="#faf7f2" strokeWidth="12" fill="none" strokeLinejoin="round">
                <path d="M256 118 L368 256 L256 394 L144 256 Z"/>
                <path d="M256 174 L322 256 L256 338 L190 256 Z"/>
                <circle cx="256" cy="256" r="18" fill="#dfba6b" stroke="none"/>
              </g>
            </svg>

            {/* Soft ambient ripple blur behind the jar */}
            <AnimatePresence>
              {ripple && (
                <motion.div
                  initial={{ scale: 0.75, opacity: 0.75 }}
                  animate={{ scale: 1.35, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gold/10 rounded-full blur-2xl pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Dynamic State Indicators */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-3 bg-parchment/60 border border-sand px-4 py-2 rounded-full shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-clay"></span>
            </span>
            <span className="font-mono text-xs text-coffee/95 font-medium tracking-wider select-none">
              YOUR JAR: <strong className="font-semibold text-walnut inline-flex items-center gap-1"><RollingCounter value={drops} /> Drops of Light</strong>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setDrops(3);
                playTranquilChime();
              }}
              disabled={ceremonyStep !== 'idle'}
              className="font-mono text-[10px] text-coffee/90 hover:text-terracotta tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-40"
            >
              Reset Jar
            </button>
            <span className="text-sand select-none">|</span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="font-mono text-[10px] text-coffee/90 hover:text-terracotta tracking-wider uppercase transition-colors cursor-pointer"
            >
              {isMuted ? 'Unmute Chime' : 'Mute Chime'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
