import { useState } from "react";
import { motion } from "motion/react";
import { Clock, Users, CheckCircle2, AlertCircle, BookOpen, ChevronRight, Filter, Search } from "lucide-react";
import { VerdictBadge } from "./VerdictBadge";

const classes = [
  { id: "cs32",  name: "CS 32",  title: "Data Structures and Algorithms",   students: 38, color: "#7B1113" },
  { id: "cs135", name: "CS 135", title: "Algorithms and Complexity",        students: 27, color: "#0B6623" },
  { id: "cs11",  name: "CS 11",  title: "Introduction to Computer Science", students: 52, color: "#1E3A8A" },
];

const assignments = [
  { id: 1, title: "Lab 4: Sorting Algorithms",   course: "CS 32",  due: "Jun 15, 2026", difficulty: "Medium", problems: 3, submissions: 22, total: 38, checker: true  },
  { id: 2, title: "PS 3: Recursion and DP",       course: "CS 135", due: "Jun 18, 2026", difficulty: "Hard",   problems: 5, submissions: 0,  total: 27, checker: true  },
  { id: 3, title: "Lab 2: Basic I/O",             course: "CS 11",  due: "Jun 20, 2026", difficulty: "Easy",   problems: 4, submissions: 52, total: 52, checker: true  },
  { id: 4, title: "Lab 5: Tree Traversal",        course: "CS 32",  due: "Jun 25, 2026", difficulty: "Hard",   problems: 4, submissions: 5,  total: 38, checker: false },
  { id: 5, title: "PS 4: Graph Algorithms",       course: "CS 135", due: "Jun 28, 2026", difficulty: "Hard",   problems: 6, submissions: 0,  total: 27, checker: true  },
];

const studentSubmissions = [
  { name: "Maria Santos",   studentId: "2021-00001", verdict: "AC" as const,  time: "124ms",  score: "100/100" },
  { name: "Juan dela Cruz", studentId: "2021-00002", verdict: "WA" as const,  time: "—",      score: "66/100"  },
  { name: "Ana Reyes",      studentId: "2021-00003", verdict: "TLE" as const, time: "2001ms", score: "33/100"  },
  { name: "Carlos Mendoza", studentId: "2021-00004", verdict: "AC" as const,  time: "88ms",   score: "100/100" },
  { name: "Rosa Garcia",    studentId: "2021-00005", verdict: "Pending" as const, time: "—",  score: "—"       },
];

const difficultyStyle: Record<string, string> = {
  Easy:   "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard:   "bg-red-100 text-red-700",
};

interface ClassroomPageProps {
  onNavigate: (page: string) => void;
}

export function ClassroomPage({ onNavigate }: ClassroomPageProps) {
  const [selectedClass, setSelectedClass] = useState("cs32");
  const [expandedAssignment, setExpandedAssignment] = useState<number | null>(1);

  const filteredAssignments = assignments.filter(a => {
    const c = classes.find(c => c.id === selectedClass);
    return c ? a.course === c.name : true;
  });

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 24, color: "#1A1A1A", letterSpacing: "-0.01em" }}>Classroom</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B6058", marginTop: 2 }}>Your enrolled courses and assignments</p>
      </div>

      {/* Class tabs */}
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {classes.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClass(c.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left shrink-0"
            style={{
              background: selectedClass === c.id ? "#FDFAF2" : "transparent",
              borderColor: selectedClass === c.id ? c.color : "rgba(123,17,19,0.12)",
              borderWidth: selectedClass === c.id ? 2 : 1,
              boxShadow: selectedClass === c.id ? `0 0 0 3px ${c.color}18` : "none",
            }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs shrink-0" style={{ background: c.color, color: "#FFF", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              {c.name.replace(" ", "")}
            </div>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{c.name}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6B6058" }}>{c.students} students</div>
            </div>
          </button>
        ))}
      </div>

      {/* Assignments */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 16, color: "#1A1A1A" }}>Assignments</h2>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B6058" }}>{filteredAssignments.length} total</span>
        </div>

        {filteredAssignments.map(a => {
          const expanded = expandedAssignment === a.id;
          const pct = Math.round((a.submissions / a.total) * 100);
          return (
            <motion.div
              key={a.id}
              layout
              className="rounded-xl border overflow-hidden"
              style={{ background: "#FDFAF2", borderColor: expanded ? "#7B111340" : "rgba(123,17,19,0.12)" }}
            >
              <button
                className="w-full text-left px-5 py-4 flex items-center gap-4"
                onClick={() => setExpandedAssignment(expanded ? null : a.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14.5, color: "#1A1A1A" }}>{a.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${difficultyStyle[a.difficulty]}`} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{a.difficulty}</span>
                    {a.checker && (
                      <span className="text-xs px-2 py-0.5 rounded border" style={{ background: "rgba(11,102,35,0.08)", borderColor: "rgba(11,102,35,0.2)", color: "#0B6623", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                        Auto-checker ON
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "#6B6058" }}><Clock size={11} /> {a.due}</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "#6B6058" }}><BookOpen size={11} /> {a.problems} problems</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "#6B6058" }}><Users size={11} /> {a.submissions}/{a.total} submitted</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE8D8" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? "#0B6623" : "#7B1113" }} />
                  </div>
                </div>
                <ChevronRight size={16} className="transition-transform shrink-0" style={{ color: "#9A8A80", transform: expanded ? "rotate(90deg)" : "none" }} />
              </button>

              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t px-5 py-4"
                  style={{ borderColor: "rgba(123,17,19,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>Student Submissions</h3>
                    <button
                      onClick={() => onNavigate("problem")}
                      className="text-xs px-3 py-1.5 rounded border transition-colors hover:bg-primary/10"
                      style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      View Problem
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                      <thead>
                        <tr className="border-b" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
                          {["Student", "ID", "Verdict", "Time", "Score"].map(h => (
                            <th key={h} className="text-left py-2 px-2 text-xs" style={{ color: "#9A8A80", fontWeight: 500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {studentSubmissions.map((s, i) => (
                          <tr key={i} className="border-b hover:bg-secondary/30 transition-colors" style={{ borderColor: "rgba(123,17,19,0.06)" }}>
                            <td className="py-2 px-2" style={{ fontWeight: 500, color: "#1A1A1A" }}>{s.name}</td>
                            <td className="py-2 px-2 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{s.studentId}</td>
                            <td className="py-2 px-2"><VerdictBadge verdict={s.verdict} /></td>
                            <td className="py-2 px-2 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{s.time}</td>
                            <td className="py-2 px-2 text-xs" style={{ fontWeight: 500, color: "#1A1A1A" }}>{s.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
