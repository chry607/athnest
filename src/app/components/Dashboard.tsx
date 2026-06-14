import { motion } from "motion/react";
import { Flame, TrendingUp, Clock, CheckCircle2, AlertCircle, Timer, BookOpen, ArrowRight } from "lucide-react";
import { VerdictBadge } from "./VerdictBadge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ratingHistory = [
  { date: "Jan", rating: 1100 },
  { date: "Feb", rating: 1145 },
  { date: "Mar", rating: 1092 },
  { date: "Apr", rating: 1210 },
  { date: "May", rating: 1289 },
  { date: "Jun", rating: 1342 },
];

const assignments = [
  { title: "Lab 4: Sorting Algorithms",   course: "CS 32",    due: "Jun 15, 2026",  difficulty: "Medium", problems: 3, submitted: 2, total: 3  },
  { title: "PS 3: Recursion and DP",       course: "CS 135",   due: "Jun 18, 2026",  difficulty: "Hard",   problems: 5, submitted: 0, total: 5  },
  { title: "Lab 2: Basic I/O",             course: "CS 11",    due: "Jun 20, 2026",  difficulty: "Easy",   problems: 4, submitted: 4, total: 4  },
];

const recentSubmissions = [
  { problem: "Bubble Sort Implementation", course: "CS 32",  verdict: "AC" as const,      time: "124ms", memory: "3.2 MB", lang: "C++",    ago: "2h ago" },
  { problem: "Fibonacci with Memoization", course: "CS 135", verdict: "WA" as const,      time: "—",     memory: "—",      lang: "Python", ago: "5h ago" },
  { problem: "Print Hello World",          course: "CS 11",  verdict: "AC" as const,      time: "11ms",  memory: "1.0 MB", lang: "Java",   ago: "1d ago" },
  { problem: "Factorial Recursive",        course: "CS 32",  verdict: "TLE" as const,     time: "2001ms",memory: "—",      lang: "C++",    ago: "2d ago" },
  { problem: "GCD Computation",            course: "CS 135", verdict: "AC" as const,      time: "9ms",   memory: "2.1 MB", lang: "C++",    ago: "3d ago" },
];

const difficultyStyle: Record<string, string> = {
  Easy:   "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard:   "bg-red-100 text-red-700",
};

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 24, color: "#1A1A1A", letterSpacing: "-0.01em" }}>
          Good morning, Maria 👋
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B6058", marginTop: 2 }}>
          3 active assignments · Your current streak is 7 days
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Current Rating",  value: "1342",  icon: TrendingUp, color: "#7B1113",  sub: "+53 this month" },
          { label: "Day Streak",      value: "7",     icon: Flame,      color: "#C4820A",  sub: "Personal best: 14" },
          { label: "Problems Solved", value: "84",    icon: CheckCircle2,color: "#0B6623", sub: "Top 18% in class" },
          { label: "Avg. Time",       value: "38min", icon: Clock,      color: "#1E3A8A",  sub: "Per problem" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 border"
            style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B6058", fontWeight: 500 }}>{label}</span>
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: `${color}14` }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 26, color: "#1A1A1A", lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#9A8A80", marginTop: 4 }}>{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Rating Chart + Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Rating Chart */}
        <div className="lg:col-span-2 rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Rating History</h2>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(11,102,35,0.1)", color: "#0B6623", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>+53 ↑</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={ratingHistory}>
              <defs>
                <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7B1113" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7B1113" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
              <YAxis domain={[1000, 1500]} tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
              <Area type="monotone" dataKey="rating" stroke="#7B1113" strokeWidth={2} fill="url(#ratingGrad)" dot={{ fill: "#7B1113", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active Assignments */}
        <div className="lg:col-span-3 rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Active Assignments</h2>
            <button
              onClick={() => onNavigate("classroom")}
              className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
              style={{ color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {assignments.map((a, i) => (
              <div key={i} className="rounded-lg border p-3.5 hover:border-primary/30 transition-colors cursor-pointer" style={{ borderColor: "rgba(123,17,19,0.1)" }} onClick={() => onNavigate("classroom")}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: "#1A1A1A" }}>{a.title}</span>
                    <span className="ml-2 text-xs" style={{ color: "#6B6058", fontFamily: "Inter, sans-serif" }}>{a.course}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${difficultyStyle[a.difficulty]}`} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, flexShrink: 0 }}>{a.difficulty}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs" style={{ color: "#6B6058", fontFamily: "Inter, sans-serif" }}>
                    <Clock size={12} /> {a.due}
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "#6B6058", fontFamily: "Inter, sans-serif" }}>
                    <BookOpen size={12} /> {a.submitted}/{a.problems} submitted
                  </div>
                </div>
                <div className="mt-2 rounded-full overflow-hidden h-1.5" style={{ background: "#EDE8D8" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(a.submitted / a.problems) * 100}%`, background: a.submitted === a.total ? "#0B6623" : "#7B1113" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Recent Submissions</h2>
          <button className="text-xs" style={{ color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
                {["Problem", "Course", "Verdict", "Time", "Memory", "Lang", ""].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs" style={{ color: "#9A8A80", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((s, i) => (
                <tr key={i} className="border-b hover:bg-secondary/30 cursor-pointer transition-colors" style={{ borderColor: "rgba(123,17,19,0.06)" }} onClick={() => onNavigate("problem")}>
                  <td className="py-2.5 px-3 text-sm" style={{ color: "#1A1A1A", fontWeight: 500 }}>{s.problem}</td>
                  <td className="py-2.5 px-3 text-xs" style={{ color: "#6B6058" }}>{s.course}</td>
                  <td className="py-2.5 px-3"><VerdictBadge verdict={s.verdict} /></td>
                  <td className="py-2.5 px-3 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{s.time}</td>
                  <td className="py-2.5 px-3 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{s.memory}</td>
                  <td className="py-2.5 px-3 text-xs" style={{ color: "#6B6058" }}>{s.lang}</td>
                  <td className="py-2.5 px-3 text-xs" style={{ color: "#9A8A80" }}>{s.ago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
