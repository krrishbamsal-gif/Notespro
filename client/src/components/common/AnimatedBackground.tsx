import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedBackgroundProps {
  intensity?: 'subtle' | 'vibrant';
  showParticles?: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  intensity = 'vibrant',
  showParticles = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, accent } = useTheme();

  // Color config based on accent theme
  const getAccentColors = () => {
    switch (accent) {
      case 'cyan':
        return {
          orb1: 'rgba(6, 182, 212, 0.22)',
          orb2: 'rgba(59, 130, 246, 0.18)',
          orb3: 'rgba(20, 184, 166, 0.15)',
          particle: 'rgba(6, 182, 212, 0.45)',
        };
      case 'emerald':
        return {
          orb1: 'rgba(16, 185, 129, 0.22)',
          orb2: 'rgba(6, 182, 212, 0.18)',
          orb3: 'rgba(139, 92, 246, 0.15)',
          particle: 'rgba(16, 185, 129, 0.45)',
        };
      case 'purple':
      default:
        return {
          orb1: 'rgba(139, 92, 246, 0.22)',
          orb2: 'rgba(99, 102, 241, 0.18)',
          orb3: 'rgba(6, 182, 212, 0.16)',
          particle: 'rgba(168, 85, 247, 0.45)',
        };
    }
  };

  const colors = getAccentColors();

  // Floating star / particle canvas effect
  useEffect(() => {
    if (!showParticles) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = Math.min(45, Math.floor((width * height) / 30000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      targetAlpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        targetAlpha: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges softly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Gentle twinkle
        p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        if (Math.abs(p.targetAlpha - p.alpha) < 0.05) {
          p.targetAlpha = Math.random() * 0.6 + 0.15;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' 
          ? `rgba(196, 181, 253, ${p.alpha})`
          : `rgba(124, 58, 237, ${p.alpha * 0.7})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = colors.particle;
        ctx.fill();

        // Connect nearby particles with subtle glowing lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = theme === 'dark'
              ? `rgba(167, 139, 250, ${lineAlpha})`
              : `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showParticles, theme, accent]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Subtle Perspective Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 mask-radial" />

      {/* 2. Floating Animated Glowing Orbs */}
      {/* Orb 1: Top-Left Purple/Primary Glow */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full blur-[140px] animate-orb-1"
        style={{
          background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)`,
        }}
      />

      {/* Orb 2: Bottom-Right Indigo/Cyan Glow */}
      <div
        className="absolute -bottom-[20%] -right-[15%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full blur-[160px] animate-orb-2"
        style={{
          background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)`,
        }}
      />

      {/* Orb 3: Center-Right Accent Glow */}
      <div
        className="absolute top-[35%] right-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full blur-[130px] animate-orb-3"
        style={{
          background: `radial-gradient(circle, ${colors.orb3} 0%, transparent 65%)`,
        }}
      />

      {/* 3. Subtle Animated Aurora Light Streak */}
      <div
        className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-purple-500/10 via-transparent to-transparent animate-aurora"
      />

      {/* 4. Canvas Floating Particles & Constellations */}
      {showParticles && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
      )}

      {/* 5. Radial Vignette to focus content in center */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/70 pointer-events-none" />
    </div>
  );
};
