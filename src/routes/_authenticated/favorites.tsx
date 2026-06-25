import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Loader2, Trash2, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFavorites, useCalculations } from "@/hooks/use-project-management";
import { FloatingCard } from "@/components/3d/floating-card";
import { toast } from "sonner";

const CALCULATOR_ICONS: Record<string, React.ReactNode> = {
  brick: "🧱",
  concrete: "🏗️",
  steel: "🔧",
  paint: "🎨",
  tile: "⬜",
  room: "📐",
  sand: "🏜️",
  gravel: "⛏️",
};

const CALCULATOR_LABELS: Record<string, string> = {
  brick: "حاسبة الطابوق",
  concrete: "حاسبة الكونكريت",
  steel: "حاسبة الحديد",
  paint: "حاسبة الصبغ",
  tile: "حاسبة الكاشي",
  room: "حاسبة المساحة",
  sand: "حاسبة الرمل",
  gravel: "حاسبة الحصى",
};

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({
    meta: [{ title: "المفضلة — BuildIQ Iraq" }],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const navigate = useNavigate();
  const { favoriteCalculators, favoriteProjects, loading, toggleFavorite } =
    useFavorites();
  const { calculations, loading: calcLoading } = useCalculations();

  const handleRemoveFavorite = async (
    type: "calculator" | "project",
    id: string
  ) => {
    try {
      await toggleFavorite(type, id);
      toast.success("تمت الإزالة من المفضلة");
    } catch (error) {
      toast.error("فشل تحديث المفضلة");
    }
  };

  const favoriteCalculations = calculations.filter((c) => c.is_favorite);

  return (
    <div className="min-h-screen bg-background rtl" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-extrabold text-arabic-heading">المفضلة</h1>
            <p className="text-sm text-muted-foreground text-arabic mt-1">
              الحسابات والمشاريع المفضلة لديك
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading || calcLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : favoriteCalculators.length === 0 &&
          favoriteProjects.length === 0 &&
          favoriteCalculations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground text-arabic mb-6">
              لا توجد عناصر مفضلة حتى الآن
            </p>
            <p className="text-sm text-muted-foreground text-arabic">
              أضف حاسبات ومشاريع للمفضلة للوصول السريع إليها
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Favorite Calculators */}
            {favoriteCalculators.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-arabic-heading mb-6">
                  الحاسبات المفضلة
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {favoriteCalculators.map((calc, index) => (
                    <FloatingCard key={calc} delay={index * 0.05}>
                      <Card className="p-6 hover:border-primary/50 transition">
                        <div
                          onClick={() =>
                            navigate({ to: `/calculators/${calc}` })
                          }
                          className="mb-4 cursor-pointer group"
                        >
                          <div className="text-4xl mb-3">
                            {CALCULATOR_ICONS[calc] || "🔢"}
                          </div>
                          <h3 className="font-bold text-lg text-arabic-heading group-hover:text-primary transition">
                            {CALCULATOR_LABELS[calc] || calc}
                          </h3>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleRemoveFavorite("calculator", calc)
                          }
                          className="w-full p-2 rounded-lg hover:bg-destructive/20 transition flex items-center justify-center gap-2 text-destructive"
                        >
                          <Trash2 className="size-4" />
                          <span className="text-sm font-medium text-arabic">
                            إزالة من المفضلة
                          </span>
                        </motion.button>
                      </Card>
                    </FloatingCard>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Favorite Calculations */}
            {favoriteCalculations.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-arabic-heading mb-6">
                  الحسابات المفضلة
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {favoriteCalculations.map((calc, index) => (
                    <FloatingCard key={calc.id} delay={index * 0.02}>
                      <Card className="p-6 hover:border-primary/50 transition">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-arabic-heading">
                              {calc.title ||
                                CALCULATOR_LABELS[calc.type] ||
                                calc.type}
                            </h3>
                            <p className="text-xs text-muted-foreground text-arabic">
                              {new Date(calc.created_at).toLocaleDateString(
                                "ar-IQ"
                              )}
                            </p>
                          </div>

                          {calc.total_cost && (
                            <p className="text-lg font-bold text-primary text-arabic-heading">
                              {calc.total_cost.toLocaleString("ar-IQ")} د.ع
                            </p>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleRemoveFavorite("project", calc.id)
                            }
                          >
                            <Trash2 className="size-5 text-destructive" />
                          </motion.button>
                        </div>
                      </Card>
                    </FloatingCard>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Favorite Projects */}
            {favoriteProjects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-arabic-heading mb-6">
                  المشاريع المفضلة
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {favoriteProjects.map((project, index) => (
                    <FloatingCard key={project.id} delay={index * 0.05}>
                      <Card className="p-6 hover:border-primary/50 transition group cursor-pointer">
                        <div
                          onClick={() =>
                            navigate({
                              to: `/_authenticated/project/${project.id}`,
                            })
                          }
                          className="mb-4 group-hover:text-primary transition"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Home className="size-5 text-primary" />
                            <h3 className="font-bold text-lg text-arabic-heading">
                              {project.name}
                            </h3>
                          </div>
                          {project.description && (
                            <p className="text-sm text-muted-foreground text-arabic line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleRemoveFavorite("project", project.id)
                          }
                          className="w-full p-2 rounded-lg hover:bg-destructive/20 transition flex items-center justify-center gap-2 text-destructive mt-4"
                        >
                          <Trash2 className="size-4" />
                          <span className="text-sm font-medium text-arabic">
                            إزالة من المفضلة
                          </span>
                        </motion.button>
                      </Card>
                    </FloatingCard>
                  ))}
                </motion.div>
              </section>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
