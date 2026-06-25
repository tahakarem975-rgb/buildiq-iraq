import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CalculatorShell, type CalcInput } from "@/components/calculator-shell";
import { Hammer } from "lucide-react";

export const Route = createFileRoute("/calculators/tile")({
  head: () => ({
    meta: [{ title: "حاسبة الكاشي — BuildIQ Iraq" }],
  }),
  component: TileCalc,
});

const TILE_SIZES = {
  "20x20": { length: 0.2, width: 0.2 },
  "30x30": { length: 0.3, width: 0.3 },
  "40x40": { length: 0.4, width: 0.4 },
  "50x50": { length: 0.5, width: 0.5 },
  "60x60": { length: 0.6, width: 0.6 },
  "80x80": { length: 0.8, width: 0.8 },
  "100x100": { length: 1.0, width: 1.0 },
  "120x60": { length: 1.2, width: 0.6 },
  "120x120": { length: 1.2, width: 1.2 },
  "160x80": { length: 1.6, width: 0.8 },
};

function TileCalc() {
  const [v, setV] = useState({
    roomLength: "",
    roomWidth: "",
    tileSize: "60x60",
    wastage: "10",
    pricePerTile: "",
    adhesivePrice: "",
  });

  const r = useMemo(() => {
    const area = (+v.roomLength || 0) * (+v.roomWidth || 0);

    const selectedTile =
      TILE_SIZES[v.tileSize as keyof typeof TILE_SIZES] ??
      TILE_SIZES["60x60"];

    const tileArea =
      selectedTile.length * selectedTile.width;

    const baseCount = area / tileArea;

    const count = Math.ceil(
      baseCount * (1 + (+v.wastage || 0) / 100)
    );

    const boxesCount = Math.ceil(count / 12);
    const adhesiveBags = Math.ceil(area / 5);

    const tileCost = count * (+v.pricePerTile || 0);
    const adhCost = adhesiveBags * (+v.adhesivePrice || 0);

    const total = tileCost + adhCost;

    return {
      area,
      count,
      boxesCount,
      adhesiveBags,
      tileCost,
      adhCost,
      total,
    };
  }, [v]);

  const inputs: CalcInput[] = [
    {
      key: "roomLength",
      label: "طول الغرفة",
      unit: "م",
      value: v.roomLength,
    },
    {
      key: "roomWidth",
      label: "عرض الغرفة",
      unit: "م",
      value: v.roomWidth,
    },
    {
      key: "tileSize",
      label: "مقاس الكاشي",
      type: "select",
      value: v.tileSize,
      options: [
        { value: "20x20", label: "20 × 20 سم" },
        { value: "30x30", label: "30 × 30 سم" },
        { value: "40x40", label: "40 × 40 سم" },
        { value: "50x50", label: "50 × 50 سم" },
        { value: "60x60", label: "60 × 60 سم" },
        { value: "80x80", label: "80 × 80 سم" },
        { value: "100x100", label: "100 × 100 سم" },
        { value: "120x60", label: "120 × 60 سم" },
        { value: "120x120", label: "120 × 120 سم" },
        { value: "160x80", label: "160 × 80 سم" },
      ],
    },
    {
      key: "wastage",
      label: "نسبة الهدر",
      unit: "%",
      value: v.wastage,
    },
    {
      key: "pricePerTile",
      label: "سعر القطعة",
      unit: "د.ع",
      value: v.pricePerTile,
      step: 100,
    },
    {
      key: "adhesivePrice",
      label: "سعر كيس اللاصق",
      unit: "د.ع",
      value: v.adhesivePrice,
      step: 500,
    },
  ];

  return (
    <CalculatorShell
      title="حاسبة الكاشي"
      subtitle="حساب عدد قطع الكاشي والكراتين والمواد اللاصقة"
      icon={Hammer}
      type="tile"
      inputs={inputs}
      onChange={(k, val) =>
        setV((s) => ({ ...s, [k]: val }))
      }
      results={[
        {
          label: "مساحة الأرضية",
          value: r.area,
          unit: "م²",
        },
        {
          label: "عدد قطع الكاشي",
          value: r.count,
          unit: "قطعة",
        },
        {
          label: "عدد الكراتين",
          value: r.boxesCount,
          unit: "كرتون",
        },
        {
          label: "أكياس اللاصق",
          value: r.adhesiveBags,
          unit: "كيس",
        },
        {
          label: "تكلفة الكاشي",
          value: r.tileCost,
          isCost: true,
        },
        {
          label: "تكلفة اللاصق",
          value: r.adhCost,
          isCost: true,
        },
      ]}
      totalCost={r.total}
    />
  );
}