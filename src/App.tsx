import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Heart, 
  Leaf, 
  Users, 
  ChevronRight, 
  Quote, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert,
  Compass,
  Palette,
  Check,
  Menu,
  X
} from 'lucide-react';
import InteractiveJar from './components/InteractiveJar';
import AppScreenshots from './components/AppScreenshots';
import CinematicLoader from './components/CinematicLoader';
import MizanIcon from './components/MizanIcon';
import { corePhilosophy } from './data/reminders';

const dustParticles = [
  { id: 1, size: 2.1, left: '12%', duration: 18, delay: -4 },
  { id: 2, size: 1.5, left: '28%', duration: 24, delay: -12 },
  { id: 3, size: 3.0, left: '42%', duration: 15, delay: -7 },
  { id: 4, size: 1.2, left: '56%', duration: 28, delay: -18 },
  { id: 5, size: 2.5, left: '68%', duration: 22, delay: -2 },
  { id: 6, size: 1.8, left: '85%', duration: 20, delay: -15 },
  { id: 7, size: 2.8, left: '94%', duration: 16, delay: -8 },
  { id: 8, size: 1.4, left: '21%', duration: 26, delay: -21 },
  { id: 9, size: 2.0, left: '37%', duration: 19, delay: -5 },
  { id: 10, size: 1.6, left: '51%', duration: 25, delay: -14 },
  { id: 11, size: 2.4, left: '76%', duration: 21, delay: -9 },
  { id: 12, size: 1.9, left: '89%', duration: 23, delay: -11 },
];

export default function App() {
  const [isLoaderActive, setIsLoaderActive] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeRef, setActiveRef] = useState<number | null>(null);
  const [fontPairing, setFontPairing] = useState<'classical' | 'warmth' | 'desert' | 'modern'>('warmth');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [hasGivenToday, setHasGivenToday] = useState(false);
  const [streakDays, setStreakDays] = useState(23);
  const [isCoinDropping, setIsCoinDropping] = useState(false);

  // Smooth parallax cursor tracking with spring physics
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springConfig = { stiffness: 45, damping: 20 };
  const smoothMouseX = useSpring(0, springConfig);
  const smoothMouseY = useSpring(0, springConfig);

  useEffect(() => {
    smoothMouseX.set(mousePos.x);
    smoothMouseY.set(mousePos.y);
  }, [mousePos.x, mousePos.y, smoothMouseX, smoothMouseY]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(max-width: 767px)').matches) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (clientX / innerWidth) - 0.5,
        y: (clientY / innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll Parallax transforms
  const { scrollY } = useScroll();
  const phoneScale = useTransform(scrollY, [0, 600], [1, 1.05]);
  const phoneScrollY = useTransform(scrollY, [0, 600], [0, -40]);
  const cardScrollY = useTransform(scrollY, [0, 600], [0, -120]);
  const headingScrollY = useTransform(scrollY, [0, 600], [0, 50]);
  const headlineOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);
  const motionScale = isMobile ? 0.42 : 1;

  // Parallax transform variables (declared at top level to respect Rules of Hooks)
  const ambientLightX = useTransform(smoothMouseX, [-0.5, 0.5], [-35 * motionScale, 35 * motionScale]);
  const ambientLightY = useTransform(smoothMouseY, [-0.5, 0.5], [-35 * motionScale, 35 * motionScale]);

  const previewRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6 * motionScale, -6 * motionScale]);
  const previewRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6 * motionScale, 6 * motionScale]);
  const previewX = useTransform(smoothMouseX, [-0.5, 0.5], [-8 * motionScale, 8 * motionScale]);
  const previewTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-8 * motionScale, 8 * motionScale]);

  const shadowX = useTransform(smoothMouseX, [-0.5, 0.5], [12 * motionScale, -12 * motionScale]);
  const shadowY = useTransform(smoothMouseY, [-0.5, 0.5], [12 * motionScale, -12 * motionScale]);

  const cardX = useTransform(smoothMouseX, [-0.5, 0.5], [-24, 24]);
  const cardTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-24, 24]);
  const cardRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const cardRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  const playToggleSound = (pairing: 'classical' | 'warmth' | 'desert' | 'modern') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      const frequencies = { classical: 261.63, warmth: 293.66, desert: 329.63, modern: 392.00 };
      osc.frequency.setValueAtTime(frequencies[pairing], ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch (e) {}
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    const waitlistEndpoint = (import.meta as any).env?.VITE_WAITLIST_ENDPOINT?.trim?.() || '/api/waitlist';
    const payload = {
      email: email.trim(),
      timestamp: new Date().toISOString(),
      source: 'mizan-waitlist',
    };

    // Save locally to represent persistent state
    const waitlist = JSON.parse(localStorage.getItem('mizan_waitlist') || '[]');
    waitlist.push(payload);
    localStorage.setItem('mizan_waitlist', JSON.stringify(waitlist));

    const finalizeSubscription = () => {
      setSubmitted(true);
      setEmail('');

      // Meditative trigger chime upon subscription
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 chord chime
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }
      } catch (err) {}
    };

    if (!waitlistEndpoint) {
      finalizeSubscription();
      return;
    }

    fetch(waitlistEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .catch(() => {
        // Preserve the local waitlist entry even if the remote endpoint is unavailable.
      })
      .finally(finalizeSubscription);
  };

  const fontClass = {
    classical: 'font-pair-classical',
    warmth: 'font-pair-warmth',
    desert: 'font-pair-desert',
    modern: 'font-pair-modern'
  }[fontPairing];

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const revealItem = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  const quoteReveal = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  };

  const cardReveal = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  };

  const footerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const footerColumn = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.55, 
        ease: "easeOut" 
      } 
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative select-text antialiased selection:bg-sand selection:text-walnut overflow-x-hidden ${fontClass}`}>
      
      {/* Cinematic Loader sequence */}
      {isLoaderActive && (
        <CinematicLoader 
          onExitStart={() => setIsLoaded(true)}
          onComplete={() => setIsLoaderActive(false)} 
        />
      )}

      {/* Absolute Ambient Sun Drift Overlays (Mimicking sunlight filtering through archways) */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[#f4ebd0] opacity-30 blur-3xl pointer-events-none mix-blend-multiply animate-sun-drift" />
      <div className="absolute top-[120vh] left-[-10vw] w-[40vw] h-[40vw] rounded-full bg-[#ebdcb9] opacity-20 blur-3xl pointer-events-none mix-blend-multiply" />
      
      {/* Bold Typography Theme Elements */}
      <div className="paper-texture-overlay" />
      <div className="absolute top-1/2 left-0 w-2 h-32 brass-accent opacity-20 -translate-y-1/2 hidden md:block" />

      {/* Main page content reveals gracefully after the ritualistic intro */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col"
        >
          {/* Elegantly Crafted Top Navigation with mask draws */}
          <header id="editorial-nav" className="sticky top-0 z-50 bg-ivory/80 backdrop-blur-md border-b border-sand/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <motion.div 
              initial={{ rotate: -30, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="w-10 h-10 flex items-center justify-center relative"
            >
              <MizanIcon 
                className="w-full h-full text-walnut group-hover:text-terracotta transition-colors duration-500" 
                strokeColor="currentColor"
                dotColor="#B08D57"
                strokeWidth={16}
              />
            </motion.div>
            <span className="font-serif text-xl font-semibold text-walnut tracking-wide overflow-hidden block">
              <motion.span
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="block"
              >
                Mizan<span className="text-terracotta font-serif">.</span>
              </motion.span>
            </span>
          </div>

          <motion.button
            type="button"
            className="md:hidden inline-flex items-center gap-2 rounded-full border border-sand bg-white/75 px-4 py-2 text-walnut shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-nav-panel"
          >
            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em]">Menu</span>
          </motion.button>

          <motion.nav 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.5
                }
              }
            }}
            className="hidden md:flex items-center space-x-8 font-sans text-[11px] tracking-[0.15em] uppercase font-medium"
          >
            {[
              { href: '#philosophy', label: 'The Why' },
              { href: '#interactive-jar', label: 'The Journey' },
              { href: '#product', label: 'The Experience' },
              { href: '#rythms', label: 'The Community' },
            ].map((link) => (
              <motion.div
                key={link.href}
                variants={{
                  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0, y: 5 },
                  visible: { 
                    clipPath: 'inset(0 0% 0 0)', 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
              >
                <a href={link.href} className="relative py-1 group text-coffee/95 hover:text-walnut transition-colors">
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-walnut transition-all duration-300 group-hover:w-full" />
                </a>
              </motion.div>
            ))}
          </motion.nav>

          <motion.a 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            href="#footer-waitlist"
            className="hidden md:inline-flex px-6 py-2.5 bg-walnut text-ivory text-xs font-sans font-medium tracking-widest uppercase hover:bg-terracotta hover:border-terracotta transition-all duration-300 shadow-sm"
          >
            Join Waitlist
          </motion.a>
        </div>
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="md:hidden absolute left-0 right-0 top-full z-40 px-4 pt-3"
            >
              <div className="rounded-3xl border border-sand/60 bg-ivory/98 shadow-[0_18px_42px_rgba(60,42,33,0.14)] overflow-hidden backdrop-blur-md">
                <div className="flex items-center justify-between px-5 py-4 border-b border-sand/50">
                  <div className="flex items-center gap-3">
                    <MizanIcon className="w-6 h-6 text-bronze" strokeColor="currentColor" dotColor="#B08D57" strokeWidth={16} />
                    <div>
                      <p className="font-serif text-base text-walnut leading-none">Quick access</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-coffee/80 mt-1">Navigate Mizan</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white text-walnut"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {[
                    { href: '#philosophy', label: 'The Why' },
                    { href: '#interactive-jar', label: 'The Journey' },
                    { href: '#product', label: 'The Experience' },
                    { href: '#rythms', label: 'The Community' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex items-center justify-between rounded-2xl border border-sand/60 bg-white px-4 py-3.5 text-[11px] font-sans uppercase tracking-[0.18em] text-walnut shadow-sm"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-bronze" />
                    </a>
                  ))}

                  <a
                    href="#footer-waitlist"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-walnut px-4 py-3.5 text-ivory shadow-sm"
                  >
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.18em] opacity-80">Stay close</p>
                      <p className="font-serif text-base italic leading-none mt-1">Join the waitlist</p>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Storyflow container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 relative z-10">

        {/* 1. The Poetic Invitation (Redesigned Cinematic Hero) */}
        <section id="hero" className="pt-4 pb-10 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative overflow-visible">
          
          {/* Ambient light source shifting based on cursor movement */}
          <motion.div 
            className="absolute -top-40 right-10 w-[550px] h-[550px] rounded-full bg-radial from-gold/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10"
            style={{
              x: ambientLightX,
              y: ambientLightY,
            }}
          />

          {/* Floating Dust Particles Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-20">
            {dustParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute bg-gold/25 rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  left: p.left,
                }}
                initial={{ y: '110%', opacity: 0 }}
                animate={{
                  y: '-10%',
                  opacity: [0, 0.65, 0.65, 0],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'linear',
                }}
              />
            ))}
          </div>

          {/* Left Column: Poetic invitation text with line-by-line reveals */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start space-y-8 relative z-10">
            <motion.div 
              style={{ y: headingScrollY, opacity: headlineOpacity }}
              className="space-y-4"
            >
              <p className="text-[11px] tracking-[0.3em] uppercase font-sans font-semibold text-bronze mb-1 overflow-hidden block">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="block"
                >
                  THE BEAUTY OF CONSISTENCY
                </motion.span>
              </p>
              
              <h1 className="text-5xl sm:text-6xl md:text-[76px] lg:text-[84px] font-serif leading-[1.0] italic tracking-tight text-walnut flex flex-col">
                <span className="overflow-hidden block py-1.5">
                  <motion.span
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className="block"
                  >
                    Small deeds,
                  </motion.span>
                </span>
                <span className="overflow-hidden block py-1.5">
                  <motion.span
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                    className="block text-terracotta"
                  >
                    lasting reward.
                  </motion.span>
                </span>
              </h1>
            </motion.div>

            <div className="space-y-6 max-w-2xl w-full">
              <motion.blockquote 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
                className="relative pl-5 py-0.5 space-y-1 my-4"
              >
                {/* Custom Left border line drawing downward */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
                  style={{ originY: 0 }}
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-clay"
                />
                <p className="font-serif text-lg sm:text-xl text-walnut/97 italic leading-relaxed">
                  “Every act of charity begins long before the donation itself. It begins with intention.”
                </p>
              </motion.blockquote>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
                className="font-sans text-sm sm:text-base text-walnut/97 leading-relaxed font-normal"
              >
                Mizan is a quiet companion for cultivating the habit of generosity. Keep track of your acts of charity, reflect on your intentions, and build a rhythm of giving that grows through sincerity, not size.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 110, 
                  damping: 13, 
                  delay: 1.15 
                }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-4 w-full"
              >
                <motion.a 
                  href="#interactive-jar"
                  whileHover={{ scale: 1.03, y: -2, boxShadow: "0px 12px 20px -8px rgba(60,42,33,0.2)" }}
                  whileTap={{ scale: 0.97, y: 0 }}
                  className="group flex items-center space-x-3 px-8 py-4 bg-walnut text-ivory rounded-none font-sans text-xs tracking-widest uppercase hover:bg-terracotta transition-all duration-300 shadow-tactile shrink-0"
                >
                  <span>Enter the Space</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </motion.a>
                
                <motion.div 
                  whileHover="hover"
                  className="flex items-center gap-4 cursor-pointer select-none"
                >
                  <div className="flex -space-x-3">
                    <motion.div 
                      variants={{
                        hover: { x: -6 }
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-8 h-8 rounded-full border-2 border-ivory bg-sand"
                    />
                    <motion.div 
                      variants={{
                        hover: { x: 0 }
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-8 h-8 rounded-full border-2 border-ivory bg-bronze relative z-10"
                    />
                    <motion.div 
                      variants={{
                        hover: { x: 6 }
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-8 h-8 rounded-full border-2 border-ivory bg-gold relative z-20"
                    />
                  </div>
                  <p className="text-[10px] font-sans uppercase tracking-wider opacity-75 hover:opacity-100 text-coffee transition-opacity duration-300">
                    12k+ Companions on the path
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Immersive App Preview Phone (Pushed to right, no overlap) */}
          <div className="lg:col-span-5 relative flex items-center justify-end w-full pt-8 lg:pt-0 pr-0 xl:pr-6 z-20">
            {/* Smooth cinematic entrance transition synced with Cinematic Loader exit */}
            <motion.div
              initial={{ opacity: 0, scale: 1.15, y: 15 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 1.15, y: 15 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="relative w-full flex flex-col items-center lg:items-end justify-end"
            >
              {/* Smooth 3D Interactive Mockup Container with scroll-parallax and mouse parallax */}
              <motion.div
                style={{
                  scale: phoneScale,
                  y: phoneScrollY,
                  rotateX: previewRotateX,
                  rotateY: previewRotateY,
                  x: previewX,
                  translateY: previewTranslateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative w-[250px] sm:w-[280px] h-[490px] sm:h-[550px] z-20 mx-auto lg:mx-0"
              >
              {/* Nested motion.div to handle the continuous subtle idle float (±5px vertical drift, ±0.5deg rotation, slow 6s loop) */}
              <motion.div
                animate={{
                  y: [5, -5, 5],
                  rotate: [-0.5, 0.5, -0.5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
                className="relative w-full h-full bg-[#3C2A21] rounded-[48px] p-3 shadow-tactile-deep border border-walnut select-none overflow-hidden"
              >
                {/* Dynamic shadow layer in opposite direction behind phone */}
                <motion.div 
                  className="absolute inset-4 rounded-[48px] bg-walnut/25 blur-2xl -z-10 pointer-events-none"
                  style={{
                    x: shadowX,
                    y: shadowY,
                  }}
                />

                {/* Endless slow sliding glass reflection glare line */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none z-25"
                  animate={{ x: ['-120%', '240%'] }}
                  transition={{ repeat: Infinity, duration: 14, delay: 5, repeatDelay: 10, ease: "easeInOut" }}
                />

                {/* Phone Speaker Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#3C2A21] rounded-b-xl z-30 flex items-center justify-center">
                  <div className="w-10 h-0.5 bg-white/20 rounded-full" />
                </div>

                {/* Simulated Inner App Screen (Quiet companion layout matching our palette) */}
                <div className="w-full h-full bg-ivory rounded-[38px] overflow-hidden flex flex-col p-4 pt-7 relative">
                  
                  {/* Simulated App Header */}
                  <div className="flex justify-between items-center border-b border-sand pb-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
                      <span className="font-mono text-[8px] text-coffee/95 uppercase tracking-widest">Mizan</span>
                    </div>
                    <span className="font-mono text-[8px] text-coffee/95">05:41 AM (Fajr)</span>
                  </div>

                  {/* Simulated Glass Jar Visual inside phone */}
                  <div className="flex-1 flex flex-col justify-center items-center py-3 space-y-3 relative">
                    {/* Decorative faint golden orbits */}
                    <div className="absolute w-44 h-44 rounded-full border border-sand/40 pointer-events-none animate-spin-slow opacity-60" />
                    <div className="absolute w-32 h-32 rounded-full border border-dashed border-bronze/30 pointer-events-none opacity-40" />

                    {/* Glass Jar Outer Frame */}
                    <div className="w-28 h-36 border-2 border-walnut/80 rounded-t-[20px] rounded-b-[36px] relative flex flex-col justify-end items-center p-3 bg-white/20 backdrop-blur-[1px] shadow-tactile overflow-hidden">
                      {/* Simulated jar lid */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-walnut rounded-full" />
                      
                      {/* Golden/Terracotta Liquid/Drops layer at bottom - adapts height on click */}
                      <motion.div 
                        initial={{ height: "35%" }}
                        animate={{ 
                          height: hasGivenToday ? "45%" : "35%",
                          backgroundColor: hasGivenToday ? "rgba(168,78,42,0.25)" : "rgba(125,100,72,0.18)" 
                        }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-0 right-0 border-t border-gold/40 flex flex-col justify-end"
                      >
                        {/* Animated wave/sand fill layer inside liquid */}
                        <motion.div 
                          animate={{ y: [1.5, -1.5, 1.5] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          className="w-full h-1 bg-gold/30"
                        />
                      </motion.div>

                      {/* Interactive gold coin drop animation */}
                      <AnimatePresence>
                        {isCoinDropping && (
                          <motion.div 
                            initial={{ y: -70, x: 0, opacity: 1, scale: 1 }}
                            animate={{ y: 55, opacity: [1, 1, 0], scale: 0.9 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.85, ease: "easeIn" }}
                            className="absolute top-2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-gold to-bronze shadow-tactile border border-walnut/10 z-30 flex items-center justify-center font-serif text-[6px] text-white font-bold"
                          >
                            &bull;
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Miniature glowing stars/deeds floating inside the phone's jar */}
                      <div className="absolute inset-x-0 top-6 bottom-4 overflow-hidden pointer-events-none">
                        <motion.div 
                          animate={{ y: [60, -10], opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
                          className="absolute left-6 w-1.5 h-1.5 rounded-full bg-terracotta" 
                        />
                        <motion.div 
                          animate={{ y: [80, 5], opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeOut" }}
                          className="absolute right-8 w-2 h-2 rounded-full bg-gold" 
                        />
                        <motion.div 
                          animate={{ y: [50, -5], opacity: [0, 0.8, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, delay: 1.5, ease: "easeOut" }}
                          className="absolute left-12 w-1 h-1 rounded-full bg-olive" 
                        />
                      </div>

                      <Heart className={`w-5 h-5 relative z-10 transition-colors duration-500 ${hasGivenToday ? 'text-terracotta animate-pulse' : 'text-coffee/55'}`} />
                      <span className="font-mono text-[7px] text-coffee/95 tracking-wider relative z-10 uppercase mt-1">Sincerity</span>
                    </div>

                    <div className="text-center space-y-0.5">
                      <p className="font-serif text-[11px] text-walnut font-semibold">
                        {hasGivenToday ? "Sadaqah Logged Quietly" : "Quiet Vessel Ready"}
                      </p>
                      <p className="font-mono text-[7.5px] text-coffee/93">
                        {hasGivenToday ? "The morning angels bear witness" : "A single drop starts an ocean"}
                      </p>
                    </div>
                  </div>

                  {/* Simulated Streak or Consistency Tracker */}
                  <div className="bg-white/80 border border-sand/60 p-2 rounded-xl text-center space-y-1 relative overflow-hidden mb-2">
                    <div className="flex justify-between items-center text-[7px] font-mono text-bronze uppercase tracking-widest">
                      <span>Daily Rhythm</span>
                      <motion.div 
                        className="w-2 h-2 border border-gold/40 border-t-gold rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <div className="flex justify-center items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
                      <span className="font-serif italic text-xs text-walnut font-semibold">
                        {streakDays} Days of Quiet Giving
                      </span>
                    </div>
                  </div>

                  {/* Minimal Daily Prompt/Check-in Screen */}
                  <div className="bg-white/90 border border-sand/60 p-2.5 rounded-2xl text-center space-y-2 mt-auto min-h-[64px] flex flex-col justify-center">
                    {!hasGivenToday ? (
                      <>
                        <p className="font-serif text-[10px] text-walnut leading-snug">
                          Did you give today?
                        </p>
                        <div className="flex justify-center">
                          <button 
                            onClick={() => {
                              setHasGivenToday(true);
                              setStreakDays(24);
                              setIsCoinDropping(true);
                              playToggleSound('warmth');
                            }}
                            className="px-4 py-1 bg-walnut text-ivory text-[9px] font-sans font-semibold tracking-wider uppercase hover:bg-terracotta hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full"
                          >
                            Yes / Reflect
                          </button>
                        </div>
                      </>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-0.5 py-0.5"
                      >
                        <p className="font-serif italic text-[11px] text-terracotta font-medium">
                          “Sincerity is safe.”
                        </p>
                        <p className="font-mono text-[7.5px] text-coffee/95 uppercase tracking-widest">
                          Your quiet habit is kept
                        </p>
                      </motion.div>
                    )}
                  </div>

                </div>
              </motion.div>
            </motion.div>

            {/* Overlapping Parchment Hadith Card (Positioned to avoid text overlap on all breakpoints) */}
            <motion.div
              style={{
                y: cardScrollY,
                x: cardX,
                translateY: cardTranslateY,
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: "preserve-3d",
              }}
              className="absolute left-[-24px] sm:left-[-48px] bottom-10 z-30"
            >
              {/* Inner card handles slow floating and hover zoom, drops in with paper-drop easing on load */}
              <motion.div
                initial={{ 
                  opacity: 0, 
                  y: 50, 
                  rotate: -28, 
                  scale: 0.9,
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.05)" 
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotate: -6, 
                  scale: 1,
                  boxShadow: "4px 12px 24px rgba(60,42,33,0.12)" 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 45, 
                  damping: 11, 
                  delay: 0.8 
                }}
                whileHover={{ 
                  y: -12, 
                  rotate: -1, 
                  scale: 1.04,
                  boxShadow: "12px 24px 36px rgba(60,42,33,0.18)",
                  transition: { type: "spring", stiffness: 120, damping: 15 }
                }}
                className="w-[190px] bg-white border border-walnut p-4 cursor-pointer text-left select-text relative"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[8px] opacity-40 tracking-[0.2em] uppercase">Reflection</span>
                    <Quote className="w-3 h-3 text-clay opacity-30" />
                  </div>
                  
                  <p className="font-serif text-sm sm:text-base italic leading-snug text-walnut">
                    “The best of deeds are those that are consistent, even if they are small.”
                  </p>
                  
                  <div className="h-[1px] w-full bg-walnut opacity-10" />
                  
                  <p className="text-[9px] font-sans italic opacity-60 text-right text-coffee">
                    — Prophet Muhammad (ﷺ)
                  </p>
                </div>
              </motion.div>
            </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. Interactive Jar Canvas Section */}
        <motion.section 
          id="interactive-jar" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-12 md:py-20 border-t border-sand/50"
        >
          <motion.div variants={revealItem}>
            <InteractiveJar />
          </motion.div>
        </motion.section>

        {/* 3. Deep Philosophical Narrative Row */}
        <motion.section 
          id="philosophy" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-14 md:py-24 border-t border-sand/50 space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            <motion.div variants={revealItem} className="md:col-span-5">
              <span className="font-mono text-xs tracking-[0.2em] text-bronze uppercase block mb-3">
                The Philosophy
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-walnut italic leading-tight">
                Not a leaderboard. <br />A garden of continuous devotion.
              </h3>
            </motion.div>
            <motion.div variants={revealItem} className="md:col-span-7">
              <blockquote className="border-l-2 border-clay pl-6 py-1 space-y-2">
                <p className="font-serif text-xl text-walnut italic leading-relaxed">
                  “{corePhilosophy.quote}”
                </p>
                <footer className="font-mono text-xs text-coffee/95">
                  — {corePhilosophy.quoteRef}
                </footer>
              </blockquote>
            </motion.div>
          </div>

          {/* The Pillars - Asymmetric Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {corePhilosophy.pillars.map((pillar, i) => (
              <motion.div 
                key={i} 
                variants={revealItem}
                className={`p-8 rounded-2xl border border-sand/60 bg-parchment/40 space-y-4 hover:bg-white transition-colors duration-300 ${
                  i === 1 ? 'md:-translate-y-4 shadow-tactile bg-white' : ''
                }`}
              >
                <span className="font-serif text-4xl text-gold font-light italic leading-none block">
                  0{i + 1}
                </span>
                <h4 className="font-serif text-xl font-semibold text-walnut">
                  {pillar.title}
                </h4>
                <p className="font-sans text-sm text-walnut/97 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 4. The Live Interactive Screenshots Segment */}
        <motion.section 
          id="product" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="pt-5 pb-12 md:pt-6 md:pb-20 border-t border-sand/50"
        >
          <motion.div variants={revealItem}>
            <AppScreenshots />
          </motion.div>
        </motion.section>

        {/* 5. Islamic Rhythm / Calendar Integration */}
        <motion.section 
          id="rythms" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-14 md:py-24 border-t border-sand/50"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <motion.span variants={revealItem} className="font-mono text-xs tracking-[0.2em] text-bronze uppercase block">
                MOMENTS THAT MATTER
              </motion.span>
              <motion.h3 variants={revealItem} className="font-serif text-3xl sm:text-4xl text-walnut leading-tight italic">
                Gentle reminders, at meaningful times.
              </motion.h3>
              <motion.p variants={revealItem} className="font-sans text-base text-walnut/97 leading-relaxed font-normal">
                Islam teaches us that certain times carry a unique closeness to our prayers and charity. 
                Mizan offers thoughtful reminders during these times, helping you build the habit of giving without interrupting your day.
              </motion.p>

              {/* Day Moments List */}
              <div className="space-y-4 pt-4">
                {[
                  {
                    time: 'Fajr Dawn',
                    description: 'Receive a quiet, screen-lit morning reminder. The Prophet (ﷺ) told us that two angels descend every single morning, one of whom prays: “O Allah, give recompense to the one who spends in charity.”'
                  },
                  {
                    time: 'Jumu’ah (Friday) Afternoons',
                    description: 'Friday is the master of all days. Mizan guides you with a soft reminder before the sunset of Jumu’ah to place a small drop, keeping the blessed Friday custom alive in your home.'
                  },
                  {
                    time: 'Ramadan & The Holy Days',
                    description: 'During the sacred times of Ramadan, Dhul-Hijjah, or Muharram, your interface adapts with specific reflection prompts, historical insights on charity, and motivational counts to maximize good deeds.'
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    variants={revealItem}
                    onMouseEnter={() => setActiveRef(idx)}
                    onMouseLeave={() => setActiveRef(null)}
                    className="p-5 rounded-xl border border-sand bg-white/40 hover:bg-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif text-lg font-bold text-walnut flex items-center space-x-2.5">
                        <span className="w-2 h-2 rounded-full bg-terracotta" />
                        <span>{item.time}</span>
                      </h4>
                      <ChevronRight className={`w-4 h-4 text-bronze transition-transform ${activeRef === idx ? 'translate-x-1' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {(activeRef === idx || window.innerWidth < 768) && (
                        <motion.p 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="font-sans text-xs text-walnut/97 mt-3 leading-relaxed overflow-hidden font-normal"
                        >
                          {item.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Asymmetrical Visual Composition Representing Islamic Geometry and Light */}
            <motion.div variants={revealItem} className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-square rounded-[32px] bg-parchment border border-sand flex items-center justify-center shadow-tactile p-6">
                
                {/* Simulated ancient manuscript geometric compass */}
                <div className="absolute inset-8 rounded-full border border-sand/60 flex items-center justify-center animate-spin-slow">
                  <div className="w-[90%] h-[90%] rounded-full border border-dashed border-bronze/30" />
                </div>

                <div className="relative z-10 text-center space-y-6">
                  {/* Glowing core icon */}
                  <div className="w-14 h-14 rounded-full bg-olive/10 border border-olive/30 flex items-center justify-center mx-auto text-olive">
                    <Compass className="w-6 h-6 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[10px] tracking-widest text-bronze uppercase">The Angel’s Prayer</span>
                    <p className="font-serif text-lg text-walnut italic leading-relaxed px-4">
                      O Allah! Compensate every person who spends in Your Cause
                    </p>
                    <p className="font-mono text-[9px] text-walnut/97">Sahih al-Bukhari 1442</p>
                  </div>
                </div>

                {/* Overlapping organic botanical sketch (represents growth and charity) */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 text-olive opacity-30 select-none pointer-events-none">
                  <Leaf className="w-full h-full rotate-45" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 6. Massive Visual Quote Divider (The Solace of Charity) */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-12 border-t border-sand/50 text-center space-y-6 max-w-3xl mx-auto"
        >
          <motion.div variants={quoteReveal}>
            <Quote className="w-10 h-10 text-clay/45 mx-auto" />
          </motion.div>
          <motion.p variants={quoteReveal} className="font-serif text-3xl sm:text-4xl text-walnut italic leading-relaxed">
            “The believer’s shade on the Day of Resurrection will be their charity.”
          </motion.p>
          <motion.span variants={quoteReveal} className="font-mono text-xs tracking-widest text-coffee/95 uppercase block">
            Prophet Muhammad (ﷺ) &bull; Musnad Ahmad
          </motion.span>
        </motion.section>

        {/* 7. The Waitlist Invitation (A Quiet Closing) */}
        <motion.section 
          id="footer-waitlist" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-10 md:py-14 border-t border-sand/50 flex justify-center"
        >
          <motion.div 
            variants={cardReveal}
            className="w-full max-w-2xl bg-white/70 border border-sand rounded-3xl p-6 md:p-10 text-center space-y-6 shadow-tactile relative overflow-hidden"
          >
            
            {/* Soft backdrop geometry */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gold/5 blur-2xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <span className="font-mono text-xs tracking-[0.2em] text-bronze uppercase block">
                Circle of Sincerity
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-walnut leading-tight italic">
                Nurture a quiet, lifelong habit.
              </h3>
              <p className="font-sans text-sm text-coffee/97 max-w-md mx-auto leading-relaxed">
                Join our private beta circles. No promotional spam, no invasive tracking. 
                Just an elegant companion to remind you of why giving matters.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  onSubmit={handleSubscribe}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10 w-full"
                >
                  <div className="relative flex-1 text-left">
                    <input 
                      id="waitlist-email"
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      className="peer w-full px-4 pt-5 pb-2 bg-white border border-sand rounded-xl text-sm font-sans text-walnut focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-all duration-300 shadow-inset-soft"
                    />
                    <label 
                      htmlFor="waitlist-email"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none origin-top-left
                        ${email 
                          ? 'top-1 text-[10px] uppercase tracking-wider text-terracotta font-semibold' 
                          : 'top-3.5 text-sm text-coffee/92 peer-focus:top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-terracotta peer-focus:font-semibold'
                        }`}
                    >
                      Enter your email address
                    </label>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="relative overflow-hidden px-6 py-3.5 bg-walnut text-ivory text-sm font-sans font-semibold rounded-xl hover:bg-terracotta transition-colors shadow-sm cursor-pointer shrink-0"
                  >
                    <span className="relative z-10">Request Invitation</span>
                    {/* Slow shimmer overlay */}
                    <motion.div 
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                        repeatDelay: 4
                      }}
                    />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-olive/10 border border-olive/20 rounded-2xl max-w-md mx-auto space-y-2 relative z-10"
                >
                  <div className="w-10 h-10 rounded-full bg-olive text-ivory flex items-center justify-center mx-auto overflow-hidden">
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                    </motion.div>
                  </div>
                  <h4 className="font-serif text-xl text-walnut font-medium">You are in the Circle.</h4>
                  <p className="font-sans text-xs text-coffee/93 leading-relaxed">
                    We have recorded your email with sincerity. As we approach our quiet release, 
                    we will reach out with your personal invitation.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="font-mono text-[10px] text-coffee/92 relative z-10 text-center md:text-left">
              Mizan values your absolute privacy. Your data is encrypted and never sold.
            </p>
          </motion.div>
        </motion.section>

      </main>

      {/* Handcrafted Fuller 4-Column Footer */}
      <motion.footer 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={footerContainer}
        className="border-t border-sand/40 bg-parchment/30 pt-10 pb-6 md:pt-12 md:pb-8 relative overflow-hidden"
      >
        {/* Subtle top border glow to visually separate it from the page without a harsh line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-terracotta/20 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 pb-6 border-b border-sand/10 justify-items-center md:justify-items-stretch">
          
          {/* Column 1 (Brand) */}
          <motion.div variants={footerColumn} className="md:col-span-3 space-y-3 text-center md:text-left w-full max-w-[320px] md:max-w-none">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <MizanIcon 
                className="w-6 h-6 text-bronze/90" 
                strokeColor="currentColor"
                dotColor="#B08D57"
                strokeWidth={18}
              />
              <span className="font-serif text-lg font-semibold text-walnut">
                Mizan<span className="text-terracotta font-serif"></span>
              </span>
            </div>
            <p className="font-serif text-md italic text-walnut/85 leading-relaxed">
              “Small drops, eternal oceans.”
            </p>

            {/* Coming soon to app stores */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
              {[
                { label: 'App Store', sub: 'Coming soon' },
                { label: 'Google Play', sub: 'Coming soon' }
              ].map((store, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-start justify-center border border-sand/70 bg-white/40 rounded-lg px-2.5 py-1.5 opacity-90 select-none"
                >
                  <span className="font-mono text-[8px] tracking-wider uppercase text-coffee/80 leading-none">{store.sub}</span>
                  <span className="font-sans text-[11px] font-medium text-walnut leading-tight">{store.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Column 2 (The Journey) */}
          <motion.div variants={footerColumn} className="md:col-span-3 text-center md:text-left space-y-3 w-full max-w-[320px] md:max-w-none">
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-bronze">Explore</h4>
            <ul className="space-y-2 font-sans text-xs">
              {[
                { href: '#philosophy', label: 'The Why' },
                { href: '#interactive-jar', label: 'The Journey' },
                { href: '#product', label: 'The Experience' },
                { href: '#rythms', label: 'The Community' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="relative py-0.5 group text-coffee/95 hover:text-walnut transition-colors inline-block">
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-walnut transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 (Trust) */}
          <motion.div variants={footerColumn} className="md:col-span-3 text-center md:text-left space-y-3 w-full max-w-[320px] md:max-w-none">
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-bronze">Trust</h4>
            <ul className="space-y-2 font-sans text-xs">
              {[
                { href: '#', label: 'Privacy Sanctum' },
                { href: '#', label: 'Clean Giving Manifesto' },
                { href: '#', label: 'Terms of Sincerity' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="relative py-0.5 group text-coffee/95 hover:text-walnut transition-colors inline-block">
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-walnut transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 (Stay Close) */}
          <motion.div variants={footerColumn} className="md:col-span-3 text-center md:text-left space-y-3 w-full max-w-[320px] md:max-w-none">
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-bronze">Stay close</h4>
            <div className="space-y-2.5">
              <p className="font-serif text-md text-walnut italic">12K+ companions on the path</p>
              
              {/* Reused avatar stack from hero */}
              <motion.div 
                whileHover="hover"
                className="flex items-center justify-center md:justify-start gap-3 cursor-pointer select-none"
              >
                <div className="flex -space-x-3">
                  <motion.div 
                    variants={{
                      hover: { x: -6 }
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-8 h-8 rounded-full border-2 border-ivory bg-sand"
                  />
                  <motion.div 
                    variants={{
                      hover: { x: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-8 h-8 rounded-full border-2 border-ivory bg-bronze relative z-10"
                  />
                  <motion.div 
                    variants={{
                      hover: { x: 6 }
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-8 h-8 rounded-full border-2 border-ivory bg-gold relative z-20"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Bottom copyright segment */}
        <div className="max-w-6xl mx-auto px-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="font-mono text-[10px] text-coffee/92">
            &copy; 2026 Mizan. 
          </p>
        </div>

      </motion.footer>
      </motion.div>
      )}

    </div>
  );
}