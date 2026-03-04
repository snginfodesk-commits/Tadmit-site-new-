import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Home, Building2 } from 'lucide-react';

const DesktopMapSvg = lazy(() => import('./DesktopMapSvg'));

export interface CityData {
  id: string;
  name: string;
  lng: number;
  lat: number;
  deals: number;
  desc: string;
  highlights: string[];
  trendPercent: number;
  color: string;
}

export const CITIES: CityData[] = [
  {
    id: 'haifa', name: 'חיפה', lng: 34.989, lat: 32.794, deals: 12,
    desc: 'רמות רמז, הדר והמפרץ',
    highlights: ['דירות 3-4 חדרים', 'שכונות מתחדשות', 'קרבה לטכניון'],
    trendPercent: 8.2, color: '#00b4d8'
  },
  {
    id: 'netanya', name: 'נתניה', lng: 34.856, lat: 32.329, deals: 15,
    desc: 'מרכז העיר ושכונות חדשות',
    highlights: ['קו ראשון לים', 'פרויקטי פינוי-בינוי', 'תשואה גבוהה'],
    trendPercent: 12.5, color: '#0096c7'
  },
  {
    id: 'telaviv', name: 'תל אביב', lng: 34.781, lat: 32.085, deals: 25,
    desc: 'פרי-סייל וליווי אישי',
    highlights: ['פרי-סייל בלעדי', 'נכסי יוקרה', 'השקעות פרימיום'],
    trendPercent: 15.1, color: '#D4AF37'
  },
  {
    id: 'jerusalem', name: 'ירושלים', lng: 35.217, lat: 31.768, deals: 18,
    desc: 'נכסי יוקרה ודיור ציבורי',
    highlights: ['שכונות ביקוש', 'דיור מוגן', 'פרויקטים חדשים'],
    trendPercent: 9.7, color: '#48cae4'
  },
  {
    id: 'ashdod', name: 'אשדוד', lng: 34.649, lat: 31.804, deals: 14,
    desc: 'ליווי משקיעי חוץ ומשפחות',
    highlights: ['קו שני לים', 'שכונות חדשות', 'מחיר אטרקטיבי'],
    trendPercent: 11.3, color: '#0077b6'
  },
  {
    id: 'beersheva', name: 'באר שבע', lng: 34.791, lat: 31.252, deals: 20,
    desc: 'השקעות סטודנטים ואקדמאים',
    highlights: ['קרבה לאוניברסיטה', 'תשואה 6%+', 'ביקוש שכירות גבוה'],
    trendPercent: 14.8, color: '#90e0ef'
  },
];

const STAT_ITEMS = [
  { value: '122+', label: 'עסקאות', icon: <Home size={18} /> },
  { value: '6', label: 'ערים', icon: <MapPin size={18} /> },
  { value: '5+', label: 'שנות ניסיון', icon: <Building2 size={18} /> },
];

const IsraeliMap: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="py-16 md:py-28 bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#0a1628] overflow-hidden relative">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-[#00b4d8]/8 blur-[160px] animate-pulse" />
        <div className="absolute -bottom-40 left-0 w-[600px] h-[600px] rounded-full bg-gold/8 blur-[140px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#023e8a]/10 blur-[200px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[#00b4d8] font-black tracking-[0.3em] uppercase text-xs mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(0,180,216,0.15), rgba(212,175,55,0.1))', border: '1px solid rgba(0,180,216,0.2)' }}>
            <MapPin size={14} />
            נוכחות בשטח
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
            הפריסה שלנו{' '}
            <span className="bg-gradient-to-r from-[#00b4d8] via-[#48cae4] to-gold bg-clip-text text-transparent">
              מדרום ועד צפון
            </span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1.5 mx-auto mt-6 rounded-full w-32"
            style={{ background: 'linear-gradient(90deg, #00b4d8, #D4AF37)' }}
          />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12 md:mb-16">
          {STAT_ITEMS.map((s) => (
            <motion.div key={s.label}
              whileHover={{ scale: 1.05, y: -4 }}
              className="rounded-2xl px-4 md:px-8 py-3 md:py-5 text-center min-w-[100px] md:min-w-[110px] cursor-default flex-1 max-w-[150px]"
              style={{
                background: 'linear-gradient(135deg, rgba(0,180,216,0.1), rgba(255,255,255,0.03))',
                border: '1px solid rgba(0,180,216,0.15)',
                backdropFilter: 'blur(12px)'
              }}>
              <div className="text-[#00b4d8] mb-2 flex justify-center">{s.icon}</div>
              <p className="text-2xl md:text-4xl font-black text-white leading-none">{s.value}</p>
              <p className="text-white/40 font-bold text-sm mt-2">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Grid: Map + Cards */}
        <div className="grid lg:grid-cols-2 gap-10 items-start max-w-7xl mx-auto">

          {/* MAP — lazy loaded to save mobile bundle size */}
          {!isMobile && (
            <Suspense fallback={
              <div className="hidden lg:flex flex-1 justify-center items-center w-full min-h-[650px]">
                <div className="w-12 h-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <DesktopMapSvg cities={CITIES} active={active} setActive={setActive} />
            </Suspense>
          )}
          {isMobile && <div className="hidden lg:block"></div>}

          {/* CITY CARDS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }}
            className={`flex flex-col gap-4 ${isMobile ? 'col-span-full' : ''}`}>

            {/* City grid — cards expand in-place on hover */}
            <motion.div
              layout
              onMouseLeave={() => setActive(null)}
              transition={{ layout: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {CITIES.map((city, i) => {
                const isActive = active === city.id;
                return (
                  <motion.div
                    key={city.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.07,
                      layout: { duration: 0.28, ease: [0.4, 0, 0.2, 1] }
                    }}
                    onMouseEnter={() => setActive(city.id)}
                    className="flex flex-col p-6 py-6 rounded-[1.8rem] cursor-pointer min-h-[140px] relative overflow-hidden"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${city.color}25, rgba(13,27,42,0.98))`
                        : 'rgba(255,255,255,0.03)',
                      border: isActive ? `2px solid ${city.color}50` : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive ? `0 12px 40px ${city.color}25` : 'none',
                      backdropFilter: 'blur(16px)',
                      alignSelf: 'stretch'
                    }}>

                    {/* Always visible: dot + name + desc */}
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: isActive ? `${city.color}20` : 'rgba(255,255,255,0.05)',
                          border: `1.5px solid ${isActive ? city.color : 'rgba(255,255,255,0.08)'}`
                        }}>
                        <div className="w-3 h-3 rounded-full transition-all duration-300"
                          style={{ background: isActive ? city.color : 'rgba(255,255,255,0.2)' }} />
                        {isActive && (
                          <motion.div
                            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="absolute inset-0 rounded-full"
                            style={{ background: `${city.color}30` }}
                          />
                        )}
                      </div>
                      <div className="text-right flex-1 min-w-0">
                        <p className="font-black text-xl leading-tight transition-colors duration-250"
                          style={{ color: isActive ? city.color : 'rgba(255,255,255,0.9)' }}>
                          {city.name}
                        </p>
                        <p className="text-sm mt-1 truncate transition-colors duration-250"
                          style={{ color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)' }}>
                          {city.desc}
                        </p>
                      </div>
                    </div>

                    {/* Expanded section — now uses direct motion height control for stability */}
                    <div className="lg:hidden mt-3 pt-3 text-right" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="flex flex-wrap gap-1.5 justify-end mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: `${city.color}22`, color: city.color, border: `1px solid ${city.color}30` }}>
                          {city.deals} עסקאות מוצלחות
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          <TrendingUp size={11} />
                          +{city.trendPercent}% עליית ערך
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {city.highlights.map((h, idx) => (
                          <span key={idx} className="text-xs font-bold px-2 py-1 rounded-full bg-white/5 text-white/65 border border-white/10">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      layout
                      initial={false}
                      animate={{
                        height: isActive ? 'auto' : 0,
                        opacity: isActive ? 1 : 0,
                        marginTop: isActive ? 12 : 0
                      }}
                      transition={{
                        duration: 0.25,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="hidden lg:block overflow-hidden"
                    >
                      <div className="pt-3 text-right" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex flex-wrap gap-1.5 justify-end mb-2">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background: `${city.color}22`, color: city.color, border: `1px solid ${city.color}30` }}>
                            {city.deals} עסקאות מוצלחות
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                            <TrendingUp size={11} />
                            +{city.trendPercent}% עליית ערך
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {city.highlights.map((h, idx) => (
                            <span key={idx} className="text-xs font-bold px-2 py-1 rounded-full bg-white/5 text-white/65 border border-white/10">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            <p className="text-white/40 font-medium text-base text-right mt-3 leading-relaxed">
              כל נקודה מייצגת עסקה מוצלחת וחקר שוק מעמיק. אנחנו בוחרים את המיקומים בפינצטה לפי פוטנציאל עליית ערך ותשואה.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IsraeliMap;
