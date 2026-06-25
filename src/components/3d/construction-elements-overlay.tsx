import { motion } from "framer-motion";

export function ConstructionElementsOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="construction-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.08)" />
          </linearGradient>
        </defs>

        {/* Construction Tools - Blueprint Ruler 1 */}
        <motion.g
          animate={{
            opacity: [0.08, 0.25, 0.08],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 0,
          }}
        >
          {/* Ruler */}
          <rect x="80" y="50" width="200" height="8" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
          {/* Tick marks */}
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map((offset) => (
            <line
              key={`ruler1-${offset}`}
              x1={80 + offset}
              y1={offset % 40 === 0 ? 46 : offset % 20 === 0 ? 48 : 50}
              x2={80 + offset}
              y2={58}
              stroke="rgba(59, 130, 246, 0.25)"
              strokeWidth="0.8"
            />
          ))}
        </motion.g>

        {/* Construction Tools - Level 1 */}
        <motion.g
          animate={{
            opacity: [0.07, 0.22, 0.07],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 2,
          }}
        >
          {/* Level base */}
          <line x1="900" y1="120" x2="1050" y2="120" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" />
          {/* Bubble levels */}
          <circle cx="920" cy="120" r="5" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
          <circle cx="970" cy="120" r="5" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
          <circle cx="1020" cy="120" r="5" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
          {/* Bubble indicators */}
          <circle cx="970" cy="120" r="2" fill="rgba(139, 92, 246, 0.4)" />
        </motion.g>

        {/* Construction Elements - Grid Structure */}
        <motion.g
          animate={{
            opacity: [0.05, 0.18, 0.05],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            delay: 1,
          }}
        >
          {/* Grid pattern indicating structure */}
          {[0, 30, 60, 90].map((x) =>
            [0, 30, 60, 90, 120].map((y) => (
              <circle
                key={`grid-${x}-${y}`}
                cx={200 + x}
                cy={200 + y}
                r="3"
                fill="none"
                stroke="rgba(202, 138, 4, 0.25)"
                strokeWidth="0.8"
              />
            ))
          )}
          {/* Connection lines */}
          {[0, 30, 60, 90].map((x, idx) =>
            idx < 3 ? (
              <line
                key={`con-h-${idx}`}
                x1={200 + x}
                y1="200"
                x2={200 + x + 30}
                y2="200"
                stroke="rgba(202, 138, 4, 0.15)"
                strokeWidth="0.5"
              />
            ) : null
          )}
        </motion.g>

        {/* Construction Cross-brace Marks */}
        <motion.g
          animate={{
            opacity: [0.06, 0.20, 0.06],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            delay: 3,
          }}
        >
          {/* X brace pattern */}
          <line x1="1000" y1="600" x2="1050" y2="650" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1" />
          <line x1="1050" y1="600" x2="1000" y2="650" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1" />
          {/* Corner marks */}
          <circle cx="1000" cy="600" r="4" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.8" />
          <circle cx="1050" cy="600" r="4" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.8" />
          <circle cx="1000" cy="650" r="4" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.8" />
          <circle cx="1050" cy="650" r="4" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.8" />
        </motion.g>

        {/* Architectural Dimensions */}
        <motion.g
          animate={{
            opacity: [0.08, 0.24, 0.08],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            delay: 0.5,
          }}
        >
          {/* Vertical dimension */}
          <line x1="150" y1="550" x2="150" y2="700" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1" />
          <line x1="145" y1="550" x2="155" y2="550" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1" />
          <line x1="145" y1="700" x2="155" y2="700" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1" />
          {/* Dimension markers */}
          <circle cx="150" cy="625" r="3" fill="rgba(139, 92, 246, 0.2)" />
          {/* Arrow indicators */}
          <path d="M 150 550 L 145 560 L 155 560 Z" fill="rgba(139, 92, 246, 0.2)" />
        </motion.g>

        {/* Structural Support Indicators */}
        <motion.g
          animate={{
            opacity: [0.06, 0.20, 0.06],
          }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            delay: 2.5,
          }}
        >
          {/* Support column base */}
          <rect x="650" y="680" width="30" height="20" fill="none" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1" />
          {/* Column */}
          <line x1="665" y1="680" x2="665" y2="600" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.5" />
          {/* Support caps */}
          <line x1="650" y1="600" x2="680" y2="600" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1" />
          {/* Load indicator */}
          <line x1="665" y1="585" x2="665" y2="600" stroke="rgba(202, 138, 4, 0.25)" strokeWidth="1" />
        </motion.g>

        {/* Foundation Blueprint Elements */}
        <motion.g
          animate={{
            opacity: [0.07, 0.22, 0.07],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 1.5,
          }}
        >
          {/* Foundation grid */}
          {[0, 25, 50, 75].map((x) =>
            [0, 25, 50].map((y) => (
              <rect
                key={`found-${x}-${y}`}
                x={400 + x}
                y={680 + y}
                width="20"
                height="20"
                fill="none"
                stroke="rgba(139, 92, 246, 0.2)"
                strokeWidth="0.5"
              />
            ))
          )}
        </motion.g>
      </svg>
    </div>
  );
}
