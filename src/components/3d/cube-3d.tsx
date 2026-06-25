import { motion } from "framer-motion";

export function Cube3D() {
  const size = 100;
  
  return (
    <div style={{ perspective: "1000px", width: "100%", height: "100%" }} className="flex items-center justify-center">
      <motion.div
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const rotations = [
            { rotateY: 0, z: size / 2 },
            { rotateY: 180, z: -size / 2 },
            { rotateY: 90, z: 0, rotateZ: 0, x: size / 2 },
            { rotateY: -90, z: 0, rotateZ: 0, x: -size / 2 },
            { rotateX: 90, z: 0, y: size / 2 },
            { rotateX: -90, z: 0, y: -size / 2 },
          ];
          
          const rot = rotations[index];
          
          return (
            <motion.div
              key={index}
              style={{
                position: "absolute",
                width: size,
                height: size,
                border: "2px solid rgba(59, 130, 246, 0.4)",
                backgroundColor: `rgba(59, 130, 246, 0.05)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                backdropFilter: "blur(10px)",
                transformStyle: "preserve-3d",
                transform: `rotateX(${rot.rotateX || 0}deg) rotateY(${rot.rotateY}deg) rotateZ(${rot.rotateZ || 0}deg) translateZ(${rot.z || rot.x || rot.y || 0}px)`,
              }}
            >
              <span className="text-primary/60 font-bold text-xs">3D</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
