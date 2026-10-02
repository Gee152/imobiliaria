import React, { useEffect, useRef, useState } from 'react';
import { Layers, Compass, Building2, Home, CheckCircle2, ChevronDown, ArrowRight } from 'lucide-react';

interface StoryStep {
  id: number;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  highlights?: string[];
  ctaText?: string;
  ctaTarget?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StoryStep[] = [
  {
    id: 1,
    phase: 'Etapa 01 — O começo',
    title: 'Todo patrimônio começa com uma escolha.',
    subtitle: 'Encontrar o imóvel certo é apenas o primeiro passo.',
    description: 'Antes do concreto e das chaves, existe a intenção. Mapear a localização correta na Zona Norte do Recife e definir o perfil ideal para a sua família ou investimento é a base de tudo.',
    icon: Compass
  },
  {
    id: 2,
    phase: 'Etapa 02 — Estrutura',
    title: 'Uma boa compra precisa de estrutura.',
    subtitle: 'Localização, documentação, financiamento e negociação fazem parte da decisão.',
    description: 'Sem sustentação jurídica e financeira clara, o sonho pode se transformar em dor de cabeça. Analisamos certidões, viabilidade de crédito e histórico patrimonial antes de qualquer compromisso.',
    highlights: ['Análise prévia de certidões', 'Simulação de crédito real', 'Negociação equilibrada'],
    icon: Layers
  },
  {
    id: 3,
    phase: 'Etapa 03 — Arquitetura',
    title: 'Não escolha apenas um imóvel.',
    subtitle: 'Escolha um endereço que faça sentido para a sua vida ou para o seu investimento.',
    description: 'A Zona Norte do Recife tem sua própria atmosfera: o verde de Casa Forte, a paz do Poço da Panela, a vitalidade das Graças e o prestígio da Jaqueira. Seu patrimônio precisa estar no lugar certo.',
    icon: Building2
  },
  {
    id: 4,
    phase: 'Etapa 04 — Ambientes',
    title: 'O imóvel precisa caber nos seus planos.',
    subtitle: 'Espaços pensados para acolher a sua rotina com conforto e privacidade.',
    description: 'Metragem bem aproveitada, ventilação privilegiada e áreas de convivência que valorizam o dia a dia da sua família.',
    highlights: ['Quartos & Suítes', 'Sala ampla integrada', 'Varanda gourmet', 'Vagas cobertas'],
    icon: Home
  },
  {
    id: 5,
    phase: 'Etapa 05 — Empreendimento completo',
    title: 'Agora começa a parte mais importante: fazer uma boa compra.',
    subtitle: 'Do interesse ao registro com assessoria e segurança jurídica integral.',
    description: 'A maquete está de pé. Mas um imóvel só é verdadeiramente seu quando o cartório lavra a escritura e expede a matrícula definitiva.',
    ctaText: 'Quero encontrar meu imóvel',
    ctaTarget: '#imoveis',
    icon: CheckCircle2
  }
];

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressPercentRef = useRef<HTMLSpanElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const activeStepIndexRef = useRef<number>(0);
  const isVideoFrameDecodedRef = useRef<boolean>(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVideoFrameDecoded, setIsVideoFrameDecoded] = useState(false);

  // Initialize and prime video decoder for iOS Safari & Low Power Mode
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // WebKit strictly requires muted + defaultMuted + playsinline attributes on DOM
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    // Draw initial 3D blueprint immediately so canvas is never blank
    drawArchitecturalCanvas(0);

    const markVideoReady = () => {
      if (video.readyState >= 2 && !isVideoFrameDecodedRef.current) {
        isVideoFrameDecodedRef.current = true;
        setIsVideoFrameDecoded(true);
      }
    };

    // Prime hardware video decoder on iOS / WebKit
    const primeDecoder = () => {
      if (video && video.paused) {
        video.muted = true;
        video.defaultMuted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Pause immediately so scroll position drives currentTime
              video.pause();
              markVideoReady();
            })
            .catch(() => {
              // Low power mode or autoplay restriction may reject before gesture;
              // interaction listener below handles this on first touch
            });
        }
      }
    };

    if (video.readyState >= 2) {
      markVideoReady();
    } else {
      primeDecoder();
    }

    video.addEventListener('loadeddata', markVideoReady);
    video.addEventListener('canplay', markVideoReady);
    video.addEventListener('playing', markVideoReady);

    // iOS Low Power Mode unlocking on first interaction (touch/scroll)
    const onFirstInteraction = () => {
      primeDecoder();
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
    };
    window.addEventListener('touchstart', onFirstInteraction, { passive: true });
    window.addEventListener('scroll', onFirstInteraction, { passive: true });
    window.addEventListener('pointerdown', onFirstInteraction, { passive: true });

    return () => {
      video.removeEventListener('loadeddata', markVideoReady);
      video.removeEventListener('canplay', markVideoReady);
      video.removeEventListener('playing', markVideoReady);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
    };
  }, []);

  // Optimized Scroll & RAF loop: 60fps smooth interpolation + zero React re-render churn
  useEffect(() => {
    let animationFrameId: number;
    let targetProgress = 0;
    let currentSmoothProgress = 0;
    let isSeeking = false;
    let pendingSeekTime: number | null = null;
    let seekWatchdogTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      const scrolledDistance = -rect.top;
      targetProgress = Math.min(Math.max(scrolledDistance / totalScrollableDistance, 0), 1);
    };

    // Video frame seek manager: avoids aborting in-flight seeks + watchdog recovery for iOS
    const applyVideoSeek = (targetTime: number) => {
      const video = videoRef.current;
      if (!video || !video.duration || isNaN(video.duration)) return;

      const clampedTime = Math.min(Math.max(targetTime, 0), video.duration - 0.01);

      if (isSeeking || video.seeking) {
        pendingSeekTime = clampedTime;
        return;
      }

      if (Math.abs(video.currentTime - clampedTime) <= 0.02) {
        return;
      }

      isSeeking = true;
      pendingSeekTime = null;

      try {
        video.currentTime = clampedTime;
      } catch {
        isSeeking = false;
      }

      // Safety watchdog: iOS Safari can throttle or drop 'seeked' events under load or in Low Power Mode
      if (seekWatchdogTimer) clearTimeout(seekWatchdogTimer);
      seekWatchdogTimer = setTimeout(() => {
        isSeeking = false;
        if (pendingSeekTime !== null) {
          const next = pendingSeekTime;
          pendingSeekTime = null;
          applyVideoSeek(next);
        }
      }, 120);
    };

    const handleSeeked = () => {
      isSeeking = false;
      if (seekWatchdogTimer) clearTimeout(seekWatchdogTimer);

      const video = videoRef.current;
      if (video && video.readyState >= 2 && !isVideoFrameDecodedRef.current) {
        isVideoFrameDecodedRef.current = true;
        setIsVideoFrameDecoded(true);
      }

      if (pendingSeekTime !== null) {
        const next = pendingSeekTime;
        pendingSeekTime = null;
        applyVideoSeek(next);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('seeked', handleSeeked);
    }

    const updateLoop = () => {
      // Smooth luxury lerp (+15% more gradual interpolation)
      const diff = targetProgress - currentSmoothProgress;
      if (Math.abs(diff) < 0.001) {
        currentSmoothProgress = targetProgress;
      } else {
        currentSmoothProgress += diff * 0.26;
      }

      // 1. Direct GPU transform for bottom progress bar (0 React re-renders)
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${currentSmoothProgress})`;
      }

      // 2. Direct DOM text update for percentage counter (0 React re-renders)
      if (progressPercentRef.current) {
        progressPercentRef.current.textContent = `${Math.round(currentSmoothProgress * 100)}%`;
      }

      // 3. Direct DOM opacity update for scroll indicator prompt
      if (scrollPromptRef.current) {
        scrollPromptRef.current.style.opacity = currentSmoothProgress > 0.88 ? '0' : '1';
      }

      // 4. Update active step ONLY when threshold crossed (5 re-renders total across entire page)
      const stepIndex = Math.min(
        Math.floor(currentSmoothProgress * STEPS.length),
        STEPS.length - 1
      );
      if (stepIndex !== activeStepIndexRef.current) {
        activeStepIndexRef.current = stepIndex;
        setCurrentStepIndex(stepIndex);
      }

      // 5. Video seek controller (queued, non-blocking seek)
      if (video && video.duration && !isNaN(video.duration)) {
        applyVideoSeek(currentSmoothProgress * video.duration);
      }

      // 6. Draw procedural 3D canvas (always active as fallback / while video decodes)
      if (!isVideoFrameDecodedRef.current) {
        drawArchitecturalCanvas(currentSmoothProgress);
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (video) {
        video.removeEventListener('seeked', handleSeeked);
      }
      if (seekWatchdogTimer) clearTimeout(seekWatchdogTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Procedural 3D Architectural Mockup on Canvas (Always 60fps fallback & enhancement)
  const drawArchitecturalCanvas = (p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid baseline
    const cx = width / 2;
    const cy = height * 0.44;

    // Perspective transformation
    ctx.save();

    // Subtle isometric rotation & breathing
    const rotation = p * 0.15;

    // Draw terrain plot (Etapa 1)
    const groundSize = Math.min(width, height) * 0.38;
    ctx.beginPath();
    ctx.moveTo(cx - groundSize, cy);
    ctx.lineTo(cx, cy - groundSize * 0.5);
    ctx.lineTo(cx + groundSize, cy);
    ctx.lineTo(cx, cy + groundSize * 0.5);
    ctx.closePath();

    ctx.fillStyle = '#26160F';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#C85A32';
    ctx.stroke();

    // Plot demarcation lines
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(200, 90, 50, 0.4)';
    for (let i = 1; i <= 3; i++) {
      const offset = (groundSize / 4) * i;
      ctx.beginPath();
      ctx.moveTo(cx - groundSize + offset, cy + (offset * 0.5));
      ctx.lineTo(cx + offset, cy - groundSize * 0.5 + (offset * 0.5));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Foundation & Structure (Etapa 2: p > 0.15)
    if (p > 0.15) {
      const structProgress = Math.min(Math.max((p - 0.15) / 0.25, 0), 1);
      const buildingWidth = groundSize * 0.7;
      const buildingDepth = groundSize * 0.35;
      const maxFloors = 8;
      const visibleFloors = Math.floor(structProgress * maxFloors);

      const floorHeight = 18;

      for (let f = 0; f <= visibleFloors; f++) {
        const floorY = cy - f * floorHeight;
        const alpha = Math.min(1, structProgress * 1.5);

        // Floor slab
        ctx.beginPath();
        ctx.moveTo(cx - buildingWidth * 0.5, floorY);
        ctx.lineTo(cx, floorY - buildingDepth * 0.5);
        ctx.lineTo(cx + buildingWidth * 0.5, floorY);
        ctx.lineTo(cx, floorY + buildingDepth * 0.5);
        ctx.closePath();

        ctx.fillStyle = f === visibleFloors ? 'rgba(200, 90, 50, 0.7)' : 'rgba(53, 31, 22, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#FAF7F2';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Columns / Pillars (Etapa 2)
        if (f < visibleFloors) {
          ctx.strokeStyle = 'rgba(200, 90, 50, 0.5)';
          ctx.lineWidth = 2;
          const corners = [
            { x: cx - buildingWidth * 0.5, y: floorY },
            { x: cx, y: floorY - buildingDepth * 0.5 },
            { x: cx + buildingWidth * 0.5, y: floorY },
            { x: cx, y: floorY + buildingDepth * 0.5 }
          ];

          corners.forEach(pt => {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.x, pt.y - floorHeight);
            ctx.stroke();
          });
        }
      }
    }

    // Facade & Glasswork (Etapa 3: p > 0.40)
    if (p > 0.40) {
      const facadeProgress = Math.min(Math.max((p - 0.40) / 0.25, 0), 1);
      const buildingWidth = groundSize * 0.7;
      const totalHeight = 8 * 18;

      // Front-left facade wall
      ctx.beginPath();
      ctx.moveTo(cx - buildingWidth * 0.5, cy);
      ctx.lineTo(cx, cy + (groundSize * 0.35) * 0.5);
      ctx.lineTo(cx, cy + (groundSize * 0.35) * 0.5 - totalHeight * facadeProgress);
      ctx.lineTo(cx - buildingWidth * 0.5, cy - totalHeight * facadeProgress);
      ctx.closePath();

      ctx.fillStyle = `rgba(74, 46, 34, ${0.4 + facadeProgress * 0.4})`;
      ctx.fill();
      ctx.strokeStyle = '#FAF7F2';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Front-right facade wall with glass reflection
      ctx.beginPath();
      ctx.moveTo(cx, cy + (groundSize * 0.35) * 0.5);
      ctx.lineTo(cx + buildingWidth * 0.5, cy);
      ctx.lineTo(cx + buildingWidth * 0.5, cy - totalHeight * facadeProgress);
      ctx.lineTo(cx, cy + (groundSize * 0.35) * 0.5 - totalHeight * facadeProgress);
      ctx.closePath();

      ctx.fillStyle = `rgba(196, 145, 56, ${0.2 + facadeProgress * 0.35})`;
      ctx.fill();
      ctx.stroke();

      // Architectural balconies
      if (facadeProgress > 0.6) {
        ctx.strokeStyle = 'rgba(250, 247, 242, 0.8)';
        ctx.lineWidth = 1.5;
        for (let b = 1; b <= 5; b++) {
          const by = cy - b * 22;
          ctx.beginPath();
          ctx.moveTo(cx - 30, by + 10);
          ctx.lineTo(cx + 30, by + 2);
          ctx.stroke();
        }
      }
    }

    // Warm Interior Ambience / Light (Etapa 4: p > 0.65)
    if (p > 0.65) {
      const lightProgress = Math.min(Math.max((p - 0.65) / 0.20, 0), 1);
      
      // Warm glowing windows
      ctx.fillStyle = `rgba(245, 190, 80, ${lightProgress * 0.8})`;
      const windowCount = 6;
      for (let w = 1; w <= windowCount; w++) {
        const wy = cy - w * 18 - 8;
        ctx.fillRect(cx - 35, wy, 8, 10);
        ctx.fillRect(cx - 15, wy + 2, 8, 10);
        ctx.fillRect(cx + 10, wy + 2, 8, 10);
        ctx.fillRect(cx + 30, wy, 8, 10);
      }
    }

    // Complete Architectural Mockup & Atmosphere (Etapa 5: p > 0.85)
    if (p > 0.85) {
      const crownProgress = Math.min(Math.max((p - 0.85) / 0.15, 0), 1);
      
      // Crown / Rooftop garden
      const topY = cy - 8 * 18;
      ctx.beginPath();
      ctx.arc(cx, topY - 12, 16 * crownProgress, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 90, 50, 0.9)';
      ctx.fill();
      ctx.strokeStyle = '#FAF7F2';
      ctx.stroke();

      // Surrounding trees / landscape indicators (Zona Norte verde)
      const treePoints = [
        { x: cx - groundSize * 0.8, y: cy - 10 },
        { x: cx + groundSize * 0.7, y: cy + 15 },
        { x: cx - groundSize * 0.4, y: cy + 40 }
      ];

      treePoints.forEach(tp => {
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 10 * crownProgress, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 110, 60, 0.75)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(250, 247, 242, 0.4)';
        ctx.stroke();
      });
    }

    ctx.restore();
  };

  // Jump smoothly to a specific stage
  const jumpToStep = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    const targetScroll = container.offsetTop + (totalScrollable * (index / (STEPS.length - 1)));
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const activeStep = STEPS[currentStepIndex];

  return (
    <section 
      ref={containerRef} 
      id="maquete" 
      className="relative w-full bg-[#1A0E09] text-[#FAF7F2]"
      style={{ height: '370vh' }}
    >
      {/* Sticky viewport frame - Exactly sized between sticky header (h-20/5rem) and viewport bottom */}
      <div className="sticky top-20 h-[calc(100vh-5rem)] h-[calc(100dvh-5rem)] w-full flex flex-col justify-between overflow-hidden">
        
        {/* Background Visual Layer: Real Video scrubbing if present + Procedural Canvas Engine */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          {/* Native Video player ready for maquete.mp4 with iOS WebKit optimizations */}
          <video
            ref={videoRef}
            src="/video/maquete.mp4#t=0.001"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
              isVideoFrameDecoded ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
          />

          {/* Procedural Canvas Layer: ALWAYS rendered so iPhone Low Power Mode never sees a black screen */}
          <canvas
            ref={canvasRef}
            width={800}
            height={700}
            className={`w-full max-w-2xl h-auto aspect-square object-contain transition-opacity duration-700 -translate-y-8 sm:-translate-y-12 ${
              isVideoFrameDecoded ? 'opacity-0 pointer-events-none' : 'opacity-95'
            }`}
          />

          {/* Cinematic gradient scrim: balanced across the full height for crystal clear centered text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/85 pointer-events-none" />
        </div>

        {/* Top Bar with Step Pill & Selector (Hidden on mobile) */}
        <div className="hidden sm:flex relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 items-center justify-between">
          {/* Element from Print 2: Step Pill moved UP to the top bar */}
          <div className="inline-flex items-center space-x-2 bg-black/65 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-[#FF9E7D] font-bold">
              {activeStep.phase}
            </span>
          </div>

          {/* Milestone Step Selector (Desktop & Mobile) */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
            {STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => jumpToStep(idx)}
                className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full transition-all duration-300 ${
                  currentStepIndex === idx
                    ? 'bg-[#C85A32] text-white shadow-sm scale-105'
                    : 'text-white/60 hover:text-white'
                }`}
                aria-label={`Ir para etapa ${s.id}`}
              >
                0{s.id}
              </button>
            ))}
            <span ref={progressPercentRef} className="text-xs text-white/60 pl-1 font-mono">
              0%
            </span>
          </div>
        </div>

        {/* Narrative Story - Centered Vertically & Horizontally across Web and Mobile */}
        <div className="relative z-10 w-full max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 my-auto py-4 sm:py-6 text-center flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-center transition-all duration-500 mx-auto">
            {/* Main Headline with high-contrast text shadow - Increased font size */}
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-3 sm:mb-4 leading-snug sm:leading-tight text-center [text-shadow:_0_2px_16px_rgba(0,0,0,0.95),_0_4px_32px_rgba(0,0,0,0.85)] max-w-2xl mx-auto">
              {activeStep.title}
            </h3>
            
            {/* Description - Increased font size */}
            <p className="font-body text-sm sm:text-base md:text-lg text-white/95 leading-relaxed max-w-xl sm:max-w-2xl mb-4 text-center mx-auto [text-shadow:_0_1px_10px_rgba(0,0,0,0.95)]">
              {activeStep.description}
            </p>

            {/* Step Highlights if available */}
            {activeStep.highlights && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {activeStep.highlights.map((h, i) => (
                  <span 
                    key={i}
                    className="inline-flex items-center text-xs sm:text-sm px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white font-medium shadow-md [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] mr-2" />
                    {h}
                  </span>
                ))}
              </div>
            )}

            {/* Contextual CTA for Step 5 */}
            {activeStep.ctaText && (
              <div className="pt-2 flex justify-center w-full">
                <a
                  href={activeStep.ctaTarget}
                  className="inline-flex items-center justify-center space-x-2 bg-[#C85A32] hover:bg-[#AB4823] text-white px-8 py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 shadow-xl shadow-black/50 touch-target active:scale-95"
                >
                  <span>{activeStep.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer Bar: Scroll Indicator Prompt ("Print 2") anchored at bottom footer style */}
        <div 
          ref={scrollPromptRef}
          className="relative z-10 w-full flex items-center justify-center pb-4 sm:pb-5 pointer-events-none transition-opacity duration-300"
        >
          <div className="inline-flex items-center justify-center space-x-2 text-xs sm:text-sm text-white/95 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-[#FF9E7D]" />
            <span className="font-medium tracking-wide">Role para avançar a construção da maquete</span>
          </div>
        </div>

        {/* Global Progress Bar at bottom of screen - Hardware accelerated with scaleX */}
        <div className="relative z-20 w-full h-1 bg-white/10 overflow-hidden">
          <div 
            ref={progressBarRef}
            className="h-full w-full bg-gradient-to-r from-[#C85A32] to-[#C49138] origin-left will-change-transform"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

      </div>
    </section>
  );
}
