"use client";

import emailjs from "@emailjs/browser";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

// ==========================================
// TILT CARD COMPONENT (3D Tilt Parallax)
// ==========================================
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [8, -8]), {
    stiffness: 150,
    damping: 25
  });

  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-8, 8]), {
    stiffness: 150,
    damping: 25
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // CHANGE: Made TiltCard fill 100% parent height for layout balance
      className="perspective-[1000px] w-full h-full"
    >
      <motion.div
        // CHANGE: Removed transformStyle: "preserve-3d" to preserve browser hit-test pointer events
        style={{ rotateX, rotateY }}
        whileHover={{
          boxShadow: "0 30px 60px rgba(139, 92, 246, 0.15), 0 0 25px rgba(139, 92, 246, 0.05)",
          borderColor: "rgba(139, 92, 246, 0.15)"
        }}
        // CHANGE: Added h-full to make card content height match exactly
        className={`w-full h-full rounded-3xl border border-neutral-200/50 dark:border-white/5 bg-white/60 dark:bg-neutral-950/40 backdrop-blur-[24px] shadow-2xl transition-all duration-300 ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ==========================================
// FORM FIELD HELPERS WITH FLOATING LABELS
// ==========================================
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({
  label,
  id,
  error,
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}: FormInputProps) {
  const [focused, setFocused] = useState(false);

  const isFloating = focused || value !== "";

  return (
    <div className="relative w-full">
      <input
        {...props}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={`w-full px-5 py-4 pt-6 pb-2 rounded-2xl border bg-transparent outline-none text-neutral-900 dark:text-white ${error
          ? "border-red-500"
          : "border-neutral-200 dark:border-white/10 focus:border-violet-500"
          }`}
      />

      <label
        htmlFor={id}
        className={`absolute left-5 transition-all pointer-events-none ${isFloating
          ? "top-1 text-[10px] text-violet-500"
          : "top-4 text-sm text-neutral-400"
          }`}
      >
        {label}
      </label>

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function FormTextarea({
  label,
  id,
  error,
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}: FormTextareaProps) {
  const [focused, setFocused] = useState(false);

  const isFloating = focused || value !== "";

  return (
    <div className="relative w-full">
      <textarea
        {...props}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={`w-full min-h-[150px] resize-none px-5 py-4 pt-6 pb-2 rounded-2xl border bg-transparent outline-none text-neutral-900 dark:text-white ${error
          ? "border-red-500"
          : "border-neutral-200 dark:border-white/10 focus:border-violet-500"
          }`}
      />

      <label
        htmlFor={id}
        className={`absolute left-5 transition-all pointer-events-none ${isFloating
          ? "top-1 text-[10px] text-violet-500"
          : "top-4 text-sm text-neutral-400"
          }`}
      >
        {label}
      </label>

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// ==========================================
// MAIN CONTACT COMPONENT
// ==========================================
export default function Contact() {
  const t = useTranslations("Contact");
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // CHANGE: Added state for beautiful animated inside-page toast notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t("validation.nameRequired");
    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }
    if (!formData.subject.trim()) newErrors.subject = t("validation.subjectRequired");
    if (!formData.message.trim()) newErrors.message = t("validation.messageRequired");
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valErrors = validate();

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        "service_b9nv335",
        "template_o3xwnm5",
        formRef.current!,
        "vtleKsXUjfaphj0q2"
      );

      setIsSubmitting(false);
      setIsSubmitted(true);

      // CHANGE: Set success notification, reset input state, hide after delay
      setToast({ type: "success", message: t("successText") });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      formRef.current?.reset();

      setTimeout(() => {
        setToast(null);
      }, 4000);

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      // CHANGE: Show animated error notification instead of standard browser alert()
      setToast({ type: "error", message: t("errorText") });

      setTimeout(() => {
        setToast(null);
      }, 4500);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-white dark:bg-[#050505] py-16 md:py-20 transition-colors duration-300"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]
      [background-image:linear-gradient(#ffffff15_1px,transparent_1px),linear-gradient(90deg,#ffffff15_1px,transparent_1px)]
      [background-size:60px_60px]
      [transform:perspective(800px)_rotateX(60deg)]
      [transform-origin:top]" />

      {/* Purple Orb */}
      <div className="absolute -left-32 top-32 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[140px] pointer-events-none" />

      {/* Pink Orb */}
      <div className="absolute -right-32 bottom-20 h-[450px] w-[450px] rounded-full bg-fuchsia-500/10 blur-[140px] pointer-events-none" />

      {/* CHANGE: Added animated Framer Motion Toast element */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-md shadow-2xl max-w-sm ${toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
              }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${toast.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
              }`}>
              {toast.type === "success" ? "✓" : "✕"}
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                {toast.type === "success" ? t("successAlert") : t("errorAlert")}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {toast.type === "success" ? t("successText") : t("errorText")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-widest"
        >
          <Sparkles size={13} className="animate-pulse" />
          {t("badge")}
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white"
        >
          {t("titlePart1")}{" "}
          <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
            {t("titlePart2")}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .1 }}
          className="mt-6 max-w-2xl text-neutral-600 dark:text-neutral-400 leading-8"
        >
          {t("description")}
        </motion.p>

        {/* CHANGE: Added items-stretch on desktop to force equal height of cards */}
        {/* Main Grid */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-stretch">

          {/* LEFT */}
          {/* CHANGE: Added flex flex-col justify-between to make content stretch nicely */}
          <TiltCard className="p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">
                {t("infoTitle")}
              </h3>

              <div className="space-y-6">

                <div className="flex gap-4 items-center group/info">
                  <div className="h-14 w-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 group-hover/info:bg-violet-500/20 group-hover/info:scale-105 transition-all duration-300">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">{t("infoEmail")}</p>
                    <p className="font-semibold text-neutral-800 dark:text-white">
                      zaidmaryam460@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center group/info">
                  <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover/info:bg-purple-500/20 group-hover/info:scale-105 transition-all duration-300">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">{t("infoPhone")}</p>
                    <p className="font-semibold text-neutral-800 dark:text-white">
                      +212 642-020790
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
  <div className="h-14 w-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 group-hover/info:bg-fuchsia-500/20 group-hover/info:scale-105 transition-all duration-300">
    <FaGithub size={22} />
  </div>
  

  <div>
    <p className="text-sm text-neutral-500">GitHub</p>
    <a
      href="https://github.com/zaidmariam"
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-neutral-800 dark:text-white hover:text-violet-500 transition"
    >
      github.com/zaidmariam
    </a>
  </div>
</div>

              </div>
            </div>

          </TiltCard>

          {/* RIGHT */}
          {/* CHANGE: Added flex flex-col h-full to right card contents */}
          <TiltCard className="p-8 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  className="relative z-20 w-full flex flex-col gap-6"
                  ref={formRef}
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                      name="user_name"
                      label={t("labelName")}
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={errors.name}
                    />

                    <FormInput
                      name="user_email"
                      label={t("labelEmail")}
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                    />
                  </div>

                  <div>
                    <FormInput
                      name="subject"
                      label={t("labelSubject")}
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      error={errors.subject}
                    />
                  </div>

                  <div>
                    <FormTextarea
                      name="message"
                      label={t("labelMessage")}
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      error={errors.message}
                    />
                  </div>

                  <div className="mt-2 flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-neutral-900 border border-white/5 flex items-center justify-center gap-3 transition-all duration-300 group cursor-pointer shadow-xl shadow-violet-500/10"
                    >
                      {/* Moving Gradient Glow */}
                      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Moving shine overlay */}
                      <motion.span
                        animate={{
                          left: ["-100%", "100%"]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                      />

                      <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("btnSending")}
                          </>
                        ) : (
                          <>
                            {t("btnSend")}
                            <Send size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{t("msgTransmitted")}</h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xs mx-auto">
                      {t("msgReceived")}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/[0.05] text-xs font-semibold text-neutral-600 dark:text-gray-300 transition-all duration-300 active:scale-95"
                  >
                    {t("btnAnother")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>
        </div>

      </div>

    </section>
  );
}