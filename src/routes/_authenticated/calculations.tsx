import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Trash2, Star, Loader2, Archive, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCalculations, useFavorites } from "@/hooks/use-project-management";
import { FloatingCard } from "@/components/3d/floating-card";
import { toast } from "sonner";
import { formatIQD } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/calculations")({
  head: () => ({
    meta: [{ title: "سجل الحسابات — BuildIQ Iraq" }],
  }),
  component: CalculationsPage,
});

function CalculationsPage() {
  const navigate = useNavigate();
  const { calculations, loading, deleteCalculation, updateCalculation } = useCalculations();
  const { toggleFavorite } = useFavorites();

  const handleToggleFavorite = async (calculationId: string, isFavorite: boolean) => {
    try {
      await updateCalculation(calculationId, { is_favorite: !isFavorite });
      toast.success(
        !isFavorite
          ? "تمت الإضافة للمفضلة"
          : "تمت الإزالة من المفضلة"
      );
    } catch (error) {
      toast.error("فشل التحديث");
    }
  };

  const handleDelete = async (calculationId: string) => {
    if (!confirm("هل تريد حذف هذا الحساب؟")) return;
    try {
      await deleteCalculation(calculationId);
      toast.success("تم حذف الحساب بنجاح");
    } catch (error) {
      toast.error("فشل الحذف");
    }
  };

  const calculationTypeLabels: Record<string, string> = {
    brick: "حاسبة الطابوق",
    concrete: "حاسبة الكونكريت",
    steel: "حاسبة الحديد",
    paint: "حاسبة الصبغ",
    tile: "حاسبة الكاشي",
    room: "حاسبة المساحة",
    sand: "حاسبة الرمل",
    gravel: "حاسبة الحصى",
  };

  return (
    <div className="min-h-screen bg-background rtl" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-extrabold text-arabic-heading">سجل الحسابات</h1>
            <p className="text-sm text-muted-foreground text-arabic mt-1">
              عرض وإدارة جميع حساباتك السابقة
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : calculations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {calculations.map((calc, index) => (
              <FloatingCard key={calc.id} delay={index * 0.02}>
                <Card className="p-6 hover:border-primary/50 transition">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="size-5 text-primary" />
                        <div>
                          <h3 className="font-bold text-lg text-arabic-heading">
                            {calc.title || calculationTypeLabels[calc.type] || calc.type}
                          </h3>
                          <p className="text-xs text-muted-foreground text-arabic">
                            {new Date(calc.created_at).toLocaleDateString("ar-IQ", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      {calc.notes && (
                        <p className="text-sm text-muted-foreground text-arabic line-clamp-1">
                          {calc.notes}
                        </p>
                      )}
                    </div>

                    {calc.total_cost && (
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-primary text-arabic-heading">
                          {formatIQD(calc.total_cost)}
                        </p>
                        <p className="text-xs text-muted-foreground text-arabic">
                          إجمالي التكلفة
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleToggleFavorite(calc.id, calc.is_favorite)
                        }
                        title={calc.is_favorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                      >
                        <Star
                          className={`size-5 ${
                            calc.is_favorite
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(calc.id)}
                        title="حذف"
                      >
                        <Trash2 className="size-5 text-destructive" />
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </FloatingCard>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Archive className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground text-arabic mb-6">
              لا توجد حسابات محفوظة حتى الآن
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate({ to: "/" })}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-arabic"
            >
              ابدأ حسابك الأول
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
