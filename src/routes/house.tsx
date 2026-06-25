import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { Home } from "lucide-react";

export const Route = createFileRoute("/house")({
  component: HouseCalc,
});

function HouseCalc() {
  const [v, setV] = useState({
    area: "",
    floors: "1",
    finishType: "medium",
  });

  const { totalArea, estimatedCost, bricksCount } = useMemo(() => {
    const area = +v.area;
    const floors = +v.floors;

    const totalArea = area * floors;

    const costPerM2 =
      v.finishType === "economic"
        ? 450000
        : v.finishType === "medium"
        ? 650000
        : 900000;

    const estimatedCost = totalArea * costPerM2;

    const bricksCount = Math.round(totalArea * 120);

return {
  totalArea,
  estimatedCost,
  bricksCount,
};
  }, [v]);

  const inputs: CalcInput[] = [
    {
      key: "area",
      label: "مساحة الأرض",
      unit: "م²",
      value: v.area,
    },
    {
      key: "floors",
      label: "عدد الطوابق",
      unit: "طابق",
      value: v.floors,
    },
    {
      key: "finishType",
      label: "نوع التشطيب",
      type: "select",
      value: v.finishType,
      options: [
        { value: "economic", label: "اقتصادي" },
        { value: "medium", label: "متوسط" },
        { value: "luxury", label: "فاخر" },
      ],
    },
  ];

  return (
    <CalculatorShell
      title="حاسبة المنزل الكامل"
      subtitle="تقدير مساحة البناء والكلفة الإجمالية"
      icon={Home}
      type="house"
      inputs={inputs}
      onChange={(k, val) => setV((s) => ({ ...s, [k]: val }))}
      results={[
  {
    label: "إجمالي مساحة البناء",
    value: totalArea,
    unit: "م²",
  },
  {
    label: "عدد الطابوق التقديري",
    value: bricksCount,
    unit: "قطعة",
  },
  {
    label: "الكلفة التقديرية",
    value: estimatedCost,
    isCost: true,
  },
]}
      totalCost={estimatedCost}
    />
  );
}