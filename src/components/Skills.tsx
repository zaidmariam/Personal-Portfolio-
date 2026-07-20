"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, Variants, useSpring, useMotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, Workflow, Database } from "lucide-react";
import {
  FaReact,
  FaLaravel,
  FaPhp,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaCss3Alt,
  FaWordpress,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiJavascript,
  SiMysql,
  SiMongodb,
  SiPostman,
  SiNodedotjs,
} from "react-icons/si";

interface Technology {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface SkillCategory {
  id: string;
  title: string;
  layer: string;
  description: string;
  glowColor: string;
  gradientFrom: string;
  gradientTo: string;
  accentText: string;
  glowShadow: string;
  gridSpan: string;
  techs: Technology[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 18,
    },
  },
};

function LetterReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const letters = Array.from(text);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 180,
      },
    },
    hidden: {
      opacity: 0,
      y: 25,
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="inline-block"
    >
      {letters.map((char, index) => (
        <motion.span
          variants={child}
          key={index}
          className={`inline-block ${char === " " ? "mr-[0.2em]" : ""} ${className || ""}`}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Skills() {
  const t = useTranslations("Skills");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isLight = false;

  const skillCategories: SkillCategory[] = useMemo(() => [
    {
      id: "frontend",
      title: t("categories.frontend.title"),
      layer: t("categories.frontend.layer"),
      description: t("categories.frontend.description"),
      glowColor: "#06b6d4",
      gradientFrom: "from-cyan-500/20",
      gradientTo: "to-blue-500/20",
      accentText: "text-cyan-600 dark:text-cyan-400",
      glowShadow: "shadow-[0_0_15px_rgba(6,182,212,0.35)]",
      gridSpan: "md:col-span-7",
      techs: [
        { name: "React", icon: FaReact, color: "#61DAFB" },
        { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
       { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
        { name: "HTML", icon: FaHtml5, color: "#E34F26" },
        { name: "CSS", icon: FaCss3Alt, color: "#1572B6" },
      ],
    },
    {
      id: "backend",
      title: t("categories.backend.title"),
      layer: t("categories.backend.layer"),
      description: t("categories.backend.description"),
      glowColor: "#a855f7",
      gradientFrom: "from-purple-500/20",
      gradientTo: "to-pink-500/20",
      accentText: " text-purple-400",
      glowShadow: "shadow-[0_0_15px_rgba(168,85,247,0.35)]",
      gridSpan: "md:col-span-5",
      techs: [
        { name: "Laravel", icon: FaLaravel, color: "#FF2D20" },
        { name: "PHP", icon: FaPhp, color: "#777BB4" },
        { name: "REST API", icon: Workflow, color: "#A855F7" },
      ],
    },
    {
      id: "database",
      title: t("categories.database.title"),
      layer: t("categories.database.layer"),
      description: t("categories.database.description"),
      glowColor: "#06b6d4",
      gradientFrom: "from-blue-500/20",
      gradientTo: "to-cyan-500/20",
      accentText: "text-cyan-600 dark:text-cyan-400",
      glowShadow: "shadow-[0_0_15px_rgba(6,182,212,0.35)]",
      gridSpan: "md:col-span-5",
      techs: [
        { name: "MySQL", icon: SiMysql, color: "#4479A1" },
        { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      ],
    },
    {
      id: "tools",
      title: t("categories.tools.title"),
      layer: t("categories.tools.layer"),
      description: t("categories.tools.description"),
      glowColor: "#a855f7",
      gradientFrom: "from-purple-500/20",
      gradientTo: "to-indigo-500/20",
      accentText: "text-purple-600 dark:text-purple-400",
      glowShadow: "shadow-[0_0_15px_rgba(168,85,247,0.35)]",
      gridSpan: "md:col-span-7",
      techs: [
        { name: "Git", icon: FaGitAlt, color: "#F05032" },
        { name: "GitHub", icon: FaGithub, color: "#FFFFFF" },
        { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      ],
    },
  ], [t]);

  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-[#050505] pt-0 pb-24 md:pt-0 md:pb-32 transition-colors duration-300"
    >
      {/* Background elegant moving ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft Purple Glow */}
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[15%] h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[130px] opacity-75"
        />

        {/* Soft Blue Glow */}
        <motion.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 50, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-[15%] top-[25%] h-[550px] w-[550px] rounded-full bg-blue-400/10 dark:bg-blue-900/10 blur-[140px] opacity-75"
        />

        {/* Soft Cyan Glow */}
        <motion.div
          animate={{
            x: [0, 30, -50, 0],
            y: [0, 40, 40, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute left-[25%] bottom-[10%] h-[650px] w-[650px] rounded-full bg-cyan-400/10 dark:bg-cyan-900/10 blur-[150px] opacity-75"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-purple-600 dark:text-purple-300">
              {t("badge")}
            </span>
          </motion.div>

          {/* Title with Letter Reveal */}
          <h2 className="mt-6 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight leading-tight transition-colors duration-300">
            <LetterReveal text={t("titlePart1")} delay={0.05} />
            <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 dark:from-purple-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent inline-block py-2">
              <LetterReveal text={t("titlePart2")} delay={0.3} />
            </span>
          </h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-neutral-400 leading-relaxed font-light transition-colors duration-300"
          >
            {t("description")}
          </motion.p>
        </div>

        {/* Asymmetric 3D Bento Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {skillCategories.map((category) => (
            <SkillCard key={category.id} category={category} isLight={isLight} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SkillCard({ category, isLight }: { category: SkillCategory; isLight: boolean }) {
  const t = useTranslations("Skills");
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Springs for 3D tilts
  const rotateX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 22 });

  // Parallax translation springs
  const translateZLabel = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZTitle = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZDesc = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZBadges = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZFooter = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse relative to center of the card
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate tilt angles (max 10 degrees)
    const rX = -(mouseY / (height / 2)) * 6;
    const rY = (mouseX / (width / 2)) * 6;

    rotateX.set(rX);
    rotateY.set(rY);

    // Dynamic translateZ offsets
    translateZLabel.set(12);
    translateZTitle.set(22);
    translateZDesc.set(16);
    translateZBadges.set(30);
    translateZFooter.set(14);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);

    translateZLabel.set(0);
    translateZTitle.set(0);
    translateZDesc.set(0);
    translateZBadges.set(0);
    translateZFooter.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover={{
        boxShadow: isLight ? `0 20px 50px ${category.glowColor}15` : `0 30px 80px ${category.glowColor}25`,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1200,
      }}
      className={`group relative rounded-[28px] md:rounded-[32px] overflow-hidden transition-all duration-500 ${category.gridSpan} min-h-[380px] cursor-default`}
    >
      {/* Outer border glow ring */}
      <div className={`absolute -inset-[1.5px] bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} rounded-[28px] md:rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

      {/* Card Content Container */}
      <div
        style={{ transformStyle: "preserve-3d" }}
        className="h-full rounded-[27px] md:rounded-[31px] border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 lg:p-10 flex flex-col justify-between transition-all duration-500 group-hover:border-white/[0.12] group-hover:bg-[#101010]/90 relative overflow-hidden"
      >
        {/* Soft radial glow in the top right corner */}
        <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gradient-to-br ${category.gradientFrom} to-transparent blur-3xl opacity-25 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none -z-10`} />

        {/* Floating details */}
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Layer Label */}
          <motion.span
            style={{ translateZ: translateZLabel }}
            className={`inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] ${category.accentText}`}
          >
            {category.layer}
          </motion.span>

          {/* Title */}
          <motion.h3
            style={{ translateZ: translateZTitle }}
            className="text-2xl md:text-3xl font-bold text-white mt-2 tracking-tight"
          >
            {category.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            style={{ translateZ: translateZDesc }}
            className="text-neutral-400 text-sm md:text-base mt-3 leading-relaxed max-w-xl"
          >
            {category.description}
          </motion.p>

          {/* Technology Badges grid */}
          <motion.div
            style={{ translateZ: translateZBadges, transformStyle: "preserve-3d" }}
            className="grid grid-cols-2 gap-4 mt-8"
          >
            {category.techs.map((tech) => (
              <TechBadge key={tech.name} tech={tech} isCardHovered={isHovered} isLight={isLight} />
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          style={{ translateZ: translateZFooter }}
          className="border-t border-white/[0.06] pt-6 mt-8 flex items-center justify-between transition-colors duration-300"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500  font-medium transition-colors duration-300">
            {category.techs.length} {t("technologies")}
          </span>

          <div className="flex items-center gap-2">
            {/* Glow pulse status indicator */}
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`h-2 w-2 rounded-full bg-current ${category.accentText} ${category.glowShadow}`}
            />
            <span className={`text-[10px] md:text-xs font-semibold uppercase tracking-[0.1em] ${category.accentText}`}>
              {t("active")}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface TechBadgeProps {
  tech: Technology;
  isCardHovered: boolean;
  isLight: boolean;
}

function TechBadge({ tech, isCardHovered, isLight }: TechBadgeProps) {
  const Icon = tech.icon;

  // Generate unique randomized idle rotation durations and delays
  const idleDuration = useMemo(() => 4 + Math.random() * 2, []);
  const idleDelay = useMemo(() => -Math.random() * 4, []);

  // Avoid white logos being invisible in light mode
  const displayColor = isLight && (tech.color === "#FFFFFF" || tech.color === "#ffffff")
    ? "#09090b"
    : tech.color;

  return (
    <motion.div
      style={{ transformStyle: "preserve-3d" }}
      className="relative"
    >
      {/* Lifts and glows slightly on card hover */}
      <motion.div
        animate={isCardHovered ? {
          y: -4,
          z: 15,
          borderColor: isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.14)",
          backgroundColor: isLight ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.04)"
        } : {
          y: 0,
          z: 0,
          borderColor: isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.04)",
          backgroundColor: isLight ? "rgba(0, 0, 0, 0.01)" : "rgba(255, 255, 255, 0.02)"
        }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="flex items-center gap-3 rounded-xl border border-white/[0.06] p-3 h-full select-none transition-colors duration-300"
      >
        {/* Slow swing animation */}
        <motion.div
          animate={{ rotate: [-3, 3, -3] }}
          transition={{
            duration: idleDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: idleDelay,
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg relative"
          style={{
            background: `${displayColor}08`,
          }}
        >
          {/* Individual icon hover: rotates 360deg and scales */}
          <motion.div
            whileHover={{ rotate: 360, scale: 1.25 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
            className="flex items-center justify-center w-full h-full cursor-pointer"
          >
            <Icon
              className="h-5 w-5 transition-shadow duration-300"
              style={{
                color: displayColor,
                filter: isCardHovered ? `drop-shadow(0 0 6px ${displayColor}45)` : "none",
              }}
            />
          </motion.div>
        </motion.div>

        <span className="text-xs font-semibold text-neutral-300 leading-tight whitespace-normal transition-colors duration-300">
          {tech.name}
        </span>
      </motion.div>
    </motion.div>
  );
}