import { motion } from "framer-motion";

export function EngineeringBlueprintBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blueprint Grid Pattern - Main Layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: 0.3,
        }}
      >
        <defs>
          <pattern id="blueprint-grid" x="40" y="40" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="40" height="40" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="1" fill="rgba(59, 130, 246, 0.3)" />
          </pattern>
          
          <pattern id="technical-grid" x="80" y="80" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="80" height="80" fill="none" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="1" />
            <line x1="0" y1="0" x2="80" y2="80" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="0.5" />
            <line x1="80" y1="0" x2="0" y2="80" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Base grids */}
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        <rect width="100%" height="100%" fill="url(#technical-grid)" opacity="0.5" />
      </svg>

      {/* Animated Technical Lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
        <defs>
          <linearGradient id="tech-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>

        {/* Horizontal lines */}
        {[0, 120, 240, 360, 480, 600, 720].map((y) => (
          <motion.line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="100%"
            y2={y}
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="1"
            animate={{
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: y * 0.05,
            }}
          />
        ))}

        {/* Vertical lines */}
        {[0, 150, 300, 450, 600, 750, 900, 1050, 1200].map((x) => (
          <motion.line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="100%"
            stroke="rgba(59, 130, 246, 0.15)"
            strokeWidth="1"
            animate={{
              opacity: [0.08, 0.3, 0.08],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: x * 0.02,
            }}
          />
        ))}

        {/* Diagonal technical lines */}
        {[0, 200, 400, 600, 800].map((offset) => (
          <motion.line
            key={`d-${offset}`}
            x1={offset}
            y1="0"
            x2={offset + 600}
            y2="100%"
            stroke="url(#tech-line-gradient)"
            strokeWidth="1"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: offset * 0.03,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
