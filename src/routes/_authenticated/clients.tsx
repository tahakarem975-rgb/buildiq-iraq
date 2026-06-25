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
import { PageHeader } from "@/components/app-shell";
import { Plus, User, Phone, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clients")({
  head: () => ({ meta: [{ title: "العملاء — BuildIQ Iraq" }] }),
  component: Clients,
});

function Clients() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => (await supabase.from("clients").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const create = useMutation({
    mutationFn: async (form: { name: string; phone: string; address: string; notes: string }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("غير مسجل");
      const { error } = await supabase.from("clients").insert({ ...form, user_id: u.user.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("تم إضافة العميل"); qc.invalidateQueries({ queryKey: ["clients"] }); setOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("clients").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("تم الحذف"); qc.invalidateQueries({ queryKey: ["clients"] }); },
  });

  return (
    <div>
      <PageHeader
        title="العملاء"
        subtitle="إدارة بيانات عملائك"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="size-4" /> عميل جديد</Button></DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader><DialogTitle>إضافة عميل</DialogTitle></DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  create.mutate({
                    name: String(fd.get("name") || "").trim(),
                    phone: String(fd.get("phone") || "").trim(),
                    address: String(fd.get("address") || "").trim(),
                    notes: String(fd.get("notes") || "").trim(),
                  });
                }}
                className="space-y-4"
              >
                <div><Label>الاسم</Label><Input name="name" required /></div>
                <div><Label>رقم الهاتف</Label><Input name="phone" dir="ltr" /></div>
                <div><Label>العنوان</Label><Input name="address" /></div>
                <div><Label>ملاحظات</Label><Textarea name="notes" rows={2} /></div>
                <Button type="submit" className="w-full" disabled={create.isPending}>حفظ</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {clients && clients.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="size-5 text-accent-foreground" />
                </div>
                <button onClick={() => { if (confirm("حذف هذا العميل؟")) del.mutate(c.id); }} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <h3 className="font-bold mb-2">{c.name}</h3>
              {c.phone && <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Phone className="size-3" /><span dir="ltr">{c.phone}</span></div>}
              {c.address && <div className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="size-3" />{c.address}</div>}
              {c.notes && <p className="text-xs text-muted-foreground mt-3 border-t border-border pt-2">{c.notes}</p>}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <User className="size-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">لا يوجد عملاء بعد</p>
        </Card>
      )}
    </div>
  );
}