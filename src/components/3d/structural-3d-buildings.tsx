import { motion } from "framer-motion";

export function Structural3DBuildings() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 3D Building Silhouettes with depth */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* 3D building shadows for depth */}
          <linearGradient id="building-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
          </linearGradient>

          <linearGradient id="building-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.12)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.03)" />
          </linearGradient>

          <linearGradient id="building-gradient-3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(202, 138, 4, 0.1)" />
            <stop offset="100%" stopColor="rgba(202, 138, 4, 0.02)" />
          </linearGradient>

          {/* Filter for building glow */}
          <filter id="building-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Building 1 - Left */}
        <motion.g
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Shadow/depth */}
          <polygon points="100,500 80,480 280,480 300,500" fill="rgba(0,0,0,0.2)" />
          {/* Main building */}
          <polygon points="100,500 80,380 280,380 300,500" fill="url(#building-gradient-1)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
          
          {/* Building grid/windows */}
          {[0, 20, 40, 60].map((x) =>
            [0, 20, 40, 60, 80, 100].map((y) => (
              <motion.rect
                key={`b1-${x}-${y}`}
                x={90 + x}
                y={390 + y}
                width="12"
                height="12"
                fill="none"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="0.5"
                animate={{
                  fill: ["rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: (x + y) * 0.02,
                }}
              />
            ))
          )}
        </motion.g>

        {/* Building 2 - Center */}
        <motion.g
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          {/* Shadow/depth */}
          <polygon points="400,520 370,450 630,450 660,520" fill="rgba(0,0,0,0.25)" />
          {/* Main building - Taller */}
          <polygon points="400,520 370,300 630,300 660,520" fill="url(#building-gradient-2)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
          
          {/* Building grid/windows - More visible */}
          {[0, 25, 50, 75].map((x) =>
            [0, 25, 50, 75, 100, 125, 150, 175, 200].map((y) => (
              <motion.rect
                key={`b2-${x}-${y}`}
                x={385 + x}
                y={315 + y}
                width="15"
                height="15"
                fill="none"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="0.5"
                animate={{
                  fill: ["rgba(139, 92, 246, 0)", "rgba(139, 92, 246, 0.12)", "rgba(139, 92, 246, 0)"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: (x + y) * 0.015,
                }}
              />
            ))
          )}
        </motion.g>

        {/* Building 3 - Right */}
        <motion.g
          animate={{
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          {/* Shadow/depth */}
          <polygon points="800,500 775,410 925,410 950,500" fill="rgba(0,0,0,0.2)" />
          {/* Main building */}
          <polygon points="800,500 775,340 925,340 950,500" fill="url(#building-gradient-3)" stroke="rgba(202, 138, 4, 0.35)" strokeWidth="2" />
          
          {/* Building grid/windows */}
          {[0, 22, 44].map((x) =>
            [0, 22, 44, 66, 88, 110, 132].map((y) => (
              <motion.rect
                key={`b3-${x}-${y}`}
                x={790 + x}
                y={355 + y}
                width="14"
                height="14"
                fill="none"
                stroke="rgba(202, 138, 4, 0.25)"
                strokeWidth="0.5"
                animate={{
                  fill: ["rgba(202, 138, 4, 0)", "rgba(202, 138, 4, 0.08)", "rgba(202, 138, 4, 0)"],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  delay: (x + y) * 0.018,
                }}
              />
            ))
          )}
        </motion.g>

        {/* Building 4 - Far left background */}
        <motion.g opacity={0.2}>
          <polygon points="20,550 0,460 150,460 170,550" fill="rgba(59, 130, 246, 0.08)" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
        </motion.g>

        {/* Building 5 - Far right background */}
        <motion.g opacity={0.2}>
          <polygon points="1050,550 1030,420 1200,420 1200,550" fill="rgba(139, 92, 246, 0.06)" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" />
        </motion.g>
      </svg>
    </div>
  );
}
