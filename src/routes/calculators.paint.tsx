import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { PaintRoller } from "lucide-react";

export const Route = createFileRoute("/calculators/paint")({
  head: () => ({ meta: [{ title: "حاسبة الصبغ — BuildIQ Iraq" }] }),
  component: PaintCalc,
});

function PaintCalc() {
  const [v, setV] = useState({
    wallLength: "", wallHeight: "", openings: "",
    coats: "", coverage: "", pricePerLiter: "",
  });

  const r = useMemo(() => {
    const area = Math.max(+v.wallLength * +v.wallHeight - +v.openings, 0);
    const totalArea = area * +v.coats;
    const liters = totalArea / Math.max(+v.coverage, 0.1);
    const cost = liters * +v.pricePerLiter;
    return { area, totalArea, liters, cost };
  }, [v]);

  const inputs: CalcInput[] = [
    { key: "wallLength", label: "طول الجدار", unit: "م", value: v.wallLength },
    { key: "wallHeight", label: "ارتفاع الجدار", unit: "م", value: v.wallHeight },
    { key: "openings", label: "مساحة الفتحات (شبابيك/أبواب)", unit: "م²", value: v.openings },
    { key: "coats", label: "عدد الطبقات", unit: "طبقة", value: v.coats, step: 1 },
    { key: "coverage", label: "تغطية اللتر الواحد", unit: "م²/لتر", value: v.coverage },
    { key: "pricePerLiter", label: "سعر اللتر", unit: "د.ع", value: v.pricePerLiter, step: 500 },
  ];

  return (
    <CalculatorShell
      title="حاسبة الصبغ" subtitle="حساب كميات الصبغ المطلوبة وفق المساحة وعدد الطبقات"
      icon={PaintRoller} type="paint"
      inputs={inputs}
      onChange={(k, val) => setV((s) => ({ ...s, [k]: val }))}
      results={[
        { label: "صافي مساحة الجدار", value: r.area, unit: "م²" },
        { label: "إجمالي المساحة (مع الطبقات)", value: r.totalArea, unit: "م²" },
        { label: "كمية الصبغ المطلوبة", value: r.liters, unit: "لتر" },
      ]}
      totalCost={r.cost}
    />
  );
}