import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function InteractiveDepthLayer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isHovering) {
        setMousePosition({ x: 0, y: 0 });
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePosition({
        x: (x - 0.5) * 30,
        y: (y - 0.5) * 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        perspective: "1200px",
      }}
      className="relative w-full h-full"
    >
      <motion.div
        animate={{
          rotateX: mousePosition.y,
          rotateY: mousePosition.x,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {/* Multiple depth layers */}
        {[0, 1, 2].map((layer) => (
          <motion.div
            key={layer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 - layer * 0.15 }}
            transition={{ delay: layer * 0.1 }}
            style={{
              position: "absolute",
              inset: 0,
              translateZ: `${layer * -30}px`,
              transformStyle: "preserve-3d",
            }}
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl border border-border/30 blur-sm"
          />
        ))}
      </motion.div>
    </div>
  );
}
