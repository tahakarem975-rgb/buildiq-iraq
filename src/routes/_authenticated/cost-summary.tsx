import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/app-shell";
import { formatIQD, formatDate } from "@/lib/format";
import { Building2, FileDown, Loader2, Calculator } from "lucide-react";
import { downloadElementAsPDF } from "@/lib/pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/cost-summary")({
  head: () => ({ meta: [{ title: "تكلفة المشروع — BuildIQ Iraq" }] }),
  component: CostSummary,
});

const TYPE_LABEL: Record<string, string> = {
  brick: "الطابوق",
  concrete: "الكونكريت",
  sand: "الرمل",
  gravel: "الحصى",
  steel: "الحديد",
  paint: "الصبغ",
  tile: "الكاشي",
  room: "مساحة الغرف",
};

function CostSummary() {
  const [projectId, setProjectId] = useState<string>("all");
  const [extra, setExtra] = useState({ labor: "", misc: "", margin: "" });
  const [exporting, setExporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: projects } = useQuery({
    queryKey: ["projects-min"],
    queryFn: async () => (await supabase.from("projects").select("id,name").order("created_at", { ascending: false })).data ?? [],
  });

  const { data: calcs } = useQuery({
    queryKey: ["all-calcs", projectId],
    queryFn: async () => {
      let q = supabase.from("calculations").select("id,title,type,total_cost,created_at,project_id").order("created_at", { ascending: false });
      if (projectId !== "all") q = q.eq("project_id", projectId);
      const { data } = await q;
      return data ?? [];
    },
  });

  const projectName = useMemo(() => {
    if (projectId === "all") return "كل المشاريع";
    return projects?.find((p) => p.id === projectId)?.name ?? "—";
  }, [projectId, projects]);

  const summary = useMemo(() => {
    const byType: Record<string, number> = {};
    let materials = 0;
    for (const c of calcs ?? []) {
      const v = Number(c.total_cost) || 0;
      materials += v;
      byType[c.type] = (byType[c.type] ?? 0) + v;
    }
    const labor = +extra.labor || 0;
    const misc = +extra.misc || 0;
    const margin = +extra.margin || 0;
    const subtotal = materials + labor + misc;
    const marginAmt = subtotal * (margin / 100);
    const grand = subtotal + marginAmt;
    return { materials, labor, misc, subtotal, marginAmt, grand, byType };
  }, [calcs, extra]);

  async function exportPDF() {
    if (!ref.current) return;
    setExporting(true);
    try {
      await downloadElementAsPDF(ref.current, `تكلفة-${projectName}.pdf`);
      toast.success("تم تنزيل التقرير");
    } catch {
      toast.error("فشل إنشاء PDF");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <PageHeader title="حاسبة تكلفة المشروع" subtitle="تجميع كل الحسابات المحفوظة + أجور العمالة والهامش لإخراج تكلفة شاملة" />

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 p-5 h-fit no-print space-y-4">
          <h2 className="font-bold">إعدادات التقرير</h2>
          <div>
            <Label>المشروع</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المشاريع</SelectItem>
                {projects?.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>أجور العمالة (د.ع)</Label>
            <Input type="number" dir="ltr" value={extra.labor} onChange={(e) => setExtra((s) => ({ ...s, labor: e.target.value }))} />
          </div>
          <div>
            <Label>مصاريف متفرقة (د.ع)</Label>
            <Input type="number" dir="ltr" value={extra.misc} onChange={(e) => setExtra((s) => ({ ...s, misc: e.target.value }))} />
          </div>
          <div>
            <Label>هامش ربح / احتياطي (%)</Label>
            <Input type="number" dir="ltr" value={extra.margin} onChange={(e) => setExtra((s) => ({ ...s, margin: e.target.value }))} />
          </div>
          <Button onClick={exportPDF} disabled={exporting} className="w-full">
            {exporting ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />} تنزيل PDF
          </Button>
        </Card>

        <div className="lg:col-span-3">
          <Card className="p-6" ref={ref}>
            <div className="border-b-2 border-primary/40 pb-4 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Building2 className="size-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-extrabold text-lg">BuildIQ Iraq</div>
                  <div className="text-xs text-muted-foreground">تقرير تكلفة المشروع</div>
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold">{projectName}</div>
                <div className="text-xs text-muted-foreground">{formatDate(new Date())}</div>
              </div>
            </div>

            <section className="mb-6">
              <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">تفصيل تكاليف المواد</h3>
              {Object.keys(summary.byType).length === 0 ? (
                <div className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg">
                  لا توجد حسابات محفوظة. ابدأ بحفظ الحسابات من الحاسبات وستظهر هنا.
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(summary.byType).map(([t, v]) => (
                    <div key={t} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                      <span className="text-sm flex items-center gap-2"><Calculator className="size-4 text-primary" /> {TYPE_LABEL[t] ?? t}</span>
                      <span className="font-extrabold" dir="ltr">{formatIQD(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-2 mb-6">
              <Row label="إجمالي المواد" value={summary.materials} />
              <Row label="أجور العمالة" value={summary.labor} />
              <Row label="مصاريف متفرقة" value={summary.misc} />
              <Row label="الإجمالي الفرعي" value={summary.subtotal} bold />
              <Row label={`هامش / احتياطي (${extra.margin || 0}%)`} value={summary.marginAmt} />
            </section>

            <div className="p-5 rounded-xl bg-gradient-to-l from-primary/20 to-accent/20 border border-primary/40">
              <div className="text-xs text-muted-foreground mb-1">التكلفة الإجمالية للمشروع</div>
              <div className="text-3xl font-extrabold text-primary" dir="ltr">{formatIQD(summary.grand)}</div>
            </div>

            <div className="mt-8 pt-4 border-t border-border text-[10px] text-muted-foreground text-center">
              تم إنشاء هذا التقرير بواسطة منصة BuildIQ Iraq • النتائج تقديرية للأغراض الإرشادية
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${bold ? "bg-primary/10 border border-primary/30" : "bg-muted/30"}`}>
      <span className={bold ? "font-bold" : "text-sm"}>{label}</span>
      <span className="font-extrabold" dir="ltr">{formatIQD(value)}</span>
    </div>
  );
}