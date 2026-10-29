import React, { useState, useRef, useCallback } from 'react';

interface InteractiveBeforeAfterProps {
  title?: string;
  subtitle?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const InteractiveBeforeAfter: React.FC<InteractiveBeforeAfterProps> = ({
  title = "Rénovation Complète : Avant / Après",
  subtitle = "Faites glisser le curseur pour visualiser la transformation d'un bassin dégradé en oasis contemporaine.",
  beforeLabel = "Avant : Fissures, étanchéité défaillante & margelles cassées",
  afterLabel = "Après : Bassin en pierre de Bali, plage immergée & filtration neuve"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-6 text-center max-w-2xl mx-auto">
          {title && <h3 className="text-xl sm:text-2xl font-bold text-[#102A43]">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
        </div>
      )}

      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden select-none cursor-ew-resize shadow-md border border-slate-200/90 bg-slate-900"
        onMouseDown={(e) => {
          isDragging.current = true;
          handleMove(e.clientX);
        }}
        onMouseUp={() => {
          isDragging.current = false;
        }}
        onMouseLeave={() => {
          isDragging.current = false;
        }}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          isDragging.current = true;
          handleMove(e.touches[0].clientX);
        }}
        onTouchEnd={() => {
          isDragging.current = false;
        }}
        onTouchMove={handleTouchMove}
      >
        {/* Layer 1: AFTER (Renovated luxury pool with crystal turquoise water) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#005f73] via-[#0a9396] to-[#94d2bd] flex items-center justify-center overflow-hidden">
          {/* Architectural pool vector visualization */}
          <div className="absolute inset-0 opacity-90">
            <svg className="w-full h-full object-cover" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="poolWater" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0077B6" />
                  <stop offset="50%" stopColor="#00B4D8" />
                  <stop offset="100%" stopColor="#90E0EF" />
                </linearGradient>
                <linearGradient id="coping" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
              </defs>
              {/* Background villa wall */}
              <rect width="1200" height="260" fill="#F1F5F9" />
              {/* Modern glass villa architecture facade */}
              <rect x="250" y="40" width="700" height="200" fill="#E2E8F0" rx="8" />
              <rect x="300" y="70" width="280" height="150" fill="#94A3B8" opacity="0.3" rx="4" />
              <rect x="620" y="70" width="280" height="150" fill="#94A3B8" opacity="0.3" rx="4" />
              {/* Limestone deck */}
              <rect y="240" width="1200" height="360" fill="url(#coping)" />
              {/* Pool basin */}
              <rect x="180" y="270" width="840" height="290" rx="16" fill="url(#poolWater)" stroke="#CBD5E1" strokeWidth="8" />
              {/* Shallow lounge sun shelf */}
              <rect x="200" y="290" width="240" height="100" rx="8" fill="#90E0EF" opacity="0.6" />
              {/* Water caustics reflection lines */}
              <path d="M220 330 Q400 310 600 330 T1000 330" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.5" />
              <path d="M200 400 Q450 380 750 410 T1000 390" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
              <path d="M220 480 Q500 460 700 490 T980 470" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.4" />
            </svg>
          </div>

          <div className="absolute top-4 right-4 bg-[#102A43]/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 font-medium z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>RÉNOVATION TERMINÉE</span>
          </div>
        </div>

        {/* Layer 2: BEFORE (Degraded, green/troubled water, cracked coping) - Clipped by width */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-0 w-full min-w-full bg-[#3f4a3c] flex items-center justify-center">
            <div className="absolute inset-0 opacity-90">
              <svg className="w-full h-full object-cover" viewBox="0 0 1200 600" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="dirtyWater" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#283618" />
                    <stop offset="50%" stopColor="#606c38" />
                    <stop offset="100%" stopColor="#4a572a" />
                  </linearGradient>
                  <linearGradient id="crackedDeck" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d5bdaf" />
                    <stop offset="100%" stopColor="#b79c88" />
                  </linearGradient>
                </defs>
                {/* Weathered background */}
                <rect width="1200" height="260" fill="#9c8c7c" opacity="0.6" />
                {/* Weathered terracotta deck */}
                <rect y="240" width="1200" height="360" fill="url(#crackedDeck)" />
                {/* Dirty pool */}
                <rect x="180" y="270" width="840" height="290" rx="16" fill="url(#dirtyWater)" stroke="#8d7768" strokeWidth="8" />
                {/* Cracks */}
                <path d="M220 280 L290 340 L340 330 L400 390" fill="none" stroke="#2b2d42" strokeWidth="3" opacity="0.7" />
                <path d="M700 310 L750 380 L800 370 L850 450" fill="none" stroke="#2b2d42" strokeWidth="2.5" opacity="0.7" />
                <path d="M450 490 L520 440 L600 480" fill="none" stroke="#2b2d42" strokeWidth="2" opacity="0.6" />
              </svg>
            </div>

            <div className="absolute top-4 left-4 bg-amber-950/85 backdrop-blur-md text-amber-200 text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 font-medium z-10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>ÉTAT INITIAL DÉGRADÉ</span>
            </div>
          </div>
        </div>

        {/* Divider line & handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-[#102A43] border border-slate-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Description captions */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
          <span>{beforeLabel}</span>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <span className="w-2 h-2 rounded-full bg-[#00B4D8] shrink-0"></span>
          <span>{afterLabel}</span>
        </div>
      </div>
    </div>
  );
};
