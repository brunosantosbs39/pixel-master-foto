import React from 'react';
import { motion } from 'motion/react';
import { cn, contrastColor, hexAlpha, Scanlines, Marquee } from './Common';

export interface LayoutProps {
  copy: any;
  brand: string;
  textOnBrand: string;
  hexAlpha: (hex: string, alpha: number) => string;
  typographySettings: {
    headline: any;
    sub: any;
    content: any;
  };
  buttonColor: string;
  canvasRef: any;
  visibility: {
    headline: boolean;
    sub: boolean;
    bullets: boolean;
    cta: boolean;
    showExpert: boolean;
    showBackground: boolean;
  };
  format: 'square' | 'portrait' | 'vertical';
  setActiveTypoTab?: (tab: 'headline' | 'sub' | 'content') => void;
  scrollToSection?: (id: string) => void;
}

export function LayoutClassic({ copy, brand, textOnBrand, typographySettings, buttonColor, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.7 : format === 'portrait' ? 0.85 : 1;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { letterSpacing: `${headline.spacing}px`, lineHeight: headline.height / 100, fontSize: `clamp(${(24 * headline.size * scale) / 100}px, 8vw, ${(42 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: `${3 + sub.spacing}px`, lineHeight: sub.height / 100, fontSize: `${(9 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: `${content.spacing}px`, lineHeight: content.height / 100, fontSize: `${(9 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col justify-between" style={{ padding }}>
      <div className="space-y-1">
        {visibility.headline && copy.headline.map((line: string, i: number) => (
          <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
            <h2 className="heading-font font-bold uppercase" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
              {line}
            </h2>
          </motion.div>
        ))}
      </div>

      {visibility.sub && (
        <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
          onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
          <p className="uppercase" style={{ ...sStyle, marginTop: '12px' }}>
            {copy.sub}
          </p>
        </motion.div>
      )}

      <div className="space-y-3">
        {visibility.bullets && (
          <div className="flex flex-col gap-2">
            {copy.bullets.map((b: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                <div className="bg-white/[0.04] backdrop-blur-md p-2 rounded-sm inline-block">
                  <div className="flex items-center gap-2 uppercase" style={cStyle}>
                    <span className="w-1 h-1 block shrink-0" style={{ background: brand }} /> {b}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {visibility.cta && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => scrollToSection?.('section-colors')}>
            <button className="w-full py-3.5 font-bold uppercase"
              style={{ ...cStyle, background: buttonColor, color: contrastColor(buttonColor), marginTop: '12px' }}>
              {copy.cta}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function LayoutCentered({ copy, brand, textOnBrand, hexAlpha: ha, typographySettings, buttonColor, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.65 : format === 'portrait' ? 0.8 : 1;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { letterSpacing: `${headline.spacing}px`, lineHeight: headline.height / 100, fontSize: `clamp(${(28 * headline.size * scale) / 100}px, 9vw, ${(48 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: `${5 + sub.spacing}px`, lineHeight: sub.height / 100, fontSize: `${(10 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: `${content.spacing}px`, lineHeight: content.height / 100, fontSize: `${(10 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col items-center justify-center text-center" style={{ padding }}>
      {visibility.sub && (
        <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
          onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
          <p className="uppercase" style={sStyle}>
            {copy.sub}
          </p>
        </motion.div>
      )}
      <div className="space-y-1 mb-3">
        {visibility.headline && copy.headline.map((line: string, i: number) => (
          <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
            <h2 className="heading-font font-bold uppercase" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
              {line}
            </h2>
          </motion.div>
        ))}
      </div>
      {visibility.bullets && (
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {copy.bullets.map((b: string, i: number) => (
            <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
              onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
              <span className="uppercase px-2 py-1 rounded-sm text-white/70"
                style={{ ...cStyle, background: ha(brand, 0.1) }}>
                {b}
              </span>
            </motion.div>
          ))}
        </div>
      )}
      {visibility.cta && (
        <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
          onClick={() => scrollToSection?.('section-colors')}>
          <button className="px-8 py-3 font-bold uppercase"
            style={{ ...cStyle, background: buttonColor, color: contrastColor(buttonColor), marginTop: '12px', fontSize: `${(9 * content.size) / 100}px` }}>
            {copy.cta}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export function LayoutBold({ copy, brand, textOnBrand, hexAlpha: ha, typographySettings, buttonColor, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.7 : format === 'portrait' ? 0.85 : 1;
  const padding = format === 'vertical' ? '15% 8%' : format === 'portrait' ? '12% 8%' : '10% 8%';

  const hStyle = { letterSpacing: `${headline.spacing}px`, lineHeight: headline.height / 100, fontSize: `clamp(${(36 * headline.size * scale) / 100}px, 12vw, ${(64 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: `${2 + sub.spacing}px`, lineHeight: sub.height / 100, fontSize: `${(11 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: `${content.spacing}px`, lineHeight: content.height / 100, fontSize: `${(11 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col justify-end" style={{ padding }}>
      <div className="space-y-0">
        {visibility.headline && copy.headline.map((line: string, i: number) => (
          <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
            <h2 className="heading-font font-black uppercase leading-[0.9]" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
              {line}
            </h2>
          </motion.div>
        ))}
      </div>
      {visibility.sub && (
        <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
          onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
          <p className="uppercase" style={{ ...sStyle, marginTop: '12px' }}>
            {copy.sub}
          </p>
        </motion.div>
      )}
      {visibility.cta && (
        <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
          onClick={() => scrollToSection?.('section-colors')}>
          <button className="w-full py-4 font-bold uppercase"
            style={{ ...cStyle, background: buttonColor, color: contrastColor(buttonColor), marginTop: '12px' }}>
            {copy.cta}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export function LayoutEditorial({ copy, brand, textOnBrand, hexAlpha: ha, typographySettings, buttonColor, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.6 : format === 'portrait' ? 0.75 : 0.9;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { 
    letterSpacing: `${headline.spacing}px`, 
    lineHeight: headline.height / 100, 
    fontSize: `clamp(${(32 * headline.size * scale) / 100}px, 10vw, ${(60 * headline.size * scale) / 100}px)`,
    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
  };
  const sStyle = { 
    color: sub.color, 
    letterSpacing: `${4 + sub.spacing}px`, 
    lineHeight: sub.height / 100, 
    fontSize: `${(9 * sub.size * scale) / 100}px`,
    textShadow: '0 1px 5px rgba(0,0,0,0.3)'
  };
  const cStyle = { 
    color: content.color, 
    letterSpacing: `${content.spacing}px`, 
    lineHeight: content.height / 100, 
    fontSize: `${(11 * content.size * scale) / 100}px`,
    textShadow: '0 1px 5px rgba(0,0,0,0.3)'
  };

  return (
    <div className="relative z-30 h-full w-full flex flex-col justify-between" style={{ padding }}>
      <div className="flex items-start justify-end border-b border-white/10 pb-4">
        {visibility.sub && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
            <div className="uppercase text-right font-black italic" style={sStyle}>{copy.sub}</div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col items-start max-w-[85%] md:max-w-[70%]">
        <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/5 space-y-4">
          {visibility.headline && (
            <div className="flex flex-col gap-1">
              {copy.headline.map((line: string, i: number) => (
                <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                  onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
                  <h2 className="heading-font leading-[0.95] uppercase font-black" 
                    style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
                    {line}
                  </h2>
                </motion.div>
              ))}
            </div>
          )}
          
          {visibility.bullets && (
            <div className="flex flex-col gap-2 pt-2">
              {copy.bullets.map((b: string, i: number) => (
                <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move flex items-center gap-3"
                  onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: brand }} />
                  <div className="uppercase font-medium opacity-80" style={cStyle}>{b}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end items-end">
        {visibility.cta && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => scrollToSection?.('section-colors')}>
            <button className="px-12 py-4 font-black uppercase text-sm tracking-[4px] transition-all hover:scale-105 active:scale-95"
              style={{ background: buttonColor, color: contrastColor(buttonColor), boxShadow: `0 10px 30px ${ha(buttonColor, 0.3)}` }}>
              {copy.cta}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function LayoutSplit({ copy, brand, textOnBrand, typographySettings, buttonColor, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.65 : format === 'portrait' ? 0.8 : 1;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { letterSpacing: `${headline.spacing}px`, lineHeight: headline.height / 100, fontSize: `clamp(${(24 * headline.size * scale) / 100}px, 8vw, ${(48 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: `${4 + sub.spacing}px`, lineHeight: sub.height / 100, fontSize: `${(8 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: `${content.spacing}px`, lineHeight: content.height / 100, fontSize: `${(9 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col" style={{ padding }}>
      <div className="flex-1 flex flex-col justify-center">
        {visibility.sub && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
            <span className="uppercase" style={sStyle}>
              {copy.sub}
            </span>
          </motion.div>
        )}
        <div className="space-y-1 mt-3">
          {visibility.headline && copy.headline.map((line: string, i: number) => (
            <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
              onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
              <h2 className="heading-font font-bold uppercase leading-[1.1]" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
                {line}
              </h2>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {visibility.bullets && (
          <div className="flex flex-col gap-2">
            {copy.bullets.map((b: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                <div className="flex items-center gap-2 uppercase" style={cStyle}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: brand }} /> {b}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {visibility.cta && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => scrollToSection?.('section-colors')}>
            <button className="w-full py-3.5 font-bold uppercase"
              style={{ ...cStyle, background: buttonColor, color: contrastColor(buttonColor), marginTop: '12px' }}>
              {copy.cta}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function LayoutBaseCenter({ copy, brand, textOnBrand, typographySettings, buttonColor, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.7 : format === 'portrait' ? 0.85 : 1;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { letterSpacing: `${headline.spacing}px`, lineHeight: headline.height / 100, fontSize: `clamp(${(24 * headline.size * scale) / 100}px, 8vw, ${(42 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: `${4 + sub.spacing}px`, lineHeight: sub.height / 100, fontSize: `${(9 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: `${content.spacing}px`, lineHeight: content.height / 100, fontSize: `${(9 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col items-center justify-end text-center" style={{ padding }}>
      {visibility.sub && (
        <motion.div drag dragConstraints={canvasRef} className="z-10 flex flex-col items-center w-full cursor-move" style={{ marginBottom: '12px' }}
          onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
          <p className="uppercase" style={sStyle}>
            {copy.sub}
          </p>
        </motion.div>
      )}
      <div className="space-y-1 mb-3 w-full flex flex-col items-center">
        {visibility.headline && copy.headline.map((line: string, i: number) => (
          <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
            <h2 className="heading-font font-bold uppercase leading-[1.1]" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
              {line}
            </h2>
          </motion.div>
        ))}
      </div>
      {visibility.bullets && (
        <div className="flex justify-center flex-wrap gap-4 mb-3">
          {copy.bullets.map((b: string, i: number) => (
            <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
              onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
              <span className="flex items-center gap-1.5 uppercase text-white/60"
                style={cStyle}>
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: brand }} />
                {b}
              </span>
            </motion.div>
          ))}
        </div>
      )}
      {visibility.cta && (
        <motion.div drag dragConstraints={canvasRef} className="z-10 w-full cursor-move"
          onClick={() => scrollToSection?.('section-colors')}>
          <button className="w-full py-3.5 font-bold uppercase"
            style={{ ...cStyle, background: buttonColor, color: contrastColor(buttonColor), marginTop: '12px', fontSize: `${(9 * content.size) / 100}px` }}>
            {copy.cta}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export function LayoutMinimal({ copy, brand, textOnBrand, typographySettings, buttonColor, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.7 : format === 'portrait' ? 0.85 : 1;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { letterSpacing: `${headline.spacing}px`, lineHeight: headline.height / 100, fontSize: `clamp(${(24 * headline.size * scale) / 100}px, 8vw, ${(42 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: `${5 + sub.spacing}px`, lineHeight: sub.height / 100, fontSize: `${(8 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: `${content.spacing}px`, lineHeight: content.height / 100, fontSize: `${(9 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col justify-center items-start" style={{ padding }}>
      <div className="space-y-8">
        <div className="space-y-4">
          {visibility.sub && (
            <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
              onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
              <p className="uppercase opacity-50" style={sStyle}>{copy.sub}</p>
            </motion.div>
          )}
          {visibility.headline && (
            <div className="space-y-1">
              {copy.headline.map((line: string, i: number) => (
                <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                  onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
                  <h2 className="heading-font font-light uppercase leading-[1.1]" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
                    {line}
                  </h2>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move">
          <div className="w-12 h-[1px] bg-white/20" />
        </motion.div>
        {visibility.bullets && (
          <div className="space-y-3">
            {copy.bullets.map((b: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                <div className="uppercase opacity-70" style={cStyle}>{b}</div>
              </motion.div>
            ))}
          </div>
        )}
        {visibility.cta && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => scrollToSection?.('section-colors')}>
            <button className="px-10 py-3 rounded-full text-[10px] tracking-[3px] font-bold uppercase transition-all hover:scale-105"
              style={{ ...cStyle, background: buttonColor, color: contrastColor(buttonColor) }}>
              {copy.cta}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function LayoutBrutalist({ copy, brand, textOnBrand, typographySettings, buttonColor, hexAlpha: ha, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.65 : format === 'portrait' ? 0.8 : 1;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { letterSpacing: `${headline.spacing}px`, lineHeight: 0.9, fontSize: `clamp(${(32 * headline.size * scale) / 100}px, 10vw, ${(64 * headline.size * scale) / 100}px)` };
  const sStyle = { color: '#000', letterSpacing: `${2 + sub.spacing}px`, lineHeight: sub.height / 100, fontSize: `${(10 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: `${content.spacing}px`, lineHeight: content.height / 100, fontSize: `${(10 * content.size * scale) / 100}px` };

  const marqueeSize = format === 'vertical' ? 'text-[80px]' : format === 'portrait' ? 'text-[100px]' : 'text-[120px]';

  return (
    <div className="relative z-30 h-full w-full flex flex-col justify-between overflow-hidden" style={{ padding }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 w-[150%] opacity-[0.03] pointer-events-none">
        <Marquee text={copy.headline[0].toUpperCase()} speed={15} className={cn("font-black", marqueeSize)} />
        <Marquee text={copy.headline[1].toUpperCase()} speed={20} className={cn("font-black", marqueeSize)} />
        <Marquee text={copy.headline[2].toUpperCase()} speed={18} className={cn("font-black", marqueeSize)} />
      </div>

      <div className="space-y-4">
        {visibility.sub && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 inline-block px-4 py-1 skew-x-[-12deg] cursor-move" style={{ background: brand }}
            onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
            <p className="uppercase font-black italic" style={sStyle}>{copy.sub}</p>
          </motion.div>
        )}
        <div className="flex flex-col gap-2">
          {visibility.headline && copy.headline.map((line: string, i: number) => (
            <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
              onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
              <h2 className="heading-font font-black uppercase break-words" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
                {i === 1 ? (
                  <span className="px-2" style={{ background: headline.color2, color: contrastColor(headline.color2) }}>{line}</span>
                ) : line}
              </h2>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {visibility.bullets && (
          <div className="flex flex-col gap-3">
            {copy.bullets.map((b: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                <div className="border-l-4 p-4 bg-black/40 backdrop-blur-sm" style={{ borderColor: brand }}>
                  <div className="uppercase font-bold" style={cStyle}>// {b}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {visibility.cta && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => scrollToSection?.('section-colors')}>
            <button className="w-full py-5 font-black uppercase text-xl border-4 active:translate-x-1 active:translate-y-1 transition-transform"
              style={{ background: buttonColor, color: contrastColor(buttonColor), borderColor: ha(buttonColor, 0.5) }}>
              {copy.cta}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function LayoutMagazine({ copy, brand, textOnBrand, typographySettings, buttonColor, hexAlpha: ha, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.7 : format === 'portrait' ? 0.85 : 1;
  const padding = format === 'vertical' ? '12% 8%' : format === 'portrait' ? '10% 8%' : '8%';

  const hStyle = { letterSpacing: '-0.04em', lineHeight: 0.85, fontSize: `clamp(${(32 * headline.size * scale) / 100}px, 12vw, ${(64 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: `${4 + sub.spacing}px`, lineHeight: sub.height / 100, fontSize: `${(8 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: `${content.spacing}px`, lineHeight: content.height / 100, fontSize: `${(9 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full" style={{ padding }}>
      <div className="h-full flex flex-col justify-between relative z-10">
        {visibility.sub && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 flex justify-between items-start border-b border-white/10 pb-4 cursor-move"
            onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
            <p className="uppercase font-bold" style={sStyle}>{copy.sub}</p>
          </motion.div>
        )}

        {visibility.headline && (
          <div className="max-w-[80%] flex flex-col gap-1">
            {copy.headline.map((line: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
                <h2 className="heading-font font-black uppercase italic" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
                  {line}
                </h2>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-end">
          {visibility.bullets && (
            <div className="flex flex-col gap-1">
              {copy.bullets.map((b: string, i: number) => (
                <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                  onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                  <div className="uppercase opacity-60" style={cStyle}>• {b}</div>
                </motion.div>
              ))}
            </div>
          )}
          {visibility.cta && (
            <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
              onClick={() => scrollToSection?.('section-colors')}>
              <button className="px-12 py-4 font-bold uppercase skew-x-[-10deg]"
                style={{ background: buttonColor, color: contrastColor(buttonColor) }}>
                <span className="inline-block skew-x-[10deg]">{copy.cta}</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LayoutAtmospheric({ copy, brand, textOnBrand, typographySettings, buttonColor, hexAlpha: ha, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.7 : format === 'portrait' ? 0.85 : 1;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { letterSpacing: '-0.02em', lineHeight: 1.1, fontSize: `clamp(${(24 * headline.size * scale) / 100}px, 8vw, ${(48 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: '0.2em', lineHeight: sub.height / 100, fontSize: `${(9 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: '0.05em', lineHeight: content.height / 100, fontSize: `${(9 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col justify-center items-center text-center overflow-hidden" style={{ padding }}>
      <div className="absolute inset-0 z-[-1] opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[80px]" style={{ background: `radial-gradient(circle, ${brand} 0%, transparent 70%)` }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[60px]" style={{ background: `radial-gradient(circle, ${brand} 0%, transparent 70%)` }} />
      </div>

      <div className="glass-morphism p-8 rounded-[40px] border border-white/10 backdrop-blur-2xl bg-white/5 shadow-2xl space-y-6">
        {visibility.sub && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 cursor-move"
            onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
            <p className="uppercase font-medium opacity-60" style={sStyle}>{copy.sub}</p>
          </motion.div>
        )}
        
        {visibility.headline && (
          <div className="flex flex-col gap-1">
            {copy.headline.map((line: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
                <h2 className={cn("heading-font", i === 1 ? "font-bold not-italic" : "font-light italic")} 
                  style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
                  {line}
                </h2>
              </motion.div>
            ))}
          </div>
        )}

        {visibility.bullets && (
          <div className="flex flex-wrap justify-center gap-4">
            {copy.bullets.map((b: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                <span className="text-[10px] uppercase tracking-widest opacity-40" style={cStyle}>
                  {b}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {visibility.cta && (
          <motion.div drag dragConstraints={canvasRef} className="z-10 pt-4 cursor-move"
            onClick={() => scrollToSection?.('section-colors')}>
            <button className="px-10 py-3.5 rounded-full font-bold uppercase tracking-[4px] transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              style={{ background: buttonColor, color: contrastColor(buttonColor) }}>
              {copy.cta}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function LayoutHardware({ copy, brand, textOnBrand, typographySettings, buttonColor, hexAlpha: ha, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.7 : format === 'portrait' ? 0.85 : 1;
  const padding = format === 'vertical' ? '12% 8%' : format === 'portrait' ? '10% 8%' : '8%';

  const hStyle = { letterSpacing: '-0.02em', lineHeight: 1, fontSize: `clamp(${(24 * headline.size * scale) / 100}px, 8vw, ${(42 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: '0.1em', lineHeight: sub.height / 100, fontSize: `${(9 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: '0.05em', lineHeight: content.height / 100, fontSize: `${(8 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col justify-between font-mono" style={{ padding }}>
      <Scanlines />
      <div className="flex justify-end items-start border-b border-white/20 pb-4">
        {visibility.sub && (
          <motion.div drag dragConstraints={canvasRef} className="text-right cursor-move"
            onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
            <div className="text-[10px] font-bold uppercase" style={sStyle}>{copy.sub}</div>
          </motion.div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8">
        {visibility.headline && (
          <div className="border-l-2 pl-6 flex flex-col gap-1" style={{ borderColor: brand }}>
            {copy.headline.map((line: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
                <h2 className="heading-font font-bold uppercase" style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
                  {line}
                </h2>
              </motion.div>
            ))}
          </div>
        )}

        {visibility.bullets && (
          <div className="grid grid-cols-2 gap-4">
            {copy.bullets.map((b: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                <div className="border border-white/10 p-3 bg-white/5 rounded-sm">
                  <div className="text-[9px] uppercase font-medium" style={cStyle}>{b}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {visibility.cta && (
        <motion.div drag dragConstraints={canvasRef} className="border-t border-white/20 pt-6 flex justify-end items-center cursor-move"
          onClick={() => scrollToSection?.('section-colors')}>
          <button className="px-8 py-3 font-bold uppercase border border-white/20 hover:bg-white hover:text-black transition-all"
            style={{ background: ha(buttonColor, 0.1), color: buttonColor, borderColor: ha(buttonColor, 0.3) }}>
            {copy.cta}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export function LayoutLuxury({ copy, brand, textOnBrand, typographySettings, buttonColor, hexAlpha: ha, canvasRef, visibility, format, setActiveTypoTab, scrollToSection }: LayoutProps) {
  const { headline, sub, content } = typographySettings;
  
  const scale = format === 'vertical' ? 0.7 : format === 'portrait' ? 0.85 : 1;
  const padding = format === 'vertical' ? '15% 10%' : format === 'portrait' ? '12% 10%' : '10%';

  const hStyle = { letterSpacing: '-0.02em', lineHeight: 0.9, fontSize: `clamp(${(28 * headline.size * scale) / 100}px, 10vw, ${(56 * headline.size * scale) / 100}px)` };
  const sStyle = { color: sub.color, letterSpacing: '0.4em', lineHeight: sub.height / 100, fontSize: `${(8 * sub.size * scale) / 100}px` };
  const cStyle = { color: content.color, letterSpacing: '0.1em', lineHeight: content.height / 100, fontSize: `${(9 * content.size * scale) / 100}px` };

  return (
    <div className="relative z-30 h-full w-full flex flex-col justify-between" style={{ padding }}>
      <div className="flex justify-between items-start">
        <div className="w-px h-24 bg-white/20" />
        {visibility.sub && (
          <motion.div drag dragConstraints={canvasRef} className="text-right cursor-move"
            onClick={() => { setActiveTypoTab?.('sub'); scrollToSection?.('section-text-adjustments'); }}>
            <p className="uppercase font-light" style={sStyle}>{copy.sub}</p>
          </motion.div>
        )}
      </div>

      <div className="space-y-6">
        {visibility.headline && (
          <div className="flex flex-col gap-1">
            {copy.headline.map((line: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('headline'); scrollToSection?.('section-text-adjustments'); }}>
                <h2 className={cn("heading-font", i === 1 ? "font-bold italic" : "font-light")} 
                  style={{ ...hStyle, color: i === 0 ? headline.color : i === 1 ? headline.color2 : headline.color3 }}>
                  {line}
                </h2>
              </motion.div>
            ))}
          </div>
        )}

        <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />

        {visibility.bullets && (
          <div className="flex gap-8">
            {copy.bullets.map((b: string, i: number) => (
              <motion.div key={i} drag dragConstraints={canvasRef} className="z-10 cursor-move"
                onClick={() => { setActiveTypoTab?.('content'); scrollToSection?.('section-text-adjustments'); }}>
                <div className="flex flex-col gap-1">
                  <span className="uppercase font-medium" style={cStyle}>{b}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {visibility.cta && (
        <motion.div drag dragConstraints={canvasRef} className="flex justify-center cursor-move"
          onClick={() => scrollToSection?.('section-colors')}>
          <button className="group relative px-16 py-4 overflow-hidden transition-all"
            style={{ color: contrastColor(buttonColor) }}>
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{ background: buttonColor }} />
            <span className="relative z-10 font-bold uppercase tracking-[6px] text-[10px]">{copy.cta}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}

export const LAYOUT_COMPONENTS: Record<string, any> = {
  classic:    LayoutClassic,
  centered:   LayoutCentered,
  bold:       LayoutBold,
  editorial:  LayoutEditorial,
  split:      LayoutSplit,
  basecenter: LayoutBaseCenter,
  minimal:    LayoutMinimal,
  brutalist:  LayoutBrutalist,
  magazine:   LayoutMagazine,
  atmospheric: LayoutAtmospheric,
  hardware:   LayoutHardware,
  luxury:     LayoutLuxury,
};
