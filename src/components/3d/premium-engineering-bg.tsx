import { AnimatedLightingEffects } from "./animated-lighting-effects";
import { EngineeringBlueprintBg } from "./engineering-blueprint-bg";
import { Structural3DBuildings } from "./structural-3d-buildings";
import { TechnicalDrawingElements } from "./technical-drawing-elements";
import { ConstructionElementsOverlay } from "./construction-elements-overlay";

export function PremiumEngineeringBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Base Blueprint and Grid */}
      <div className="absolute inset-0">
        <EngineeringBlueprintBg />
      </div>

      {/* Layer 2: 3D Buildings */}
      <div className="absolute inset-0">
        <Structural3DBuildings />
      </div>

      {/* Layer 3: Technical Drawing Elements */}
      <div className="absolute inset-0">
        <TechnicalDrawingElements />
      </div>

      {/* Layer 4: Construction Elements */}
      <div className="absolute inset-0">
        <ConstructionElementsOverlay />
      </div>

      {/* Layer 5: Animated Lighting Effects (Top) */}
      <div className="absolute inset-0">
        <AnimatedLightingEffects />
      </div>

      {/* Subtle overlay to ensure readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.02) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
