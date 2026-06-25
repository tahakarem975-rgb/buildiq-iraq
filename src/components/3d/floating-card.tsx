import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FloatingCard({ children, delay = 0, className = "" }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -20, rotateY: 0 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        rotateY: 0,
      }}
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: -5,
        transition: { duration: 0.3 }
      }}
      transition={{ 
        delay, 
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      className={`${className}`}
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 10px 25px rgba(0, 0, 0, 0.1)",
            "0 20px 50px rgba(0, 0, 0, 0.15)",
            "0 10px 25px rgba(0, 0, 0, 0.1)"
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
