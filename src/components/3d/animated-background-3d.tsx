import { motion } from "framer-motion";

export function AnimatedBackground3D() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 15 + Math.random() * 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1200px" }}>
      {/* Background blur elements with depth */}
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        style={{
          transformStyle: "preserve-3d",
          translateZ: "50px",
        }}
      />

      <motion.div
        animate={{
          x: [-30, 30, -30],
          y: [50, -50, 50],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-1/3 -right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        style={{
          transformStyle: "preserve-3d",
          translateZ: "-30px",
        }}
      />

      {/* Floating particles with depth */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 0,
            y: window.innerHeight + 50,
            x: `${particle.x}%`,
          }}
          animate={{
            opacity: [0, 0.5, 0.5, 0],
            y: -50,
            x: `${particle.x + (Math.random() - 0.5) * 20}%`,
            rotateZ: 360,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            transformStyle: "preserve-3d",
            translateZ: `${Math.sin(particle.id) * 100}px`,
          }}
        />
      ))}
    </div>
  );
}
