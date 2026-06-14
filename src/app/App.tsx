import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { LoginPage } from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { ProblemsListPage } from "./components/ProblemsListPage";
import { ProblemPage } from "./components/ProblemPage";
import { ClassroomPage } from "./components/ClassroomPage";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { RankingsPage } from "./components/RankingsPage";
import { ProfilePage } from "./components/ProfilePage";
import "../styles/fonts.css";

type Page = "login" | "landing" | "dashboard" | "problems" | "problem" | "classroom" | "submissions" | "rankings" | "teacher" | "profile";
type Role = "student" | "teacher";

export default function App() {
  const [page,             setPage]            = useState<Page>("login");
  const [role,             setRole]            = useState<Role>("student");
  const [selectedProblem,  setSelectedProblem] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isApp = page !== "landing" && page !== "login";

  function navigate(p: string) {
    setPage(p as Page);
  }

  function handleLogin(r: Role) {
    setRole(r);
    navigate(r === "teacher" ? "teacher" : "dashboard");
  }

  function openProblem(id: string) {
    setSelectedProblem(id);
    setPage("problem");
  }

  return (
    <div className="size-full flex" style={{ fontFamily: "Inter, sans-serif", background: "var(--background)" }}>

      {/* Login */}
      {page === "login" && (
        <div className="size-full">
          <LoginPage onLogin={handleLogin} onViewLanding={() => navigate("landing")} />
        </div>
      )}

      {/* Landing */}
      {page === "landing" && (
        <div className="size-full">
          <LandingPage onEnter={p => { navigate(p); }} />
        </div>
      )}

      {/* App shell */}
      {isApp && (
        <>
          <Sidebar
            currentPage={page}
            onNavigate={navigate}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(c => !c)}
            role={role}
            onLogout={() => { setPage("login"); setSidebarCollapsed(false); }}
          />
          <main className="flex-1 min-w-0 h-full overflow-hidden" style={{ background: "var(--background)" }}>
            {page === "dashboard"   && <Dashboard onNavigate={navigate} />}
            {page === "problems"    && <ProblemsListPage onSelectProblem={openProblem} />}
            {page === "problem"     && <ProblemPage problemId={selectedProblem} onBack={() => navigate("problems")} />}
            {page === "classroom"   && <ClassroomPage onNavigate={navigate} />}
            {page === "teacher"     && role === "teacher" && <TeacherDashboard />}
            {page === "rankings"    && <RankingsPage />}
            {page === "profile"     && <ProfilePage />}
            {page === "submissions" && <SubmissionsPlaceholder onNavigate={p => { if (p === "problem") openProblem("P002"); else navigate(p); }} />}
          </main>
        </>
      )}
    </div>
  );
}

function SubmissionsPlaceholder({ onNavigate }: { onNavigate: (p: string) => void }) {
  const verdicts = [
    { id: "#5821", problem: "BMI Classifier",            course: "CS 32",  verdict: "AC",  time: "12ms",   mem: "3.2 MB", lang: "C++17",  when: "Today, 10:23 AM"    },
    { id: "#5780", problem: "Fibonacci with Memoization",course: "CS 135", verdict: "WA",  time: "—",      mem: "—",      lang: "C++17",  when: "Yesterday, 4:12 PM" },
    { id: "#5741", problem: "Bubble Sort",               course: "CS 32",  verdict: "TLE", time: "1001ms", mem: "—",      lang: "Python", when: "Jun 11, 9:05 AM"    },
    { id: "#5702", problem: "Hello World",               course: "CS 11",  verdict: "AC",  time: "8ms",    mem: "1.0 MB", lang: "Java",   when: "Jun 10, 2:14 PM"    },
    { id: "#5680", problem: "GCD Computation",           course: "CS 135", verdict: "AC",  time: "9ms",    mem: "2.1 MB", lang: "C++17",  when: "Jun 9, 11:00 AM"    },
    { id: "#5620", problem: "Factorial Recursive",       course: "CS 32",  verdict: "CE",  time: "—",      mem: "—",      lang: "C++17",  when: "Jun 8, 3:45 PM"     },
    { id: "#5580", problem: "Array Reverse",             course: "CS 11",  verdict: "AC",  time: "6ms",    mem: "1.4 MB", lang: "C++17",  when: "Jun 7, 9:12 AM"     },
  ];
  const vStyle: Record<string, string> = {
    AC:  "bg-green-100 text-green-700 border-green-200",
    WA:  "bg-red-100 text-red-700 border-red-200",
    TLE: "bg-yellow-100 text-yellow-700 border-yellow-200",
    CE:  "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 24, color: "#1A1A1A", letterSpacing: "-0.01em" }}>Submissions</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B6058", marginTop: 2 }}>All your code submissions across courses</p>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        <table className="w-full" style={{ fontFamily: "Inter, sans-serif" }}>
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
              {["ID", "Problem", "Course", "Verdict", "Time", "Memory", "Language", "Date"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs" style={{ color: "#9A8A80", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {verdicts.map((s, i) => (
              <tr key={i} className="border-b hover:bg-secondary/30 transition-colors cursor-pointer" style={{ borderColor: "rgba(123,17,19,0.06)" }} onClick={() => onNavigate("problem")}>
                <td className="py-3 px-4 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#9A8A80" }}>{s.id}</td>
                <td className="py-3 px-4 text-sm" style={{ color: "#1A1A1A", fontWeight: 500 }}>{s.problem}</td>
                <td className="py-3 px-4 text-xs" style={{ color: "#6B6058" }}>{s.course}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded border ${vStyle[s.verdict] ?? "bg-gray-100 text-gray-500 border-gray-200"}`} style={{ fontWeight: 600 }}>
                    {s.verdict === "AC" ? "✓ " : ""}{s.verdict}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{s.time}</td>
                <td className="py-3 px-4 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{s.mem}</td>
                <td className="py-3 px-4 text-xs" style={{ color: "#6B6058" }}>{s.lang}</td>
                <td className="py-3 px-4 text-xs" style={{ color: "#9A8A80" }}>{s.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
