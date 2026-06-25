import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, FolderKanban, Users, Tag, Boxes, Layers, Wrench, PaintRoller, Hammer,
  Ruler, Mountain, Pickaxe, Calculator,
  LogOut, Sun, Moon, Menu, X, Building2, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/projects", label: "المشاريع", icon: FolderKanban },
  { to: "/clients", label: "العملاء", icon: Users },
  { to: "/prices", label: "أسعار المواد", icon: Tag },
  { to: "/cost-summary", label: "تكلفة المشروع", icon: Calculator },
];

const calcs = [
  { to: "/calculators/room", label: "مساحة الغرف", icon: Ruler },
  { to: "/calculators/brick", label: "الطابوق", icon: Boxes },
  { to: "/calculators/concrete", label: "الكونكريت", icon: Layers },
  { to: "/calculators/sand", label: "الرمل", icon: Mountain },
  { to: "/calculators/gravel", label: "الحصى", icon: Pickaxe },
  { to: "/calculators/steel", label: "الحديد", icon: Wrench },
  { to: "/calculators/paint", label: "الصبغ", icon: PaintRoller },
  { to: "/calculators/tile", label: "الكاشي", icon: Hammer },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  async function logout() {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/auth", replace: true });
  }

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 right-0 h-screen w-72 bg-sidebar text-sidebar-foreground border-l border-sidebar-border z-50 transition-transform ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Building2 className="size-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-extrabold text-base leading-tight">BuildIQ</div>
              <div className="text-[10px] text-sidebar-foreground/60 tracking-wider">IRAQ</div>
            </div>
          </Link>
          <button className="lg:hidden text-sidebar-foreground/70" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100vh-160px)]">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50 px-3 mb-2">الرئيسية</div>
            {nav.map((it) => (
              <Link key={it.to} to={it.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive(it.to) ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"}`}>
                <it.icon className="size-4" /> {it.label}
              </Link>
            ))}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50 px-3 mb-2">الحاسبات</div>
            {calcs.map((it) => (
              <Link key={it.to} to={it.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive(it.to) ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"}`}>
                <it.icon className="size-4" /> {it.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-sidebar-border flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-sidebar-foreground hover:bg-sidebar-accent">
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" onClick={logout} className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="size-4 ml-2" /> تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-4 h-14 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="text-foreground">
            <Menu className="size-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Building2 className="size-4 text-primary-foreground" />
            </div>
            <span className="font-bold">BuildIQ Iraq</span>
          </div>
          <button onClick={toggleTheme} className="text-foreground">
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6 no-print">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function BackToCalcs() {
  return (
    <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
      <ChevronLeft className="size-4" /> رجوع
    </Link>
  );
}