import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CalculatorGrid3DProps {
  children: ReactNode[];
}

export function CalculatorGrid3D({ children }: CalculatorGrid3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-20 grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto"
      style={{ perspective: "1200px" }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            rotateY: -90,
            rotateX: 20,
            y: 30,
          }}
          animate={{
            opacity: 1,
            rotateY: 0,
            rotateX: 0,
            y: 0,
          }}
          transition={{
            delay: 0.5 + index * 0.05,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          whileHover={{
            y: -12,
            rotateX: 5,
            rotateY: -5,
            rotateZ: 2,
          }}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
