// components/Section3D.tsx

"use client";

import { motion } from "framer-motion";

export default function Section3D({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 80,
        rotateX: 12,
        filter: "blur(10px)"
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)"
      }}
      viewport={{
        once: true,
        amount: 0.25
      }}
      transition={{
        duration: 1,
        ease: [0.16,1,0.3,1]
      }}
      style={{
        transformPerspective: 1000
      }}
    >
      {children}
    </motion.div>
  );
}