
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic2 } from 'lucide-react';
import { MILITARY_LOGOS } from '../constants';

const MilitaryLectures: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let isInteracting = false;

    const setInteracting = () => { isInteracting = true; };
    const clearInteracting = () => { isInteracting = false; };

    // Mobile touch
    el.addEventListener('touchstart', setInteracting, { passive: true });
    el.addEventListener('touchend', clearInteracting);
    el.addEventListener('touchcancel', clearInteracting);

    // Desktop mouse drag
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isInteracting = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => { isInteracting = false; };
    const onMouseUp = () => { isInteracting = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isInteracting) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    const step = () => {
      const setWidth = el.scrollWidth / 4;

      if (!isInteracting) {
        el.scrollLeft -= 0.5;
      }

      const currentAbs = Math.abs(el.scrollLeft);
      if (currentAbs >= setWidth * 2) {
        el.scrollLeft += setWidth;
      } else if (currentAbs < 5) {
        el.scrollLeft -= setWidth;
      }

      animationId = window.requestAnimationFrame(step);
    };

    animationId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationId);
      el.removeEventListener('touchstart', setInteracting);
      el.removeEventListener('touchend', clearInteracting);
      el.removeEventListener('touchcancel', clearInteracting);
    };
  }, []);

  return (
    <section className="bg-navy py-10 md:py-14 relative overflow-hidden border-y border-gold/20">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
            <Mic2 className="text-gold" size={16} />
            <span className="text-gold font-black tracking-widest text-xs uppercase">מרצים בשטח</span>
          </div>
          <h3 className="text-white font-black tracking-tight text-3xl md:text-4xl lg:text-6xl mb-6 leading-tight">
            גאים להרצות ולהוביל ערכים <br />
            <span className="text-gold">ביחידות המובחרות של צה"ל</span>
          </h3>
          <div className="w-24 h-1 bg-gold/40 rounded-full" />
        </div>

        {/* Lecture Photos */}
        <div className="flex gap-6 md:gap-10 justify-center items-center mt-6 mb-2 px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/30 w-56 md:w-64 lg:w-72 aspect-[4/3] group rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
            <img
              src="/assets/amit-lecture.png"
              alt="עמית גולד מרצה ביחידות צבאיות"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-3 text-right">
              <p className="text-white font-black text-base">עמית גולד</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/30 w-56 md:w-64 lg:w-72 aspect-[4/3] group rotate-[3deg] hover:rotate-0 transition-transform duration-500">
            <img
              src="/assets/noam-lecture.png"
              alt="נועם סדן מרצה ביחידות צבאיות"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-3 text-right">
              <p className="text-white font-black text-base">נועם סדן</p>
            </div>
          </div>
        </div>

      </div>

      {/* Marquee Units */}
      <div className="relative flex overflow-hidden w-full mt-10" dir="rtl">
        <div
          ref={scrollRef}
          className="flex items-center gap-8 md:gap-20 py-4 overflow-x-auto pb-8 lg:pb-4 hide-scrollbar select-none w-max cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[...MILITARY_LOGOS, ...MILITARY_LOGOS, ...MILITARY_LOGOS, ...MILITARY_LOGOS].map((unit, i) => (
            <div
              key={i}
              className="text-white/20 text-3xl md:text-5xl lg:text-5xl font-black tracking-widest hover:text-gold transition-colors duration-500 uppercase whitespace-nowrap shrink-0 px-2"
            >
              {unit}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default MilitaryLectures;
