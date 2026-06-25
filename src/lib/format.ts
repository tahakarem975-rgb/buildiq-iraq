export function formatIQD(n: number): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("ar-IQ", { maximumFractionDigits: 0 }).format(Math.round(n)) + " د.ع";
}

export function formatNumber(n: number, digits = 2): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("ar-IQ", { maximumFractionDigits: digits }).format(n);
}

export function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(date);
}