import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Building2, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/calculators")({
  component: CalculatorsLayout,
});

function CalculatorsLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Building2 className="size-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-extrabold leading-tight">BuildIQ <span className="text-accent">Iraq</span></div>
              <div className="text-[10px] text-muted-foreground tracking-wider">حاسبات البناء</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="text-sm rounded-lg border border-border px-3 py-1.5 hover:bg-card transition">
              تسجيل الدخول
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              الرئيسية <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}