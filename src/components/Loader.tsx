"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Loader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowsRef = useRef<HTMLDivElement>(null);

  // Disable scroll when loading to maintain visual focus
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 3D Parallax, Canvas Stars, and Auto-Drift animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle viewport resize dynamically
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Star data representation
    const starsCount = 45;
    const stars: {
      x: number;
      y: number;
      size: number;
      speed: number;
      alpha: number;
      alphaSpeed: number;
    }[] = [];

    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5, // 0.5px to 2.0px
        speed: Math.random() * 0.12 + 0.04, // extremely slow drifting
        alpha: Math.random() * 0.85 + 0.15, // opacity
        alphaSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    // Parallax variables - manually calculated using high-performance lerp
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let autoTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset from the exact center of screen normalized between [-1, 1]
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      targetX = dx * 32; // max offset of 32px
      targetY = dy * 32;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // High performance animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Automated breathing/floating camera drift
      autoTime += 0.0035;
      const autoX = Math.sin(autoTime) * 14;
      const autoY = Math.cos(autoTime * 0.7) * 14;

      // Mouse displacement spring interpolation
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      const totalX = currentX + autoX;
      const totalY = currentY + autoY;

      // Render starfield
      for (let i = 0; i < starsCount; i++) {
        const star = stars[i];

        // Slide upward
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Shimmer opacity update
        star.alpha += star.alphaSpeed;
        if (star.alpha > 1.0 || star.alpha < 0.15) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        // Draw position adjusted for depth (50% parallax coefficient)
        const drawX = (star.x + totalX * 0.5 + width) % width;
        const drawY = (star.y + totalY * 0.5 + height) % height;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, Math.min(1.0, star.alpha))})`;
        ctx.fill();
      }

      // Parallax Grid (35% parallax coefficient)
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${totalX * 0.35}px, ${totalY * 0.35}px, 0)`;
      }

      // Parallax Ambient Aurora (20% parallax coefficient)
      if (glowsRef.current) {
        glowsRef.current.style.transform = `translate3d(${totalX * 0.2}px, ${totalY * 0.2}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const nameLetters = "ZAID MARIAM".split("");

  // Letter reveal staggered config
  const titleContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.055,
        delayChildren: 0.15,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // premium easeOutExpo curve
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: "blur(16px)",
        scale: 1.04,
      }}
      transition={{
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as [number, number, number, number], // easeInOutQuart - Apple/Vercel standard exit curve
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#090611] select-none"
    >
      {/* Cinematic Custom CSS Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes light-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .sweep-text {
          background: linear-gradient(
            110deg,
            #ffffff 35%,
            #a855f7 48%,
            #d946ef 50%,
            #8b5cf6 52%,
            #ffffff 65%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: light-sweep 4.5s linear infinite;
        }

        @keyframes noise-drift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-0.5%, -0.5%); }
          20% { transform: translate(-1%, 0.5%); }
          30% { transform: translate(0.5%, -1%); }
          40% { transform: translate(-0.5%, 1.5%); }
          50% { transform: translate(-1%, 0.5%); }
          60% { transform: translate(1%, 1%); }
          70% { transform: translate(1.5%, -0.5%); }
          80% { transform: translate(-1%, 0.5%); }
          90% { transform: translate(0.5%, -1.5%); }
          100% { transform: translate(0, 0); }
        }
        .grain-noise {
          animation: noise-drift 0.7s steps(5) infinite;
        }

        @keyframes aurora-glow-1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(35px, -50px) scale(1.1); }
          66% { transform: translate(-25px, 25px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes aurora-glow-2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-45px, 45px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes aurora-glow-3 {
          0% { transform: translate(0px, 0px) scale(1); }
          40% { transform: translate(25px, 35px) scale(0.9); }
          80% { transform: translate(-35px, -25px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .aurora-anim-1 { animation: aurora-glow-1 18s ease-in-out infinite; }
        .aurora-anim-2 { animation: aurora-glow-2 22s ease-in-out infinite; }
        .aurora-anim-3 { animation: aurora-glow-3 15s ease-in-out infinite; }
      `}} />

      {/* Background Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Fine-line Grid Overlay */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none z-1 opacity-20"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
              <path d="M 70 0 L 0 0 0 70" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Film Grain Noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-2 overflow-hidden opacity-[0.03]">
        <svg className="grain-noise w-[110%] h-[110%] -top-[5%] -left-[5%] relative" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Moving Aurora Accents */}
      <div
        ref={glowsRef}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
      >
        <div className="aurora-anim-1 absolute w-[550px] h-[550px] rounded-full bg-[#8b5cf6]/9 blur-[130px] -translate-x-[20%] -translate-y-[15%]" />
        <div className="aurora-anim-2 absolute w-[650px] h-[650px] rounded-full bg-[#a855f7]/10 blur-[150px] translate-x-[15%] translate-y-[20%]" />
        <div className="aurora-anim-3 absolute w-[450px] h-[450px] rounded-full bg-[#d946ef]/5 blur-[110px] -translate-y-[5%]" />
      </div>

      {/* Core Typographical Elements */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        
        {/* Animated Vector Sparkle (✦) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: -8 }}
          animate={{
            opacity: [0.75, 1, 0.75],
            scale: [0.95, 1.1, 0.95],
            y: 0,
            rotate: 360,
          }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 1.1, ease: "easeOut" },
            rotate: { duration: 16, repeat: Infinity, ease: "linear" },
          }}
          className="mb-8 flex items-center justify-center text-[#c084fc]"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>

        {/* Large Name Text (Letter-by-Letter Staggered Reveal) */}
        <motion.h1
          variants={titleContainerVariants}
          initial="hidden"
          animate="visible"
          className="sweep-text text-5xl md:text-7xl font-bold tracking-[0.3em] uppercase pl-[0.3em]"
        >
          {nameLetters.map((letter, idx) => (
            <motion.span
              key={idx}
              variants={letterVariants}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Center-growing Gradient Separator Line */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: {
              scaleX: 1,
              opacity: 0.5,
              transition: {
                delay: 1.1,
                duration: 1.3,
                ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
              },
            },
          }}
          className="my-5 h-[1px] w-48 md:w-64 bg-gradient-to-r from-transparent via-[#8b5cf6] via-[#d946ef] via-[#a855f7] to-transparent origin-center"
        />

        {/* Subtitle Text (Fades In post-name) */}
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 1.4,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="text-[10px] md:text-[11px] font-normal uppercase tracking-[0.45em] text-[#9ca3af] pl-[0.45em]"
        >
          Full Stack Developer
        </motion.p>

      </div>
    </motion.div>
  );
}