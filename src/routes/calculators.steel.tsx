import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { Wrench } from "lucide-react";

export const Route = createFileRoute("/calculators/steel")({
  head: () => ({
    meta: [{ title: "حاسبة الحديد — BuildIQ Iraq" }],
  }),
  component: SteelCalc,
});

const DIAMS = ["8", "10", "12", "14", "16", "18", "20", "25"];

function SteelCalc() {
  const [v, setV] = useState({
    diameter: "12",
    lengthPerBar: "",
    barsCount: "",
  });

  const r = useMemo(() => {
    const d = +v.diameter;

    // وزن المتر الواحد
    const weightPerM = (d * d) / 162;

    // الطول الكلي
    const totalLength =
      (+v.lengthPerBar || 0) * (+v.barsCount || 0);

    // الوزن الكلي
    const totalWeight = totalLength * weightPerM;

    // الوزن بالطن
    const totalTons = totalWeight / 1000;

    return {
      weightPerM,
      totalLength,
      totalWeight,
      totalTons,
    };
  }, [v]);

  const inputs: CalcInput[] = [
    {
      key: "diameter",
      label: "قطر الحديد",
      unit: "مم",
      type: "select",
      value: v.diameter,
      options: DIAMS.map((d) => ({
        value: d,
        label: `${d} مم`,
      })),
    },
    {
      key: "lengthPerBar",
      label: "طول السيخ",
      unit: "م",
      value: v.lengthPerBar,
    },
    {
      key: "barsCount",
      label: "عدد الأسياخ",
      unit: "سيخ",
      value: v.barsCount,
      step: 1,
    },
  ];

  return (
    <CalculatorShell
      title="حاسبة الحديد"
      subtitle="حساب وزن حديد التسليح وفق قطر السيخ"
      icon={Wrench}
      type="steel"
      inputs={inputs}
      onChange={(k, val) =>
        setV((s) => ({ ...s, [k]: val }))
      }
      results={[
        {
          label: "وزن المتر الواحد",
          value: r.weightPerM,
          unit: "كغم/م",
        },
        {
          label: "الطول الكلي",
          value: r.totalLength,
          unit: "م",
        },
        {
          label: "الوزن الكلي",
          value: r.totalWeight,
          unit: "كغم",
        },
        {
          label: "الوزن بالطن",
          value: r.totalTons,
          unit: "طن",
        },
      ]}
      totalCost={0}
    />
  );
}