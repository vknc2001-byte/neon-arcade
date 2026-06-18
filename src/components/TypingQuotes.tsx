import { useState, useEffect } from 'react';

const QUOTES = [
  "Gaming is not a crime, it's a passion.",
  "Eat, Sleep, Play, Repeat.",
  "Just one more level...",
  "Respawn and try again.",
  "Failure doesn't mean the game is over.",
  "We don't stop playing because we grow old...",
  "...we grow old because we stop playing.",
  "Keep calm and game on.",
  "Reality is broken. Game designers can fix it.",
  "Leveling up in real life.",
  "Born to play, forced to work.",
  "I don't need to get a life, I'm a gamer.",
  "I have multiple lives.",
  "Noob today, Pro tomorrow.",
  "Lag is my only enemy.",
  "I am not a player, I am a gamer.",
  "Players play the game, Gamers live the game.",
  "Escape reality, play games.",
  "My controller is my weapon.",
  "My keyboard is my sword.",
  "Saving the world, one pixel at a time.",
  "Video games ruined my life... Good thing I have two more.",
  "Home is where the save point is.",
  "Warning: May start talking about games.",
  "I pause my game to be here.",
  "It's not a bug, it's an undocumented feature.",
  "Gamers never die, they just respawn.",
  "High score? What does that mean? Did I break it?",
  "A hero need not speak. When he is gone, the world will speak for him.",
  "Stand in the ashes of a trillion dead souls...",
  "What is a man? A miserable little pile of secrets.",
  "The right man in the wrong place can make all the difference.",
  "Nothing is true, everything is permitted.",
  "War. War never changes.",
  "Praise the sun!",
  "Would you kindly?",
  "Boy.",
  "It's dangerous to go alone! Take this.",
  "Wake me when you need me.",
  "I survived the Gulag.",
  "Do a barrel roll!",
  "FINISH HIM!",
  "Are you not entertained?",
  "Skill issue.",
  "Git gud.",
  "GLHF!",
  "GG WP.",
  "Rush B, do not stop.",
  "Penta Kill!",
  "Victory Royale!"
];

export default function TypingQuotes() {
  const [text, setText] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentQuote = QUOTES[quoteIndex];
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
      } else {
        timeoutId = setTimeout(() => {
          setText(currentQuote.substring(0, text.length - 1));
        }, 30); // Delete speed
      }
    } else {
      if (text === currentQuote) {
        timeoutId = setTimeout(() => setIsDeleting(true), 4000); // Pause at end of quote
      } else {
        timeoutId = setTimeout(() => {
          setText(currentQuote.substring(0, text.length + 1));
        }, 70); // Type speed
      }
    }

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, quoteIndex]);

  return (
    <div className="absolute top-8 left-6 md:left-8 z-30 max-w-[60%] lg:max-w-[50%] pointer-events-none">
      <div className="inline-block bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <span className="text-cyan-400 font-mono text-xs md:text-sm font-bold tracking-widest uppercase opacity-80 mr-2">
          &gt;
        </span>
        <span className="text-white/90 font-sans text-xs md:text-sm italic tracking-wide">
          "{text}"
        </span>
        <span className="inline-block w-1.5 h-4 ml-1 bg-fuchsia-500 animate-pulse align-middle" />
      </div>
    </div>
  );
}
