import { type ReactNode, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatIQD, formatNumber, formatDate } from "@/lib/format";
import { FileDown, Save, Loader2, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { downloadElementAsPDF } from "@/lib/pdf";

export interface CalcInput {
  key: string;
  label: string;
  unit?: string;
  type?: "number" | "select";
  value: number | string;
  step?: number;
  options?: { value: string; label: string }[];
}

export interface CalcResult {
  label: string;
  value: number;
  unit?: string;
  isCost?: boolean;
  isTotal?: boolean;
}

export function CalculatorShell({
  title, subtitle, icon: Icon, type, inputs, onChange, results, totalCost,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  inputs: CalcInput[];
  onChange: (key: string, value: string) => void;
  results: CalcResult[];
  totalCost: number;
}) {
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [projectId, setProjectId] = useState<string>("none");
  const [reportName, setReportName] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: projects } = useQuery({
    queryKey: ["projects-list"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("id,name").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  async function save() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return toast.error("سجّل الدخول أولاً");
    setSaving(true);
    const inputsObj = Object.fromEntries(inputs.map((i) => [i.key, i.value]));
    const resultsObj = Object.fromEntries(results.map((r) => [r.label, r.value]));
    const { error } = await supabase.from("calculations").insert({
      user_id: u.user.id,
      project_id: projectId === "none" ? null : projectId,
      type,
      title: reportName || title,
      inputs: inputsObj,
      results: resultsObj,
      total_cost: totalCost,
    });
    setSaving(false);
    if (error) return toast.error("فشل الحفظ: " + error.message);
    toast.success("تم حفظ الحساب");
  }

  async function exportPDF() {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await downloadElementAsPDF(reportRef.current, `${reportName || title}.pdf`);
      toast.success("تم تنزيل التقرير");
    } catch {
      toast.error("فشل إنشاء PDF");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="no-print mb-6 flex items-center gap-3">
        <div className="size-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Icon className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-2 p-5 no-print h-fit">
          <h2 className="font-bold mb-4">المدخلات</h2>
          <div className="space-y-4">
            {inputs.map((inp) => (
              <div key={inp.key} className="space-y-1.5">
                <Label htmlFor={inp.key}>{inp.label} {inp.unit && <span className="text-xs text-muted-foreground">({inp.unit})</span>}</Label>
                {inp.type === "select" ? (
                  <Select value={String(inp.value)} onValueChange={(v) => onChange(inp.key, v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {inp.options?.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={inp.key}
                    type="number"
                    step={inp.step ?? 0.01}
                    value={inp.value}
                    onChange={(e) => onChange(inp.key, e.target.value)}
                    dir="ltr"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-6 pt-4 space-y-3">
            <div>
              <Label>اسم التقرير (اختياري)</Label>
              <Input value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder={title} />
            </div>
            <div>
              <Label>ربط بمشروع</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger><SelectValue placeholder="بدون مشروع" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون مشروع</SelectItem>
                  {projects?.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} حفظ
              </Button>
              <Button variant="outline" onClick={exportPDF} disabled={exporting} className="flex-1">
                {exporting ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />} تنزيل PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Results / Report */}
        <div className="lg:col-span-3">
          <Card className="p-6 print-area" ref={reportRef}>
            <ReportHeader title={reportName || title} subtitle={subtitle} />

            <section>
              <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">المدخلات</h3>
              <div className="grid sm:grid-cols-2 gap-2 mb-6">
                {inputs.map((i) => (
                  <div key={i.key} className="flex justify-between border-b border-dashed border-border py-1.5 text-sm">
                    <span className="text-muted-foreground">{i.label}</span>
                    <span className="font-semibold">
                      {i.type === "select"
                        ? i.options?.find((o) => o.value === String(i.value))?.label
                        : `${formatNumber(Number(i.value))} ${i.unit ?? ""}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">النتائج</h3>
              <div className="space-y-2">
                {results.map((r) => (
                  <div key={r.label} className={`flex items-center justify-between p-3 rounded-lg ${r.isTotal ? "bg-primary/10 border border-primary/30" : "bg-muted/40"}`}>
                    <span className={r.isTotal ? "font-bold" : "text-sm"}>{r.label}</span>
                    <span className={`font-extrabold ${r.isTotal ? "text-primary text-lg" : ""}`} dir="ltr">
                      {r.isCost ? formatIQD(r.value) : `${formatNumber(r.value)} ${r.unit ?? ""}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {totalCost > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-l from-primary/20 to-accent/20 border border-primary/40">
                <div className="text-xs text-muted-foreground mb-1">التكلفة الإجمالية التقديرية</div>
                <div className="text-3xl font-extrabold text-primary" dir="ltr">{formatIQD(totalCost)}</div>
              </div>
            )}

            <ReportFooter />
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReportHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b-2 border-primary/40 pb-4 mb-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Building2 className="size-6 text-primary-foreground" />
        </div>
        <div>
          <div className="font-extrabold text-lg">BuildIQ Iraq</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div className="text-left">
        <div className="font-bold">{title}</div>
        <div className="text-xs text-muted-foreground">{formatDate(new Date())}</div>
      </div>
    </div>
  );
}

function ReportFooter() {
  return (
    <div className="mt-8 pt-4 border-t border-border text-[10px] text-muted-foreground text-center">
      تم إنشاء هذا التقرير بواسطة منصة BuildIQ Iraq • النتائج تقديرية للأغراض الإرشادية
    </div>
  );
}