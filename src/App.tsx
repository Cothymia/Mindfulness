import { useState } from 'react';
import MindfulnessTimer from './components/MindfulnessTimer';
import GratitudeJournal from './components/GratitudeJournal';
import MoodTracker from './components/MoodTracker';
import { motion } from 'motion/react';
import { Leaf, Sparkles, BookOpen, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'practice' | 'journal' | 'mood'>('practice');

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-amber-100 selection:text-amber-900">
      {/* Dynamic Background Atmosphere */}
      <div className="atmosphere" />

      {/* Navigation Rail */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-1 bg-white/40 backdrop-blur-md rounded-full border border-white/50 shadow-sm">
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'practice' 
              ? 'bg-neutral-900 text-white shadow-md' 
              : 'text-neutral-600 hover:bg-white/50'
          }`}
        >
          <Sparkles size={16} />
          Practice
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'journal' 
              ? 'bg-neutral-900 text-white shadow-md' 
              : 'text-neutral-600 hover:bg-white/50'
          }`}
        >
          <BookOpen size={16} />
          Journal
        </button>
        <button
          onClick={() => setActiveTab('mood')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'mood' 
              ? 'bg-neutral-900 text-white shadow-md' 
              : 'text-neutral-600 hover:bg-white/50'
          }`}
        >
          <Heart size={16} />
          Mood
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'practice' && (
            <div className="flex flex-col items-center gap-12">
              <div className="text-center max-w-lg">
                <header className="mb-4">
                  <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6">
                    <Leaf className="text-emerald-500" size={32} />
                  </div>
                  <h1 className="text-6xl font-serif font-light text-neutral-900 mb-6 tracking-tight">
                    Breathing Spaces
                  </h1>
                  <p className="text-neutral-500 text-lg font-serif italic leading-relaxed">
                    "Mindfulness is not a destination, but the way of being."
                  </p>
                </header>
              </div>
              <MindfulnessTimer />
            </div>
          )}
          {activeTab === 'journal' && <GratitudeJournal />}
          {activeTab === 'mood' && <MoodTracker />}
        </motion.div>
      </main>

      {/* Ambient Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 flex justify-center pointer-events-none">
        <div className="text-neutral-300 font-sans text-[10px] uppercase tracking-[0.2em] font-medium">
          ZenSix • Daily Harmony • Est. 2026
        </div>
      </footer>
    </div>
  );
}
