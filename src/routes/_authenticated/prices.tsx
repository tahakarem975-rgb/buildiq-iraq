import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/app-shell";
import { Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatIQD } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/prices")({
  head: () => ({ meta: [{ title: "أسعار المواد — BuildIQ Iraq" }] }),
  component: Prices,
});

const CATS = ["طابوق", "كونكريت", "حديد", "صبغ", "كاشي", "أخرى"];

function Prices() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: prices } = useQuery({
    queryKey: ["prices"],
    queryFn: async () => (await supabase.from("material_prices").select("*").order("category")).data ?? [],
  });

  const create = useMutation({
    mutationFn: async (form: { category: string; name: string; unit: string; price_iqd: number }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("غير مسجل");
      const { error } = await supabase.from("material_prices").insert({ ...form, user_id: u.user.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("تم الحفظ"); qc.invalidateQueries({ queryKey: ["prices"] }); setOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("material_prices").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["prices"] }); },
  });

  const byCat: Record<string, typeof prices> = {};
  (prices ?? []).forEach((p) => { (byCat[p.category] ??= []).push(p); });

  return (
    <div>
      <PageHeader
        title="أسعار المواد"
        subtitle="إدارة أسعار مواد البناء بالدينار العراقي"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="size-4" /> إضافة سعر</Button></DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader><DialogTitle>إضافة سعر مادة</DialogTitle></DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  create.mutate({
                    category: String(fd.get("category") || "أخرى"),
                    name: String(fd.get("name") || "").trim(),
                    unit: String(fd.get("unit") || "").trim(),
                    price_iqd: Number(fd.get("price_iqd") || 0),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label>الفئة</Label>
                  <Select name="category" defaultValue="طابوق">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>اسم المادة</Label><Input name="name" required placeholder="مثال: طابوق ثرمستون" /></div>
                <div><Label>الوحدة</Label><Input name="unit" required placeholder="قطعة / م³ / كغم / لتر" /></div>
                <div><Label>السعر بالدينار العراقي</Label><Input name="price_iqd" type="number" min="0" required dir="ltr" /></div>
                <Button type="submit" className="w-full" disabled={create.isPending}>حفظ</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {Object.keys(byCat).length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="size-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">لم تضف أسعاراً بعد. أنشئ قائمة أسعارك المرجعية لاستخدامها في الحاسبات.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(byCat).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="font-bold mb-3 text-primary">{cat}</h3>
              <Card className="divide-y divide-border">
                {items!.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">لكل {p.unit}</div>
                    </div>
                    <div className="font-bold text-primary" dir="ltr">{formatIQD(Number(p.price_iqd))}</div>
                    <button onClick={() => del.mutate(p.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}