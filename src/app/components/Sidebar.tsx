import React from "react";
import { LayoutDashboard, Code2, BookOpen, Send, Trophy, User, ChevronLeft, ChevronRight, GraduationCap, LogOut } from "lucide-react";

const ALL_NAV = [
  { icon: LayoutDashboard, label: "Dashboard",   page: "dashboard",   roles: ["student", "teacher"] },
  { icon: Code2,           label: "Problems",    page: "problems",    roles: ["student", "teacher"] },
  { icon: BookOpen,        label: "Classroom",   page: "classroom",   roles: ["student", "teacher"] },
  { icon: Send,            label: "Submissions", page: "submissions", roles: ["student"]            },
  { icon: Trophy,          label: "Rankings",    page: "rankings",    roles: ["student", "teacher"] },
  { icon: User,            label: "Profile",     page: "profile",     roles: ["student", "teacher"] },
  { icon: GraduationCap,   label: "Teacher",     page: "teacher",     roles: ["teacher"]            },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  role: "student" | "teacher";
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, collapsed, onToggle, role, onLogout }: SidebarProps) {
  const navItems = ALL_NAV.filter(item => item.roles.includes(role));

  // treat "problem" (editor) as active state for "problems" (list)
  const activePage = currentPage === "problem" ? "problems" : currentPage;

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? 64 : 220,
        background: "var(--sidebar)",
        color: "var(--sidebar-foreground)",
        borderRight: "1px solid var(--sidebar-border)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: "#F5F1E3" }}>
          <span style={{ color: "#7B1113", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 14 }}>AN</span>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 17, color: "#F5F1E3", letterSpacing: "-0.01em" }}>
              AthNest
            </div>
            <div style={{ fontSize: 10, color: "rgba(245,241,227,0.4)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {role === "teacher" ? "Teacher" : "Student"}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {navItems.map(({ icon: Icon, label, page }) => {
          const active = activePage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left transition-colors duration-150"
              style={{
                background: active ? "var(--sidebar-accent)" : "transparent",
                color: active ? "#FFFFFF" : "rgba(245,241,227,0.7)",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: active ? 600 : 400,
              }}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom — logout + collapse */}
      <div className="px-2 pb-4 flex flex-col gap-0.5 border-t pt-3" style={{ borderColor: "var(--sidebar-border)" }}>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left transition-colors hover:bg-red-900/30"
          style={{ color: "rgba(245,241,227,0.55)", fontSize: 14, fontFamily: "Inter, sans-serif" }}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut size={17} className="shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
        <button
          onClick={onToggle}
          className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors"
          style={{ color: "rgba(245,241,227,0.3)", fontSize: 12, fontFamily: "Inter, sans-serif" }}
        >
          {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
