import { motion } from "framer-motion";

export function GradientBg3D() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Multiple gradient layers with 3D depth */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-1/2 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 blur-3xl"
        style={{ transformStyle: "preserve-3d", translateZ: "50px" }}
      />

      <motion.div
        animate={{
          x: [-100, 50, 100, -100],
          y: [100, 0, -100, 100],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -inset-1/3 bg-gradient-to-tl from-accent/3 via-primary/3 to-transparent blur-3xl"
        style={{ transformStyle: "preserve-3d", translateZ: "-30px" }}
      />

      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-1/4 bg-gradient-radial from-primary/8 to-transparent rounded-full blur-2xl"
        style={{ transformStyle: "preserve-3d", translateZ: "20px" }}
      />
    </div>
  );
}
