import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { Pickaxe } from "lucide-react";

export const Route = createFileRoute("/calculators/gravel")({
  head: () => ({ meta: [{ title: "حاسبة الحصى — BuildIQ Iraq" }] }),
  component: GravelCalc,
});

function GravelCalc() {
  const [v, setV] = useState({
    purpose: "concrete",
    length: "", width: "", thickness: "",
    pricePerM3: "", wastage: "10",
  });

  // Gravel density ~ 1500 kg/m³
  const DENSITY = 1500;

  const PURPOSE: Record<string, { label: string; factor: number }> = {
    concrete: { label: "كونكريت (حصى خشن)", factor: 1.0 },
    subbase: { label: "طبقة أساس تحت البلاط/الشارع", factor: 1.1 },
    drainage: { label: "تصريف / حول الأنابيب", factor: 1.0 },
    decoration: { label: "حصى زينة (حدائق)", factor: 1.0 },
  };

  const r = useMemo(() => {
    const L = +v.length, W = +v.width, T = +v.thickness;
    const baseVol = L * W * T;
    const p = PURPOSE[v.purpose] ?? PURPOSE.concrete;
    const wast = 1 + (+v.wastage || 0) / 100;
    const volume = baseVol * p.factor * wast;
    const weightTon = (volume * DENSITY) / 1000;
    const cost = volume * +v.pricePerM3;
    return { area: L * W, volume, weightTon, cost };
  }, [v]);

  const inputs: CalcInput[] = [
    {
      key: "purpose", label: "الاستخدام", type: "select", value: v.purpose,
      options: Object.entries(PURPOSE).map(([k, p]) => ({ value: k, label: p.label })),
    },
    { key: "length", label: "الطول", unit: "م", value: v.length },
    { key: "width", label: "العرض", unit: "م", value: v.width },
    { key: "thickness", label: "السماكة", unit: "م", value: v.thickness },
    { key: "pricePerM3", label: "سعر م³ من الحصى", unit: "د.ع", value: v.pricePerM3, step: 1000 },
    { key: "wastage", label: "نسبة الهدر", unit: "%", value: v.wastage },
  ];

  return (
    <CalculatorShell
      title="حاسبة الحصى"
      subtitle="حساب كمية الحصى للكونكريت، طبقات الأساس، التصريف والديكور"
      icon={Pickaxe} type="gravel"
      inputs={inputs}
      onChange={(k, val) => setV((s) => ({ ...s, [k]: val }))}
      results={[
        { label: "المساحة", value: r.area, unit: "م²" },
        { label: "حجم الحصى المطلوب", value: r.volume, unit: "م³" },
        { label: "الوزن التقديري", value: r.weightTon, unit: "طن" },
        { label: "التكلفة", value: r.cost, isCost: true },
      ]}
      totalCost={r.cost}
    />
  );
}