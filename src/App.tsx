import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';
import { Sparkles, Download, Image as ImageIcon, Eye, EyeOff, Trash2, AlertCircle, Upload, CheckCircle2, RefreshCcw, Star, TrendingUp, Users, Bell, Zap, Award, Shield, MessageSquare, X, Heart, ShoppingCart, Rocket, Target, Lightbulb, Globe, Lock, Unlock, Camera, Music, Video, MapPin, Phone, Mail, Calendar, Clock, Search, Menu, Settings, MoreHorizontal, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Plus, Minus, Filter, Share2, ExternalLink, Copy, Check, Info, HelpCircle, BookOpen, Layers, Combine, Undo2, Redo2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { geminiService, CreativeCopy, BrandIdentity, FloatingElement } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cn, contrastColor, hexAlpha, getComplementaryColor, getAnalogousColors, Noise, Scanlines, Marquee } from './components/Common';
import { LAYOUT_COMPONENTS, LayoutProps } from './components/Layouts';
import { FloatingElements, getIcon } from './components/FloatingElements';

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const PRESETS = [
  { label: 'Dourado Elite',      color: '#C5A370' },
  { label: 'Azul Corporativo',   color: '#1A56DB' },
  { label: 'Verde Emerald',      color: '#059669' },
  { label: 'Vermelho Prestígio', color: '#DC2626' },
  { label: 'Roxo Premium',       color: '#7C3AED' },
  { label: 'Branco Luxo',        color: '#F5F5F5' },
];

const TYPOGRAPHY_PAIRS = [
  {
    id: 'cormorant', label: 'Autoridade Clássica',
    heading: 'Cormorant Garamond', body: 'Inter',
    google: 'Cormorant+Garamond:ital,wght@0,600;1,600&family=Inter:wght@400;700',
    italic: true,
  },
  {
    id: 'luxury', label: 'Prestigio Real',
    heading: 'Montserrat', body: 'Cormorant Garamond',
    google: 'Montserrat:wght@300;600&family=Cormorant+Garamond:ital,wght@0,400;1,400',
    italic: false,
  },
  {
    id: 'hardware', label: 'Hardware Studio',
    heading: 'JetBrains Mono', body: 'Inter',
    google: 'JetBrains+Mono:wght@400;700&family=Inter:wght@400;700',
    italic: false,
  },
  {
    id: 'brutal', label: 'Brutalismo Puro',
    heading: 'Anton', body: 'Inter',
    google: 'Anton&family=Inter:wght@400;700',
    italic: false,
  },
  {
    id: 'editorial-bold', label: 'Editorial Bold',
    heading: 'Libre Baskerville', body: 'Inter',
    google: 'Libre+Baskerville:ital,wght@0,700;1,700&family=Inter:wght@400;700',
    italic: true,
  },
  {
    id: 'playfair', label: 'Luxo Editorial',
    heading: 'Playfair Display', body: 'Lato',
    google: 'Playfair+Display:ital,wght@0,700;1,700&family=Lato:wght@400;700',
    italic: true,
  },
  {
    id: 'space', label: 'Tech Moderno',
    heading: 'Space Grotesk', body: 'Inter',
    google: 'Space+Grotesk:wght@600;700&family=Inter:wght@400;700',
    italic: false,
  },
  {
    id: 'oswald', label: 'Bold Impact',
    heading: 'Oswald', body: 'Open Sans',
    google: 'Oswald:wght@600;700&family=Open+Sans:wght@400;700',
    italic: false,
  },
  {
    id: 'dm', label: 'Sofisticado',
    heading: 'DM Serif Display', body: 'DM Sans',
    google: 'DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;700',
    italic: true,
  },
  {
    id: 'bebas', label: 'Disruptivo',
    heading: 'Bebas Neue', body: 'Roboto',
    google: 'Bebas+Neue&family=Roboto:wght@400;700',
    italic: false,
  },
];

const LAYOUTS = [
  { id: 'classic',    label: 'Classic',   desc: 'Headline topo · CTA base' },
  { id: 'centered',  label: 'Centered',  desc: 'Conteúdo centralizado' },
  { id: 'bold',      label: 'Bold',      desc: 'Headline dominante' },
  { id: 'editorial', label: 'Editorial', desc: 'Estilo revista' },
  { id: 'split',     label: 'Split',     desc: 'Divisão horizontal' },
  { id: 'basecenter',label: 'Base',      desc: 'Texto centro + base' },
  { id: 'minimal',   label: 'Minimal',   desc: 'Foco no essencial' },
  { id: 'brutalist', label: 'Brutalist', desc: 'Impacto e contraste' },
  { id: 'magazine',  label: 'Magazine',  desc: 'Editorial dinâmico' },
  { id: 'atmospheric', label: 'Atmospheric', desc: 'Imersivo e etéreo' },
  { id: 'hardware',  label: 'Hardware',  desc: 'Técnico e industrial' },
  { id: 'luxury',    label: 'Luxury',    desc: 'Exclusivo e refinado' },
];

const FRAMEWORKS: Record<string, any> = {
  AIDA: {
    headline: ['Construa uma', 'Presença de Elite', 'no Digital.'],
    sub: 'Para mentores e estrategistas',
    bullets: ['Posicionamento Premium', 'Criativos de Alta Conversão'],
    cta: 'Toque para Saiba Mais',
    insight: '"Atenção concentrada na Headline superior. Contraste do dourado garante 84% de legibilidade no mobile."',
    floatingElements: [
      { type: 'notification', text: '5.0 (2.5k avaliações)', icon: 'Star' },
      { type: 'badge', text: 'Best Seller 2024', icon: 'Award' }
    ]
  },
  PAS: {
    headline: ['Chega de', 'Campanhas que', 'Não Convertem.'],
    sub: 'Identifique e elimine o problema',
    bullets: ['Diagnóstico de Funil Grátis', 'Estratégia Aplicada em 7 Dias'],
    cta: 'Quero Resolver Agora',
    insight: '"Copy de dor no topo gera 2x mais cliques em audiências frias. Headline impacta 73% da decisão."',
    floatingElements: [
      { type: 'notification', text: 'Vagas Limitadas!', icon: 'Bell' },
      { type: 'label', text: 'Oportunidade Única' }
    ]
  },
  '4Ps': {
    headline: ['A Promessa que', 'Transforma seu', 'Negócio Digital.'],
    sub: 'Resultados comprovados em 90 dias',
    bullets: ['Método Validado com +500 Alunos', 'Garantia ou Reembolso'],
    cta: 'Garantir Minha Vaga',
    insight: '"Promessa específica com prova social aumenta conversão em até 3x para produtos premium."',
    floatingElements: [
      { type: 'review', text: 'O melhor investimento que já fiz no meu negócio!' },
      { type: 'notification', text: '+500 Alunos', icon: 'Users' }
    ]
  },
};

const dimensions: Record<string, any> = {
  square:   { display: '1080x1080', maxW: 'max-w-[420px]', aspect: 'aspect-square' },
  portrait: { display: '1080x1350', maxW: 'max-w-[380px]', aspect: 'aspect-[4/5]' },
  vertical: { display: '1080x1920', maxW: 'max-w-[300px]', aspect: 'aspect-[9/16]' },
};

// ── LAYOUT COMPONENTS ──────────────────────────────────────────────────────

// Layout components are now imported from ./components/Layouts













interface HistoryState {
  format: string;
  framework: string;
  layout: string;
  typography: any;
  brandColor: string;
  buttonColor: string | null;
  headlineSettings: any;
  subSettings: any;
  contentSettings: any;
  vignetteOpacity: number;
  vignetteColor: string;
  vignetteDirection: string;
  bgTextOpacity: number;
  bgText: string | null;
  atmosphereOpacity: number;
  atmosphereBlur: number;
  expertFade: number;
  expertScale: number;
  bgTextScale: number;
  showHeadline: boolean;
  showSub: boolean;
  showBullets: boolean;
  showCTA: boolean;
  showExpert: boolean;
  showBackground: boolean;
  aiBgImage: string | null;
  generatedBg: string | null;
  personImage: string | null;
  generatedCopy: CreativeCopy | null;
}

// ── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────

export default function PixelMaster() {
  const [format, setFormat]             = useState('portrait');
  const [framework, setFramework]       = useState('AIDA');
  const [layout, setLayout]             = useState('editorial');
  const [typography, setTypography]     = useState(TYPOGRAPHY_PAIRS[1]);
  const [subjectImage, setSubjectImage] = useState<string | null>('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800');
  const [contrast, setContrast]         = useState(80);
  const [bokeh, setBokeh]               = useState(45);
  const [generating, setGenerating]     = useState(false);
  const [identifying, setIdentifying]   = useState(false);
  const [genError, setGenError]         = useState<string | null>(null);
  const [downloading, setDownloading]   = useState(false);
  const [exportingVideo, setExportingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [dragOver, setDragOver]         = useState(false);
  const [brandColor, setBrandColor]     = useState('#E0AA66');
  const [produto, setProduto]           = useState('PixelMaster AI');
  const [publico, setPublico]           = useState('Mentores e Estrategistas');
  const [generatedCopy, setGeneratedCopy] = useState<CreativeCopy | null>(null);
  const [generatedBg, setGeneratedBg]   = useState<string | null>(null);
  const [brandArchetype, setBrandArchetype] = useState<BrandIdentity | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [brandingBookImage, setBrandingBookImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing]           = useState(false);
  const [analyzingBranding, setAnalyzingBranding] = useState(false);
  const [personImage, setPersonImage]   = useState<string | null>('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800');
  const [removingBg, setRemovingBg]     = useState(false);
  const [aiBgImage, setAiBgImage]       = useState<string | null>(null);
  const [bgHistory, setBgHistory]       = useState<string[]>([]);
  const [bgRemovedEnabled, setBgRemovedEnabled] = useState(true);
  const [showHeadline, setShowHeadline]     = useState(true);
  const [showSub, setShowSub]               = useState(true);
  const [showBullets, setShowBullets]       = useState(true);
  const [showCTA, setShowCTA]               = useState(true);
  const [showExpert, setShowExpert]         = useState(true);
  const [showBackground, setShowBackground] = useState(true);

  // Typography Adjustments
  const [headlineSettings, setHeadlineSettings] = useState({ size: 100, spacing: 0, height: 110, color: '#ffffff', color2: '#E0AA66', color3: '#ffffff' });
  const [subSettings, setSubSettings]           = useState({ size: 100, spacing: 0, height: 110, color: 'rgba(255,255,255,0.4)' });
  const [contentSettings, setContentSettings]   = useState({ size: 100, spacing: 0, height: 110, color: 'rgba(255,255,255,0.7)' });
  const [activeTypoTab, setActiveTypoTab] = useState<'headline' | 'sub' | 'content'>('headline');

  // Individual Element Adjustments
  const [buttonColor, setButtonColor]       = useState<string | null>('#4CAF50');
  const [vignetteOpacity, setVignetteOpacity] = useState(0.8);
  const [vignetteColor, setVignetteColor]     = useState('#000000');
  const [vignetteDirection, setVignetteDirection] = useState<'left' | 'right' | 'top' | 'bottom' | 'radial' | 'classic'>('classic');
  const [bgTextOpacity, setBgTextOpacity]     = useState(0.1);
  const [bgText, setBgText]                   = useState<string | null>(null);
  const [atmosphereOpacity, setAtmosphereOpacity] = useState(0.2);
  const [atmosphereBlur, setAtmosphereBlur]       = useState(100);
  const [expertKey, setExpertKey]             = useState(0);
  const [expertFade, setExpertFade]           = useState(30);
  const [expertScale, setExpertScale]         = useState(100);
  const [bgTextScale, setBgTextScale]         = useState(100);
  const [visualElementsPrompt, setVisualElementsPrompt] = useState('');
  const [enhancing, setEnhancing]           = useState(false);
  const [bgVariations, setBgVariations]     = useState<string[]>([]);
  const [generatingVariations, setGeneratingVariations] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState<number[]>([]);
  const [blending, setBlending]             = useState(false);

  // History for Undo/Redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryState[]>([]);
  const [isHistoryAction, setIsHistoryAction] = useState(false);

  const getCurrentState = useCallback((): HistoryState => ({
    format, framework, layout, typography, brandColor, buttonColor,
    headlineSettings, subSettings, contentSettings,
    vignetteOpacity, vignetteColor, vignetteDirection,
    bgTextOpacity, bgText, atmosphereOpacity, atmosphereBlur, expertFade,
    expertScale, bgTextScale,
    showHeadline, showSub, showBullets, showCTA, showExpert, showBackground,
    aiBgImage, generatedBg, personImage,
    generatedCopy
  }), [
    format, framework, layout, typography, brandColor, buttonColor,
    headlineSettings, subSettings, contentSettings,
    vignetteOpacity, vignetteColor, vignetteDirection,
    bgTextOpacity, bgText, atmosphereOpacity, atmosphereBlur, expertFade,
    expertScale, bgTextScale,
    showHeadline, showSub, showBullets, showCTA, showExpert, showBackground,
    aiBgImage, generatedBg, personImage,
    generatedCopy
  ]);

  const saveToHistory = useCallback(() => {
    if (isHistoryAction) return;
    const currentState = getCurrentState();
    setHistory(prev => {
      // Don't save if it's the same as the last state
      if (prev.length > 0 && JSON.stringify(prev[prev.length - 1]) === JSON.stringify(currentState)) {
        return prev;
      }
      const newHistory = [...prev, currentState];
      if (newHistory.length > 50) newHistory.shift(); // Limit history
      return newHistory;
    });
    setRedoStack([]);
  }, [getCurrentState, isHistoryAction]);

  const applyState = (state: HistoryState) => {
    setIsHistoryAction(true);
    setFormat(state.format);
    setFramework(state.framework);
    setLayout(state.layout);
    setTypography(state.typography);
    setBrandColor(state.brandColor);
    setButtonColor(state.buttonColor);
    setHeadlineSettings(state.headlineSettings);
    setSubSettings(state.subSettings);
    setContentSettings(state.contentSettings);
    setVignetteOpacity(state.vignetteOpacity);
    setVignetteColor(state.vignetteColor);
    setVignetteDirection(state.vignetteDirection);
    setBgTextOpacity(state.bgTextOpacity);
    setBgText(state.bgText);
    setAtmosphereOpacity(state.atmosphereOpacity);
    setAtmosphereBlur(state.atmosphereBlur);
    setExpertFade(state.expertFade);
    setExpertScale(state.expertScale || 100);
    setBgTextScale(state.bgTextScale || 100);
    setShowHeadline(state.showHeadline);
    setShowSub(state.showSub);
    setShowBullets(state.showBullets);
    setShowCTA(state.showCTA);
    setShowExpert(state.showExpert);
    setShowBackground(state.showBackground);
    setAiBgImage(state.aiBgImage);
    setGeneratedBg(state.generatedBg);
    setPersonImage(state.personImage);
    setGeneratedCopy(state.generatedCopy);
    setTimeout(() => setIsHistoryAction(false), 100);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const currentState = getCurrentState();
    const newHistory = [...history];
    const prevState = newHistory.pop()!;
    
    // If we are at the very end, we need to save the current state to redo stack first
    setRedoStack(prev => [currentState, ...prev]);
    setHistory(newHistory);
    applyState(newHistory[newHistory.length - 1]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.shift()!;
    
    setHistory(prev => [...prev, nextState]);
    setRedoStack(newRedoStack);
    applyState(nextState);
  };

  // Complementary Palette
  const complementaryPalette = useMemo(() => {
    const comp = getComplementaryColor(brandColor);
    const analogous = getAnalogousColors(brandColor);
    return {
      primary: brandColor,
      complementary: comp,
      analogous1: analogous[0],
      analogous2: analogous[1],
      accent: contrastColor(brandColor) === '#000000' ? hexAlpha(brandColor, 0.8) : hexAlpha(brandColor, 0.2)
    };
  }, [brandColor]);

  // Save initial state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([getCurrentState()]);
    }
  }, []);

  // Copyright Check State
  const [copyrightRisk, setCopyrightRisk] = useState<{ risk: 'low' | 'medium' | 'high'; details: string } | null>(null);
  const [checkingCopyright, setCheckingCopyright] = useState(false);

  const handleCheckCopyright = async () => {
    const currentBg = aiBgImage || generatedBg;
    if (!currentBg) return;
    
    setCheckingCopyright(true);
    try {
      const mimeType = currentBg.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
      const result = await geminiService.checkCopyright(currentBg, mimeType);
      setCopyrightRisk(result);
    } catch (err) {
      console.error('Copyright check failed:', err);
    }
    setCheckingCopyright(false);
  };

  // Debounced history saving
  useEffect(() => {
    if (isHistoryAction) return;
    
    const timer = setTimeout(() => {
      saveToHistory();
    }, 1000); // Save state after 1s of inactivity
    
    return () => clearTimeout(timer);
  }, [
    format, framework, layout, typography, brandColor, buttonColor,
    headlineSettings, subSettings, contentSettings,
    vignetteOpacity, vignetteColor, vignetteDirection,
    bgTextOpacity, bgText, atmosphereOpacity, atmosphereBlur, expertFade,
    expertScale, bgTextScale,
    showHeadline, showSub, showBullets, showCTA, showExpert, showBackground,
    aiBgImage, generatedBg, personImage, generatedCopy,
    saveToHistory, isHistoryAction
  ]);

  const canvasRef        = useRef<HTMLDivElement>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const colorInputRef    = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const brandingInputRef  = useRef<HTMLInputElement>(null);

  const copy        = generatedCopy || FRAMEWORKS[framework];
  const textOnBrand = useMemo(() => contrastColor(brandColor), [brandColor]);
  const CanvasLayout = LAYOUT_COMPONENTS[layout];

  const handleFile = useCallback(async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => setSubjectImage(e.target?.result as string);
    reader.readAsDataURL(file);
    
    setPersonImage(null);
    setRemovingBg(true);
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(file);
      const url = URL.createObjectURL(blob);
      setPersonImage(url);
    } catch (err) {
      console.error('BG removal failed:', err);
    }
    setRemovingBg(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleGenerate = async () => {
    if (!produto.trim() || !publico.trim()) {
      setGenError('Preencha o produto e o público-alvo.');
      return;
    }
    setGenError(null);
    setGenerating(true);
    try {
      // Automate brand identity if not yet set
      if (!brandArchetype) {
        const brandData = await geminiService.identifyBrand(produto, publico);
        setBrandArchetype(brandData);
        if (brandData.brandColor) setBrandColor(brandData.brandColor);
        const typo = TYPOGRAPHY_PAIRS.find(t => t.id === brandData.typography);
        if (typo) setTypography(typo);
        if (LAYOUT_COMPONENTS[brandData.layout]) setLayout(brandData.layout);
      }

      const copyData = await geminiService.generateCopy(framework, produto, publico, brandArchetype || undefined);
      setGeneratedCopy(copyData);

      // Try Gemini image generation
      const aiImg = await geminiService.generateImage(copyData.keyword);
      if (aiImg) {
        setAiBgImage(aiImg);
        setGeneratedBg(null);
        setBgVariations([]); // Clear variations on new main image
      } else {
        // Fallback to Unsplash
        const unsplashKey = import.meta.env.VITE_UNSPLASH_KEY;
        if (unsplashKey && copyData.keyword) {
          const orientation = format === 'square' ? 'squarish' : 'portrait';
          const imgRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(copyData.keyword)}&per_page=3&orientation=${orientation}`,
            { headers: { Authorization: `Client-ID ${unsplashKey}` } }
          );
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            const results = imgData.results;
            if (results?.length) {
              const pick = results[Math.floor(Math.random() * Math.min(results.length, 3))];
              setGeneratedBg(pick.urls.regular);
              setAiBgImage(null);
            }
          }
        }
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [brandColor, '#ffffff', '#000000']
      });
      
    } catch (err: any) {
      setGenError(err.message);
    }
    setGenerating(false);
  };

  const handleIdentifyBrand = async () => {
    if (!produto.trim() || !publico.trim()) {
      setGenError('Preencha produto e público para identificar a marca.');
      return;
    }
    setGenError(null);
    setIdentifying(true);
    try {
      const data = await geminiService.identifyBrand(produto, publico);
      setBrandArchetype(data);
      if (data.brandColor) setBrandColor(data.brandColor);
    } catch (err: any) {
      setGenError(err.message);
    }
    setIdentifying(false);
  };

  const handleEnhanceBackground = async () => {
    const currentBg = aiBgImage || generatedBg;
    if (!currentBg || !visualElementsPrompt.trim()) return;
    
    setEnhancing(true);
    try {
      // Store current in history before enhancing
      setBgHistory(prev => [...prev, currentBg]);
      
      // Determine mime type
      const mimeType = currentBg.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
      const enhanced = await geminiService.enhanceImage(currentBg, mimeType, visualElementsPrompt);
      if (enhanced) {
        setAiBgImage(enhanced);
        setGeneratedBg(null);
        setVisualElementsPrompt('');
      }
    } catch (err) {
      console.error('Enhancement failed:', err);
    }
    setEnhancing(false);
  };

  const undoBackground = () => {
    if (bgHistory.length === 0) return;
    const previous = bgHistory[bgHistory.length - 1];
    setBgHistory(prev => prev.slice(0, -1));
    if (previous.startsWith('data:image')) {
      setAiBgImage(previous);
      setGeneratedBg(null);
    } else {
      setGeneratedBg(previous);
      setAiBgImage(null);
    }
  };

  const handleGenerateVariations = async () => {
    const prompt = copy?.keyword || visualElementsPrompt;
    if (!prompt) return;

    setGeneratingVariations(true);
    try {
      const variations = await geminiService.generateVariations(prompt);
      setBgVariations(variations);
    } catch (err) {
      console.error('Variations failed:', err);
    }
    setGeneratingVariations(false);
  };

  const handleBlendVariations = async () => {
    if (selectedVariations.length < 2) return;
    const prompt = copy?.keyword || visualElementsPrompt;
    const imagesToBlend = selectedVariations.map(idx => bgVariations[idx]);

    setBlending(true);
    try {
      const blended = await geminiService.blendImages(imagesToBlend, prompt);
      if (blended) {
        setBgHistory(prev => [...prev, aiBgImage || generatedBg || '']);
        setAiBgImage(blended);
        setGeneratedBg(null);
        setSelectedVariations([]);
      }
    } catch (err) {
      console.error('Blending failed:', err);
    }
    setBlending(false);
  };

  const applyArchetype = () => {
    if (!brandArchetype) return;
    
    if (brandArchetype.typography) {
      const typoId = brandArchetype.typography.toLowerCase().trim();
      const typo = TYPOGRAPHY_PAIRS.find(t => 
        t.id === typoId || 
        t.label.toLowerCase().includes(typoId) || 
        typoId.includes(t.id)
      );
      if (typo) setTypography(typo);
    }
    
    if (brandArchetype.layout) {
      const layoutId = brandArchetype.layout.toLowerCase().trim();
      const matchedLayout = Object.keys(LAYOUT_COMPONENTS).find(id => 
        id === layoutId || 
        layoutId.includes(id) || 
        id.includes(layoutId)
      );
      if (matchedLayout) setLayout(matchedLayout);
    }

    if (brandArchetype.brandColor && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(brandArchetype.brandColor)) {
      setBrandColor(brandArchetype.brandColor);
      setButtonColor(brandArchetype.brandColor);
      setHeadlineSettings(prev => ({ ...prev, color2: brandArchetype.brandColor! }));
    }
  };

  const handleReferenceUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setReferenceImage(dataUrl);
      const base64 = dataUrl.split(',')[1];
      const mediaType = file.type;
      setAnalyzing(true);
      setGenError(null);
      try {
        const data = await geminiService.analyzeDesign(base64, mediaType);
        setBrandArchetype(data);
        if (data.brandColor && /^#[0-9A-Fa-f]{6}$/.test(data.brandColor)) {
          setBrandColor(data.brandColor);
        }
      } catch (err: any) {
        setGenError(err.message);
      }
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleBrandingUpload = async (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setBrandingBookImage(dataUrl);
      const base64 = dataUrl.split(',')[1];
      const mediaType = file.type;
      setAnalyzingBranding(true);
      setGenError(null);
      try {
        const data = await geminiService.analyzeBrandingBook(base64, mediaType);
        console.log('Extracted Branding Data:', data);

        if (data.brandColor && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(data.brandColor)) {
          setBrandColor(data.brandColor);
          setButtonColor(data.brandColor);
          setHeadlineSettings(prev => ({ ...prev, color2: data.brandColor! }));
        }

        if (data.typography) {
          const typoId = data.typography.toLowerCase().trim();
          const typo = TYPOGRAPHY_PAIRS.find(t => 
            t.id === typoId || 
            t.label.toLowerCase().includes(typoId) || 
            typoId.includes(t.id)
          );
          if (typo) {
            setTypography(typo);
          }
        }

        if (data.layout) {
          const layoutId = data.layout.toLowerCase().trim();
          const matchedLayout = Object.keys(LAYOUT_COMPONENTS).find(id => 
            id === layoutId || 
            layoutId.includes(id) || 
            id.includes(layoutId)
          );
          if (matchedLayout) {
            setLayout(matchedLayout);
          }
        }
        
        setBrandArchetype(data);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [data.brandColor || brandColor, '#ffffff']
        });
        
      } catch (err: any) {
        setGenError(err.message);
      }
      setAnalyzingBranding(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      // Ensure images are loaded (though they should be if visible)
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
        backgroundColor: '#121212',
        logging: false,
        onclone: (clonedDoc) => {
          // You can perform adjustments on the cloned DOM here if needed
          const el = clonedDoc.getElementById('creative-canvas');
          if (el) el.style.borderRadius = '0';
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `pixelmaster-${framework.toLowerCase()}-${layout}-${format}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: [brandColor, '#ffffff']
      });
    } catch (err) { 
      console.error('Download error:', err);
      setGenError('Erro ao exportar imagem. Tente novamente.');
    }
    setDownloading(false);
  };

  const handleExportVideo = async () => {
    if (!canvasRef.current) return;
    setExportingVideo(true);
    setVideoProgress(0);
    setAnimationKey(prev => prev + 1); // Trigger animation replay

    try {
      const target = canvasRef.current;
      const width = target.offsetWidth;
      const height = target.offsetHeight;

      const recordingCanvas = document.createElement('canvas');
      recordingCanvas.width = width;
      recordingCanvas.height = height;
      const ctx = recordingCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const stream = recordingCanvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pixelmaster-animation-${Date.now()}.webm`;
        a.click();
        setExportingVideo(false);
        
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.8 },
          colors: [brandColor, '#FFD700']
        });
      };

      recorder.start();

      const duration = 4000; // 4 seconds
      const startTime = Date.now();

      const captureFrame = async () => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= duration) {
          recorder.stop();
          return;
        }

        try {
          const frameCanvas = await htmlToImage.toCanvas(target, {
            width,
            height,
            backgroundColor: '#121212',
            style: { borderRadius: '0' },
            pixelRatio: 1, // Keep it 1 for performance during recording
          });
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(frameCanvas, 0, 0);
          
          const progress = Math.min(100, (elapsed / duration) * 100);
          setVideoProgress(Math.round(progress));
        } catch (e) {
          console.error('Frame capture error', e);
        }

        requestAnimationFrame(captureFrame);
      };

      // Small delay to let initial animations start
      setTimeout(captureFrame, 100);

    } catch (err) {
      console.error('Video export error:', err);
      setExportingVideo(false);
      setGenError('Erro ao exportar vídeo. Tente novamente.');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const bgFilter = `brightness(${0.2 + contrast * 0.003}) blur(${bokeh * 0.08}px) grayscale(1)`;
  const layoutProps: LayoutProps = { 
    copy, 
    brand: brandColor, 
    textOnBrand, 
    hexAlpha,
    buttonColor: buttonColor || brandColor,
    typographySettings: {
      headline: headlineSettings,
      sub: subSettings,
      content: contentSettings
    },
    visibility: {
      headline: showHeadline,
      sub: showSub,
      bullets: showBullets,
      cta: showCTA,
      showExpert,
      showBackground
    },
    format: format as any,
    canvasRef,
    setActiveTypoTab,
    scrollToSection
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${typography.google}&display=swap');
        .heading-font {
          font-family: '${typography.heading}', serif;
          font-style: ${typography.italic ? 'italic' : 'normal'};
        }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glow-text {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; cursor: pointer; }
        input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type=color]::-webkit-color-swatch { border: none; border-radius: 4px; }
      `}</style>

      {/* ── SIDEBAR ESQUERDA ── */}
      <aside className="w-80 bg-[#121212] border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto shrink-0 scrollbar-hide">

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg shadow-lg" style={{ background: brandColor }}>
            <Sparkles size={18} style={{ color: textOnBrand }} />
          </div>
          <div>
            <h1 className="heading-font text-xl tracking-tight">PixelMaster AI</h1>
            <p className="text-[9px] text-white/30 uppercase tracking-[2px]">Creative Studio v2.0</p>
          </div>
        </div>

        {/* ── DNA DA MARCA & ESTRATÉGIA ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: brandColor }}>
              ✦ DNA & Estratégia
            </label>
            <div className="flex gap-2">
              <RefreshCcw size={12} className="text-white/20 cursor-pointer hover:text-white/50" 
                onClick={() => { setBrandingBookImage(null); setReferenceImage(null); setBrandArchetype(null); }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => brandingInputRef.current?.click()}
              className="relative h-20 border border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white/5 transition-all overflow-hidden group"
              style={{ borderColor: hexAlpha(brandColor, 0.2) }}
            >
              {brandingBookImage ? (
                <img src={brandingBookImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Book" />
              ) : (
                <BookOpen size={14} className="text-white/30" />
              )}
              <span className="text-[7px] uppercase tracking-widest text-white/40 z-10">Brand Book</span>
              {analyzingBranding && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><RefreshCcw size={10} className="animate-spin text-white" /></div>}
            </div>
            <div
              onClick={() => referenceInputRef.current?.click()}
              className="relative h-20 border border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white/5 transition-all overflow-hidden group"
              style={{ borderColor: hexAlpha(brandColor, 0.2) }}
            >
              {referenceImage ? (
                <img src={referenceImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Ref" />
              ) : (
                <ImageIcon size={14} className="text-white/30" />
              )}
              <span className="text-[7px] uppercase tracking-widest text-white/40 z-10">Referência</span>
              {analyzing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><RefreshCcw size={10} className="animate-spin text-white" /></div>}
            </div>
          </div>

          <div className="space-y-2">
            <input type="text" value={produto} onChange={(e) => setProduto(e.target.value)}
              placeholder="Produto/Serviço"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white/80 focus:outline-none focus:border-white/20" />
            <input type="text" value={publico} onChange={(e) => setPublico(e.target.value)}
              placeholder="Público-alvo"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white/80 focus:outline-none focus:border-white/20" />
            
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {['AIDA', 'PAS', 'BAB', '4Ps'].map(f => (
                <button key={f} onClick={() => setFramework(f)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-bold transition-all whitespace-nowrap",
                    framework === f ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
                  )}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {brandArchetype && !analyzing && !analyzingBranding && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                className="p-3 rounded-xl border bg-white/[0.02]" 
                style={{ borderColor: hexAlpha(brandColor, 0.2) }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award size={12} style={{ color: brandColor }} />
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: brandColor }}>{brandArchetype.archetype}</p>
                </div>
                <p className="text-[9px] text-white/50 leading-tight mb-2">{brandArchetype.description}</p>
                <button onClick={applyArchetype}
                  className="w-full py-1.5 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all"
                  style={{ background: brandColor, color: textOnBrand }}>
                  Aplicar Identidade
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <hr className="border-white/5" />

        {/* ── DESIGN & ESTILO ── */}
        <section className="space-y-4">
          <label className="text-[10px] uppercase tracking-[2px] font-bold text-white/40">
            ✦ Design & Estilo
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[8px] uppercase tracking-widest text-white/30">Cor & Tipografia</span>
              <div className="flex gap-1">
                {PRESETS.slice(0, 4).map(p => (
                  <button key={p.color} onClick={() => { setBrandColor(p.color); setButtonColor(p.color); }}
                    className="w-4 h-4 rounded-full border border-white/10 hover:scale-110 transition-transform"
                    style={{ background: p.color }} />
                ))}
                <div className="w-4 h-4 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 cursor-pointer"
                  onClick={() => colorInputRef.current?.click()}>
                  <Plus size={8} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select 
                value={typography.id}
                onChange={(e) => {
                  const t = TYPOGRAPHY_PAIRS.find(x => x.id === e.target.value);
                  if (t) setTypography(t);
                }}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-[9px] text-white/60 focus:outline-none appearance-none"
              >
                {TYPOGRAPHY_PAIRS.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <select 
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-[9px] text-white/60 focus:outline-none appearance-none"
              >
                {LAYOUTS.map(l => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>


        {/* ── VISIBILIDADE & AJUSTES ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-[2px] font-bold text-white/40">
              ✦ Ajustes & Visibilidade
            </label>
            <div className="flex gap-1">
              {[
                { state: showHeadline, set: setShowHeadline, label: 'H' },
                { state: showSub, set: setShowSub, label: 'S' },
                { state: showCTA, set: setShowCTA, label: 'C' },
                { state: showExpert, set: setShowExpert, label: 'E' },
              ].map((item, i) => (
                <button key={i} onClick={() => item.set(!item.state)}
                  className={cn(
                    "w-6 h-6 rounded flex items-center justify-center text-[8px] font-bold transition-all",
                    item.state ? "bg-white/10 text-white" : "bg-red-500/10 text-red-400"
                  )} title={item.label}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-1 p-1 bg-white/[0.03] rounded-lg border border-white/5">
            {(['headline', 'sub', 'content'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTypoTab(tab)}
                className={cn(
                  "flex-1 py-1.5 text-[8px] uppercase tracking-wider rounded-md transition-all",
                  activeTypoTab === tab 
                    ? "bg-white/10 text-white shadow-lg" 
                    : "text-white/30 hover:text-white/60"
                )}
              >
                {tab === 'headline' ? 'Título' : tab === 'sub' ? 'Sub' : 'Corpo'}
              </button>
            ))}
          </div>

          <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            {(() => {
              const settings = activeTypoTab === 'headline' ? headlineSettings : activeTypoTab === 'sub' ? subSettings : contentSettings;
              const setSettings = activeTypoTab === 'headline' ? setHeadlineSettings : activeTypoTab === 'sub' ? setSubSettings : setContentSettings;

              return (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                      <span>Tamanho</span>
                      <span>{settings.size}%</span>
                    </div>
                    <input type="range" min="30" max="300" value={settings.size} 
                      onChange={(e) => setSettings({ ...settings, size: Number(e.target.value) })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: complementaryPalette.complementary }} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                      <span>Espaçamento</span>
                      <span>{settings.spacing}px</span>
                    </div>
                    <input type="range" min="-5" max="20" value={settings.spacing} 
                      onChange={(e) => setSettings({ ...settings, spacing: Number(e.target.value) })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: complementaryPalette.complementary }} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                      <span>Altura Linha</span>
                      <span>{settings.height}%</span>
                    </div>
                    <input type="range" min="50" max="250" value={settings.height} 
                      onChange={(e) => setSettings({ ...settings, height: Number(e.target.value) })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: complementaryPalette.complementary }} />
                  </div>

                  {activeTypoTab !== 'headline' && (
                    <div className="space-y-2">
                      <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">Cor do Texto</div>
                      <div className="flex gap-2">
                        {[...new Set(['#ffffff', brandColor, '#000000', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.7)'])].map((c) => (
                          <button key={c} onClick={() => setSettings({ ...settings, color: c })}
                            className={cn("w-5 h-5 rounded-full border", settings.color === c ? "border-white" : "border-transparent")}
                            style={{ background: c }} />
                        ))}
                        <input type="color" value={settings.color.startsWith('rgba') ? '#ffffff' : settings.color} 
                          onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                          className="w-5 h-5 rounded-full overflow-hidden border border-white/10 bg-transparent cursor-pointer" />
                      </div>
                    </div>
                  )}

                  {activeTypoTab === 'headline' && (
                    <>
                      <div className="space-y-2">
                        <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">Cor da Linha 1</div>
                        <div className="flex gap-2">
                          {[...new Set(['#ffffff', brandColor, '#000000', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.7)'])].map((c) => (
                            <button key={c} onClick={() => setHeadlineSettings({ ...headlineSettings, color: c })}
                              className={cn("w-5 h-5 rounded-full border", headlineSettings.color === c ? "border-white" : "border-transparent")}
                              style={{ background: c }} />
                          ))}
                          <input type="color" value={headlineSettings.color.startsWith('rgba') ? '#ffffff' : headlineSettings.color} 
                            onChange={(e) => setHeadlineSettings({ ...headlineSettings, color: e.target.value })}
                            className="w-5 h-5 rounded-full overflow-hidden border border-white/10 bg-transparent cursor-pointer" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">Cor da Linha 2 (Destaque)</div>
                        <div className="flex gap-2">
                          {[...new Set(['#ffffff', brandColor, '#000000', '#E0AA66', '#FFD700'])].map((c) => (
                            <button key={c} onClick={() => setHeadlineSettings({ ...headlineSettings, color2: c })}
                              className={cn("w-5 h-5 rounded-full border", headlineSettings.color2 === c ? "border-white" : "border-transparent")}
                              style={{ background: c }} />
                          ))}
                          <input type="color" value={headlineSettings.color2} 
                            onChange={(e) => setHeadlineSettings({ ...headlineSettings, color2: e.target.value })}
                            className="w-5 h-5 rounded-full overflow-hidden border border-white/10 bg-transparent cursor-pointer" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">Cor da Linha 3</div>
                        <div className="flex gap-2">
                          {[...new Set(['#ffffff', brandColor, '#000000', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.7)'])].map((c) => (
                            <button key={c} onClick={() => setHeadlineSettings({ ...headlineSettings, color3: c })}
                              className={cn("w-5 h-5 rounded-full border", headlineSettings.color3 === c ? "border-white" : "border-transparent")}
                              style={{ background: c }} />
                          ))}
                          <input type="color" value={headlineSettings.color3.startsWith('rgba') ? '#ffffff' : headlineSettings.color3} 
                            onChange={(e) => setHeadlineSettings({ ...headlineSettings, color3: e.target.value })}
                            className="w-5 h-5 rounded-full overflow-hidden border border-white/10 bg-transparent cursor-pointer" />
                        </div>
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        </section>

        {/* ── AJUSTES DA EXPERT ── */}
        <section className="space-y-3">
          <label className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: complementaryPalette.analogous1 }}>
            Ajustes da Expert
          </label>
          <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                <span>Fade na Base (Bottom-up)</span>
                <span>{expertFade}%</span>
              </div>
              <input type="range" min="0" max="100" value={expertFade} 
                onChange={(e) => setExpertFade(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: complementaryPalette.analogous1 }} />
              <p className="text-[7px] text-white/20 uppercase">Ajusta a suavidade do corte na base da imagem</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                <span>Escala da Expert</span>
                <span>{expertScale}%</span>
              </div>
              <input type="range" min="50" max="200" value={expertScale} 
                onChange={(e) => setExpertScale(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
            </div>

            <div className="space-y-2">
              <div className="text-[8px] uppercase tracking-wider text-white/30 mb-1">Texto de Fundo (Atrás da Expert)</div>
              <input 
                type="text" 
                value={bgText || copy.headline[1] || ''} 
                onChange={(e) => setBgText(e.target.value)}
                placeholder="Texto atrás da expert..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>
        </section>

        {/* ── ELEMENTOS INDIVIDUAIS ── */}
        <section className="space-y-3">
          <label className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: brandColor }}>
            Ajustes de Elementos
          </label>
          <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                <span>Vinheta (Cor e Intensidade)</span>
                <span>{Math.round(vignetteOpacity * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="color" value={vignetteColor} 
                  onChange={(e) => setVignetteColor(e.target.value)}
                  className="w-6 h-6 rounded-full overflow-hidden border border-white/10 bg-transparent cursor-pointer shrink-0" />
                <input type="range" min="0" max="100" value={vignetteOpacity * 100} 
                  onChange={(e) => setVignetteOpacity(Number(e.target.value) / 100)}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {(['classic', 'left', 'right', 'top', 'bottom', 'radial'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => setVignetteDirection(dir)}
                    className={`px-2 py-1 text-[7px] uppercase tracking-tighter rounded border transition-all ${
                      vignetteDirection === dir 
                        ? 'bg-white/20 border-white/40 text-white' 
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                <span>Opacidade do Texto de Fundo</span>
                <span>{Math.round(bgTextOpacity * 100)}%</span>
              </div>
              <input type="range" min="0" max="100" value={bgTextOpacity * 100} 
                onChange={(e) => setBgTextOpacity(Number(e.target.value) / 100)}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                <span>Tamanho do Texto de Fundo</span>
                <span>{bgTextScale}%</span>
              </div>
              <input type="range" min="50" max="300" value={bgTextScale} 
                onChange={(e) => setBgTextScale(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                <span>Atmosfera (Glow de Fundo)</span>
                <span>{Math.round(atmosphereOpacity * 100)}%</span>
              </div>
              <input type="range" min="0" max="100" value={atmosphereOpacity * 100} 
                onChange={(e) => setAtmosphereOpacity(Number(e.target.value) / 100)}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-wider text-white/30">
                <span>Blur da Atmosfera</span>
                <span>{atmosphereBlur}px</span>
              </div>
              <input type="range" min="0" max="250" value={atmosphereBlur} 
                onChange={(e) => setAtmosphereBlur(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
            </div>

            <div className="space-y-2">
              <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">Posição da Expert</div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setExpertKey(prev => prev + 1)}
                  className="py-2 rounded-lg text-[8px] uppercase tracking-wider border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={10} /> Resetar
                </button>
                <button 
                  onClick={() => { setPersonImage(null); setSubjectImage(null); }}
                  className="py-2 rounded-lg text-[8px] uppercase tracking-wider border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={10} /> Remover
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">Cor do Botão</div>
              <div className="flex gap-2">
                {[...new Set(['#ffffff', brandColor, '#000000', '#ff0000', '#00ff00'])].map((c) => (
                  <button key={c} onClick={() => setButtonColor(c)}
                    className={cn("w-5 h-5 rounded-full border", (buttonColor || brandColor) === c ? "border-white" : "border-transparent")}
                    style={{ background: c }} />
                ))}
                <input type="color" value={buttonColor || brandColor} onChange={(e) => setButtonColor(e.target.value)}
                  className="w-5 h-5 rounded-full overflow-hidden border border-white/10 bg-transparent cursor-pointer" />
              </div>
            </div>
          </div>
        </section>

        {/* ── ESPECIALISTA ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: brandColor }}>
              Especialista
            </label>
            {personImage && (
              <button
                onClick={() => setBgRemovedEnabled(v => !v)}
                className="text-[8px] uppercase tracking-wider px-2 py-1 rounded-full transition-all"
                style={bgRemovedEnabled
                  ? { background: hexAlpha(brandColor, 0.15), color: brandColor, border: `1px solid ${hexAlpha(brandColor, 0.4)}` }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }
                }>
                {bgRemovedEnabled ? '✂ Fundo Removido' : 'Original'}
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
          <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className="relative h-32 w-full border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 overflow-hidden group"
            style={{ borderColor: dragOver ? brandColor : 'rgba(255,255,255,0.1)', background: dragOver ? hexAlpha(brandColor, 0.08) : 'rgba(255,255,255,0.03)' }}>
            {subjectImage ? (
              <>
                <img
                  src={personImage && bgRemovedEnabled ? personImage : subjectImage}
                  className="absolute inset-0 w-full h-full object-contain opacity-90 p-2" alt="" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={16} className="text-white" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Trocar Foto</span>
                </div>
                {removingBg && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                      <Sparkles size={18} style={{ color: brandColor }} />
                    </motion.div>
                    <span className="text-[9px] text-white/60 uppercase tracking-wider">Removendo fundo...</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <ImageIcon size={24} className="text-white/10" />
                <span className="text-[9px] text-white/40 uppercase tracking-wider">
                  {dragOver ? 'Solte aqui' : 'Arraste sua foto'}
                </span>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button 
              onClick={() => setExpertKey(prev => prev + 1)}
              className="py-2 rounded-lg text-[8px] uppercase tracking-wider border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={10} /> Resetar Posição
            </button>
            <button 
              onClick={() => { setPersonImage(null); setSubjectImage(null); }}
              className="py-2 rounded-lg text-[8px] uppercase tracking-wider border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={10} /> Remover Foto
            </button>
          </div>

          <div className="space-y-2 mt-4">
            <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">Cor do Botão de Ação</div>
            <div className="flex gap-2">
              {[...new Set(['#ffffff', brandColor, '#000000', '#ff0000', '#00ff00'])].map((c) => (
                <button key={c} onClick={() => setButtonColor(c)}
                  className={cn("w-5 h-5 rounded-full border", (buttonColor || brandColor) === c ? "border-white" : "border-transparent")}
                  style={{ background: c }} />
              ))}
              <input type="color" value={buttonColor || brandColor} onChange={(e) => setButtonColor(e.target.value)}
                className="w-5 h-5 rounded-full overflow-hidden border border-white/10 bg-transparent cursor-pointer" />
            </div>
          </div>
        </section>

        {/* ── ELEMENTOS VISUAIS (IA) ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: complementaryPalette.primary }}>
              Elementos Visuais (IA)
            </label>
            {bgHistory.length > 0 && (
              <button 
                onClick={undoBackground}
                className="text-[8px] uppercase tracking-wider text-white/40 hover:text-white transition-colors flex items-center gap-1"
              >
                <RefreshCcw size={10} /> Desfazer
              </button>
            )}
          </div>
          <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="relative">
              <textarea
                value={visualElementsPrompt}
                onChange={(e) => setVisualElementsPrompt(e.target.value)}
                placeholder="Ex: neon lines, floating particles, luxury textures..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-none h-20"
              />
              <div className="absolute bottom-2 right-2 flex gap-1">
                {['Neon', 'Particles', 'Glow', 'Luxury'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setVisualElementsPrompt(prev => prev ? `${prev}, ${tag.toLowerCase()}` : tag.toLowerCase())}
                    className="text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={handleEnhanceBackground}
              disabled={enhancing || !visualElementsPrompt.trim()}
              className="w-full py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-[2px] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: hexAlpha(brandColor, 0.1), color: brandColor, border: `1px solid ${hexAlpha(brandColor, 0.2)}` }}
            >
              {enhancing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <RefreshCcw size={12} />
                </motion.div>
              ) : <Sparkles size={12} />}
              {enhancing ? 'Aprimorando...' : 'Aprimorar Fundo'}
            </button>
          </div>
        </section>

        {/* ── VARIAÇÕES DE FUNDO IA ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: complementaryPalette.analogous2 }}>
              Variações de Fundo (IA)
            </label>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCheckCopyright}
                disabled={checkingCopyright || !(aiBgImage || generatedBg)}
                className="text-[8px] uppercase tracking-wider text-white/60 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-30"
              >
                {checkingCopyright ? <RefreshCcw size={10} className="animate-spin" /> : <Shield size={10} />}
                Copyright
              </button>
              <button 
                onClick={handleGenerateVariations}
                disabled={generatingVariations || !(aiBgImage || generatedBg || copy?.keyword)}
                className="text-[8px] uppercase tracking-wider text-white/60 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-30"
              >
                {generatingVariations ? <RefreshCcw size={10} className="animate-spin" /> : <Layers size={10} />}
                Gerar Variações
              </button>
            </div>
          </div>

          {copyrightRisk && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={cn(
                "p-3 rounded-lg border text-[9px] leading-tight",
                copyrightRisk.risk === 'low' ? "bg-green-500/10 border-green-500/20 text-green-400" :
                copyrightRisk.risk === 'medium' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                "bg-red-500/10 border-red-500/20 text-red-400"
              )}
            >
              <div className="flex items-center gap-2 mb-1 font-bold uppercase tracking-wider">
                <AlertCircle size={10} />
                Risco de Copyright: {copyrightRisk.risk.toUpperCase()}
              </div>
              {copyrightRisk.details}
            </motion.div>
          )}
          
          <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            {bgVariations.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {bgVariations.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
                      <img src={img} alt={`Variation ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            setBgHistory(prev => [...prev, aiBgImage || generatedBg || '']);
                            setAiBgImage(img);
                            setGeneratedBg(null);
                          }}
                          className="p-1.5 rounded-full bg-white text-black hover:scale-110 transition-transform"
                        >
                          <Check size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedVariations(prev => 
                              prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                            );
                          }}
                          className={cn(
                            "p-1.5 rounded-full transition-all",
                            selectedVariations.includes(idx) ? "bg-brand text-black scale-110" : "bg-white/20 text-white hover:bg-white/40"
                          )}
                          style={selectedVariations.includes(idx) ? { background: brandColor } : {}}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      {selectedVariations.includes(idx) && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-black" style={{ background: brandColor }}>
                          {selectedVariations.indexOf(idx) + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedVariations.length >= 2 && (
                  <button 
                    onClick={handleBlendVariations}
                    disabled={blending}
                    className="w-full py-2.5 rounded-lg text-[9px] uppercase tracking-[2px] font-bold transition-all flex items-center justify-center gap-2"
                    style={{ background: hexAlpha(brandColor, 0.2), color: brandColor, border: `1px solid ${hexAlpha(brandColor, 0.4)}` }}
                  >
                    {blending ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <RefreshCcw size={12} />
                      </motion.div>
                    ) : <Combine size={12} />}
                    {blending ? 'Mesclando...' : `Mesclar ${selectedVariations.length} Variações`}
                  </button>
                )}
                
                <p className="text-[7px] text-white/30 text-center uppercase tracking-wider">
                  Selecione 2 ou mais para mesclar estilos
                </p>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-white/20">
                <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                  <Layers size={20} />
                </div>
                <p className="text-[8px] uppercase tracking-[2px] text-center">
                  Nenhuma variação gerada<br/>
                  <span className="opacity-50">Clique em "Gerar Variações" acima</span>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── ELEMENTOS FLUTUANTES ── */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: complementaryPalette.complementary }}>
              Elementos Flutuantes
            </label>
            <button 
              onClick={() => {
                const types: FloatingElement['type'][] = ['notification', 'badge', 'review', 'label', 'icon-only', 'stat', 'pill'];
                const type = types[Math.floor(Math.random() * types.length)];
                const icons = ['Star', 'Zap', 'Award', 'Bell', 'Heart', 'Rocket', 'Target'];
                const icon = icons[Math.floor(Math.random() * icons.length)];
                const newEl: FloatingElement = { type, text: 'Novo Elemento', icon, x: 50, y: 50 };
                if (generatedCopy) {
                  setGeneratedCopy({ ...generatedCopy, floatingElements: [...(generatedCopy.floatingElements || []), newEl] });
                } else {
                  setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: [...(FRAMEWORKS[framework].floatingElements || []), newEl] });
                }
              }}
              className="text-[8px] uppercase tracking-wider text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <Plus size={10} /> Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {(copy.floatingElements || []).map((el: FloatingElement, i: number) => (
              <div key={i} className="flex flex-col gap-2 bg-white/5 rounded-lg p-3 group border border-white/5">
                <div className="flex items-center gap-2">
                  <select 
                    value={el.type}
                    onChange={(e) => {
                      const newElements = [...(copy.floatingElements || [])];
                      newElements[i] = { ...el, type: e.target.value as any };
                      if (generatedCopy) {
                        setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                      } else {
                        setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                      }
                    }}
                    className="bg-black/40 text-[8px] uppercase tracking-wider rounded px-1 py-0.5 text-white/60 focus:outline-none border border-white/10"
                  >
                    <option value="notification">Notificação</option>
                    <option value="badge">Selo</option>
                    <option value="review">Review</option>
                    <option value="label">Etiqueta</option>
                    <option value="icon-only">Ícone</option>
                    <option value="stat">Status</option>
                    <option value="pill">Pílula</option>
                  </select>
                  <div className="flex-1" />
                  <button 
                    onClick={() => {
                      const newElements = (copy.floatingElements || []).filter((_: any, idx: number) => idx !== i);
                      if (generatedCopy) {
                        setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                      } else {
                        setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-white/40 cursor-pointer hover:bg-white/20 transition-all"
                    onClick={() => {
                      const icons = ['Star', 'Zap', 'Award', 'Bell', 'Heart', 'Rocket', 'Target', 'Users', 'TrendingUp', 'Shield', 'MessageSquare', 'CheckCircle2', 'AlertCircle', 'Sparkles'];
                      const currentIdx = icons.indexOf(el.icon || 'Bell');
                      const nextIdx = (currentIdx + 1) % icons.length;
                      const newElements = [...(copy.floatingElements || [])];
                      newElements[i] = { ...el, icon: icons[nextIdx] };
                      if (generatedCopy) {
                        setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                      } else {
                        setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                      }
                    }}
                  >
                    {getIcon(el.icon || 'Bell')}
                  </div>
                  <input 
                    type="text" 
                    value={el.text} 
                    onChange={(e) => {
                      const newElements = [...(copy.floatingElements || [])];
                      newElements[i] = { ...el, text: e.target.value };
                      if (generatedCopy) {
                        setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                      } else {
                        setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                      }
                    }}
                    className="flex-1 bg-transparent text-[9px] text-white focus:outline-none border-b border-white/10 pb-0.5"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[7px] uppercase tracking-tighter text-white/30">
                      <span>Posição X</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={Math.round(el.x ?? 50)} 
                          onChange={(e) => {
                            const newElements = [...(copy.floatingElements || [])];
                            newElements[i] = { ...el, x: Number(e.target.value) };
                            if (generatedCopy) {
                              setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                            } else {
                              setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                            }
                          }}
                          className="w-8 bg-white/5 text-center text-[7px] border border-white/10 rounded focus:outline-none"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <input type="range" min="0" max="100" value={el.x ?? 50} 
                      onChange={(e) => {
                        const newElements = [...(copy.floatingElements || [])];
                        newElements[i] = { ...el, x: Number(e.target.value) };
                        if (generatedCopy) {
                          setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                        } else {
                          setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                        }
                      }}
                      className="w-full h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[7px] uppercase tracking-tighter text-white/30">
                      <span>Posição Y</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={Math.round(el.y ?? 50)} 
                          onChange={(e) => {
                            const newElements = [...(copy.floatingElements || [])];
                            newElements[i] = { ...el, y: Number(e.target.value) };
                            if (generatedCopy) {
                              setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                            } else {
                              setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                            }
                          }}
                          className="w-8 bg-white/5 text-center text-[7px] border border-white/10 rounded focus:outline-none"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <input type="range" min="0" max="100" value={el.y ?? 50} 
                      onChange={(e) => {
                        const newElements = [...(copy.floatingElements || [])];
                        newElements[i] = { ...el, y: Number(e.target.value) };
                        if (generatedCopy) {
                          setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                        } else {
                          setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                        }
                      }}
                      className="w-full h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[7px] uppercase tracking-tighter text-white/30">
                      <span>Tamanho</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={el.size ?? 100} 
                          onChange={(e) => {
                            const newElements = [...(copy.floatingElements || [])];
                            newElements[i] = { ...el, size: Number(e.target.value) };
                            if (generatedCopy) {
                              setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                            } else {
                              setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                            }
                          }}
                          className="w-8 bg-white/5 text-center text-[7px] border border-white/10 rounded focus:outline-none"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <input type="range" min="30" max="200" value={el.size ?? 100} 
                      onChange={(e) => {
                        const newElements = [...(copy.floatingElements || [])];
                        newElements[i] = { ...el, size: Number(e.target.value) };
                        if (generatedCopy) {
                          setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                        } else {
                          setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                        }
                      }}
                      className="w-full h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[7px] uppercase tracking-tighter text-white/30">
                      <span>Opacidade</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={Math.round((el.opacity ?? 1) * 100)} 
                          onChange={(e) => {
                            const newElements = [...(copy.floatingElements || [])];
                            newElements[i] = { ...el, opacity: Number(e.target.value) / 100 };
                            if (generatedCopy) {
                              setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                            } else {
                              setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                            }
                          }}
                          className="w-8 bg-white/5 text-center text-[7px] border border-white/10 rounded focus:outline-none"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <input type="range" min="0" max="100" value={(el.opacity ?? 1) * 100} 
                      onChange={(e) => {
                        const newElements = [...(copy.floatingElements || [])];
                        newElements[i] = { ...el, opacity: Number(e.target.value) / 100 };
                        if (generatedCopy) {
                          setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                        } else {
                          setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                        }
                      }}
                      className="w-full h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <div className="flex justify-between text-[7px] uppercase tracking-tighter text-white/30">
                      <span>Rotação</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={el.rotation ?? 0} 
                          onChange={(e) => {
                            const newElements = [...(copy.floatingElements || [])];
                            newElements[i] = { ...el, rotation: Number(e.target.value) };
                            if (generatedCopy) {
                              setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                            } else {
                              setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                            }
                          }}
                          className="w-8 bg-white/5 text-center text-[7px] border border-white/10 rounded focus:outline-none"
                        />
                        <span>°</span>
                      </div>
                    </div>
                    <input type="range" min="-180" max="180" value={el.rotation ?? 0} 
                      onChange={(e) => {
                        const newElements = [...(copy.floatingElements || [])];
                        newElements[i] = { ...el, rotation: Number(e.target.value) };
                        if (generatedCopy) {
                          setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
                        } else {
                          setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
                        }
                      }}
                      className="w-full h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: brandColor }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-auto pt-4 space-y-2">
          <button onClick={handleGenerate} disabled={generating}
            className="w-full font-bold py-4 rounded-xl text-[11px] uppercase tracking-[3px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            style={{ background: brandColor, color: textOnBrand }}>
            {generating ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <RefreshCcw size={14} />
              </motion.div>
            ) : <Sparkles size={14} />}
            {generating ? 'Processando IA...' : 'Gerar Criativo Elite'}
          </button>
          
          <button onClick={handleIdentifyBrand} disabled={identifying}
            className="w-full py-3 rounded-xl text-[9px] uppercase tracking-[2px] border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {identifying ? 'Analisando nicho...' : 'Sugerir Identidade Visual'}
          </button>
        </div>
      </aside>

      {/* ── CANVAS CENTRAL ── */}
      <main className="flex-1 bg-[#0a0a0a] relative flex flex-col items-center justify-center p-12 overflow-hidden">
        
        {/* Background Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }} />

        {copyrightRisk && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-4 max-w-md"
            style={{ borderLeft: `4px solid ${copyrightRisk.risk === 'high' ? '#ef4444' : copyrightRisk.risk === 'medium' ? '#f59e0b' : '#10b981'}` }}
          >
            <div className={cn(
              "p-2 rounded-lg",
              copyrightRisk.risk === 'high' ? "bg-red-500/20 text-red-400" : 
              copyrightRisk.risk === 'medium' ? "bg-amber-500/20 text-amber-400" : 
              "bg-emerald-500/20 text-emerald-400"
            )}>
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Análise de Copyright</h3>
                <button onClick={() => setCopyrightRisk(null)} className="text-white/20 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">{copyrightRisk.details}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={cn(
                  "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                  copyrightRisk.risk === 'high' ? "bg-red-500 text-white" : 
                  copyrightRisk.risk === 'medium' ? "bg-amber-500 text-black" : 
                  "bg-emerald-500 text-white"
                )}>
                  Risco: {copyrightRisk.risk}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="absolute top-8 flex items-center gap-4 z-20">
          <div className="flex bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl">
            {Object.keys(dimensions).map((f) => (
              <button key={f} onClick={() => setFormat(f)}
                className="px-6 py-2 rounded-full text-[10px] uppercase tracking-[3px] transition-all"
                style={format === f ? { background: brandColor, color: textOnBrand, fontWeight: 800 } : { color: 'rgba(255,255,255,0.4)' }}>
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl gap-1">
            <button onClick={handleUndo} disabled={history.length <= 1}
              className="p-2 rounded-full hover:bg-white/5 disabled:opacity-20 transition-all text-white/60 hover:text-white"
              title="Desfazer (Ctrl+Z)">
              <Undo2 size={16} />
            </button>
            <button onClick={handleRedo} disabled={redoStack.length === 0}
              className="p-2 rounded-full hover:bg-white/5 disabled:opacity-20 transition-all text-white/60 hover:text-white"
              title="Refazer (Ctrl+Y)">
              <Redo2 size={16} />
            </button>
            <div className="w-px h-4 bg-white/10 self-center mx-1" />
            <button onClick={handleCheckCopyright} disabled={checkingCopyright || (!aiBgImage && !generatedBg)}
              className="p-2 rounded-full hover:bg-white/5 disabled:opacity-20 transition-all text-white/60 hover:text-white flex items-center gap-2 px-3"
              title="Verificar Direitos Autorais">
              {checkingCopyright ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <RefreshCcw size={14} />
                </motion.div>
              ) : <ShieldCheck size={16} />}
              <span className="text-[8px] uppercase tracking-widest font-bold">Copyright</span>
            </button>
          </div>
        </div>

        <motion.div 
          layout
          ref={canvasRef}
          id="creative-canvas"
          className={cn(
            "relative w-full shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ease-in-out",
            dimensions[format].maxW,
            dimensions[format].aspect
          )}
        >
          {/* Layer 1: Background */}
          <div className="absolute inset-0 z-0">
            {showBackground && (
              <AnimatePresence mode="wait">
                <motion.img
                  key={aiBgImage || generatedBg || 'default'}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  src={aiBgImage || (!personImage && subjectImage) || generatedBg || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'}
                  className="w-full h-full object-cover" 
                  style={{ filter: bgFilter }} 
                  alt="" 
                />
              </AnimatePresence>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent" />
            
            {/* Atmospheric Ambient Gradient (Overlay on BG) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
              <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full"
                style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)`, opacity: atmosphereOpacity, filter: `blur(${atmosphereBlur}px)` }} />
              <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full"
                style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)`, opacity: atmosphereOpacity * 0.75, filter: `blur(${atmosphereBlur * 1.2}px)` }} />
            </div>

            <Noise />
          </div>

          {/* Layer 1.5: Background Text (Between BG and Expert) */}
          <div className="absolute inset-0 z-[5] flex items-center justify-center overflow-hidden pointer-events-none" style={{ opacity: bgTextOpacity }}>
            <h1 className="heading-font font-black uppercase leading-none whitespace-nowrap select-none" 
              style={{ color: brandColor, fontSize: `${(250 * bgTextScale) / 100}px` }}>
              {bgText || copy.headline[1]}
            </h1>
          </div>

          {/* Layer 2: Person cutout with Rim Light & Glow */}
          {personImage && bgRemovedEnabled && showExpert && (
            <>
              <div className="absolute bottom-0 inset-x-0 z-10 w-full h-[80%] blur-[60px] opacity-40 pointer-events-none"
                style={{ background: `radial-gradient(circle at bottom, ${brandColor} 0%, transparent 70%)` }} />
              <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none">
                <motion.img
                  key={`expert-${expertKey}`}
                  drag
                  dragConstraints={canvasRef}
                  dragElastic={0.1}
                  dragMomentum={false}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  src={personImage}
                  className={cn(
                    "w-auto object-contain object-bottom cursor-move select-none pointer-events-auto"
                  )}
                  style={{ 
                    height: `${(format === 'vertical' ? 85 : format === 'portrait' ? 90 : 95) * (expertScale / 100)}%`,
                    filter: `drop-shadow(0 0 20px ${hexAlpha(brandColor, 0.6)}) drop-shadow(0 0 5px ${brandColor}) brightness(1.05)`,
                    WebkitMaskImage: `linear-gradient(to top, transparent 0%, black ${expertFade}%)`,
                    maskImage: `linear-gradient(to top, transparent 0%, black ${expertFade}%)`
                  }}
                  alt="" 
                />
              </div>
            </>
          )}

          {/* Layer 3: Legibility Gradients */}
          {personImage && bgRemovedEnabled && (
            <div className="absolute inset-0 z-20 pointer-events-none" style={{
              background: (() => {
                const op = vignetteOpacity;
                const c = vignetteColor;
                const ha = hexAlpha;
                switch (vignetteDirection) {
                  case 'left': return `linear-gradient(to right, ${ha(c, op)} 0%, ${ha(c, op * 0.4)} 40%, transparent 100%)`;
                  case 'right': return `linear-gradient(to left, ${ha(c, op)} 0%, ${ha(c, op * 0.4)} 40%, transparent 100%)`;
                  case 'top': return `linear-gradient(to bottom, ${ha(c, op)} 0%, ${ha(c, op * 0.4)} 40%, transparent 100%)`;
                  case 'bottom': return `linear-gradient(to top, ${ha(c, op)} 0%, ${ha(c, op * 0.4)} 40%, transparent 100%)`;
                  case 'radial': return `radial-gradient(circle at center, transparent 20%, ${ha(c, op * 0.6)} 70%, ${ha(c, op)} 100%)`;
                  default: return `linear-gradient(to right, ${ha(c, op)} 35%, ${ha(c, op * 0.25)} 70%, transparent 100%), linear-gradient(to top, ${ha(c, op * 1.1)} 15%, transparent 50%)`;
                }
              })()
            }} />
          )}

          {/* Layer 4: Floating Elements */}
          <FloatingElements 
            elements={copy.floatingElements || []} 
            canvasRef={canvasRef} 
            brand={brandColor} 
            onUpdate={(index, updates) => {
              const newElements = [...(copy.floatingElements || [])];
              newElements[index] = { ...newElements[index], ...updates };
              if (generatedCopy) {
                setGeneratedCopy({ ...generatedCopy, floatingElements: newElements });
              } else {
                setGeneratedCopy({ ...FRAMEWORKS[framework], floatingElements: newElements });
              }
            }}
          />

          {/* Layer 5: Layout content */}
          <CanvasLayout key={animationKey} {...layoutProps} />
        </motion.div>

        <div className="mt-8 flex items-center gap-6 text-[10px] text-white/20 uppercase tracking-[3px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: brandColor }} />
            <span style={{ color: hexAlpha(brandColor, 0.6) }}>{brandColor.toUpperCase()}</span>
          </div>
          <span>·</span>
          <span>{dimensions[format].display} PX</span>
          <span>·</span>
          <span className="text-white/40">{typography.label}</span>
        </div>
      </main>

      {/* ── SIDEBAR DIREITA ── */}
      <aside className="w-80 bg-[#121212] border-l border-white/10 p-6 flex flex-col gap-6 shrink-0 overflow-y-auto scrollbar-hide">
        {/* Sliders */}
        <div className="space-y-5">
          <h3 className="text-[11px] uppercase font-bold tracking-[3px] text-white/70">Ajustes de Render</h3>
          {[
            { label: 'Contraste', value: contrast, set: setContrast },
            { label: 'Bokeh (Blur)', value: bokeh,    set: setBokeh },
          ].map(({ label, value, set }) => (
            <div key={label} className="space-y-2">
              <div className="flex justify-between text-[9px] uppercase tracking-wider text-white/40">
                <span>{label}</span>
                <span style={{ color: brandColor }} className="font-bold">{value}%</span>
              </div>
              <input type="range" min="0" max="100" value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/5"
                style={{ accentColor: brandColor }} />
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-3">
          <button onClick={handleExportVideo} disabled={downloading || exportingVideo}
            className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 text-[10px] font-bold uppercase tracking-[3px] transition-all text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 rounded-xl shadow-xl disabled:opacity-40">
            {exportingVideo ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Gravando {videoProgress}%</span>
              </div>
            ) : (
              <>
                <Video size={14} style={{ color: brandColor }} />
                <span>Exportar Vídeo (WebM)</span>
              </>
            )}
          </button>

          <button onClick={handleDownload} disabled={downloading || exportingVideo}
            className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 text-[10px] font-bold uppercase tracking-[3px] transition-all text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 rounded-xl shadow-xl disabled:opacity-40">
            <Download size={14} />
            {downloading ? 'Exportando...' : 'Baixar Criativo'}
          </button>
          
          <p className="text-[8px] text-center text-white/10 uppercase tracking-[2px]">
            Powered by Gemini 3.1 Pro & PixelMaster Engine
          </p>
        </div>
      </aside>
    </div>
  );
}
