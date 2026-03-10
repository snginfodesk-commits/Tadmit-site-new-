import React, { useState, useEffect } from 'react';

interface A11yState {
  fontSize: number;
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  pauseAnimations: boolean;
}

const DEFAULT: A11yState = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  pauseAnimations: false,
};

const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [s, setS] = useState<A11yState>(() => {
    try { return JSON.parse(localStorage.getItem('a11y') || 'null') ?? DEFAULT; }
    catch { return DEFAULT; }
  });

  useEffect(() => {
    localStorage.setItem('a11y', JSON.stringify(s));
    const r = document.documentElement;
    r.classList.remove('a11y-font-lg', 'a11y-font-xl');
    if (s.fontSize === 1) r.classList.add('a11y-font-lg');
    if (s.fontSize === 2) r.classList.add('a11y-font-xl');
    r.classList.toggle('a11y-contrast', s.highContrast);
    r.classList.toggle('a11y-gray', s.grayscale);
    r.classList.toggle('a11y-links', s.underlineLinks);
    r.classList.toggle('a11y-stop', s.pauseAnimations);
  }, [s]);

  const toggle = (k: keyof Omit<A11yState, 'fontSize'>) =>
    setS(prev => ({ ...prev, [k]: !prev[k] }));

  const activeCount = [s.fontSize > 0, s.highContrast, s.grayscale, s.underlineLinks, s.pauseAnimations].filter(Boolean).length;

  return (
    <div className="fixed bottom-24 left-4 z-50" dir="rtl">
      {isOpen && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl border border-navy/10 p-4 w-52">
          <div className="flex justify-between items-center mb-3">
            <button onClick={() => setS(DEFAULT)} className="text-xs text-navy/40 hover:text-navy font-bold transition-colors">איפוס</button>
            <span className="text-sm font-black text-navy">נגישות</span>
          </div>

          {/* Font size */}
          <div className="flex items-center justify-between py-2 border-b border-navy/5 mb-1">
            <div className="flex gap-1">
              <button
                onClick={() => setS(p => ({ ...p, fontSize: Math.min(2, p.fontSize + 1) }))}
                disabled={s.fontSize >= 2}
                className="w-7 h-7 rounded-lg bg-navy/5 hover:bg-navy/10 disabled:opacity-30 font-black text-navy text-base flex items-center justify-center transition-colors"
              >+</button>
              <button
                onClick={() => setS(p => ({ ...p, fontSize: Math.max(0, p.fontSize - 1) }))}
                disabled={s.fontSize <= 0}
                className="w-7 h-7 rounded-lg bg-navy/5 hover:bg-navy/10 disabled:opacity-30 font-black text-navy text-base flex items-center justify-center transition-colors"
              >−</button>
            </div>
            <span className="text-sm font-bold text-navy">גודל טקסט</span>
          </div>

          {/* Toggles */}
          {([
            ['highContrast', 'ניגודיות גבוהה'],
            ['grayscale', 'גווני אפור'],
            ['underlineLinks', 'הדגש קישורים'],
            ['pauseAnimations', 'עצור אנימציות'],
          ] as [keyof Omit<A11yState, 'fontSize'>, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => toggle(k)}
              className={`w-full flex items-center justify-between py-1.5 px-1 rounded-xl transition-colors ${s[k] ? 'bg-navy/5' : ''}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full border-2 transition-colors flex-shrink-0 ${s[k] ? 'bg-gold border-gold' : 'border-navy/20'}`} />
              <span className="text-sm font-bold text-navy">{label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label="פתח תפריט נגישות"
        title="נגישות"
        className="w-11 h-11 bg-navy text-white rounded-full shadow-lg hover:bg-gold hover:text-navy transition-all flex items-center justify-center relative"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M19 7h-6l-1-1H6v2h5.5l.5 1v2H7v2h5v6h2v-6h3v-2h-4V9l.5-1H19V7z" />
        </svg>
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full text-navy text-[10px] font-black flex items-center justify-center leading-none">
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default AccessibilityWidget;
