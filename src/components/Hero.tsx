"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Download } from "lucide-react";
import { useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";

// A simple seedable pseudo-random number generator (Mulberry32)
// to ensure identical values on server and client (eliminating hydration mismatches)
function createPRNG(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Hero");
  const locale = useLocale();

  // =========================
  // MOUSE 3D PARALLAX
  // =========================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-200, 200], [10, -10]),
    {
      stiffness: 90,
      damping: 25,
    }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-200, 200], [-10, 10]),
    {
      stiffness: 90,
      damping: 25,
    }
  );

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // =========================
  // SCROLL 3D TRANSITION
  // =========================
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Generate stable random values for stars once per render/session using a seed
  const stars = useMemo(() => {
    const prng = createPRNG(42);
    return Array.from({ length: 60 }).map((_, i) => {
      const xOffset = prng() * 50 - 25;
      const duration = 8 + prng() * 8;
      const size = prng() * 5 + 2;
      const left = prng() * 100;
      const top = prng() * 100;
      return {
        id: i,
        xOffset,
        duration,
        size,
        left,
        top,
      };
    });
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#050505] perspective-[1600px]"
    >
      {/* ==========================
      3D ANTI GRAVITY BACKGROUND
      ========================== */}
      <div className="absolute inset-0 overflow-hidden bg-[#050505]">
        {/* Purple Nebula */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 top-10 h-[700px] w-[700px] rounded-full bg-violet-700/30 blur-[180px]"
        />

        {/* Cyan Nebula */}
        <motion.div
          animate={{
            x: [0, -120, 50, 0],
            y: [0, 80, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-52 bottom-0 h-[750px] w-[750px] rounded-full bg-violet-600/20 blur-[220px]"
        />

        {/* 3D GRID */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#ffffff15_1px,transparent_1px),linear-gradient(90deg,#ffffff15_1px,transparent_1px)] [background-size:80px_80px] [transform:perspective(900px)_rotateX(65deg)] [transform-origin:top]" />

        {/* Floating 3D Stars */}
        {stars.map((star) => (
          <motion.span
            key={star.id}
            animate={{
              y: [0, -120, 0],
              x: [0, star.xOffset, 0],
              scale: [1, 1.8, 1],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.id * 0.15,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-violet-300 shadow-[0_0_25px_#8B5CF6]"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
          />
        ))}

        {/* Dark Cinematic Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_80%)]" />
      </div>

      <motion.div
        style={{
          y: heroY,
          scale: heroScale,
          opacity: heroOpacity,
        }}
        className="relative z-10 mx-auto flex min-h-screen items-start lg:items-center max-w-7xl px-6 pt-24 pb-8 md:pt-32 md:pb-16 lg:px-8"
      >
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_450px]">
          {/* ================= LEFT ================= */}
          <motion.div
            initial={{
              opacity: 0,
              x: -80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="space-y-8"
          >
            <motion.span
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm tracking-[5px] text-violet-300"
            >
              {t("hello")}
            </motion.span>

            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="text-6xl font-black leading-none md:text-7xl xl:text-8xl"
            >
              {t("name").split(" ")[0]}
              <br />
              <span className="bg-gradient-to-r from-white via-violet-300 to-fuchsia-500 bg-clip-text text-transparent">
                {t("name").split(" ")[1]}
              </span>
            </motion.h1>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.5,
              }}
              className="h-12 text-xl font-semibold text-gray-300 sm:text-2xl md:text-3xl"
            >
              <TypeAnimation
                key={locale}
                sequence={[
                  t("title1"),
                  2500,
                  t("title2"),
                  2500,
                  t("title3"),
                  2500,
                ]}
                speed={45}
                repeat={Infinity}
              />
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.7,
              }}
              className="max-w-xl text-lg leading-9 text-gray-300"
            >
              {t("description")}
            </motion.p>

            {/* ================= BUTTONS ================= */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.9,
              }}
              className="flex flex-nowrap gap-3 sm:gap-5"
            >
              {/* VIEW PROJECTS */}
              <motion.a
                href="#projects"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-700/30 sm:px-8 sm:py-4 sm:text-base"
              >
                {t("viewProjects")}
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </motion.a>

              {/* DOWNLOAD CV */}
              <motion.a
                href="/MARIAM ZAID CV.pdf"
                download
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold backdrop-blur-xl transition-all hover:border-violet-500 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(124,58,237,.35)] sm:px-8 sm:py-4 sm:text-base"
              >
                <Download
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-y-1 group-hover:scale-110"
                />
                {t("downloadCv")}
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT 3D IMAGE ================= */}
          <div
            ref={cardRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="relative flex h-[480px] w-full max-w-[450px] items-center justify-center lg:translate-x-6 [perspective:1500px]"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative flex h-full w-full items-center justify-center"
            >
              {/* BIG PURPLE GLOW */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.08, 0.18, 0.08],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute h-[380px] w-[380px] rounded-full bg-violet-600/80 blur-[150px]"
                style={{
                  transform: "translateZ(-150px)",
                }}
              />

              {/* ORBIT RINGS */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-[370px] w-[370px] rounded-full border-[0.5px] border-violet-500/15 border-dashed"
                style={{
                  transform: "translateZ(-50px)",
                }}
              />

              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 45,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-[310px] w-[310px] rounded-full border-[0.5px] border-violet-400/15 border-dashed"
                style={{
                  transform: "translateZ(-30px)",
                }}
              />

              {/* IMAGE FLOAT */}
              <motion.div
                animate={{
                  y: [-15, 15, -15],
                  rotateZ: [-1, 1, -1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative z-20"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="relative h-[250px] w-[250px] overflow-hidden rounded-[28px] border border-white/20 bg-white/5 backdrop-blur-sm backdrop-saturate-150 shadow-[0_0_40px_rgba(124,58,237,0.12)] sm:h-[300px] sm:w-[300px] lg:h-[340px] lg:w-[340px]"
                >
                  {/* LIGHT REFLECTION */}
                  <motion.div
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-y-0 z-20 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />

                  <Image
                    src="/profile.jpeg"
                    alt="Zaid Mariam"
                    fill
                    priority
                    quality={75}
                    sizes="340px"
                    className="object-cover object-center scale-[1.05]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute inset-0 rounded-[26px] ring-1 ring-white/20" />
                </motion.div>
              </motion.div>

              {/* ORBIT PARTICLE 1 */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-[340px] w-[340px] flex items-start justify-center"
                style={{
                  transform: "translateZ(80px)",
                }}
              >
                <div className="h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_30px_#8B5CF6]" />
              </motion.div>

              {/* GLASS FLOATING SPHERE */}
              <motion.div
                animate={{
                  y: [10, -20, 10],
                  x: [-10, 10, -10],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-10 top-16 h-14 w-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl shadow-lg"
                style={{
                  transform: "translateZ(120px)",
                }}
              />

              {/* SECOND GLASS SPHERE */}
              <motion.div
                animate={{
                  y: [-15, 15, -15],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-16 right-12 h-16 w-16 rounded-full border border-violet-400/20 bg-violet-500/5 backdrop-blur-xl"
                style={{
                  transform: "translateZ(100px)",
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}