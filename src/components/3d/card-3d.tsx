import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface Card3DProps {
  children: ReactNode;
  delay?: number;
}

export function Card3D({ children, delay = 0 }: Card3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 40, 
        rotateX: -15,
        rotateZ: -5
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        rotateZ: 0
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ 
        delay, 
        duration: 0.5,
        type: "spring",
        stiffness: 120,
        damping: 12
      }}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -8 : 0,
          y: isHovered ? -12 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          animate={{
            boxShadow: isHovered 
              ? "0 30px 60px rgba(59, 130, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.15)"
              : "0 10px 25px rgba(0, 0, 0, 0.1)"
          }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
