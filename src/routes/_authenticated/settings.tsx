import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Mail, User, Loader2, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [{ title: "الإعدادات — BuildIQ Iraq" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/auth" });
      } else {
        setUser(data.user);
        setDisplayName(data.user.user_metadata?.name || "");
        setIsLoading(false);
      }
    })();
  }, [navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("أدخل اسمك");
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase.auth.updateUser({
        data: { name: displayName },
      });

      if (error) throw error;
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
      toast.error("فشل تحديث الملف الشخصي");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      toast.success("تم نسخ البريد الإلكتروني");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background rtl" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate({ to: "/_authenticated/dashboard" })}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="size-5" />
            <span className="text-arabic">العودة</span>
          </motion.button>
          <h1 className="text-3xl font-extrabold text-arabic-heading mt-3">
            الإعدادات
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-arabic-heading mb-6">
              الملف الشخصي
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="text-sm font-medium text-arabic mb-2 block">
                  اسم العرض
                </label>
                <div className="flex items-center gap-2">
                  <User className="size-5 text-muted-foreground" />
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="rtl text-arabic"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="text-sm font-medium text-arabic mb-2 block">
                  البريد الإلكتروني
                </label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
                  <Mail className="size-5 text-muted-foreground" />
                  <span className="flex-1 text-arabic">{user.email}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-2 hover:bg-primary/10 rounded-lg transition"
                  >
                    {copied ? (
                      <Check className="size-5 text-green-500" />
                    ) : (
                      <Copy className="size-5 text-muted-foreground" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Account Details */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-muted-foreground text-arabic">
                  <strong>معرّف الحساب:</strong> {user.id.slice(0, 8)}...
                </p>
                <p className="text-sm text-muted-foreground text-arabic mt-2">
                  <strong>تم إنشاء الحساب:</strong>{" "}
                  {new Date(user.created_at).toLocaleDateString("ar-IQ")}
                </p>
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="w-full p-3 rounded-lg bg-primary text-primary-foreground font-semibold text-arabic hover:opacity-90 disabled:opacity-50 transition"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin inline" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ التغييرات"
                )}
              </motion.button>
            </form>
          </Card>
        </motion.section>

        {/* Preferences Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-arabic-heading mb-6">
              التفضيلات
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition">
                <div>
                  <p className="font-medium text-arabic-heading">الإشعارات</p>
                  <p className="text-xs text-muted-foreground text-arabic">
                    استقبل تنبيهات عن مشاريعك وحساباتك
                  </p>
                </div>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🔔</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition">
                <div>
                  <p className="font-medium text-arabic-heading">المظهر</p>
                  <p className="text-xs text-muted-foreground text-arabic">
                    نمط العرض (فاتح / غامق)
                  </p>
                </div>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🎨</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition">
                <div>
                  <p className="font-medium text-arabic-heading">الخصوصية</p>
                  <p className="text-xs text-muted-foreground text-arabic">
                    إدارة إعدادات الخصوصية والأمان
                  </p>
                </div>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🔒</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Security Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-arabic-heading mb-6">
              الأمان
            </h2>

            <div className="space-y-4">
              <Button className="w-full justify-start text-arabic" variant="outline">
                تغيير كلمة المرور
              </Button>
              <Button className="w-full justify-start text-arabic" variant="outline">
                جلسات النشاط
              </Button>
              <Button className="w-full justify-start text-arabic" variant="outline">
                الأجهزة المرتبطة
              </Button>
            </div>
          </Card>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 border-destructive/50 bg-destructive/5">
            <h2 className="text-2xl font-bold text-destructive mb-6">
              منطقة الخطر
            </h2>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full p-3 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive font-semibold text-arabic transition flex items-center justify-center gap-2"
              >
                <LogOut className="size-5" />
                تسجيل الخروج من هذا الجهاز
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive font-semibold text-arabic transition"
              >
                حذف الحساب بشكل نهائي
              </motion.button>
            </div>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}
