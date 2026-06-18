import { useState } from 'react';

const TASTE_KEY = 'na_taste_prefs';
const SETUP_KEY = 'na_taste_setup';

export function getTastePrefs(): string[] {
  try { return JSON.parse(localStorage.getItem(TASTE_KEY) ?? '[]'); }
  catch { return []; }
}
export function hasDoneTasteSetup(): boolean {
  return localStorage.getItem(SETUP_KEY) === 'done';
}

const CATEGORIES = [
  { id: 'ACTION',   label: 'Adrenaline Rush',  emoji: '💥', desc: 'Fast-paced action games'    },
  { id: 'ARCADE',   label: 'Quick Fun',         emoji: '🕹️', desc: 'Easy pick-up-and-play'      },
  { id: 'FUN',      label: 'Casual Vibes',      emoji: '😄', desc: 'Relaxed & fun for everyone' },
  { id: 'SHOOTING', label: 'Sharp Shooter',     emoji: '🎯', desc: 'Aim, fire, destroy'         },
  { id: 'RACING',   label: 'Speed Freak',       emoji: '🏎️', desc: 'Race to the finish line'    },
  { id: 'PUZZLE',   label: 'Brain Trainer',     emoji: '🧩', desc: 'Solve & think your way out' },
];

interface TasteModalProps {
  onDone: (prefs: string[]) => void;
}

export default function TasteModal({ onDone }: TasteModalProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDone = () => {
    const prefs = selected.length >= 3 ? selected : CATEGORIES.map((c) => c.id);
    localStorage.setItem(TASTE_KEY, JSON.stringify(prefs));
    localStorage.setItem(SETUP_KEY, 'done');
    onDone(prefs);
  };

  const canSubmit = selected.length >= 3;

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="modal-card w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🎮</div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white">
            What's Your Taste?
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Pick <span className="text-orange-400 font-bold">at least 3</span> genres — we'll recommend games just for you
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-orange-500/20 border-orange-400 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
                    : 'bg-zinc-800/60 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                )}
                <span className="text-2xl">{cat.emoji}</span>
                <span className={`text-xs font-black uppercase tracking-wide ${isSelected ? 'text-orange-300' : 'text-white'}`}>
                  {cat.label}
                </span>
                <span className="text-[10px] text-zinc-500 text-center leading-tight">{cat.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <p className="text-center text-xs text-zinc-500 mb-4">
          {selected.length} selected
          {!canSubmit && <span className="text-yellow-400"> — pick {3 - selected.length} more</span>}
          {canSubmit && <span className="text-orange-400"> — ready!</span>}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleDone()}
            disabled={!canSubmit}
            className={`flex-1 py-3 font-black uppercase tracking-widest text-sm rounded-xl transition-all ${
              canSubmit
                ? 'bg-orange-500 text-black hover:bg-white active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Show My Games →
          </button>
          <button
            onClick={() => handleDone()}
            className="px-4 py-3 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            Skip
          </button>
        </div>

      </div>
    </div>
  );
}
