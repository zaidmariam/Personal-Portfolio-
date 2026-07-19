"use client";

import { useState, useEffect, useTransition, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent, Variants } from "framer-motion";
import { Languages, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { setUserLocale } from "@/services/locale";

interface NavItem {
  name: string;
  id: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = useTranslations("Navbar");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const navItems: NavItem[] = useMemo(() => [
    { name: t("home"), id: "home" },
    { name: t("about"), id: "about" },
    { name: t("skills"), id: "skills" },
    { name: t("projects"), id: "projects" },
    { name: t("contact"), id: "contact" }
  ], [t]);

  const languages = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "fr", label: "FR", flag: "🇫🇷" }
  ];

  const handleLocaleChange = (newLocale: string) => {
    startTransition(async () => {
      await setUserLocale(newLocale);
      window.location.reload();
    });
  };

  // Prevent hydration layout shift
  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================
  // SCROLL PROGRESS INDICATOR
  // =========================
  const { scrollY, scrollYProgress } = useScroll();
  const scrollYSpring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  // Track scroll position to trigger glassmorphic state
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // =========================
  // ACTIVE LINK OBSERVATION
  // =========================
  const isScrollingToRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mounted) return;

    let rAFId: number;

    const handleScroll = () => {
      // Bypass scroll active-state updates during programmatic smooth scrolls
      if (isScrollingToRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportCenter = scrollY + viewportHeight / 2;
      const docHeight = document.documentElement.scrollHeight;

      // Edge cases: top and bottom limits
      const isAtTop = scrollY < 100;
      const isAtBottom = scrollY + viewportHeight >= docHeight - 100;

      if (isAtTop) {
        setActiveSection("home");
        return;
      }

      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      // Find which section currently intercepts the viewport center line
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          const bottom = rect.bottom + scrollY;

          if (viewportCenter >= top && viewportCenter < bottom) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial run to set state correctly on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rAFId);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [mounted, navItems]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      isScrollingToRef.current = true;
      setActiveSection(id);
      setIsOpen(false);

      const offset = id === "home" ? 0 : 80;
      const targetScrollY = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);

      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth"
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingToRef.current = false;
      }, 800);
    }
  };

  // =========================
  // MENU INTERACTIVE ANIMATIONS
  // =========================
  const navbarVariants: Variants = {
    hidden: { y: -60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 18,
        delay: 0.1
      }
    }
  };

  const logoVariants: Variants = {
    hidden: { opacity: 0, x: -30, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        delay: 0.3
      }
    }
  };

  // Circular clip path expansion variants starting from top right
  const menuBgVariants: Variants = {
    closed: {
      clipPath: "circle(24px at calc(100% - 40px) 43px)",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 35
      }
    },
    open: {
      clipPath: "circle(1500px at calc(100% - 40px) 43px)",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 18,
        restDelta: 2
      }
    }
  };

  const menuListVariants: Variants = {
    open: {
      transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const menuItemVariants: Variants = {
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 14 }
    },
    closed: {
      y: 40,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  // Custom morphing paths for hamburger button lines
  const path1Variants: Variants = {
    closed: { d: "M 4 6 L 20 6" },
    open: { d: "M 5 5 L 19 19" }
  };

  const path2Variants: Variants = {
    closed: { opacity: 1 },
    open: { opacity: 0 }
  };

  const path3Variants: Variants = {
    closed: { d: "M 4 18 L 20 18" },
    open: { d: "M 5 19 L 19 5" }
  };

  return (
    <>
      {/* 1. SCROLL PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 origin-left z-[100] shadow-[0_1px_12px_rgba(139,92,246,0.6),0_0_6px_rgba(217,70,239,0.4)]"
        style={{ scaleX: scrollYSpring }}
      />

      {/* 2. FULL WIDTH FIXED NAVBAR */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        style={{
          height: isScrolled ? "70px" : "86px",
          backgroundColor: isScrolled ? "rgba(8, 8, 8, 0.65)" : "rgba(8, 8, 8, 0)",
          backdropFilter: isScrolled ? "blur(24px) saturate(180%)" : "blur(0px) saturate(100%)",
          WebkitBackdropFilter: isScrolled ? "blur(24px) saturate(180%)" : "blur(0px) saturate(100%)",
          borderBottomWidth: "1px",
          borderBottomColor: isScrolled ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0)",
          boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.45)" : "none"
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 22
        }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-auto select-none flex items-center border-b transition-colors duration-300"
      >
        <div className="w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* LOGO */}
          <motion.a
            href="#home"
            onClick={(e) => handleScrollTo(e, "home")}
            variants={logoVariants}
            animate={{
              scale: isScrolled ? 0.94 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 22
            }}
            whileHover={{
              rotate: 3,
              transition: { type: "spring", stiffness: 350, damping: 10 }
            }}
            className="relative group flex items-center cursor-pointer origin-left"
          >
            {/* Soft violet glow behind logo */}
            <div className="absolute -inset-3 bg-violet-600/35 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent group-hover:from-violet-400 group-hover:via-fuchsia-400 group-hover:to-white transition-all duration-500">
              Z<span className="text-violet-500 group-hover:text-fuchsia-500 transition-colors duration-500">M</span>
            </span>
          </motion.a>

          {/* DESKTOP MENU LINKS */}
          <ul className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="relative py-1 flex items-center justify-center">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={(e) => handleScrollTo(e, item.id)}
                    animate={{
                      scale: isScrolled ? 0.95 : 1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 22
                    }}
                    className={`relative z-10 px-4 py-2 block text-xs tracking-widest uppercase font-semibold transition-colors duration-300 origin-center ${isActive
                      ? "text-transparent"
                      : "text-neutral-400 hover:text-white"
                      }`}
                    whileHover={{
                      y: -2,
                      scale: 1.03,
                      transition: { type: "spring", stiffness: 350, damping: 15 }
                    }}
                  >
                    <span
                      className={
                        isActive
                          ? "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent"
                          : ""
                      }
                    >
                      {item.name}
                    </span>
                  </motion.a>

                  {/* Active Underline glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-[-2px] left-4 right-4 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full z-10 shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* RIGHT ACTION: LANGUAGE SWITCHER */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.button
                onClick={() => setIsLangOpen(!isLangOpen)}
                animate={{
                  scale: isScrolled ? 0.95 : 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 22
                }}
                whileHover={{
                  scale: isScrolled ? 1.0 : 1.05,
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.25)",
                  borderColor: "rgba(139, 92, 246, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                className="relative px-3 rounded-xl border border-white/10 bg-white/5 text-neutral-200 transition-colors duration-300 cursor-pointer flex items-center justify-center h-10 gap-1.5 shadow-[0_0_10px_rgba(0,0,0,0.02)] select-none"
              >
                <Languages size={15} className="text-violet-400" />
                <span className="text-xs font-bold tracking-wider">
                  {locale === "en" ? "🇬🇧 EN" : "🇫🇷 FR"}
                </span>
                <ChevronDown size={12} className={`text-neutral-400 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isLangOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-32 rounded-xl border border-white/10 bg-[#080808]/90 backdrop-blur-xl p-1.5 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col gap-1"
                    >
                      {languages.map((lang) => {
                        const isActive = locale === lang.code;
                        return (
                          <button
                            key={lang.code}
                            disabled={isPending}
                            onClick={() => {
                              handleLocaleChange(lang.code);
                              setIsLangOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all duration-200 cursor-pointer ${isActive
                              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                              : "text-neutral-450 hover:text-white hover:bg-white/5"
                              }`}
                          >
                            <span>{lang.flag} {lang.label}</span>
                            {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              animate={{
                scale: isScrolled ? 0.95 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 22
              }}
              className="relative z-50 md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.02)]"
              whileHover={{ scale: isScrolled ? 1.02 : 1.08, rotate: isOpen ? -90 : 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <motion.path
                  fill="transparent"
                  strokeWidth="2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  variants={path1Variants}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ type: "spring", stiffness: 180, damping: 15 }}
                />
                <motion.path
                  d="M 4 12 L 20 12"
                  fill="transparent"
                  strokeWidth="2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  variants={path2Variants}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.12 }}
                />
                <motion.path
                  fill="transparent"
                  strokeWidth="2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  variants={path3Variants}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ type: "spring", stiffness: 180, damping: 15 }}
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* 3. MOBILE FULLSCREEN OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuBgVariants}
            className="fixed inset-0 z-40 md:hidden flex flex-col justify-center items-center px-8 backdrop-blur-[24px] bg-black/90 bg-gradient-to-b from-black via-neutral-950/98 to-black/95"
          >
            {/* Background Glow Blobs */}
            <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none animate-pulse" />

            <motion.div variants={menuListVariants} className="flex flex-col gap-8 text-center relative z-10 w-full max-w-xs">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.div key={item.id} variants={menuItemVariants}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleScrollTo(e, item.id)}
                      className={`text-3xl font-extrabold tracking-wide transition-all relative py-2 block ${isActive
                        ? "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.35)]"
                        : "text-gray-400 hover:text-white"
                        }`}
                    >
                      {item.name}

                      {/* Small glow dot under active mobile link */}
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileIndicator"
                          className="w-1.5 h-1.5 rounded-full bg-violet-400 mx-auto mt-1 shadow-[0_0_8px_#a78bfa]"
                        />
                      )}
                    </a>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}