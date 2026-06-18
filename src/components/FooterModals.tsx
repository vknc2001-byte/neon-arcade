import { useState } from 'react';

export type ModalType = 'terms' | 'privacy' | 'contact';

// ─────────────────────────────────────────────────────────────────────────────
// ✏️  EDITABLE CONTENT — Fill in your details below
// ─────────────────────────────────────────────────────────────────────────────
const SITE_NAME    = 'Neon Arcade';
const CONTACT_EMAIL = 'arcadecare@zohomail.in';   // ← your email
const SITE_URL     = 'https://neonarcade.netlify.app'; // ← your site URL
const LAST_UPDATED = 'June 2026';
// ─────────────────────────────────────────────────────────────────────────────

interface Props { type: ModalType; onClose: () => void; }

export default function FooterModal({ type, onClose }: Props) {
  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4 py-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <h2 className="font-black uppercase tracking-widest text-white text-sm">
            {type === 'terms'   && '📄 Terms of Service'}
            {type === 'privacy' && '🔒 Privacy Policy'}
            {type === 'contact' && '📬 Contact Us'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 text-sm text-zinc-400 leading-relaxed space-y-4">
          {type === 'terms'   && <TermsContent />}
          {type === 'privacy' && <PrivacyContent />}
          {type === 'contact' && <ContactContent />}
        </div>

      </div>
    </div>
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
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    // Opens default mail client with pre-filled content
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject || 'Pixel Arcade Contact')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSent(true);
    setError('');
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-white font-bold text-lg">Message Ready!</h3>
        <p className="text-zinc-400 mt-2 text-sm">Your email client should open with the message pre-filled.</p>
        <p className="text-zinc-500 text-xs mt-1">If it didn't open, email us directly at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-400 hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-zinc-400">
        Have a question, suggestion, or want to report an issue? We'd love to hear from you!
      </p>
      <p className="text-zinc-500 text-xs">
        Or email us directly at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-400 hover:underline">{CONTACT_EMAIL}</a>
      </p>

      {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3 mt-2">
        <div className="grid grid-cols-2 gap-3">
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
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Message *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Describe your question or feedback here..."
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-orange-500 hover:bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          Send Message →
        </button>
      </form>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
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
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
      />
    </div>
  );
}
