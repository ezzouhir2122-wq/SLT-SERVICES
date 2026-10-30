import React, { useState, useRef, useCallback } from 'react';

interface InteractiveBeforeAfterProps {
  title?: string;
  subtitle?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeImage?: string;
  afterImage?: string;
}

const DEFAULT_BEFORE = '/assets/pool-before.png';
const DEFAULT_AFTER = '/assets/pool-hero.png';

export const InteractiveBeforeAfter: React.FC<InteractiveBeforeAfterProps> = ({
  title = 'Votre piscine : avant / après',
  subtitle = 'Faites glisser le curseur pour découvrir une illustration de transformation de piscine.',
  beforeLabel = 'Avant : bassin en construction',
  afterLabel = 'Après : piscine aménagée',
  beforeImage = DEFAULT_BEFORE,
  afterImage = DEFAULT_AFTER
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
        {/* Layer 1: AFTER (rénovation terminée) */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt="Après travaux"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-4 right-4 bg-[#102A43]/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 font-medium z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{afterLabel}</span>
          </div>
        </div>

        {/* Layer 2: BEFORE (état initial) - clipped via clip-path */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt="Avant travaux"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-slate-900/20" />
          <div className="absolute top-4 left-4 bg-amber-950/85 backdrop-blur-md text-amber-200 text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 font-medium z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>{beforeLabel}</span>
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
