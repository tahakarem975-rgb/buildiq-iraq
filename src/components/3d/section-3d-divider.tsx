import { motion } from "framer-motion";

export function Section3DDivider() {
  return (
    <div 
      className="relative h-32 w-full flex items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Top layer */}
      <motion.div
        animate={{
          rotateX: [0, 45, 0],
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      {/* Middle layer */}
      <motion.div
        animate={{
          rotateX: [0, -45, 0],
          y: [0, 20, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      {/* Light rays */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0, 0.3, 0],
            scaleY: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.7,
          }}
          className="absolute w-px h-16 bg-gradient-to-b from-primary/60 to-transparent"
          style={{
            left: `${25 + i * 25}%`,
            transformStyle: "preserve-3d",
          }}
        />
      ))}
    </div>
  );
}
