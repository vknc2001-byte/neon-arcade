import { useRef, useState } from 'react';
import { topScorers, sideGames, gamesData } from '../data';

interface PlayProps {
  gameId: string;
  onBackToLobby: () => void;
  onPlayGame: (gameId: string) => void;
}

export default function Play({ gameId, onBackToLobby, onPlayGame }: PlayProps) {
  const game = gamesData.find((g) => g.id === gameId) ?? gamesData[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: game.title, text: game.description, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      }
    } catch {}
  };

  const handleFullscreen = () => {
    const el = iframeRef.current as HTMLIFrameElement & {
      mozRequestFullScreen?: () => void;
      webkitRequestFullscreen?: () => void;
    };
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden pb-16 selection:bg-[#06b6d4] selection:text-black">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 opacity-20 retro-grid pointer-events-none z-0"></div>
      
      {/* Atmospheric Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* TopNavBar */}
      <header className="relative z-25 bg-zinc-950/90 border-b border-zinc-800 backdrop-blur-md">
        <nav className="flex justify-between items-center px-6 md:px-12 h-20 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <a 
              href="index.html" 
              onClick={(e) => {
                e.preventDefault();
                onBackToLobby();
              }}
              className="flex items-center gap-2 text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none hover:brightness-110 cursor-pointer transition-all select-none"
            >
              <span className="neon-orange text-orange-400">NEON</span>
              <span className="neon-purple text-purple-400">ARCADE</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToLobby}
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-zinc-700 hover:border-[#06b6d4] transition-colors"
            >
              RETURN TO LOBBY
            </button>
          </div>
        </nav>
      </header>

      {/* Arcade Dashboard workspace */}
      <main className="relative z-20 max-w-[1440px] mx-auto px-6 md:px-12 py-8">
        
        {/* Main interactive grid splitting console and sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          
          {/* Central machine display console */}
          <div className="flex flex-col gap-6">
            
            {/* Game iframe embed */}
            <div className="relative rounded bg-black border-2 border-zinc-800 overflow-hidden shadow-2xl w-full">
              <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-950 border-b border-zinc-800 flex items-center px-3 gap-2 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest ml-2">Now Playing // {game.title} // Live</span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider">ACTIVE</span>
                </div>
              </div>
              <div className="pt-8">
                <iframe
                  ref={iframeRef}
                  src={game.iframeUrl}
                  width="100%"
                  style={{ height: '520px', display: 'block', border: 'none' }}
                  scrolling="no"
                  frameBorder="0"
                  title={game.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Game specifications and technical cards */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-1 font-mono">
                    Published by <span className="text-orange-400">{game.publisher}</span>
                  </div>
                  <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 tracking-tight uppercase leading-none mb-2">
                    {game.title}
                  </h1>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
                    {game.description}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0 relative">
                  {/* Share toast */}
                  {shareToast && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 border border-orange-500/40 text-orange-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded whitespace-nowrap animate-pulse">
                      ✓ Link Copied!
                    </div>
                  )}
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    title="Share this game"
                    className="p-3 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 hover:text-orange-400 text-white transition-all rounded active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                  {/* Favorite button */}
                  <button
                    onClick={() => setIsFavorited((f) => !f)}
                    title={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
                    className={`p-3 border transition-all rounded active:scale-95 ${
                      isFavorited
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(217,70,239,0.3)]'
                        : 'bg-zinc-900 border-zinc-800 hover:border-purple-500/50 hover:text-purple-400 text-white'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  {/* Fullscreen button */}
                  <button
                    onClick={handleFullscreen}
                    title="Fullscreen"
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded shadow-[0_0_15px_rgba(217,70,239,0.3)] active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                      <path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
                    </svg>
                    FULLSCREEN
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded p-4">
                <div className="text-[9px] uppercase font-bold text-orange-400 tracking-widest mb-2 font-mono flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                    <line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                  HOW TO PLAY
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                    {game.instructions}
                  </p>
              </div>

              {/* Specifications vectors */}
              <div className="flex flex-wrap gap-2 mt-1">
                {(game.tags ?? []).map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded font-bold text-[9px] tracking-widest uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right sidebar */}
          <aside className="flex flex-col gap-8">
            
            {/* Game thumbnail card */}
            <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden relative group">
              <div className="relative">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest font-mono block">Publisher</span>
                  <span className="text-xs text-white font-bold uppercase tracking-wide">{game.publisher}</span>
                </div>
              </div>
            </div>

            {/* Next UP list */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase border-l-2 border-orange-500 pl-3">
                Other Games
              </h3>

              <div className="flex flex-col gap-3">
                {gamesData.filter((g) => g.id !== gameId).slice(0, 8).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => onPlayGame(g.id)}
                    className="group flex gap-3 p-2 bg-zinc-900/30 border border-zinc-800 hover:border-orange-500/50 rounded transition-all text-left w-full cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded overflow-hidden border border-zinc-800 bg-[#0a0a0a] shrink-0">
                      <img
                        src={g.image}
                        alt={g.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-white font-bold text-xs uppercase group-hover:text-orange-400 tracking-wide transition-colors">
                        {g.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">
                        {g.category}
                      </span>
                    </div>
                  </button>
                ))}
                {gamesData.filter((g) => g.id !== gameId).length === 0 && (
                  <p className="text-zinc-600 text-xs">No other games yet.</p>
                )}
              </div>
            </div>

          </aside>
        </div>

        {/* More Games Grid */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">More <span className="text-orange-400">Games</span></span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {gamesData.filter((g) => g.id !== gameId).slice(8, 28).map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onPlayGame(g.id);
                }}
                className="group relative bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all text-left cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 bg-gradient-to-b from-zinc-900/50 to-transparent">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wide truncate group-hover:text-orange-400 transition-colors">{g.title}</h4>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-1 block">{g.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-20 max-w-[1440px] mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <span className="font-black italic tracking-widest text-orange-400 text-sm uppercase">Neon Arcade</span>
          <p className="text-[10px] text-zinc-500 mt-1">© 2026 Neon Arcade. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
