import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Building2, ClipboardList, Menu, X, Diamond } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/obras", label: "Obras", icon: Building2 },
  { to: "/ordens-servico", label: "Ordens de Serviço", icon: ClipboardList },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col
          ${collapsed ? "w-[68px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-sidebar-border px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
          <Diamond className="h-6 w-6 text-sidebar-primary flex-shrink-0" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-wide text-sidebar-primary">
              DIAMOND
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`sidebar-item ${isActive ? "sidebar-item-active" : "sidebar-item-inactive"} ${collapsed ? "justify-center px-0" : ""}`}
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>
      </aside>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-[68px]" : "lg:ml-[260px]"}`}>
        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <Diamond className="h-5 w-5" />
          <span className="font-bold tracking-wide">DIAMOND</span>
        </header>

        <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
