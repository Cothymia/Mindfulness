import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

const DURATION = 6 * 60; // 6 minutes in seconds

export default function MindfulnessTimer() {
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldOut'>('Inhale');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DURATION);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Breathing cycle animation (Box breathing or similar)
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setPhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        if (prev === 'Exhale') return 'HoldOut';
        return 'Inhale';
      });
    }, 4000); // 4 seconds per phase
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center p-8 glass-surface max-w-md w-full mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif font-medium text-neutral-800 mb-2">Daily Session</h2>
        <p className="text-neutral-500 font-sans text-sm uppercase tracking-widest">6 Minutes of Calm</p>
      </div>

      <div className="relative flex items-center justify-center mb-12 h-64 w-64">
        {/* Breathing Animation */}
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              key={phase}
              initial={{ scale: phase === 'Inhale' ? 0.8 : phase === 'Exhale' ? 1.2 : 1 }}
              animate={{ 
                scale: phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : phase === 'Hold' ? 1.2 : 0.8,
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="absolute inset-0 breathing-circle blur-2xl opacity-30"
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={isActive ? { 
            scale: phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : phase === 'Hold' ? 1.2 : 0.8 
          } : { scale: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-40 h-40 breathing-circle shadow-lg flex items-center justify-center z-10"
        >
          <div className="text-4xl font-serif text-white font-light tabular-nums">
            {formatTime(timeLeft)}
          </div>
        </motion.div>

        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-0 right-0 text-center"
          >
            <span className="text-neutral-600 font-serif italic text-lg">{phase}...</span>
          </motion.div>
        )}
      </div>

      <div className="flex gap-6 mt-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="p-4 rounded-full bg-white shadow-md hover:shadow-lg transition-all text-neutral-700"
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-white shadow-md hover:shadow-lg transition-all text-neutral-400"
        >
          <RotateCcw size={24} />
        </button>
      </div>
      
      {!isActive && timeLeft === DURATION && (
        <p className="mt-8 text-neutral-400 text-sm italic font-serif">
          Find a comfortable seat, press play to begin your 6-minute practice.
        </p>
      )}
    </div>
  );
}
