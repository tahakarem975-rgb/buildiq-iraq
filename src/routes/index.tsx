import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calculator, Building2, Users, FileText, ArrowLeft, Boxes, PaintRoller, Layers, Hammer, Wrench, Ruler, Mountain, Pickaxe } from "lucide-react";
import { FloatingCard } from "@/components/3d/floating-card";
import { Card3D } from "@/components/3d/card-3d";
import { Text3D } from "@/components/3d/text-3d";
import { PremiumEngineeringBg } from "@/components/3d/premium-engineering-bg";
import { Section3DDivider } from "@/components/3d/section-3d-divider";
import { Button3D } from "@/components/3d/button-3d";
import { InteractiveDepthLayer } from "@/components/3d/interactive-depth-layer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildIQ Iraq — حسابات البناء الذكية بالدينار العراقي" },
      { name: "description", content: "احسب كميات وتكاليف الطابوق، الكونكريت، الحديد، الصبغ، والكاشي لمشاريعك في العراق. تقارير PDF احترافية وإدارة كاملة للعملاء." },
      { property: "og:title", content: "BuildIQ Iraq" },
      { property: "og:description", content: "منصة احترافية لحسابات البناء بالدينار العراقي" },
    ],
  }),
  component: Index,
});

function Index() {
  const calcs = [
    { icon: Boxes, name: "الطابوق", to: "/calculators/brick", color: "from-orange-500/20 to-amber-500/10" },
    { icon: Layers, name: "الكونكريت", to: "/calculators/concrete", color: "from-slate-500/20 to-zinc-500/10" },
    { icon: Wrench, name: "الحديد", to: "/calculators/steel", color: "from-blue-500/20 to-sky-500/10" },
    { icon: PaintRoller, name: "الصبغ", to: "/calculators/paint", color: "from-emerald-500/20 to-teal-500/10" },
    { icon: Hammer, name: "الكاشي", to: "/calculators/tile", color: "from-rose-500/20 to-pink-500/10" },
    { icon: Ruler, name: "مساحة الغرف", to: "/calculators/room", color: "from-violet-500/20 to-purple-500/10" },
    { icon: Mountain, name: "الرمل", to: "/calculators/sand", color: "from-yellow-500/20 to-amber-500/10" },
    { icon: Pickaxe, name: "الحصى", to: "/calculators/gravel", color: "from-stone-500/20 to-neutral-500/10" },
    {
  icon: Building2,
  name: "المنزل الكامل",
  to: "/house",
  color: "from-cyan-500/20 to-blue-500/10",
},
  ];
  return (
    <div className="min-h-screen bg-background relative overflow-hidden rtl" dir="rtl">
      {/* Premium Civil Engineering Background */}
      <PremiumEngineeringBg />
      
      {/* Subtle additional gradient overlay for enhanced readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/70 pointer-events-none" />
      
      {/* Soft top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation - Enhanced with 3D effects */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between rtl" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <motion.div 
            whileHover={{ 
              rotateY: 360,
              scale: 1.1 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
            className="size-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer"
          >
            <Building2 className="size-5 text-primary-foreground" />
          </motion.div>
          <span className="font-extrabold text-xl tracking-tight">BuildIQ <span className="text-accent">Iraq</span></span>
        </motion.div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition">تسجيل الدخول</Link>
          <Link to="/auth" className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition">
            ابدأ مجاناً
          </Link>
        </div>
      </nav>

      {/* Hero Section - Enhanced with 3D */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center rtl" dir="rtl">
        <FloatingCard delay={0}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-4 py-1.5 text-xs text-muted-foreground mb-6 text-arabic">
            <span className="size-2 rounded-full bg-accent animate-pulse" /> منصة هندسية احترافية للعراق
          </div>
        </FloatingCard>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.8] mb-6 text-arabic-heading" style={{ perspective: "1000px" }}>
            <Text3D>
             حساب كميات البناء
            </Text3D>
            <br />
            <motion.span 
              className="bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              <Text3D>بدقة هندسية</Text3D>
            </motion.span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-arabic"
        >
          حاسبات احترافية للطابوق، الكونكريت، الحديد، الصبغ والكاشي. أسعار بالدينار العراقي، تقارير PDF، وإدارة كاملة للمشاريع والعملاء.
        </motion.p>

        {/* CTA Buttons - Enhanced with 3D */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button3D isPrimary>
            <Link 
              to="/auth" 
              className="group rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:opacity-90 transition inline-flex items-center gap-2 w-full arabic-button"
            >
              أنشئ حسابك الآن <ArrowLeft className="size-4 group-hover:-translate-x-1 transition" />
            </Link>
          </Button3D>
          <Button3D>
            <Link 
              to="/auth" 
              className="rounded-xl border border-border bg-card/50 backdrop-blur px-6 py-3 font-semibold hover:bg-card transition w-full arabic-button"
            >
              دخول الحساب
            </Link>
          </Button3D>
        </motion.div>

        {/* Calculators Grid - Enhanced with 3D Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto"
        >
          {calcs.map((c, index) => (
            <Card3D key={c.name} delay={0.5 + index * 0.05}>
              <Link
                to={c.to}
                className={`relative rounded-2xl border border-border bg-gradient-to-br ${c.color} backdrop-blur p-5 hover:scale-105 hover:border-primary/50 transition block text-center cursor-pointer`}
              >
                <motion.div
                  whileHover={{
                    rotateZ: 360,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <c.icon className="size-8 text-foreground mb-3 mx-auto" />
                </motion.div>
                <div className="text-sm font-semibold text-arabic">{c.name}</div>
              </Link>
            </Card3D>
          ))}
        </motion.div>
      </section>

      {/* 3D Section Divider */}
      <Section3DDivider />

      {/* Features Section - Enhanced with 3D */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24 rtl" dir="rtl">
        <InteractiveDepthLayer />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-6 relative z-10 pt-6"
        >
          {[
            { icon: Calculator, title: "حاسبات دقيقة", desc: "خمس حاسبات هندسية تعتمد على معايير البناء العراقية" },
            { icon: Users, title: "إدارة العملاء", desc: "احفظ بيانات عملائك واربط كل مشروع بصاحبه" },
            { icon: FileText, title: "تقارير PDF", desc: "صدِّر تقارير احترافية بالعربية جاهزة للطباعة" },
          ].map((f, index) => (
            <FloatingCard key={f.title} delay={1.2 + index * 0.1}>
              <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 card-arabic">
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                  className="size-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                >
                  <f.icon className="size-5 text-primary" />
                </motion.div>
                <h3 className="font-bold text-lg mb-1 text-arabic-heading">{f.title}</h3>
                <p className="text-sm text-muted-foreground text-arabic">{f.desc}</p>
              </div>
            </FloatingCard>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 text-center text-sm text-muted-foreground rtl" dir="rtl">
        © {new Date().getFullYear()} BuildIQ Iraq — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}
