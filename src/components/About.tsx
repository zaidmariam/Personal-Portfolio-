"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  animate,
  Variants
} from "framer-motion";
import {
  Laptop,
  Code2,
  Zap,
  Brain,
  GraduationCap,
  Layers,
  Briefcase,
  Sparkles
} from "lucide-react";
import { useTranslations } from "next-intl";

// =========================
// COUNTER SUB-COMPONENT
// =========================
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1], // Custom premium ease-out
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.floor(latest) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [inView, value, suffix]);

  return (
    <span ref={ref} className="font-extrabold tabular-nums">
      0{suffix}
    </span>
  );
}

// =========================
// CODE TYPEWRITER DATA
// =========================
interface Token {
  text: string;
  type: "keyword" | "property" | "string" | "operator" | "bracket" | "text" | "indent";
}

// =========================
// MAIN ABOUT COMPONENT
// =========================
export default function About() {
  const [mounted, setMounted] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const t = useTranslations("About");

  const containerRef = useRef<HTMLDivElement>(null);
  const cardAreaRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Mount protection
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = false;

  // =========================
  // CODE TYPEWRITER DATA
  // =========================
  const codeLines = useMemo<Token[][]>(() => [
    [
      { text: "const ", type: "keyword" },
      { text: "developer", type: "text" },
      { text: " = ", type: "operator" },
      { text: "{", type: "bracket" }
    ],
    [
      { text: "  name", type: "property" },
      { text: ": ", type: "operator" },
      { text: `"${t("card.nameValue") || "Zaid Mariam"}"`, type: "string" },
      { text: ",", type: "text" }
    ],
    [
      { text: "  role", type: "property" },
      { text: ": ", type: "operator" },
      { text: `"${t("card.roleValue") || "Full Stack Developer"}"`, type: "string" },
      { text: ",", type: "text" }
    ],
    
    [
      { text: "  education", type: "property" },
      { text: ": ", type: "operator" },
      { text: `"${t("card.educationValue") || "OFPPT"}"`, type: "string" },
      { text: ",", type: "text" }
    ],
    [
      { text: "  stack", type: "property" },
      { text: ": ", type: "operator" },
      { text: "[", type: "bracket" }
    ],
    [
      { text: "    ", type: "indent" },
      { text: '"React"', type: "string" },
      { text: ", ", type: "text" },
      { text: '"Laravel"', type: "string" },
      { text: ",", type: "text" }
    ],
    [
      { text: "    ", type: "indent" },
      { text: '"PHP"', type: "string" },
      { text: ", ", type: "text" },
      { text: '"Tailwind CSS"', type: "string" },
      { text: ", ", type: "text" },
      { text: '"MySQL"', type: "string" }
    ],
    [
      { text: "  ", type: "indent" },
      { text: "]", type: "bracket" },
      { text: ",", type: "text" }
    ],
    [
      { text: "  mindset", type: "property" },
      { text: ": ", type: "operator" },
      { text: `"${t("card.mindsetValue") || "Always Learning 🚀"}"`, type: "string" }
    ],
    [
      { text: "};", type: "bracket" }
    ]
  ], [t]);

  const tokenizedLines = useMemo(() => {
    let charAccumulator = 0;
    return codeLines.map((line) => {
      return line.map((token) => {
        const start = charAccumulator;
        const end = charAccumulator + token.text.length;
        charAccumulator = end;
        return { ...token, start, end };
      });
    });
  }, [codeLines]);

  const totalChars = useMemo(() => {
    if (tokenizedLines.length === 0) return 0;
    const lastLine = tokenizedLines[tokenizedLines.length - 1];
    if (lastLine.length === 0) return 0;
    return lastLine[lastLine.length - 1].end;
  }, [tokenizedLines]);

  // Typewriter Loop
  useEffect(() => {
    if (!mounted || totalChars === 0) return;

    const timer = setInterval(() => {
      setTypedCount((prev) => {
        if (prev >= totalChars + 80) {
          return 0; // reset loop
        }
        return prev + 1;
      });
    }, 15);

    return () => clearInterval(timer);
  }, [mounted, totalChars]);

  // =========================
  // MOUSE 3D PARALLAX (CARD)
  // =========================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for 3D tilt effects
  const rotateX = useSpring(useTransform(mouseY, [-250, 250], [10, -10]), {
    stiffness: 120,
    damping: 25
  });

  const rotateY = useSpring(useTransform(mouseX, [-250, 250], [-10, 10]), {
    stiffness: 120,
    damping: 25
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardAreaRef.current) return;
    const rect = cardAreaRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // =========================
  // SCROLL TIMELINE PROGRESS
  // =========================
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"]
  });
  const timelineLineY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Timeline entries
  const timelineEntries = [
    {
      year: t("journey.milestones.m1.year"),
      title: t("journey.milestones.m1.title"),
      desc: t("journey.milestones.m1.desc"),
      icon: Code2,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      year: t("journey.milestones.m2.year"),
      title: t("journey.milestones.m2.title"),
      desc: t("journey.milestones.m2.desc"),
      icon: GraduationCap,
      gradient: "from-purple-500 to-fuchsia-500",
    },
    {
      year: t("journey.milestones.m3.year"),
      title: t("journey.milestones.m3.title"),
      desc: t("journey.milestones.m3.desc"),
      icon: Layers,
      gradient: "from-fuchsia-500 to-pink-500",
    },
    {
      year: t("journey.milestones.m4.year"),
      title: t("journey.milestones.m4.title"),
      desc: t("journey.milestones.m4.desc"),
      icon: Briefcase,
      gradient: "from-pink-500 to-violet-500",
    },
  ];

  const getTokenClass = (type: string) => {
    switch (type) {
      case "keyword":
        return "text-pink-500 dark:text-pink-400 font-semibold";
      case "property":
        return "text-blue-600 dark:text-blue-400";
      case "string":
        return "text-emerald-600 dark:text-emerald-400";
      case "operator":
        return "text-purple-600 dark:text-purple-400";
      case "bracket":
        return "text-amber-600 dark:text-amber-400";
      case "indent":
        return "";
      default:
        return "text-neutral-700 dark:text-neutral-300";
    }
  };

  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 50, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  return (
    <section
  id="about"
  ref={containerRef}
  className="relative min-h-screen pt-4 sm:pt-8 md:pt-16 pb-20 md:pb-32 overflow-hidden bg-[#050505] transition-colors duration-300 select-none"
>
      {/* 3D Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] [background-image:linear-gradient(#ffffff15_1px,transparent_1px),linear-gradient(90deg,#ffffff15_1px,transparent_1px)] [background-size:60px_60px] [transform:perspective(800px)_rotateX(60deg)] [transform-origin:top] pointer-events-none" />

      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] rounded-full bg-violet-500/10 dark:bg-violet-600/10 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-[550px] h-[550px] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-600/10 blur-[150px] pointer-events-none" />

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted &&
          Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -60, 0],
                x: [0, i % 2 === 0 ? 30 : -30, 0],
                opacity: [0.15, 0.65, 0.15]
              }}
              transition={{
                duration: 6 + (i % 5) * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
              className="absolute rounded-full bg-violet-400/30 dark:bg-violet-400/40 blur-[2px]"
              style={{
                width: `${4 + (i % 4)}px`,
                height: `${4 + (i % 4)}px`,
                left: `${(i * 7) % 95}%`,
                top: `${(i * 11) % 90}%`
              }}
            />
          ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ========================================================
            TOP GRID: HEADING + VS CODE DEVS CARD
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          {/* LEFT SIDE: BRIEF BIO AND METRICS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.12 } }
            }}
            className="lg:col-span-6 space-y-8"
          >
            {/* Tag Badge */}
            <motion.div
              variants={revealVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.1)]"
            >
              <Sparkles size={13} className="animate-pulse" />
              <span>{t("badge")}</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={revealVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-neutral-900 dark:text-white"
            >
              {t("titlePart1")}
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(139,92,246,0.15)]">
                {t("titlePart2")}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={revealVariants}
              className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed font-medium"
            >
              {t("description")}
            </motion.p>

            {/* Numerical Statistics */}
            <motion.div
              variants={revealVariants}
              className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-neutral-200 dark:border-white/5"
            >
              {/* Projects */}
              <div className="space-y-1">
                <div className="flex items-center gap-0.5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-violet-600 dark:text-violet-400">
                  <Counter value={3} suffix="+" />
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                  {t("stats.projects")}
                </p>
              </div>

              {/* Technologies */}
              <div className="space-y-1">
                <div className="flex items-center gap-0.5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                  <Counter value={10} suffix="+" />
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                  {t("stats.tech")}
                </p>
              </div>

              {/* Passion */}
              <div className="space-y-1">
                <div className="flex items-center gap-0.5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-fuchsia-600 dark:text-fuchsia-400">
                  <Counter value={100} suffix="%" />
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                  {t("stats.passion")}
                </p>
              </div>

              {/* Years of Study */}
              <div className="space-y-1">
                <div className="flex items-center gap-0.5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-pink-600 dark:text-pink-400">
                  <Counter value={2} suffix="+" />
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                  {t("stats.study")}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: IDE CODE DEV CARD WITH FLOATING BADGES */}
          <div
            ref={cardAreaRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-6 relative flex items-center justify-center min-h-[520px] perspective-[1200px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Parallax Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 1200 }}
              whileHover={{
                boxShadow: isLight
                  ? "0 30px 60px rgba(139, 92, 246, 0.1), 0 0 25px rgba(139, 92, 246, 0.04)"
                  : "0 30px 60px rgba(139, 92, 246, 0.22), 0 0 30px rgba(139, 92, 246, 0.08)",
                borderColor: isLight
                  ? "rgba(139, 92, 246, 0.15)"
                  : "rgba(139, 92, 246, 0.12)"
              }}
              className="w-full max-w-lg relative bg-white/70 dark:bg-neutral-950/40 backdrop-blur-[24px] border border-neutral-200/50 dark:border-white/5 shadow-2xl rounded-2xl overflow-hidden transition-colors duration-300 z-10"
            >
              {/* Window Header */}
              <div
                style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
                className="flex items-center justify-between px-4 py-3 bg-neutral-200/30 dark:bg-white/5 border-b border-neutral-200/40 dark:border-white/5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-black/5" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-black/5" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-black/5" />
                </div>
                <div className="text-xs font-bold text-neutral-500 dark:text-neutral-500 font-mono tracking-wide">
                  developer.ts
                </div>
                <div className="w-12" />
              </div>

              {/* Code Workspace */}
              <div
                style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                className="p-6 font-mono text-sm leading-relaxed overflow-x-auto min-h-[320px] select-text"
              >
                {tokenizedLines.map((line, lineIdx) => {
                  return (
                    <div key={lineIdx} className="flex items-start group">
                      {/* Line Number */}
                      <span className="text-neutral-300 dark:text-neutral-700 select-none text-right w-6 pr-4 border-r border-neutral-200 dark:border-neutral-800/50 mr-4 font-mono">
                        {lineIdx + 1}
                      </span>
                      {/* Line Code */}
                      <span className="flex-1 flex flex-wrap">
                        {line.map((token, tokenIdx) => {
                          const isFullyRendered = typedCount >= token.end;
                          const isPartiallyRendered = typedCount > token.start && typedCount < token.end;

                          if (isFullyRendered) {
                            return (
                              <span key={tokenIdx} className={getTokenClass(token.type)}>
                                {token.text}
                              </span>
                            );
                          }

                          if (isPartiallyRendered) {
                            const sliceOffset = typedCount - token.start;
                            return (
                              <span key={tokenIdx} className="inline-flex items-center">
                                <span className={getTokenClass(token.type)}>
                                  {token.text.slice(0, sliceOffset)}
                                </span>
                                <motion.span
                                  animate={{ opacity: [1, 0, 1] }}
                                  transition={{ repeat: Infinity, duration: 0.8 }}
                                  className="inline-block w-1.5 h-3.5 bg-violet-500 dark:bg-violet-400"
                                />
                              </span>
                            );
                          }

                          return null;
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ========================================================
                FLOATING GLASS BADGES (ROUND THE DEVS CARD IN 3D SPACE)
                ======================================================== */}
            {/* Badge 1: Full Stack Developer (Top Left) */}
            {/* Badge 1: Full Stack Developer (Top Left) */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                translateZ: 60,
                transformStyle: "preserve-3d"
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, translateZ: 85 }}
              className="absolute -top-6 -left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-neutral-200/50 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg text-neutral-800 dark:text-white pointer-events-auto"
            >
              <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
                <Laptop size={15} />
              </div>
              <span className="text-xs font-extrabold tracking-wide">{t("card.fullStack")}</span>
            </motion.div>

            {/* Badge 2: Clean Code (Top Right) */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                translateZ: 80,
                transformStyle: "preserve-3d"
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              whileHover={{ scale: 1.05, translateZ: 105 }}
              className="absolute -top-10 -right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-neutral-200/50 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg text-neutral-800 dark:text-white pointer-events-auto"
            >
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                <Code2 size={15} />
              </div>
              <span className="text-xs font-extrabold tracking-wide">{t("card.cleanCode")}</span>
            </motion.div>

            {/* Badge 3: Fast Learner (Bottom Left) */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                translateZ: 50,
                transformStyle: "preserve-3d"
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              whileHover={{ scale: 1.05, translateZ: 75 }}
              className="absolute -bottom-8 -left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-neutral-200/50 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg text-neutral-800 dark:text-white pointer-events-auto"
            >
              <div className="p-1.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-500">
                <Zap size={15} />
              </div>
              <span className="text-xs font-extrabold tracking-wide">{t("card.fastLearner")}</span>
            </motion.div>

            {/* Badge 4: Problem Solver (Bottom Right) */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                translateZ: 70,
                transformStyle: "preserve-3d"
              }}
              animate={{ y: [0, -11, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              whileHover={{ scale: 1.05, translateZ: 95 }}
              className="absolute -bottom-10 -right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-neutral-200/50 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg text-neutral-800 dark:text-white pointer-events-auto"
            >
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-500">
                <Brain size={15} />
              </div>
              <span className="text-xs font-extrabold tracking-wide">{t("card.problemSolver")}</span>
            </motion.div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM TIMELINE: SCROLL-DRIVEN EXPERIENCE
            ======================================================== */}
        <div ref={timelineRef} className="mt-20 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="text-center space-y-4 max-w-xl mx-auto"
          >
            <h3 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {t("journey.title")}
            </h3>
            <p className="text-neutral-500 dark:text-neutral-500 text-xs font-bold tracking-widest uppercase">
              {t("journey.subtitle")}
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto py-12">
            {/* Dynamic Scroll-Linked Timeline Progress Line */}
            <div className="absolute left-[23px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-neutral-200 dark:bg-neutral-850" />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: "100%" }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ scaleY: timelineLineY }}
              className="absolute left-[23px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-500 via-purple-500 to-fuchsia-500 origin-top shadow-[0_0_10px_#8b5cf6]"
            />

            {/* Timeline Cards Loop */}
            <div className="space-y-12">
              {timelineEntries.map((entry, index) => {
                const isEven = index % 2 === 0;
                const IconComponent = entry.icon;
                return (
                  <div
                    key={entry.year}
                    className="relative flex flex-col md:flex-row items-start md:items-center"
                  >
                    {/* Circle Node on Timeline */}
                    <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 z-20 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: false, amount: 0.35 }}
                        transition={{ type: "spring", stiffness: 120, damping: 15, delay: index * 0.05 }}
                        className={`w-6 h-6 rounded-full border-[3px] border-white dark:border-[#050505] bg-gradient-to-tr ${entry.gradient} shadow-lg`}
                      />
                    </div>

                    {/* Timeline Grid Content Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full pl-12 md:pl-0">
                      {/* Left Block: Render card if even, otherwise empty on desktop */}
                      <div className={`md:px-8 ${isEven ? "md:text-right" : "md:order-2"}`}>
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 80,
                            scale: 0.95,
                            rotateX: 10,
                            filter: "blur(10px)"
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                            filter: "blur(0px)"
                          }}
                          viewport={{ once: false, amount: 0.35 }}
                          transition={{
                            type: "spring",
                            stiffness: 70,
                            damping: 18,
                            delay: index * 0.1
                          }}
                          whileHover={{ y: -3 }}
                          className="p-7 rounded-3xl border border-neutral-200/40 dark:border-white/5 bg-white/40 dark:bg-[#080808]/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-violet-500/30 dark:hover:border-violet-500/20 hover:shadow-[0_20px_50px_rgba(139,92,246,0.1)] dark:hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] transition-all duration-500"
                        >
                          <div
                            className={`flex items-center gap-3 mb-2 md:justify-start ${isEven ? "md:flex-row-reverse" : ""
                              }`}
                          >
                            <div className={`p-2 rounded-xl bg-gradient-to-tr ${entry.gradient} text-white shadow-md`}>
                              <IconComponent size={16} />
                            </div>
                            <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                              {entry.year}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                            {entry.title}
                          </h4>
                          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                            {entry.desc}
                          </p>
                        </motion.div>
                      </div>

                      {/* Right Block: Spacer grid element */}
                      <div className="hidden md:block" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}