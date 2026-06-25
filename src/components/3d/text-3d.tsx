import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface Text3DProps {
  children: ReactNode;
  className?: string;
}

export function Text3D({ children, className = "" }: Text3DProps) {
  const text = String(children);

  const isArabic = /[\u0600-\u06FF]/.test(text);

  const items = isArabic ? text.split(" ") : text.split("");

  const variants: Variants = {
    hidden: {
      opacity: 0,
      rotateX: -90,
      y: 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  return (
    <div
      className={className}
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        perspective: "1000px",
        display: "inline-block",
      }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={variants}
          style={{
            display: "inline-block",
            transformStyle: "preserve-3d",
            textShadow: "0 10px 20px rgba(0,0,0,.1)",
            marginLeft: isArabic ? "8px" : "0",
            marginRight: isArabic ? "0" : "0",
          }}
        >
          {item}
        </motion.span>
      ))}
    </div>
  );
}