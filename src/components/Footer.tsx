"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Mail, Sparkles, Phone } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navbar");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-[#050505] border-t border-neutral-200/40 dark:border-white/[0.04] pt-20 pb-10 transition-colors duration-300">

      {/* Animated gradient top border line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-neutral-200/10 dark:bg-white/[0.02] overflow-hidden">
        <motion.div
          animate={{
            left: ["-100%", "100%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
        />
      </div>

      {/* Background Perspective Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]
      [background-image:linear-gradient(#ffffff15_1px,transparent_1px),linear-gradient(90deg,#ffffff15_1px,transparent_1px)]
      [background-size:60px_60px]
      [transform:perspective(800px)_rotateX(60deg)]
      [transform-origin:top] z-0" />

      {/* Blurred decorative backdrops */}
      <div className="absolute -left-20 bottom-0 h-[350px] w-[350px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute -right-20 top-0 h-[350px] w-[350px] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" />

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {mounted &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -40, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{
                duration: 6 + (i % 4) * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              className="absolute rounded-full bg-violet-400/20 dark:bg-violet-400/30 blur-[1px]"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                left: `${(i * 13) % 95}%`,
                top: `${(i * 19) % 85}%`
              }}
            />
          ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* COLUMN 1: Brand details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-widest text-neutral-900 dark:text-white">
                {t("brand")}
              </h3>
              <p className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                {t("role")}
              </p>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed font-light">
              {t("description")}
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-light">
              <span>{t("location")}</span>
            </div>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">
              {t("linksTitle")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: tNav("home"), id: "home" },
                { name: tNav("about"), id: "about" },
                { name: tNav("skills"), id: "skills" },
                { name: tNav("projects"), id: "projects" },
                { name: tNav("contact"), id: "contact" }
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleScrollTo(e, link.id)}
                    className="text-sm font-light text-neutral-500 dark:text-neutral-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Social Connections */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">
              {t("connectTitle")}
            </h4>
            <div className="flex flex-wrap gap-4">
              {[
  {
    icon: <FaGithub size={18} />,
    href: "https://github.com/zaidmariam",
    label: "GitHub"
  },
  {
    icon: <Mail size={18} />,
    href: "mailto:zaidmaryam460@gmail.com",
    label: "Email"
  },
  {
    icon: <Phone size={18} />,
    href: "tel:+212642-020790",
    label: "Phone"
  }
].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{
                    y: -4,
                    rotate: 8,
                    borderColor: "rgba(139, 92, 246, 0.4)",
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.15)",
                  }}
                  className="h-11 w-11 rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/[0.03] flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-violet-500 dark:hover:text-violet-400 transition-all duration-300"
                  aria-label={item.label}
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </div>

        </div>

        {/* Divider & Credits */}
        <div className="mt-16 pt-8 border-t border-neutral-200/20 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center md:text-left">
            <p>{t("copyright")}</p>
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
              {t("credits")}
            </p>
          </div>

          {/* Back To Top Action */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/[0.03] hover:bg-violet-500/10 text-neutral-600 dark:text-neutral-300 hover:text-violet-500 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 text-sm font-semibold cursor-pointer"
          >
            <span>{t("backToTop")}</span>
            <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-1" />
          </motion.button>
        </div>

      </div>

    </footer>
  );
}
