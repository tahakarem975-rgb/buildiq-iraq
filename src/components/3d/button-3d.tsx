import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Button3DProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  isPrimary?: boolean;
}

export function Button3D({ 
  children, 
  onClick, 
  className = "", 
  isPrimary = false 
}: Button3DProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ y: 0 }}
      whileHover={{ y: -6 }}
      whileTap={{ y: -2 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <motion.div
        animate={{
          boxShadow: [
            `0 10px 25px rgba(0, 0, 0, ${isPrimary ? 0.2 : 0.1})`,
            `0 20px 40px rgba(59, 130, 246, ${isPrimary ? 0.3 : 0.1})`,
            `0 10px 25px rgba(0, 0, 0, ${isPrimary ? 0.2 : 0.1})`,
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        <div className="relative overflow-hidden">
          {/* Shine effect */}
          <motion.div
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              transformStyle: "preserve-3d",
            }}
          />
          {children}
        </div>
      </motion.div>
    </motion.button>
  );
}
