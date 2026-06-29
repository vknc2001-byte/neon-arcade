import React, { useEffect } from 'react';

type PageType = 'about' | 'terms' | 'privacy' | 'contact';

// ─────────────────────────────────────────────────────────────────────────────
// ✏️  EDITABLE CONTENT — Fill in your details below
// ─────────────────────────────────────────────────────────────────────────────
const SITE_NAME    = 'Neon Arcade';
const CONTACT_EMAIL = 'arcadecare@zohomail.in';
const SITE_URL     = 'https://neonarcadegames.netlify.app';
const LAST_UPDATED = 'June 2026';
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  type: PageType;
  onBack: () => void;
}

export default function InfoPage({ type, onBack }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [type]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      {/* Background glow */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-12 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-orange-500 hover:text-black text-zinc-400 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-1.5 text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none cursor-default select-none">
            <span className="neon-orange text-orange-400">NEON</span>
            <span className="neon-purple text-purple-400">ARCADE</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 md:px-8 py-12">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-8 border-b border-zinc-800 pb-4">
          {type === 'about'   && 'ℹ️ About Us'}
          {type === 'terms'   && '📄 Terms of Service'}
          {type === 'privacy' && '🔒 Privacy Policy'}
          {type === 'contact' && '📬 Contact Us'}
        </h1>
        
        <div className="space-y-6 text-zinc-400 leading-relaxed text-sm">
          {type === 'about'   && <AboutContent />}
          {type === 'terms'   && <TermsContent />}
          {type === 'privacy' && <PrivacyContent />}
          {type === 'contact' && <ContactContent />}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/60 py-6 text-center mt-12">
        <span className="font-black italic tracking-widest text-orange-400 text-sm uppercase">Neon Arcade</span>
        <p className="text-[10px] text-zinc-600 mt-1">© 2026 Neon Arcade. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ── About Us ──────────────────────────────────────────────────────────────────
function AboutContent() {
  return (
    <>
      <Section title="Welcome to Neon Arcade">
        Neon Arcade is a premium browser gaming portal dedicated to providing the best free, high-octane games on the internet. Founded in 2026, our mission is to deliver instant, ad-supported entertainment directly to your browser with no downloads, no installations, and no hidden fees.
      </Section>
      <Section title="Our Games">
        We carefully curate a massive library of HTML5 games across various genres including Action, Racing, Puzzle, and Arcade. Whether you are looking for a quick five-minute distraction or a deep gaming experience, Neon Arcade has something for everyone. All games are optimized to run flawlessly on both desktop and mobile devices.
      </Section>
      <Section title="Why Choose Us?">
        Unlike other gaming portals that clutter your screen with pop-ups and fake download buttons, we believe in a clean, neon-inspired aesthetic that puts the games front and center. Our lightning-fast servers and dedicated team ensure that your gaming experience is always smooth and uninterrupted.
      </Section>
    </>
  );
}

// ── Terms of Service ──────────────────────────────────────────────────────────
function TermsContent() {
  return (
    <>
      <p className="text-zinc-500 text-xs">Last updated: {LAST_UPDATED}</p>
      <Section title="1. Acceptance of Terms">
        By accessing and using {SITE_NAME} ({SITE_URL}), you agree to be bound
        by these Terms of Service. If you do not agree, please do not use our site.
      </Section>
      <Section title="2. Use of the Site">
        {SITE_NAME} is a free online gaming portal. You may use this site for personal,
        non-commercial purposes. You must not misuse or attempt to disrupt the site's
        services, games, or any third-party content embedded here.
      </Section>
      <Section title="3. Games & Third-Party Content">
        All games available on {SITE_NAME} are embedded from third-party providers. We do not own the games and are not responsible for their
        content, functionality, or availability.
      </Section>
      <Section title="4. Advertisements">
        This site displays advertisements provided by our advertising partners. By using
        this site, you acknowledge that ads may be shown before, during, or after gameplay.
      </Section>
      <Section title="5. Intellectual Property">
        The {SITE_NAME} name, logo, and site design are our property. Game content
        belongs to their respective publishers. All rights reserved.
      </Section>
      <Section title="6. Limitation of Liability">
        {SITE_NAME} is provided "as is". We are not liable for any damages arising from
        use of this site, including but not limited to game performance, data loss, or
        third-party content.
      </Section>
      <Section title="7. Changes to Terms">
        We reserve the right to update these terms at any time. Continued use of the
        site after changes constitutes acceptance of the new terms.
      </Section>
      <Section title="8. Contact">
        For questions about these terms, contact us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-400 hover:underline">{CONTACT_EMAIL}</a>.
      </Section>
    </>
  );
}

// ── Privacy Policy ────────────────────────────────────────────────────────────
function PrivacyContent() {
  return (
    <>
      <p className="text-zinc-500 text-xs">Last updated: {LAST_UPDATED}</p>
      <Section title="1. Information We Collect">
        {SITE_NAME} does not collect personally identifiable information unless you
        voluntarily contact us. We may collect anonymous usage data (pages visited,
        game sessions) to improve our service.
      </Section>
      <Section title="2. Cookies & Local Storage">
        We use browser local storage to save your game preferences (favourite genres,
        play history). No cookies are sent to our servers. Third-party game providers
        and ad networks may use their own cookies.
      </Section>
      <Section title="3. Third-Party Advertising">
        Ads on this site are served by our advertising partners.
        These third parties may use cookies to deliver relevant ads. We do not control
        their data practices — please review their privacy policies separately.
      </Section>
      <Section title="4. Children's Privacy">
        This site is not directed to children under 13. We do not knowingly collect
        information from children. If you believe a child has provided personal data,
        please contact us immediately.
      </Section>
      <Section title="5. Data Security">
        All data stored locally on your device is under your browser's control. We
        do not store personal data on our servers.
      </Section>
      <Section title="6. Your Rights">
        You may clear your browser's local storage at any time to remove any preferences
        or data saved by {SITE_NAME}.
      </Section>
      <Section title="7. Contact">
        For privacy questions, contact us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-400 hover:underline">{CONTACT_EMAIL}</a>.
      </Section>
    </>
  );
}

// ── Contact Us ────────────────────────────────────────────────────────────────
function ContactContent() {
  const [form, setForm]     = React.useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = React.useState(false);
  const [error, setError]   = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject || 'Neon Arcade Contact')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSent(true);
    setError('');
  };

  if (sent) {
    return (
      <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-white font-black uppercase tracking-widest text-xl">Message Ready!</h3>
        <p className="text-zinc-400 mt-2 text-sm">Your email client should open with the message pre-filled.</p>
        <p className="text-zinc-500 text-xs mt-2">If it didn't open, email us directly at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-400 hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <p className="text-zinc-400 mb-6">
        Have a question, suggestion, or want to report an issue? We'd love to hear from you!
      </p>

      {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-2 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Your Name *" value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="John Doe" />
          <Field label="Your Email *" value={form.email} type="email"
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            placeholder="john@example.com" />
        </div>
        <Field label="Subject" value={form.subject}
          onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
          placeholder="Bug report / Suggestion / Game request..." />
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Message *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Describe your question or feedback here..."
            rows={6}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 mt-2 bg-orange-500 hover:bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          Send Message →
        </button>
      </form>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-white font-bold text-base mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
      />
    </div>
  );
}
