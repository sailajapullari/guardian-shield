import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  BarChart3,
  Shield,
  BookOpen,
  Zap,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/behaviors", label: "User Behavior", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/real-cases", label: "Real Cases", icon: Shield },
  { to: "/how-it-works", label: "How It Works", icon: BookOpen },
  { to: "/simulator", label: "Simulator", icon: Zap },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
          <Shield className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">GuardianPay</h1>
          <p className="text-xs text-muted-foreground">Fraud Detection</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg gradient-primary opacity-90"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <item.icon className="relative z-10 w-4.5 h-4.5" />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <ChevronRight className="relative z-10 w-4 h-4 ml-auto" />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="glass-card p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse-glow" />
            <span className="text-xs font-medium text-foreground">System Active</span>
          </div>
          <p className="text-xs text-muted-foreground">ML Model v2.4 • Real-time</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
