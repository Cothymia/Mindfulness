import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Frown, Meh, Moon, CloudLightning, Calendar, Trash2 } from 'lucide-react';

type MoodType = 'happy' | 'sad' | 'soso' | 'tired' | 'upset';

interface MoodEntry {
  id: string;
  type: MoodType;
  date: string;
  note?: string;
}

const moodOptions: { type: MoodType; icon: any; label: string; color: string }[] = [
  { type: 'happy', icon: Smile, label: 'Happy', color: 'text-amber-500 bg-amber-50' },
  { type: 'sad', icon: Frown, label: 'Sad', color: 'text-blue-500 bg-blue-50' },
  { type: 'soso', icon: Meh, label: 'So-so', color: 'text-neutral-500 bg-neutral-100' },
  { type: 'tired', icon: Moon, label: 'Tired', color: 'text-indigo-500 bg-indigo-50' },
  { type: 'upset', icon: CloudLightning, label: 'Upset', color: 'text-rose-500 bg-rose-50' },
];

export default function MoodTracker() {
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('zen_mood_tracker');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load mood history', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zen_mood_tracker', JSON.stringify(history));
  }, [history]);

  const saveMood = () => {
    if (!selectedMood) return;
    
    const entry: MoodEntry = {
      id: Date.now().toString(),
      type: selectedMood,
      date: new Date().toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      note: note.trim() || undefined,
    };

    setHistory([entry, ...history]);
    setSelectedMood(null);
    setNote('');
  };

  const deleteEntry = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-10">
      <div className="text-center">
        <h2 className="text-3xl font-serif text-neutral-800 mb-2">How are you feeling?</h2>
        <p className="text-neutral-500 font-sans text-sm italic">Capture your emotional landscape</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {moodOptions.map((mood) => {
          const Icon = mood.icon;
          const isActive = selectedMood === mood.type;
          return (
            <button
              key={mood.type}
              onClick={() => setSelectedMood(mood.type)}
              className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all duration-300 ${
                isActive 
                  ? `${mood.color} ring-2 ring-current ring-offset-4 ring-offset-neutral-50 shadow-lg scale-110` 
                  : 'bg-white text-neutral-400 hover:text-neutral-600 hover:shadow-md'
              }`}
            >
              <Icon size={32} />
              <span className="text-xs font-medium uppercase tracking-widest">{mood.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card p-6 border border-neutral-200"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any thoughts on why you feel this way? (Optional)"
              className="w-full bg-transparent border-none focus:ring-0 text-lg font-serif text-neutral-700 placeholder:text-neutral-300 resize-none min-h-24"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={saveMood}
                className="bg-neutral-900 text-white px-8 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
              >
                Log Mood
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-sans font-medium uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100 pb-2">
          Mood History
        </h3>
        
        {history.length === 0 ? (
          <div className="text-center py-12 opacity-30 italic font-serif text-neutral-400">
            No moods logged yet.
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence initial={false}>
              {history.map((entry) => {
                const moodData = moodOptions.find(m => m.type === entry.type)!;
                const MoodIcon = moodData.icon;
                return (
                  <motion.div
                    layout
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex gap-4 items-start p-5 glass-card group"
                  >
                    <div className={`p-3 rounded-2xl ${moodData.color}`}>
                      <MoodIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-sans font-semibold text-sm capitalize text-neutral-700">
                          {entry.type}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-neutral-400 font-mono tracking-tighter">
                            {entry.date}
                          </span>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {entry.note ? (
                        <p className="text-neutral-500 font-serif text-sm leading-relaxed italic">
                          "{entry.note}"
                        </p>
                      ) : (
                        <p className="text-neutral-300 text-xs italic">No note added</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
