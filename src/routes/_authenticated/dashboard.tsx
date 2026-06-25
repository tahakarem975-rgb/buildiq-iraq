import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app-shell";
import { FolderKanban, Users, Calculator, TrendingUp, Boxes, Layers, Wrench, PaintRoller, Hammer, Plus, Ruler, Mountain, Pickaxe } from "lucide-react";
import { formatIQD, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "لوحة التحكم — BuildIQ Iraq" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [p, c, ca] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("calculations").select("total_cost"),
      ]);
      const total = (ca.data ?? []).reduce((s, r: { total_cost: number | null }) => s + (Number(r.total_cost) || 0), 0);
      return { projects: p.count ?? 0, clients: c.count ?? 0, calcs: ca.data?.length ?? 0, totalCost: total };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["recent-calcs"],
    queryFn: async () => {
      const { data } = await supabase.from("calculations")
        .select("id, title, type, total_cost, created_at")
        .order("created_at", { ascending: false }).limit(6);
      return data ?? [];
    },
  });

  const calcCards = [
    { to: "/calculators/brick", label: "حاسبة الطابوق", icon: Boxes, desc: "احسب عدد الطابوق ومواد البناء" },
    { to: "/calculators/concrete", label: "حاسبة الكونكريت", icon: Layers, desc: "نسب الإسمنت والرمل والحصى" },
    { to: "/calculators/steel", label: "حاسبة الحديد", icon: Wrench, desc: "وزن وكميات حديد التسليح" },
    { to: "/calculators/paint", label: "حاسبة الصبغ", icon: PaintRoller, desc: "كميات الصبغ حسب المساحة" },
    { to: "/calculators/tile", label: "حاسبة الكاشي", icon: Hammer, desc: "عدد قطع الكاشي والمواد" },
    { to: "/calculators/room", label: "حاسبة مساحة الغرف", icon: Ruler, desc: "مساحات الغرف والمطابخ والحمامات" },
    { to: "/calculators/sand", label: "حاسبة الرمل", icon: Mountain, desc: "كميات الرمل للياسة والمونة والردم" },
    { to: "/calculators/gravel", label: "حاسبة الحصى", icon: Pickaxe, desc: "كميات الحصى للكونكريت وطبقات الأساس" },
    { to: "/cost-summary", label: "تكلفة المشروع", icon: Calculator, desc: "تجميع كل الحسابات في تقرير تكلفة شامل" },
  ];

  return (
    <div>
      <PageHeader title="لوحة التحكم" subtitle="نظرة عامة على نشاطك ومشاريعك" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FolderKanban} label="المشاريع" value={String(stats?.projects ?? 0)} accent="primary" />
        <StatCard icon={Users} label="العملاء" value={String(stats?.clients ?? 0)} accent="accent" />
        <StatCard icon={Calculator} label="الحسابات" value={String(stats?.calcs ?? 0)} accent="primary" />
        <StatCard icon={TrendingUp} label="إجمالي التكاليف" value={formatIQD(stats?.totalCost ?? 0)} accent="accent" small />
      </div>

      <h2 className="font-bold text-lg mb-4">الحاسبات</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {calcCards.map((c) => (
          <Link key={c.to} to={c.to} className="group">
            <Card className="p-5 hover:border-primary/50 hover:shadow-lg transition h-full">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <c.icon className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{c.label}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-4">آخر الحسابات</h2>
      {recent && recent.length > 0 ? (
        <Card className="divide-y divide-border">
          {recent.map((r) => (
            <div key={r.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.title || r.type}</div>
                <div className="text-xs text-muted-foreground">{formatDate(r.created_at)}</div>
              </div>
              <div className="font-bold text-primary" dir="ltr">{formatIQD(Number(r.total_cost) || 0)}</div>
            </div>
          ))}
        </Card>
      ) : (
        <Card className="p-10 text-center">
          <Calculator className="size-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground mb-4">لا توجد حسابات بعد</p>
          <Link to="/calculators/brick" className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
            <Plus className="size-4" /> ابدأ حسابك الأول
          </Link>
        </Card>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, small }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent: string; small?: boolean }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>
      <div className={`font-extrabold ${small ? "text-lg" : "text-2xl"}`} dir="ltr">{value}</div>
    </Card>
  );
}