import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Download, Trash2, Loader2, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePDFReports } from "@/hooks/use-project-management";
import { FloatingCard } from "@/components/3d/floating-card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [{ title: "التقارير — BuildIQ Iraq" }],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { reports, loading, updatePDFReport, deletePDFReport } = usePDFReports();

  const handleDownload = async (reportId: string, fileName: string) => {
    try {
      // Mark as downloaded
      await updatePDFReport(reportId, {
        downloaded_at: new Date().toISOString(),
      });

      // In a real application, you would download the file from storage
      toast.success("جاري تحميل التقرير...");

      // Simulate download
      setTimeout(() => {
        toast.success("تم تحميل التقرير بنجاح");
      }, 1000);
    } catch (error) {
      toast.error("فشل تحميل التقرير");
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("هل تريد حذف هذا التقرير؟")) return;

    try {
      await deletePDFReport(reportId);
      toast.success("تم حذف التقرير بنجاح");
    } catch (error) {
      toast.error("فشل حذف التقرير");
    }
  };

  const statusLabels: Record<string, string> = {
    generated: "تم الإنشاء",
    downloaded: "تم التحميل",
    archived: "مؤرشف",
  };

  const statusColors: Record<string, string> = {
    generated: "bg-blue-500/20 text-blue-500",
    downloaded: "bg-green-500/20 text-green-500",
    archived: "bg-gray-500/20 text-gray-500",
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
            <h1 className="text-3xl font-extrabold text-arabic-heading">التقارير</h1>
            <p className="text-sm text-muted-foreground text-arabic mt-1">
              إدارة التقارير و ملفات PDF الخاصة بك
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : reports.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {reports.map((report, index) => (
              <FloatingCard key={report.id} delay={index * 0.05}>
                <Card className="p-6 hover:border-primary/50 transition flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="size-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <FileText className="size-5 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-arabic-heading truncate">
                          {report.file_name}
                        </h3>
                        <p className="text-xs text-muted-foreground text-arabic">
                          {new Date(report.generated_at).toLocaleDateString("ar-IQ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 rounded-lg bg-secondary/50">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        statusColors[report.status] || statusColors.generated
                      } text-arabic`}
                    >
                      {statusLabels[report.status] || report.status}
                    </span>
                  </div>

                  {report.file_size && (
                    <p className="text-xs text-muted-foreground mb-4 text-arabic">
                      الحجم: {(report.file_size / 1024).toFixed(2)} كيلوبايت
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleDownload(report.id, report.file_name)
                      }
                      className="flex-1 p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 transition flex items-center justify-center gap-2"
                      title="تحميل"
                    >
                      <Download className="size-4" />
                      <span className="text-xs font-medium text-arabic">تحميل</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(report.id)}
                      className="flex-1 p-2 rounded-lg hover:bg-destructive/20 transition flex items-center justify-center"
                      title="حذف"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </motion.button>
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
              لا توجد تقارير محفوظة حتى الآن
            </p>
            <p className="text-sm text-muted-foreground text-arabic">
              سيتم عرض التقارير المولدة هنا
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
