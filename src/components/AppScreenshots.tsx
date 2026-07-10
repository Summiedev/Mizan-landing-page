import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Users, Clock, Moon, ChevronRight, Check, Heart, Play } from 'lucide-react';

// Custom lightweight counter that rolls up elegantly from 0 when active
function AnimatedStreakCount({ value, delay = 0.2 }: { value: number; delay?: number }) {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1000; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Smooth progress easing out
      const easeOutQuad = (t: number) => t * (2 - t);
      setDisplayVal(Math.floor(easeOutQuad(progress) * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const timeout = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <span>{displayVal}</span>;
}

export default function AppScreenshots() {
  const [activeTab, setActiveTab] = useState<'streak' | 'family' | 'remembrance'>('streak');
  const [beadCount, setBeadCount] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle gentle 3D tilt tracking for the phone visual anchor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Sound effect for dhikr beads
  const playBeadClick = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(beadCount % 33 === 32 ? 440 : 520 + (beadCount % 5) * 15, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  // Motion variants for staggering
  const pillsContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const pillItem = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 }
    }
  };

  const featureCardReveal = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 18,
        delay: 0.3 + index * 0.15
      }
    })
  };

  return (
    <div className="space-y-12 py-6">
      {/* Editorial Navigation with Self-Drawing Divider line */}
      <div className="relative pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6">
          <div className="space-y-1">
            <span className="font-mono text-[11px] tracking-widest text-bronze uppercase block overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Product Narrative
              </motion.span>
            </span>
            <h3 className="font-serif text-3xl text-walnut italic block overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="block"
              >
                Inside the Daily Companion
              </motion.span>
            </h3>
          </div>

          {/* Staggered Navigation Pills with magnetic-like hover effect */}
          <motion.div 
            variants={pillsContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-2.5 z-10"
          >
            {[
              { id: 'streak', label: 'Streaks of Sincerity', icon: Leaf },
              { id: 'family', label: 'The Family Circle', icon: Users },
              { id: 'remembrance', label: 'Fajr Remembrance', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  variants={pillItem}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    playBeadClick();
                  }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center space-x-2.5 px-4.5 py-2.5 text-xs font-sans rounded-full transition-all duration-300 border cursor-pointer select-none overflow-hidden ${
                    isSelected
                      ? 'text-ivory border-walnut shadow-sm'
                      : 'bg-white/50 text-coffee border-sand hover:bg-white hover:border-bronze'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`} />
                  <span className="relative z-10 font-medium">{tab.label}</span>
                  
                  {/* Sliding active background using Framer Motion layoutId */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeAppTabBackground"
                      className="absolute inset-0 bg-walnut -z-10"
                      transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Self-drawing elegant divider line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-sand/80 origin-left"
        />
      </div>

      {/* Layered Editorial Screens Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Dynamic Interactive App Interface (Phone as Visual Anchor) */}
        <motion.div 
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="lg:col-span-6 flex justify-center order-2 lg:order-1 relative"
        >
          {/* Outer perspective wrapper */}
          <div className="relative p-4" style={{ perspective: 1200 }}>
            {/* Interactive Phone body */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{
                rotateX: mousePos.y * -8,
                rotateY: mousePos.x * 8,
                scale: mousePos.x !== 0 ? 1.01 : 1,
              }}
              transition={{ type: "spring", stiffness: 110, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full max-w-[340px] aspect-[9/18.5] bg-parchment rounded-[42px] p-3.5 border-[6px] border-coffee/90 shadow-[0_24px_60px_-15px_rgba(60,42,33,0.07)] relative overflow-hidden flex flex-col"
            >
              {/* Subtle glossy glare layer tracking mouse */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent pointer-events-none z-30"
                animate={{
                  x: mousePos.x * 50,
                  y: mousePos.y * 50,
                }}
                transition={{ type: "spring", stiffness: 110, damping: 20 }}
              />

              {/* Phone Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-coffee rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Simulated App Background */}
              <div className="flex-1 bg-ivory rounded-[32px] overflow-hidden flex flex-col p-5 pt-8 relative paper-texture">
                
                {/* App Status Header with animated border */}
                <div className="relative mt-2 pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-olive animate-pulse" />
                      <span className="font-mono text-[9px] text-coffee/85 uppercase tracking-widest">Mizan</span>
                    </div>
                    <span className="font-mono text-[9px] text-coffee/85">05:41 AM (Fajr)</span>
                  </div>
                  
                  {/* Status header divider that draws itself */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-sand/70 origin-left"
                  />
                </div>

                {/* Dynamic Screen Content */}
                <div className="flex-1 overflow-y-auto pt-4 space-y-4 no-scrollbar">
                  <AnimatePresence mode="wait">
                    {activeTab === 'streak' && (
                      <motion.div
                        key="streak"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-4"
                      >
                        {/* Streak Header Card */}
                        <div className="bg-white/80 border border-sand p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-center space-y-2">
                          <p className="font-mono text-[9px] tracking-wider text-bronze uppercase">Sincerity Habit</p>
                          <h4 className="font-serif text-3xl text-walnut italic leading-none font-medium">
                            <AnimatedStreakCount value={18} /> Day Streak
                          </h4>
                          <p className="font-sans text-[11px] text-coffee/90 max-w-[200px] mx-auto leading-normal">
                            Your intentions are roots in quiet soil. Consistency is beloved to Allah.
                          </p>
                        </div>

                        {/* Streak Garden Grid */}
                        <div className="bg-parchment/60 border border-sand p-4 rounded-2xl space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                          <div className="relative pb-2">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[10px] text-coffee/95 uppercase font-semibold">Weekly Growth</span>
                              <span className="font-mono text-[9px] text-olive font-bold uppercase">7/7 Given</span>
                            </div>
                            <motion.div 
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="absolute bottom-0 left-0 right-0 h-[1px] bg-sand/50 origin-left"
                            />
                          </div>
                          
                          <div className="grid grid-cols-7 gap-1.5 pt-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                              <div key={i} className="flex flex-col items-center space-y-1">
                                <span className="font-mono text-[9px] text-coffee/75">{day}</span>
                                <div className="w-7 h-10 rounded-lg bg-olive/10 border border-olive/20 flex items-center justify-center relative overflow-hidden">
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '100%' }}
                                    transition={{ delay: i * 0.08, duration: 0.8, ease: "easeOut" }}
                                    className="absolute bottom-0 left-0 right-0 bg-olive/25"
                                  />
                                  <Leaf className="w-3.5 h-3.5 text-olive relative z-10" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Habit Log */}
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] text-coffee/85 uppercase block">Today's Garden Actions</span>
                          
                          <div className="bg-white/80 border border-sand rounded-xl p-3 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-olive text-white rounded-lg">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="font-sans text-xs font-semibold text-walnut">Fajr Gratitude Drop</p>
                                <p className="font-sans text-[10px] text-coffee/75">Recorded at 04:52 AM</p>
                              </div>
                            </div>
                            <span className="font-mono text-[10px] text-olive font-bold">+1 Drop</span>
                          </div>

                          <div className="bg-white/40 border border-dashed border-sand rounded-xl p-3 flex items-center justify-between opacity-70">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-sand text-coffee rounded-lg">
                                <Clock className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="font-sans text-xs font-semibold text-walnut">Friday Jumu'ah Charity</p>
                                <p className="font-sans text-[10px] text-coffee/75">Awaiting blessing</p>
                              </div>
                            </div>
                            <span className="font-mono text-[9px] text-coffee/75">Pending</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'family' && (
                      <motion.div
                        key="family"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-4"
                      >
                        {/* Family Jar Card */}
                        <div className="bg-clay text-ivory p-4 rounded-2xl shadow-[0_4px_25px_rgba(168,78,42,0.15)] space-y-2 relative overflow-hidden">
                          <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-15">
                            <Users className="w-24 h-24" />
                          </div>
                          <p className="font-mono text-[9px] tracking-wider uppercase opacity-80">Connected Jar</p>
                          <h4 className="font-serif text-2xl italic leading-none font-medium">Bait Al-Rashid</h4>
                          <p className="font-sans text-[11px] opacity-90 leading-normal">
                            Spouse and 3 children cultivating generosity together as one household.
                          </p>
                        </div>

                        {/* Live Stream of Generosity */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] text-coffee/85 uppercase">Family Deeds Stream</span>
                            <span className="font-mono text-[9px] text-terracotta font-semibold">Live Feed</span>
                          </div>

                          {[
                            { name: 'Safiya (Mom)', action: 'Secret Sadaqah for a neighbor', time: '10m ago', icon: Heart, color: 'text-terracotta' },
                            { name: 'Yusuf (11)', action: 'Watered neighborhood birds', time: '2h ago', icon: Leaf, color: 'text-olive' },
                            { name: 'Khadijah (7)', action: 'Offered a bright smile to Dad', time: '4h ago', icon: Heart, color: 'text-gold' }
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10, x: -5 }}
                              animate={{ opacity: 1, y: 0, x: 0 }}
                              transition={{ delay: index * 0.12, type: "spring", stiffness: 100, damping: 18 }}
                              className="bg-white/80 border border-sand rounded-xl p-3 flex items-start space-x-3 shadow-[0_2px_10px_rgba(0,0,0,0.015)]"
                            >
                              <div className={`p-2 bg-parchment rounded-lg mt-0.5 ${item.color}`}>
                                <item.icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <p className="font-sans text-xs font-bold text-walnut">{item.name}</p>
                                  <p className="font-mono text-[9px] text-coffee/70">{item.time}</p>
                                </div>
                                <p className="font-sans text-[11px] text-coffee/95 mt-0.5 leading-snug">{item.action}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'remembrance' && (
                      <motion.div
                        key="remembrance"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-5"
                      >
                        {/* Adhkar Visual Circle */}
                        <div className="bg-white/80 border border-sand p-5 rounded-2xl flex flex-col items-center space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.015)] text-center">
                          <div className="space-y-1">
                            <p className="font-mono text-[9px] tracking-wider text-bronze uppercase">Morning Remembrance</p>
                            <h4 className="font-serif text-2xl text-walnut italic">Subhan Allah</h4>
                            <p className="font-sans text-[10px] text-coffee/60">Glory be to Allah</p>
                          </div>

                          {/* Dhikr Bead Counter with slide vibration micro-animation */}
                          <button
                            onClick={() => {
                              setBeadCount(prev => prev + 1);
                              playBeadClick();
                            }}
                            className="relative w-28 h-28 rounded-full border-[3px] border-sand bg-parchment/50 flex items-center justify-center hover:bg-white hover:border-bronze focus:outline-none transition-all active:scale-95 group shadow-sm cursor-pointer"
                          >
                            <div className="absolute inset-2 rounded-full border border-dashed border-sand" />
                            
                            <motion.div 
                              key={beadCount}
                              initial={{ scale: 0.94 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 350, damping: 15 }}
                              className="flex flex-col items-center"
                            >
                              <span className="font-serif text-3xl font-medium text-walnut">{beadCount % 33}</span>
                              <span className="font-mono text-[9px] text-coffee/50 uppercase tracking-widest">/ 33 Beads</span>
                            </motion.div>
                            
                            {/* Physical bead representation sliding inside */}
                            <motion.div 
                              className="absolute w-2 h-2 rounded-full bg-olive shadow" 
                              animate={{
                                rotate: (beadCount % 33) * (360 / 33),
                              }}
                              transition={{ type: "spring", stiffness: 120, damping: 20 }}
                              style={{
                                transformOrigin: "center center",
                                top: "4px",
                                left: "calc(50% - 4px)",
                                height: "8px",
                                width: "8px"
                              }}
                            />
                          </button>

                          <p className="font-sans text-[10px] text-coffee/50 italic leading-normal">
                            Tap circle to slide the bead. Beautiful haptic click guides your breath.
                          </p>
                        </div>

                        {/* Prayer Time Warning */}
                        <div className="bg-olive/15 border border-olive/20 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Moon className="w-3.5 h-3.5 text-olive animate-pulse" />
                            <span className="font-sans text-[11px] font-semibold text-olive">Morning Du'a companion</span>
                          </div>
                          <span className="font-mono text-[10px] text-olive font-bold">1/1 Complete</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fake Apple Home Bar Indicator */}
                <div className="w-24 h-1 bg-coffee/30 rounded-full mx-auto mt-4" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Editorial Narrative Side (Content reveals using clipping masks/translations) */}
        <div className="lg:col-span-6 space-y-12 order-1 lg:order-2 text-left">
          <div className="space-y-4">
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-xs tracking-[0.2em] text-bronze uppercase block"
              >
                The App Design Philosophy
              </motion.span>
            </div>
            
            <div className="overflow-hidden">
              <motion.h4 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="font-serif text-3xl sm:text-4xl text-walnut leading-tight font-medium"
              >
                An interface that feels like textured linen.
              </motion.h4>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="font-sans text-sm sm:text-base text-coffee/85 leading-relaxed font-normal"
            >
              We spent months stripping away unnecessary elements. No flashing popups, 
              no leaderboard points, and no visual clutter. Instead, we designed a digital 
              journal that respects your attention and centers your devotion.
            </motion.p>
          </div>

          {/* Bullet Details with enhanced spacing, alignment, and subtle custom soft shadows */}
          <div className="space-y-10 md:space-y-12">
            {[
              {
                icon: Leaf,
                title: 'Streaks of Devotion, Not Numbers',
                description: 'Most streak systems make you feel guilty for missing. Our "Streak Garden" rewards consistent rhythm. Even on a busy day, taking one second to drop a quiet prayer keeps your garden alive and your intent focused.',
                colorClass: 'text-bronze'
              },
              {
                icon: Users,
                title: 'Generosity within Household Circles',
                description: "Generosity isn't inherited—it is taught by example. Connect family jars to create a beautiful, private circle of giving. See the gentle trail of kindness that your spouse, children, and parents plant throughout the day.",
                colorClass: 'text-terracotta'
              },
              {
                icon: Clock,
                title: 'Sacred Morning Remembrance',
                description: 'A beautiful integrated bead slider tracks your morning and evening Adhkar (remembrance). Receive warm prompts right after Fajr when the world is silent and the morning breeze bears testimony to your prayers.',
                colorClass: 'text-olive'
              }
            ].map((bullet, index) => {
              const BulletIcon = bullet.icon;
              return (
                <motion.div 
                  key={index} 
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={featureCardReveal}
                  className="flex items-start space-x-5 group/card"
                >
                  {/* Independent icon animation on hover of the card block */}
                  <div className="pt-0.5">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: [0, -4, 4, 0] }}
                      transition={{ type: "spring", stiffness: 220, damping: 12 }}
                      className={`p-3 bg-parchment rounded-2xl border border-sand/70 group-hover/card:border-bronze/40 group-hover/card:bg-white ${bullet.colorClass} transition-colors duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.015)]`}
                    >
                      <BulletIcon className="w-5 h-5 stroke-[1.75]" />
                    </motion.div>
                  </div>
                  
                  <div className="space-y-1.5 flex-1 text-left">
                    <h5 className="font-serif text-lg sm:text-xl font-medium text-walnut italic leading-snug">
                      {bullet.title}
                    </h5>
                    <p className="font-sans text-xs sm:text-[13px] text-coffee/85 leading-relaxed font-normal">
                      {bullet.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
