import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/app-shell";
import { Plus, FolderKanban, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatIQD } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({ meta: [{ title: "المشاريع — BuildIQ Iraq" }] }),
  component: Projects,
});

function Projects() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, name, description, status, created_at, client_id, clients(name)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: clients } = useQuery({
    queryKey: ["clients-min"],
    queryFn: async () => (await supabase.from("clients").select("id,name")).data ?? [],
  });

  const { data: totals } = useQuery({
    queryKey: ["project-totals"],
    queryFn: async () => {
      const { data } = await supabase.from("calculations").select("project_id,total_cost");
      const map: Record<string, number> = {};
      (data ?? []).forEach((c: { project_id: string | null; total_cost: number | null }) => {
        if (!c.project_id) return;
        map[c.project_id] = (map[c.project_id] || 0) + (Number(c.total_cost) || 0);
      });
      return map;
    },
  });

  const create = useMutation({
    mutationFn: async (form: { name: string; description: string; client_id: string | null }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("غير مسجل");
      const { error } = await supabase.from("projects").insert({ ...form, user_id: u.user.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("تم إنشاء المشروع"); qc.invalidateQueries({ queryKey: ["projects"] }); setOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("projects").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("تم الحذف"); qc.invalidateQueries({ queryKey: ["projects"] }); },
  });

  return (
    <div>
      <PageHeader
        title="المشاريع"
        subtitle="إدارة جميع مشاريع البناء الخاصة بك"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="size-4" /> مشروع جديد</Button></DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader><DialogTitle>إنشاء مشروع جديد</DialogTitle></DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const cid = String(fd.get("client_id") || "");
                  create.mutate({
                    name: String(fd.get("name") || "").trim(),
                    description: String(fd.get("description") || "").trim(),
                    client_id: cid && cid !== "none" ? cid : null,
                  });
                }}
                className="space-y-4"
              >
                <div><Label>اسم المشروع</Label><Input name="name" required /></div>
                <div><Label>الوصف</Label><Textarea name="description" rows={3} /></div>
                <div>
                  <Label>العميل</Label>
                  <Select name="client_id" defaultValue="none">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون عميل</SelectItem>
                      {clients?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={create.isPending}>حفظ</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {projects && projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="p-5 hover:border-primary/40 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderKanban className="size-5 text-primary" />
                </div>
                <button onClick={() => { if (confirm("حذف هذا المشروع؟")) del.mutate(p.id); }} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <h3 className="font-bold mb-1">{p.name}</h3>
              {p.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>}
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">{(p as { clients?: { name: string } | null }).clients?.name ?? "بدون عميل"}</span>
                <span className="text-muted-foreground">{formatDate(p.created_at)}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                <span className="text-xs text-muted-foreground">إجمالي التكاليف</span>
                <span className="font-bold text-primary" dir="ltr">{formatIQD(totals?.[p.id] ?? 0)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FolderKanban className="size-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">لا توجد مشاريع — أنشئ مشروعك الأول</p>
        </Card>
      )}
    </div>
  );
}