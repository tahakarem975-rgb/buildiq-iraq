import { motion } from "framer-motion";

export function TechnicalDrawingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="measurement-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>

        {/* Measurement Line 1 - Top Left */}
        <motion.g
          animate={{
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 0,
          }}
        >
          <line x1="150" y1="100" x2="350" y2="100" stroke="url(#measurement-gradient)" strokeWidth="1.5" />
          <line x1="150" y1="95" x2="150" y2="105" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
          <line x1="350" y1="95" x2="350" y2="105" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
          <circle cx="250" cy="100" r="3" fill="rgba(59, 130, 246, 0.4)" />
        </motion.g>

        {/* Measurement Line 2 - Center */}
        <motion.g
          animate={{
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            delay: 1.5,
          }}
        >
          <line x1="500" y1="150" x2="700" y2="150" stroke="url(#measurement-gradient)" strokeWidth="1.5" />
          <line x1="500" y1="145" x2="500" y2="155" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
          <line x1="700" y1="145" x2="700" y2="155" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
        </motion.g>

        {/* Construction Annotation 1 */}
        <motion.g
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 2,
          }}
        >
          {/* Corner marking */}
          <circle cx="200" cy="250" r="8" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
          <line x1="190" y1="250" x2="210" y2="250" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.8" />
          <line x1="200" y1="240" x2="200" y2="260" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.8" />
          
          {/* Measurement indicator */}
          <line x1="200" y1="250" x2="250" y2="280" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.8" strokeDasharray="3,3" />
          <circle cx="250" cy="280" r="4" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.8" />
        </motion.g>

        {/* Construction Annotation 2 */}
        <motion.g
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            delay: 3,
          }}
        >
          {/* Corner marking */}
          <circle cx="900" cy="180" r="8" fill="none" stroke="rgba(202, 138, 4, 0.3)" strokeWidth="1" />
          <line x1="890" y1="180" x2="910" y2="180" stroke="rgba(202, 138, 4, 0.3)" strokeWidth="0.8" />
          <line x1="900" y1="170" x2="900" y2="190" stroke="rgba(202, 138, 4, 0.3)" strokeWidth="0.8" />
          
          {/* Measurement indicator */}
          <line x1="900" y1="180" x2="850" y2="220" stroke="rgba(202, 138, 4, 0.2)" strokeWidth="0.8" strokeDasharray="3,3" />
          <circle cx="850" cy="220" r="4" fill="none" stroke="rgba(202, 138, 4, 0.3)" strokeWidth="0.8" />
        </motion.g>

        {/* Dimension Lines Grid */}
        {[0, 150, 300, 450, 600, 750, 900, 1050].map((x, idx) => (
          <motion.line
            key={`dim-v-${idx}`}
            x1={x}
            y1="700"
            x2={x}
            y2="720"
            stroke="rgba(59, 130, 246, 0.15)"
            strokeWidth="0.8"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: idx * 0.15,
            }}
          />
        ))}

        {/* Horizontal dimension line */}
        <motion.line
          x1="0"
          y1="720"
          x2="1200"
          y2="720"
          stroke="rgba(59, 130, 246, 0.15)"
          strokeWidth="0.8"
          animate={{
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />

        {/* Technical Angle Markers */}
        <motion.g
          animate={{
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 0.5,
          }}
        >
          <circle cx="400" cy="350" r="15" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.8" />
          <line x1="400" y1="335" x2="400" y2="350" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.8" />
          <path d="M 400 350 L 415 350" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="0.8" fill="none" />
          <path d="M 400 350 A 15 15 0 0 0 410.6 360.6" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.8" fill="none" />
        </motion.g>

        {/* Technical Angle Marker 2 */}
        <motion.g
          animate={{
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            delay: 2,
          }}
        >
          <circle cx="800" cy="400" r="12" fill="none" stroke="rgba(202, 138, 4, 0.2)" strokeWidth="0.8" />
          <line x1="800" y1="388" x2="800" y2="400" stroke="rgba(202, 138, 4, 0.2)" strokeWidth="0.8" />
          <path d="M 800 400 L 812 400" stroke="rgba(202, 138, 4, 0.2)" strokeWidth="0.8" />
        </motion.g>
      </svg>
    </div>
  );
}
