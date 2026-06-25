import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { Mountain } from "lucide-react";

export const Route = createFileRoute("/calculators/sand")({
  head: () => ({ meta: [{ title: "حاسبة الرمل — BuildIQ Iraq" }] }),
  component: SandCalc,
});

function SandCalc() {
  const [v, setV] = useState({
    purpose: "plaster",
    length: "", width: "", thickness: "",
    pricePerM3: "", wastage: "10",
  });

  // Sand density ~ 1600 kg/m³
  const DENSITY = 1600;

  const PURPOSE: Record<string, { label: string; factor: number; hint: string }> = {
    plaster: { label: "لياسة / بلاستر", factor: 1.0, hint: "مساحة × سماكة" },
    bedding: { label: "فرشة رمل تحت الكاشي", factor: 1.0, hint: "مساحة × سماكة" },
    backfill: { label: "ردم / تعبئة", factor: 1.05, hint: "حجم + 5% انضغاط" },
    mortar: { label: "مونة بناء", factor: 1.25, hint: "تعويض الفراغات" },
  };

  const r = useMemo(() => {
    const L = +v.length, W = +v.width, T = +v.thickness;
    const baseVol = L * W * T;
    const p = PURPOSE[v.purpose] ?? PURPOSE.plaster;
    const wast = 1 + (+v.wastage || 0) / 100;
    const volume = baseVol * p.factor * wast;
    const weightKg = volume * DENSITY;
    const weightTon = weightKg / 1000;
    const cost = volume * +v.pricePerM3;
    return { area: L * W, volume, weightKg, weightTon, cost };
  }, [v]);

  const inputs: CalcInput[] = [
    {
      key: "purpose", label: "الاستخدام", type: "select", value: v.purpose,
      options: Object.entries(PURPOSE).map(([k, p]) => ({ value: k, label: p.label })),
    },
    { key: "length", label: "الطول", unit: "م", value: v.length },
    { key: "width", label: "العرض", unit: "م", value: v.width },
    { key: "thickness", label: "السماكة", unit: "م", value: v.thickness },
    { key: "pricePerM3", label: "سعر م³ من الرمل", unit: "د.ع", value: v.pricePerM3, step: 1000 },
    { key: "wastage", label: "نسبة الهدر", unit: "%", value: v.wastage },
  ];

  return (
    <CalculatorShell
      title="حاسبة الرمل"
      subtitle="حساب كمية الرمل بحسب الاستخدام (لياسة، فرشة، ردم، مونة)"
      icon={Mountain} type="sand"
      inputs={inputs}
      onChange={(k, val) => setV((s) => ({ ...s, [k]: val }))}
      results={[
        { label: "المساحة", value: r.area, unit: "م²" },
        { label: "حجم الرمل المطلوب", value: r.volume, unit: "م³" },
        { label: "الوزن التقديري", value: r.weightTon, unit: "طن" },
        { label: "الوزن بالكيلوغرام", value: r.weightKg, unit: "كغم" },
        { label: "التكلفة", value: r.cost, isCost: true },
      ]}
      totalCost={r.cost}
    />
  );
}