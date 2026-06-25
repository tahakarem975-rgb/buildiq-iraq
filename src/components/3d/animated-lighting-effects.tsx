import { motion } from "framer-motion";

export function AnimatedLightingEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Light Ray 1 - Top Left to Center */}
      <motion.div
        className="absolute"
        animate={{
          opacity: [0, 0.3, 0],
          x: [0, 100, 200],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "400px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
          top: "10%",
          left: "-200px",
          filter: "blur(2px)",
        }}
      />

      {/* Animated Light Ray 2 - Right Side */}
      <motion.div
        className="absolute"
        animate={{
          opacity: [0.1, 0.4, 0.1],
          x: [-200, 0, 200],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          width: "500px",
          height: "3px",
          background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent)",
          top: "30%",
          right: "-250px",
          filter: "blur(3px)",
        }}
      />

      {/* Animated Light Ray 3 - Bottom */}
      <motion.div
        className="absolute"
        animate={{
          opacity: [0, 0.25, 0],
          y: [0, 50, 100],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        style={{
          width: "3px",
          height: "300px",
          background: "linear-gradient(180deg, transparent, rgba(202, 138, 4, 0.3), transparent)",
          bottom: "-150px",
          left: "25%",
          filter: "blur(2px)",
        }}
      />

      {/* Floating Light Particle 1 */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          x: [0, 50, -30, 20, 0],
          y: [0, -100, -50, -150, 0],
          opacity: [0, 0.6, 0.8, 0.4, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
          top: "10%",
          left: "15%",
          filter: "blur(40px)",
        }}
      />

      {/* Floating Light Particle 2 */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          x: [-50, 50, 30, -20, -50],
          y: [0, 80, 120, 60, 0],
          opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          bottom: "5%",
          right: "10%",
          filter: "blur(50px)",
        }}
      />

      {/* Floating Light Particle 3 */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          x: [0, 80, -60, 40, 0],
          y: [0, 60, 100, 40, 0],
          opacity: [0.1, 0.4, 0.5, 0.3, 0.1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(202, 138, 4, 0.12) 0%, transparent 70%)",
          top: "20%",
          right: "20%",
          filter: "blur(60px)",
        }}
      />

      {/* Overhead Lighting from top */}
      <motion.div
        className="absolute"
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          inset: 0,
          background: "linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Side Accent Light */}
      <motion.div
        className="absolute"
        animate={{
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          width: "600px",
          height: "100%",
          background: "linear-gradient(90deg, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
          left: 0,
          pointerEvents: "none",
        }}
      />

      {/* Subtle Energy Pulse */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.15 }}
      >
        <defs>
          <radialGradient id="energy-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </radialGradient>
        </defs>

        {/* Pulse 1 */}
        <motion.circle
          cx="300"
          cy="200"
          r="100"
          fill="url(#energy-pulse)"
          animate={{
            r: [100, 200, 300],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Pulse 2 */}
        <motion.circle
          cx="900"
          cy="400"
          r="80"
          fill="url(#energy-pulse)"
          animate={{
            r: [80, 180, 280],
            opacity: [0.4, 0.15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeOut",
            delay: 2,
          }}
        />
      </svg>
    </div>
  );
}
