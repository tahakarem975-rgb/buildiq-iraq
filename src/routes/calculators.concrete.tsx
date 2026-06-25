import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/calculators/concrete")({
  head: () => ({ meta: [{ title: "حاسبة الكونكريت — BuildIQ Iraq" }] }),
  component: ConcreteCalc,
});

function ConcreteCalc() {
  const [v, setV] = useState({
    length: "", width: "", thickness: "",
    mix: "1:2:4", cementPrice: "", sandPrice: "", gravelPrice: "", wastage: "",
  });

  // Mix proportions to volumes per m³ (dry vol = 1.54)
  const MIX: Record<string, { c: number; s: number; g: number; label: string }> = {
    "1:1.5:3": { c: 1, s: 1.5, g: 3, label: "1:1.5:3 (M20 — قوي)" },
    "1:2:4": { c: 1, s: 2, g: 4, label: "1:2:4 (M15 — قياسي)" },
    "1:3:6": { c: 1, s: 3, g: 6, label: "1:3:6 (M10 — عادي)" },
  };

  const r = useMemo(() => {
    const L = +v.length, W = +v.width, T = +v.thickness;
    const vol = L * W * T;
    const wast = 1 + +v.wastage / 100;
    const dry = vol * 1.54 * wast;
    const m = MIX[v.mix] ?? MIX["1:2:4"];
    const sum = m.c + m.s + m.g;
    const cementM3 = (dry * m.c) / sum;
    // 1 bag cement = 50kg = ~0.0347 m³
    const cementBags = Math.ceil(cementM3 / 0.0347);
    const sandM3 = (dry * m.s) / sum;
    const gravelM3 = (dry * m.g) / sum;
    const cementCost = cementBags * +v.cementPrice;
    const sandCost = sandM3 * +v.sandPrice;
    const gravelCost = gravelM3 * +v.gravelPrice;
    return {
      vol, cementBags, sandM3, gravelM3,
      cementCost, sandCost, gravelCost,
      total: cementCost + sandCost + gravelCost,
    };
  }, [v]);

  const inputs: CalcInput[] = [
    { key: "length", label: "الطول", unit: "م", value: v.length },
    { key: "width", label: "العرض", unit: "م", value: v.width },
    { key: "thickness", label: "السماكة", unit: "م", value: v.thickness },
    { key: "mix", label: "نسبة الخلط", type: "select", value: v.mix,
      options: Object.entries(MIX).map(([k, m]) => ({ value: k, label: m.label })) },
    { key: "cementPrice", label: "سعر كيس الإسمنت (50 كغم)", unit: "د.ع", value: v.cementPrice, step: 100 },
    { key: "sandPrice", label: "سعر م³ من الرمل", unit: "د.ع", value: v.sandPrice, step: 1000 },
    { key: "gravelPrice", label: "سعر م³ من الحصى", unit: "د.ع", value: v.gravelPrice, step: 1000 },
    { key: "wastage", label: "نسبة الهدر", unit: "%", value: v.wastage },
  ];

  return (
    <CalculatorShell
      title="حاسبة الكونكريت" subtitle="حساب كميات الإسمنت والرمل والحصى وفق نسب الخلط"
      icon={Layers} type="concrete"
      inputs={inputs}
      onChange={(k, val) => setV((s) => ({ ...s, [k]: val }))}
      results={[
        { label: "حجم الكونكريت", value: r.vol, unit: "م³" },
        { label: "أكياس الإسمنت", value: r.cementBags, unit: "كيس" },
        { label: "الرمل", value: r.sandM3, unit: "م³" },
        { label: "الحصى", value: r.gravelM3, unit: "م³" },
        { label: "تكلفة الإسمنت", value: r.cementCost, isCost: true },
        { label: "تكلفة الرمل", value: r.sandCost, isCost: true },
        { label: "تكلفة الحصى", value: r.gravelCost, isCost: true },
      ]}
      totalCost={r.total}
    />
  );
}