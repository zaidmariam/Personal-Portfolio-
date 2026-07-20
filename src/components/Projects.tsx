"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, Variants, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useTranslations } from "next-intl";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  status: string;
  year: string;
  type: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const PROJECTS: Project[] = [
  {
  id: "cosmea",
  title: "Cosméa E-Commerce Platform",
  category: "E-Commerce & Web Development",
  description: "A full-stack e-commerce platform for cosmetic products featuring secure authentication, product search, shopping cart, customer reviews, order management, and a comprehensive admin dashboard with CRUD operations.",
  image: "/projects/ecommerce1.jpeg",
  tags: [
    "React",
    "Laravel",
    "MySQL",
    "CSS",
    "REST API"
  ],
  liveUrl: "https://cosmea.example.com",
  githubUrl: "https://github.com/zaidmariam/cosmea-ecommerce",
  status: "Production Ready",
  year: "2026",
  type: "E-Commerce Platform",
  accentColor: "#8FAF8F",
gradientFrom: "from-emerald-400/20",
gradientTo: "to-lime-500/20"
},
  {
  id: "codelyx",
  title: "CodeLyx",
  category: "Digital Solutions & Web Development",
  description:"Official website of CodeLyx – Full Stack Web Development Services. A modern showcase platform built to present professional web solutions, development services, and digital experiences with a focus on performance, responsive design, and user experience.",
  image: "/projects/codelyx.png",
  tags: [
    "React",
    "JavaScript",
    "Tailwind CSS",
    
  ],
  liveUrl: "https://codelyx.com",
  githubUrl: "https://github.com/zaidmariam/codelyx",
  status: "Completed",
  year: "2026",
  type: "Brand Showcase Website",
  accentColor: "#8b5cf6",
  gradientFrom: "from-purple-500/20",
  gradientTo: "to-blue-500/20"
}
];

const sectionVariants: Variants = {
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

const badgeContainerVariants: Variants = {
  hover: {
    transition: {
      staggerChildren: 0.04,
    }
  },
  rest: {}
};

const badgeVariants: Variants = {
  hover: {
    y: -2,
    opacity: 1,
    scale: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: "0 0 12px rgba(255, 255, 255, 0.05)",
    transition: { type: "spring", stiffness: 350, damping: 15 }
  },
  rest: {
    y: 0,
    opacity: 0.85,
    scale: 0.98,
    borderColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
    transition: { type: "spring", stiffness: 350, damping: 20 }
  }
};

const buttonContainerVariants: Variants = {
  hover: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 18 }
  },
  rest: {
    y: 12,
    opacity: 0
  }
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

export default function Projects() {
  const t = useTranslations("Projects");

  const localizedProjects = useMemo(() => PROJECTS.map(project => ({
    ...project,
    title: t(`items.${project.id}.title`),
    category: t(`items.${project.id}.category`),
    description: t(`items.${project.id}.description`),
    status: t(`items.${project.id}.status`),
    type: t(`items.${project.id}.type`)
  })), [t]);

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#050505] pt-8 pb-24 md:pt-10 md:pb-28"

    >
      {/* Background elegant moving ambient glows - matching Skills section */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft Purple Glow */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[10%] h-[600px] w-[600px] rounded-full bg-purple-900/5 blur-[140px] opacity-60"
        />

        {/* Soft Blue Glow */}
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 45, -35, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-[10%] top-[20%] h-[550px] w-[550px] rounded-full bg-blue-900/5 blur-[130px] opacity-60"
        />

        {/* Soft Cyan Glow */}
        <motion.div
          animate={{
            x: [0, 30, -40, 0],
            y: [0, 30, 30, 0],
            scale: [1, 1.08, 0.94, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute left-[20%] bottom-[10%] h-[650px] w-[650px] rounded-full bg-cyan-900/5 blur-[150px] opacity-60"
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
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-purple-300">
              {t("badge")}
            </span>
          </motion.div>

          {/* Title with Letter Reveal */}
          <h2 className="mt-6 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight leading-tight">
            <LetterReveal text={t("titlePart1")} delay={0.05} />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent inline-block py-2">
              <LetterReveal text={t("titlePart2")} delay={0.3} />
            </span>
          </h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-neutral-400 leading-relaxed font-light"
          >
            {t("description")}
          </motion.p>
        </div>

        {/* Simple 2-Column Responsive Grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {localizedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("Projects");
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion Values for pointer coordinate ratios (-1 to 1) relative to center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse Spotlight Motion Values (relative to top-left of card)
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useSpring(0, { stiffness: 150, damping: 20 });

  const smoothSpotlightX = useSpring(spotlightX, { stiffness: 180, damping: 24 });
  const smoothSpotlightY = useSpring(spotlightY, { stiffness: 180, damping: 24 });

  // Springs for 3D tilts (max 5 degrees for a luxurious feel)
  const rotateX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 22 });

  // Parallax translation depth springs (3D layer break effect)
  const translateZImage = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZCategory = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZTitle = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZDesc = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZTech = useSpring(0, { stiffness: 150, damping: 20 });
  const translateZButtons = useSpring(0, { stiffness: 150, damping: 20 });

  // Floating follow-mouse parallax translations (spring-buffered transforms)
  const labelX = useSpring(useTransform(mouseX, (val) => val * 4), { stiffness: 150, damping: 20 });
  const labelY = useSpring(useTransform(mouseY, (val) => val * 4), { stiffness: 150, damping: 20 });

  const titleX = useSpring(useTransform(mouseX, (val) => val * 8), { stiffness: 150, damping: 20 });
  const titleY = useSpring(useTransform(mouseY, (val) => val * 8), { stiffness: 150, damping: 20 });

  const descX = useSpring(useTransform(mouseX, (val) => val * 6), { stiffness: 150, damping: 20 });
  const descY = useSpring(useTransform(mouseY, (val) => val * 6), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse relative to center of the card
    const mX = e.clientX - rect.left - width / 2;
    const mY = e.clientY - rect.top - height / 2;

    const rX = -(mY / (height / 2)) * 5;
    const rY = (mX / (width / 2)) * 5;

    rotateX.set(rX);
    rotateY.set(rY);

    // Set mouse coordinates relative to boundary (-1 to 1) for follow-mouse inertia
    mouseX.set(mX / (width / 2));
    mouseY.set(mY / (height / 2));

    // Mouse coordinates relative to card top-left for spotlight tracking
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);

    // Dynamic translateZ offsets (Apple VisionOS depth breaking layers effect)
    translateZImage.set(20);
    translateZCategory.set(14);
    translateZTitle.set(32);
    translateZDesc.set(24);
    translateZTech.set(28);
    translateZButtons.set(36);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    spotlightOpacity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0);
    mouseY.set(0);
    spotlightOpacity.set(0);

    translateZImage.set(0);
    translateZCategory.set(0);
    translateZTitle.set(0);
    translateZDesc.set(0);
    translateZTech.set(0);
    translateZButtons.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover={{
        y: -8,
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.6), 0 30px 90px ${project.accentColor}12`,
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
      className="group/card relative rounded-[22px] overflow-hidden bg-[#050505] border border-white/10 backdrop-blur-md transition-colors duration-500 group-hover/card:border-white/15 cursor-default h-full"
    >
      {/* Dynamic base float & sway inner card container */}
      <motion.div
        animate={isHovered ? {
          y: -8,
          rotate: 0,
        } : {
          y: [0, -3, 0],
          rotate: [-0.25, 0.25, -0.25],
        }}
        transition={isHovered ? {
          type: "spring",
          stiffness: 220,
          damping: 18,
        } : {
          y: { duration: 8 + (index % 3), repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 9 + (index % 3), repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ transformStyle: "preserve-3d", height: "100%" }}
      >
        {/* Outer border glow ring */}
        <div className={`absolute -inset-[1.5px] bg-gradient-to-br ${project.gradientFrom} ${project.gradientTo} rounded-[22px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10`} />

        {/* Mouse Spotlight Layer */}
        <motion.div
          className="pointer-events-none absolute w-[400px] h-[400px] rounded-full blur-[100px] -z-10"
          style={{
            x: useTransform(smoothSpotlightX, (x) => x - 200),
            y: useTransform(smoothSpotlightY, (y) => y - 200),
            opacity: spotlightOpacity,
            background: `radial-gradient(circle, ${project.accentColor}18 0%, transparent 70%)`,
          }}
        />

        {/* Ambient Spotlight blur */}
        <div className={`absolute -right-20 -top-20 w-52 h-52 rounded-full bg-gradient-to-br ${project.gradientFrom} to-transparent blur-3xl opacity-20 group-hover/card:opacity-40 transition-opacity duration-500 pointer-events-none -z-10`} />

        {/* Card Content Container */}
        <div
          style={{ transformStyle: "preserve-3d" }}
          className="p-6 flex flex-col h-full justify-between"
        >
          <div style={{ transformStyle: "preserve-3d" }}>
            {/* Visual Panel wrapper */}
            <motion.div
              style={{ translateZ: translateZImage }}
              className="w-full relative"
            >
              <ProjectImage src={project.image} alt={project.title} accentColor={project.accentColor} />
            </motion.div>

            {/* Category */}
            <div style={{ transformStyle: "preserve-3d" }} className="mt-6">
              <motion.span
                style={{ translateZ: translateZCategory, x: labelX, y: labelY, color: project.accentColor }}
                className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] select-none"
              >
                {project.category}
              </motion.span>
            </div>

            {/* Title */}
            <motion.h3
              style={{ translateZ: translateZTitle, x: titleX, y: titleY }}
              className="text-xl md:text-2xl font-bold text-white mt-2 tracking-tight"
            >
              {project.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              style={{ translateZ: translateZDesc, x: descX, y: descY }}
              className="text-neutral-450 text-sm md:text-base mt-4 leading-relaxed font-light"
            >
              {project.description}
            </motion.p>

            {/* Technology Badges */}
            <motion.div style={{ translateZ: translateZTech }} className="mt-5">
              <ProjectTech tags={project.tags} isCardHovered={isHovered} />
            </motion.div>
          </div>

          {/* GitHub Button */}
          <motion.div style={{ translateZ: translateZButtons }} className="mt-6">
            <ProjectButtons
              githubUrl={project.githubUrl}
              isCardHovered={isHovered}
              t={t}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ProjectImageProps {
  src: string;
  alt: string;
  accentColor: string;
}

export function ProjectImage({ src, alt, accentColor }: ProjectImageProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[16px] border border-white/[0.05] bg-neutral-950/60 aspect-video select-none group/img">
      {/* Light zoom glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-15 transition-opacity duration-700 pointer-events-none z-15 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)`
        }}
      />

      {/* Glass Reflection sweep */}
      <div className="absolute inset-0 -translate-x-full group-hover/card:translate-x-full transition-transform duration-[1200ms] ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-25" />

      {/* Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)] pointer-events-none z-20 opacity-70" />

      {/* Subtle Noise Texture Overlay (CSS-only) */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.025] pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Richer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-[#050505]/20 to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity duration-500 z-10" />

      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover/card:scale-[1.06] group-hover/card:brightness-[1.05] group-hover/card:contrast-[1.05]"
        loading="lazy"
      />
    </div>
  );
}

interface ProjectTechProps {
  tags: string[];
  isCardHovered: boolean;
}

export function ProjectTech({ tags, isCardHovered }: ProjectTechProps) {
  return (
    <motion.div
      variants={badgeContainerVariants}
      animate={isCardHovered ? "hover" : "rest"}
      className="flex flex-wrap gap-2 mt-5"
      style={{ transformStyle: "preserve-3d" }}
    >
      {tags.map((tag) => (
        <ProjectBadge key={tag} tag={tag} />
      ))}
    </motion.div>
  );
}

interface ProjectBadgeProps {
  tag: string;
}

export function ProjectBadge({ tag }: ProjectBadgeProps) {
  return (
    <motion.span
      variants={badgeVariants}
      className="
        inline-flex
        items-center
        justify-center
        text-xs
        md:text-sm
        font-semibold
        px-4
        py-2
        rounded-full
        border
        border-white/10
        bg-white/[0.06]
        text-white
        backdrop-blur-md
        shadow-sm
        transition-all
        duration-300
        select-none
        whitespace-nowrap
      "
    >
      {tag}
    </motion.span>
  );
}
interface ProjectButtonsProps {
  githubUrl: string;
  isCardHovered: boolean;
  t: (key: string) => string;
}

export function ProjectButtons({ githubUrl, isCardHovered, t }: ProjectButtonsProps) {
  return (
    <motion.a
      href={githubUrl}
      target="_blank"
      rel="noreferrer"
      variants={buttonContainerVariants}
      animate={isCardHovered ? "hover" : "rest"}
      whileHover={{
        scale: 1.02,
        borderColor: "rgba(255, 255, 255, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.08)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="flex items-center justify-center gap-2 w-full text-xs md:text-sm font-semibold rounded-xl border border-white/[0.08] bg-white/[0.02] py-3.5 text-white transition-colors duration-300 select-none group/btn cursor-pointer max-md:!opacity-100 max-md:!transform-none"
    >
      <FaGithub className="w-4 h-4 text-neutral-400 group-hover/btn:text-white group-hover/btn:scale-110 transition-transform duration-300 ease-out" />
      <span>{t("github")}</span>
    </motion.a>
  );
}
