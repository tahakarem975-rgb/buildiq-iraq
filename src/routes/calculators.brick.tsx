import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { Boxes } from "lucide-react";

export const Route = createFileRoute("/calculators/brick")({
  head: () => ({ meta: [{ title: "حاسبة الطابوق — BuildIQ Iraq" }] }),
  component: BrickCalc,
});

function BrickCalc() {
  const [v, setV] = useState({
    length: "", height: "", thickness: "",
    brickType: "ثرمستون", brickPrice: "", mortarPrice: "", wastage: "",
  });

  // Brick sizes (m): ثرمستون 0.4x0.2x0.2, طابوق 0.24x0.115x0.07, بلوك 0.4x0.2x0.2
  const BRICK_SPEC: Record<string, { vol: number; mortar: number; label: string }> = {
    ثرمستون: { vol: 0.4 * 0.2 * 0.2, mortar: 0.10, label: "ثرمستون 40×20×20" },
    طابوق: { vol: 0.24 * 0.115 * 0.07, mortar: 0.30, label: "طابوق 24×11.5×7" },
    بلوك: { vol: 0.4 * 0.2 * 0.2, mortar: 0.10, label: "بلوك إسمنتي 40×20×20" },
  };

  const { area, wallVol, count, mortarVol, brickCost, mortarCost, total } = useMemo(() => {
    const L = +v.length, H = +v.height, T = +v.thickness;
    const spec = BRICK_SPEC[v.brickType] ?? BRICK_SPEC.ثرمستون;
    const area = L * H;
    const wallVol = area * T;
    const wastage = +v.wastage / 100;
    const count = Math.ceil((wallVol / spec.vol) * (1 + wastage));
    const mortarVol = wallVol * spec.mortar;
    const brickCost = count * +v.brickPrice;
    const mortarCost = mortarVol * +v.mortarPrice;
    return { area, wallVol, count, mortarVol, brickCost, mortarCost, total: brickCost + mortarCost };
  }, [v]);

  const inputs: CalcInput[] = [
    { key: "length", label: "طول الجدار", unit: "م", value: v.length },
    { key: "height", label: "ارتفاع الجدار", unit: "م", value: v.height },
    { key: "thickness", label: "سماكة الجدار", unit: "م", value: v.thickness },
    { key: "brickType", label: "نوع الطابوق", type: "select", value: v.brickType,
      options: Object.entries(BRICK_SPEC).map(([k, s]) => ({ value: k, label: s.label })) },
    { key: "brickPrice", label: "سعر القطعة الواحدة", unit: "د.ع", value: v.brickPrice, step: 50 },
    { key: "mortarPrice", label: "سعر م³ من المونة", unit: "د.ع", value: v.mortarPrice, step: 1000 },
    { key: "wastage", label: "نسبة الهدر", unit: "%", value: v.wastage },
  ];

  return (
    <CalculatorShell
      title="حاسبة الطابوق"
      subtitle="حساب عدد قطع الطابوق وكمية المونة لجدران البناء"
      icon={Boxes} type="brick"
      inputs={inputs}
      onChange={(k, val) => setV((s) => ({ ...s, [k]: val }))}
      results={[
        { label: "مساحة الجدار", value: area, unit: "م²" },
        { label: "حجم الجدار", value: wallVol, unit: "م³" },
        { label: "عدد قطع الطابوق", value: count, unit: "قطعة" },
        { label: "كمية المونة", value: mortarVol, unit: "م³" },
        { label: "تكلفة الطابوق", value: brickCost, isCost: true },
        { label: "تكلفة المونة", value: mortarCost, isCost: true },
      ]}
      totalCost={total}
    />
  );
}