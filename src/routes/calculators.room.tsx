import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { Ruler } from "lucide-react";

export const Route = createFileRoute("/calculators/room")({
  head: () => ({ meta: [{ title: "حاسبة مساحة الغرف — BuildIQ Iraq" }] }),
  component: RoomCalc,
});

function RoomCalc() {
  const [v, setV] = useState({
    roomType: "غرفة",
    length: "",
    width: "",
    height: "",
    count: "1",
    pricePerM2: "",
  });

  const ROOM_LABELS: Record<string, string> = {
    "غرفة": "غرفة نوم / معيشة",
    "مطبخ": "مطبخ",
    "حمام": "حمام",
    "صالة": "صالة / هول",
  };

  const { area, totalArea, perimeter, wallArea, volume, cost } = useMemo(() => {
    const L = +v.length, W = +v.width, H = +v.height, N = Math.max(1, +v.count || 1);
    const a = L * W;
    const p = 2 * (L + W);
    const wa = p * H;
    const vol = a * H;
    const totalA = a * N;
    const c = totalA * +v.pricePerM2;
    return { area: a, totalArea: totalA, perimeter: p, wallArea: wa, volume: vol, cost: c };
  }, [v]);

  const inputs: CalcInput[] = [
    {
      key: "roomType", label: "نوع الغرفة", type: "select", value: v.roomType,
      options: Object.entries(ROOM_LABELS).map(([k, l]) => ({ value: k, label: l })),
    },
    { key: "length", label: "الطول", unit: "م", value: v.length },
    { key: "width", label: "العرض", unit: "م", value: v.width },
    { key: "height", label: "الارتفاع", unit: "م", value: v.height },
    { key: "count", label: "عدد الغرف المتطابقة", unit: "غرفة", value: v.count, step: 1 },
    { key: "pricePerM2", label: "سعر التشطيب لكل م² (اختياري)", unit: "د.ع", value: v.pricePerM2, step: 1000 },
  ];

  return (
    <CalculatorShell
      title="حاسبة مساحة الغرف"
      subtitle="حساب مساحات الغرف، المطابخ، الحمامات والصالات + محيط الجدران والحجم"
      icon={Ruler} type="room"
      inputs={inputs}
      onChange={(k, val) => setV((s) => ({ ...s, [k]: val }))}
      results={[
        { label: "مساحة الغرفة الواحدة", value: area, unit: "م²" },
        { label: "المساحة الإجمالية", value: totalArea, unit: "م²" },
        { label: "محيط الغرفة", value: perimeter, unit: "م" },
        { label: "مساحة الجدران", value: wallArea, unit: "م²" },
        { label: "حجم الغرفة", value: volume, unit: "م³" },
        { label: "تكلفة التشطيب التقديرية", value: cost, isCost: true },
      ]}
      totalCost={cost}
    />
  );
}