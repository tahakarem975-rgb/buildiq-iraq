import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface Parallax3DSectionProps {
  children: ReactNode;
  depth?: number;
}

export function Parallax3DSection({ children, depth = 50 }: Parallax3DSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -depth]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        rotateX,
        opacity,
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
