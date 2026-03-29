import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, TrendingUp, Users, Bell, Zap, Award, Shield, MessageSquare, 
  CheckCircle2, AlertCircle, Sparkles, Heart, ShoppingCart, Rocket, 
  Target, Lightbulb, Globe, Lock, Unlock, Camera, Music, Video, 
  MapPin, Phone, Mail, Calendar, Clock, Search, Share2, Info, HelpCircle 
} from 'lucide-react';
import { FloatingElement } from '../services/gemini';

export function getIcon(name: string) {
  const icons: Record<string, any> = {
    Star, TrendingUp, Users, Bell, Zap, Award, Shield, MessageSquare, CheckCircle2, AlertCircle, Sparkles,
    Heart, ShoppingCart, Rocket, Target, Lightbulb, Globe, Lock, Unlock, Camera, Music, Video, MapPin, 
    Phone, Mail, Calendar, Clock, Search, Share2, Info, HelpCircle
  };
  const Icon = icons[name] || Bell;
  return <Icon size={12} />;
}

interface FloatingElementsProps {
  elements: FloatingElement[];
  canvasRef: React.RefObject<HTMLDivElement>;
  brand: string;
  onUpdate?: (index: number, updates: Partial<FloatingElement>) => void;
}

export function FloatingElements({ elements, canvasRef, brand, onUpdate }: FloatingElementsProps) {
  if (!elements || elements.length === 0) return null;

  return (
    <>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          drag
          dragConstraints={canvasRef}
          onDragEnd={(_, info) => {
            if (onUpdate && canvasRef.current) {
              const rect = canvasRef.current.getBoundingClientRect();
              const x = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
              const y = Math.max(0, Math.min(100, ((info.point.y - rect.top) / rect.height) * 100));
              onUpdate(i, { x, y });
            }
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: el.opacity ?? 1, 
            scale: (el.size ?? 100) / 100, 
            rotate: el.rotation ?? 0,
            y: 0 
          }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="absolute z-40 cursor-move pointer-events-auto"
          style={{ 
            left: el.x !== undefined ? `${el.x}%` : `${20 + (i * 15)}%`, 
            top: el.y !== undefined ? `${el.y}%` : `${30 + (i * 10)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {el.type === 'notification' && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: brand }}>
                {getIcon(el.icon || 'Bell')}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap">{el.text}</span>
            </div>
          )}
          {el.type === 'badge' && (
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-xl">
              <span className="text-amber-400">{getIcon(el.icon || 'Award')}</span>
              <span className="text-[9px] font-black uppercase italic tracking-tighter text-white whitespace-nowrap">{el.text}</span>
            </div>
          )}
          {el.type === 'review' && (
            <div className="bg-white/95 rounded-xl p-3 shadow-2xl flex flex-col gap-1 max-w-[150px]">
              <div className="flex gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
              </div>
              <p className="text-[9px] text-black font-medium leading-tight italic">"{el.text}"</p>
            </div>
          )}
          {el.type === 'label' && (
            <div className="px-3 py-1 rounded-sm skew-x-[-10deg] shadow-lg" style={{ background: brand }}>
              <span className="inline-block skew-x-[10deg] text-[8px] font-black uppercase text-black whitespace-nowrap">{el.text}</span>
            </div>
          )}
          {el.type === 'icon-only' && (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white">
              {getIcon(el.icon || 'Zap')}
            </div>
          )}
          {el.type === 'stat' && (
            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center shadow-2xl min-w-[80px]">
              <span className="text-[14px] font-black text-white leading-none">{el.text}</span>
              <span className="text-[7px] uppercase tracking-widest text-white/40 mt-1">Total Reach</span>
            </div>
          )}
          {el.type === 'pill' && (
            <div className="bg-white text-black rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xl">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: brand }} />
              <span className="text-[9px] font-bold uppercase tracking-widest">{el.text}</span>
            </div>
          )}
        </motion.div>
      ))}
    </>
  );
}
