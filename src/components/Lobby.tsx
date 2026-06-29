import { useState, useEffect, useCallback, useMemo } from 'react';
import { gamesData, CATEGORIES, type Category } from '../data';
import type { Game } from '../types';
import TasteModal, { getTastePrefs, hasDoneTasteSetup } from './TasteModal';
import TypingQuotes from './TypingQuotes';
import { getPlayCounts, isAutoHot, sortByPopularity, HOT_THRESHOLD } from '../utils/playCount';

// ── Tag colour map ────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  ACTION:   'bg-red-500/15 text-red-400 border-red-500/30',
  ARCADE:   'bg-purple-500/15 text-purple-400 border-purple-500/30',
  FUN:      'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  SHOOTING: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  RACING:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PUZZLE:   'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

// ── Banner Carousel ───────────────────────────────────────────────────────────
function BannerCarousel({ games, onPlay }: { games: Game[]; onPlay: (id: string) => void }) {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => (c + 1) % games.length), [games.length]);
  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);
  const game = games[current];
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800 group bg-black" style={{ height: '380px' }}>
      {games.map((g, index) => {
        const isActive = index === current;
        return (
          <div key={g.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}>
            {/* 1. Blurred Background Layer (fills the space without showing sharp pixels) */}
            <img
              src={g.banner ?? g.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125"
              onError={(e) => { (e.target as HTMLImageElement).src = g.image; }}
            />
            {/* 2. Sharp Foreground Layer (contained so it doesn't stretch past native resolution) */}
            <div className="absolute inset-0 w-full h-full flex justify-end">
              <img
                src={g.banner ?? g.image}
                alt={g.title}
                className="h-full w-full md:w-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-1000"
                style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%, black)', maskImage: 'linear-gradient(to right, transparent, black 30%, black)' }}
                onError={(e) => { (e.target as HTMLImageElement).src = g.image; }}
              />
            </div>
            {/* 3. Smooth fade gradients to blend the sharp image into the dark background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent w-full md:w-3/4 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
          </div>
        );
      })}

      <TypingQuotes />

      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3 z-20">
        <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded w-fit border ${TAG_COLORS[game.category] ?? 'bg-zinc-700 text-zinc-400 border-zinc-600'}`}>
          {game.category}
        </span>
        <h2 className="text-2xl md:text-4xl font-black italic uppercase text-white drop-shadow-lg leading-tight">
          {game.title}
        </h2>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">by {game.publisher}</span>
          <button
            onClick={() => onPlay(game.id)}
            className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-lg transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Play Now
          </button>
        </div>
        {games.length > 1 && (
          <div className="flex gap-2 mt-1">
            {games.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-orange-400' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'}`} />
            ))}
          </div>
        )}
      </div>

      {games.length > 1 && (
        <>
          <button onClick={() => setCurrent((c) => (c - 1 + games.length) % games.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </>
      )}
    </div>
  );
}

// ── Game Card ─────────────────────────────────────────────────────────────────
function GameCard({
  game, onPlay, onTagClick, isHot,
}: {
  game: Game; onPlay: (id: string) => void;
  onTagClick: (tag: string) => void; isHot: boolean;
}) {
  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer"
      onClick={() => onPlay(game.id)}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video w-full bg-zinc-800">
        <img src={game.image} alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {/* Hot/New badge */}
        {(isHot || game.isHot) && (
          <span className="hot-ring absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
            🔥 HOT
          </span>
        )}
        {game.isNew && !(isHot || game.isHot) && (
          <span className="absolute top-2 left-2 bg-orange-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
            ✨ NEW
          </span>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(6,182,212,0.6)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black translate-x-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-bold text-xs uppercase leading-tight truncate mb-2 group-hover:text-orange-400 transition-colors">
          {game.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {(game.gameTags ?? [game.category]).slice(0, 3).map((tag) => (
            <span
              key={tag}
              onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border cursor-pointer hover:brightness-125 transition-all ${TAG_COLORS[tag] ?? 'bg-zinc-700/50 text-zinc-400 border-zinc-600'}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Lobby ────────────────────────────────────────────────────────────────
interface LobbyProps {
  onPlay: (gameId: string) => void;
}

export default function Lobby({ onPlay }: LobbyProps) {
  const [searchQuery,      setSearchQuery]      = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [tastePrefs,       setTastePrefs]       = useState<string[]>(() => getTastePrefs());
  const [showTasteModal,   setShowTasteModal]   = useState(() => !hasDoneTasteSetup());
  const [playCounts,       setPlayCounts]       = useState<Record<string, number>>(() => getPlayCounts());
  const [currentPage,      setCurrentPage]      = useState(1);
  const GAMES_PER_PAGE = 150;

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Refresh play counts when component mounts
  useEffect(() => { setPlayCounts(getPlayCounts()); }, []);

  const filteredGames = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const games = gamesData.filter((game) => {
      const tags = game.gameTags ?? [game.category];
      const matchesSearch = !q || game.title.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q));
      const matchesCat = selectedCategory === 'ALL' || tags.includes(selectedCategory);
      return matchesSearch && matchesCat;
    });
    return sortByPopularity(games, playCounts);
  }, [searchQuery, selectedCategory, playCounts]);

  const recommendedGames = useMemo(() => {
    if (!tastePrefs.length) return [];
    return sortByPopularity(
      gamesData.filter((g) => (g.gameTags ?? [g.category]).some((t) => tastePrefs.includes(t))),
      playCounts
    ).slice(0, 6);
  }, [tastePrefs, playCounts]);

  const bannerGames = useMemo(() => gamesData.filter((g) => g.banner || g.image), []);

  const handleTasteDone = (prefs: string[]) => {
    setTastePrefs(prefs);
    setShowTasteModal(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Taste Modal */}
      {showTasteModal && <TasteModal onDone={handleTasteDone} />}

      {/* ── STICKY HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Top row: Logo + badge */}
          <div className="flex items-center justify-between h-12 border-b border-zinc-800/50">
            <div className="flex items-center gap-3">
              {/* Split PIXEL-blinking title */}
              <div className="flex items-center gap-1.5 text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none cursor-default select-none">
                <span className="neon-orange text-orange-400">NEON</span>
                <span className="neon-purple text-purple-400">ARCADE</span>
              </div>
              <span className="hidden sm:inline-block text-[9px] font-bold border border-orange-500/40 text-orange-400 px-2 py-0.5 rounded uppercase tracking-widest">
                V2.0 BETA
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded uppercase tracking-widest">
                FREE TO PLAY
              </span>
            </div>
            <button
              onClick={() => setShowTasteModal(true)}
              title="Update game preferences"
              className="text-[10px] text-zinc-500 hover:text-orange-400 transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              🎮 My Taste
            </button>
          </div>

          {/* Filter + Search row */}
          <div className="flex items-center gap-3 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {cat === 'ALL' ? 'All Games' : cat}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative ml-auto shrink-0">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="bg-zinc-800/80 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition-colors w-36 md:w-48"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 py-5 space-y-8">

        {/* ── Conditional Rendering: Hide fluff when searching/filtering ── */}
        {searchQuery.trim() === '' && selectedCategory === 'ALL' && (
          <>
            {/* Banner Carousel — full width */}
            <BannerCarousel games={bannerGames} onPlay={onPlay} />

            {/* Recommended for You — only if taste prefs set */}
            {tastePrefs.length > 0 && recommendedGames.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <span className="text-lg">✨</span> Recommended for You
                  </h2>
                  <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    Based on your taste
                  </span>
                  <button
                    onClick={() => setShowTasteModal(true)}
                    className="ml-auto text-[10px] text-zinc-500 hover:text-orange-400 transition-colors uppercase tracking-wide"
                  >
                    Change taste →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {recommendedGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={onPlay}
                      onTagClick={(tag) => setSelectedCategory(tag as Category)}
                      isHot={isAutoHot(game.id, playCounts)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Trending / Hot Games — games with 500+ plays */}
            {gamesData.some((g) => isAutoHot(g.id, playCounts)) && (
              <section>
                <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 mb-4">
                  <span>🔥</span> Trending Now
                  <span className="text-[9px] text-zinc-500 font-normal normal-case tracking-normal">500+ players</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {gamesData.filter((g) => isAutoHot(g.id, playCounts)).map((game) => (
                    <GameCard key={game.id} game={game} onPlay={onPlay}
                      onTagClick={(tag) => setSelectedCategory(tag as Category)} isHot={true} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* All / Filtered Games */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
              {selectedCategory === 'ALL' ? '🎮 All Games' : `🏷️ ${selectedCategory}`}
              {searchQuery && (
                <span className="text-xs text-zinc-500 font-normal normal-case tracking-normal">
                  — results for "{searchQuery}"
                </span>
              )}
            </h2>
            <span className="text-[10px] text-zinc-500">{filteredGames.length} games</span>
          </div>

          {filteredGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-zinc-800 rounded-xl">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">No games found</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                className="mt-4 text-xs text-orange-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Clear filters →
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredGames.slice((currentPage - 1) * GAMES_PER_PAGE, currentPage * GAMES_PER_PAGE).map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={onPlay}
                    onTagClick={(tag) => setSelectedCategory(tag as Category)}
                    isHot={isAutoHot(game.id, playCounts)}
                  />
                ))}
              </div>
              
              {Math.ceil(filteredGames.length / GAMES_PER_PAGE) > 1 && (
                <div className="flex items-center justify-center gap-6 mt-12">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(p => p - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-700 hover:border-orange-500 hover:text-orange-400 text-white rounded-lg disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-white disabled:cursor-not-allowed transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  
                  <span className="text-zinc-400 font-black tracking-widest uppercase text-xs">
                    Page <span className="text-orange-400">{currentPage}</span> / {Math.ceil(filteredGames.length / GAMES_PER_PAGE)}
                  </span>
                  
                  <button
                    disabled={currentPage === Math.ceil(filteredGames.length / GAMES_PER_PAGE)}
                    onClick={() => {
                      setCurrentPage(p => p + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-700 hover:border-orange-500 hover:text-orange-400 text-white rounded-lg disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-white disabled:cursor-not-allowed transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── SEO TEXT BLOCK (For AdSense/Search Bots) ──────────────────── */}
        <section className="mt-12 pt-8 border-t border-zinc-800/50">
          <div className="grid md:grid-cols-2 gap-8 text-sm text-zinc-400 leading-relaxed">
            <div>
              <h2 className="text-white font-black uppercase tracking-widest mb-3">Free Online Games at Neon Arcade</h2>
              <p className="mb-4">
                Welcome to Neon Arcade, your ultimate destination for free online browser games. We offer a massive, carefully curated library of HTML5 games that you can play instantly without any downloads, installations, or subscriptions. Whether you are searching for high-octane racing games, challenging puzzle games, or classic arcade games, our platform is designed to provide seamless entertainment on both desktop and mobile devices.
              </p>
              <p>
                Our mission is to build the fastest, most user-friendly gaming portal on the internet. We prioritize a clean, dark-mode aesthetic that puts the focus entirely on gameplay. Every game in our collection is heavily optimized to ensure lightning-fast load times and smooth performance, regardless of your device's hardware.
              </p>
            </div>
            <div>
              <h2 className="text-white font-black uppercase tracking-widest mb-3">Play Instantly, Anywhere</h2>
              <p className="mb-4">
                Neon Arcade is built using cutting-edge web technologies to guarantee a flawless gaming experience. You don't need a high-end gaming PC to enjoy our catalog; if you have a web browser, you have access to hundreds of premium titles. We regularly update our library with the latest and most popular games to ensure there is always something new to discover.
              </p>
              <p>
                Dive into action-packed shooters, test your brain with logic puzzles, or relax with casual fun games. Our platform is completely free to play, supported by unobtrusive, high-quality advertisements that allow us to keep the servers running and the games flowing. Start playing today and join a growing community of casual gamers!
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 py-6 mt-4 border-t border-zinc-800/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-black italic tracking-widest text-orange-400 text-sm uppercase neon-flicker">
              Neon Arcade
            </span>
            <p className="text-[10px] text-zinc-600 mt-0.5">© 2026 Neon Arcade. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-5">
            {(['about', 'terms', 'privacy', 'contact']).map((m) => (
              <a
                key={m}
                href={`/${m}.html`}
                className="text-[11px] text-zinc-500 hover:text-orange-400 transition-colors uppercase tracking-widest capitalize"
              >
                {m === 'about' ? 'About Us' : m === 'terms' ? 'Terms of Service' : m === 'privacy' ? 'Privacy Policy' : 'Contact Us'}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
