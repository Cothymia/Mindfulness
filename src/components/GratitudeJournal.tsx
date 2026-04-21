import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Heart, Calendar } from 'lucide-react';

interface JournalEntry {
  id: string;
  text: string;
  date: string;
}

export default function GratitudeJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('zen_gratitude_journal');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load journal entries', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zen_gratitude_journal', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      text: newEntry.trim(),
      date: new Date().toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
    };
    setEntries([entry, ...entries]);
    setNewEntry('');
    setIsAdding(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-8">
      <div className="flex justify-between items-end border-v border-neutral-200 pb-4">
        <div>
          <h2 className="text-3xl font-serif text-neutral-800">Gratitude Journal</h2>
          <p className="text-neutral-500 font-sans text-sm italic">What are you thankful for today?</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          {isAdding ? 'Close' : <><Plus size={16} /> New Entry</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 glass-card border border-neutral-200">
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="I am grateful for..."
                className="w-full bg-transparent border-none focus:ring-0 text-xl font-serif text-neutral-700 placeholder:text-neutral-300 resize-none min-h-32"
                autoFocus
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={addEntry}
                  disabled={!newEntry.trim()}
                  className="bg-neutral-900 text-white px-6 py-2 rounded-full text-sm font-medium disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                >
                  Save to Heart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {entries.length === 0 && !isAdding && (
          <div className="text-center py-20 bg-neutral-50/50 rounded-3xl border border-dashed border-neutral-200">
            <Heart className="mx-auto text-neutral-200 mb-4" size={48} />
            <p className="text-neutral-400 font-serif italic">Your journey of gratitude begins here.</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              layout
              key={entry.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 glass-card group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono tracking-widest uppercase">
                  <Calendar size={12} />
                  {entry.date}
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-400 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-neutral-700 font-serif text-lg leading-relaxed">
                {entry.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
