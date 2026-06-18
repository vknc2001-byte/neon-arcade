import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Lobby from './components/Lobby';
import Play from './components/Play';
import { incrementPlayCount } from './utils/playCount';

export default function App() {
  const [currentPath, setCurrentPath] = useState<'/' | '/play.html'>(() => {
    const path = window.location.pathname;
    if (path.includes('play.html')) return '/play.html';
    return '/';
  });

  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [selectedGameId, setSelectedGameId] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('play.html')) {
        setDirection('forward');
        setCurrentPath('/play.html');
      } else {
        setDirection('backward');
        setCurrentPath('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPlay = (gameId: string) => {
    incrementPlayCount(gameId); // ← track every play for auto-HOT at 500+
    setSelectedGameId(gameId);
    setDirection('forward');
    window.history.pushState({ transition: 'push' }, '', '/play.html');
    setCurrentPath('/play.html');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToLobby = () => {
    setDirection('backward');
    window.history.pushState({ transition: 'push_back' }, '', '/');
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Define transition variations: push and push_back slide effects
  const variants = {
    initial: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? '100%' : '-100%',
      opacity: 0.8,
    }),
    animate: {
      x: '0%',
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? '-100%' : '100%',
      opacity: 0.8,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#121212] min-h-screen">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentPath}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen"
        >
          {currentPath === '/play.html' ? (
            <Play gameId={selectedGameId} onBackToLobby={navigateToLobby} onPlayGame={navigateToPlay} />
          ) : (
            <Lobby onPlay={navigateToPlay} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
