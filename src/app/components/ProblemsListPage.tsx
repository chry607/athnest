import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Code2, Clock, Database, CheckCircle2, ArrowRight, Filter, Flame } from "lucide-react";

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  timeLimit: string;
  memLimit: string;
  acceptance: number;
  solveCount: number;
  solved: boolean;
  course?: string;
  rating?: number;
}

const PROBLEMS: Problem[] = [
  { id: "P001", title: "Hello, World!",                   difficulty: "Easy",   tags: ["I/O"],                  timeLimit: "1s", memLimit: "256MB", acceptance: 97, solveCount: 1204, solved: true,  course: "CS 11"  },
  { id: "P002", title: "BMI Classifier",                  difficulty: "Easy",   tags: ["Implementation"],       timeLimit: "1s", memLimit: "256MB", acceptance: 88, solveCount: 984,  solved: true,  course: "CS 32",  rating: 800  },
  { id: "P003", title: "Factorial (Iterative)",           difficulty: "Easy",   tags: ["Math", "Loops"],        timeLimit: "1s", memLimit: "256MB", acceptance: 91, solveCount: 876,  solved: true,  course: "CS 11"  },
  { id: "P004", title: "GCD and LCM",                    difficulty: "Easy",   tags: ["Math"],                 timeLimit: "1s", memLimit: "256MB", acceptance: 84, solveCount: 741,  solved: false, course: "CS 32",  rating: 900  },
  { id: "P005", title: "Palindrome Check",                difficulty: "Easy",   tags: ["Strings"],              timeLimit: "1s", memLimit: "256MB", acceptance: 80, solveCount: 698,  solved: true,  course: "CS 11"  },
  { id: "P006", title: "Linear Search",                   difficulty: "Easy",   tags: ["Arrays", "Search"],     timeLimit: "1s", memLimit: "256MB", acceptance: 92, solveCount: 810,  solved: true,  course: "CS 32"  },
  { id: "P007", title: "Bubble Sort",                     difficulty: "Easy",   tags: ["Sorting"],              timeLimit: "2s", memLimit: "256MB", acceptance: 76, solveCount: 634,  solved: false, course: "CS 32",  rating: 1000 },
  { id: "P008", title: "Fibonacci (Recursive)",           difficulty: "Medium", tags: ["Recursion", "Math"],    timeLimit: "1s", memLimit: "256MB", acceptance: 65, solveCount: 512,  solved: true,  course: "CS 135", rating: 1100 },
  { id: "P009", title: "Binary Search",                   difficulty: "Medium", tags: ["Binary Search"],        timeLimit: "1s", memLimit: "256MB", acceptance: 61, solveCount: 489,  solved: true,  course: "CS 135", rating: 1200 },
  { id: "P010", title: "Merge Sort",                      difficulty: "Medium", tags: ["Sorting", "Recursion"], timeLimit: "2s", memLimit: "256MB", acceptance: 58, solveCount: 421,  solved: false, course: "CS 135", rating: 1300 },
  { id: "P011", title: "Stack Implementation",            difficulty: "Medium", tags: ["Data Structures"],      timeLimit: "1s", memLimit: "256MB", acceptance: 70, solveCount: 455,  solved: true,  course: "CS 32"  },
  { id: "P012", title: "Longest Common Subsequence",      difficulty: "Medium", tags: ["DP", "Strings"],        timeLimit: "2s", memLimit: "256MB", acceptance: 49, solveCount: 312,  solved: false, course: "CS 135", rating: 1400 },
  { id: "P013", title: "BFS Shortest Path",               difficulty: "Medium", tags: ["Graphs", "BFS"],        timeLimit: "2s", memLimit: "256MB", acceptance: 55, solveCount: 378,  solved: false, course: "CS 135", rating: 1350 },
  { id: "P014", title: "0-1 Knapsack",                   difficulty: "Hard",   tags: ["DP"],                   timeLimit: "2s", memLimit: "256MB", acceptance: 38, solveCount: 198,  solved: false, course: "CS 135", rating: 1600 },
  { id: "P015", title: "Dijkstra's Algorithm",            difficulty: "Hard",   tags: ["Graphs", "Shortest Path"], timeLimit: "3s", memLimit: "512MB", acceptance: 41, solveCount: 224, solved: false, course: "CS 135", rating: 1700 },
  { id: "P016", title: "Segment Tree Range Sum",          difficulty: "Hard",   tags: ["Data Structures", "Trees"], timeLimit: "3s", memLimit: "512MB", acceptance: 32, solveCount: 167, solved: false, rating: 1800 },
  { id: "P017", title: "Strongly Connected Components",   difficulty: "Hard",   tags: ["Graphs"],               timeLimit: "3s", memLimit: "512MB", acceptance: 29, solveCount: 143,  solved: false, rating: 1900 },
  { id: "P018", title: "Trie Prefix Search",              difficulty: "Hard",   tags: ["Data Structures", "Strings"], timeLimit: "2s", memLimit: "512MB", acceptance: 35, solveCount: 189, solved: false, rating: 1750 },
];

const ALL_TAGS = [...new Set(PROBLEMS.flatMap(p => p.tags))].sort();
const ALL_COURSES = [...new Set(PROBLEMS.map(p => p.course).filter(Boolean))] as string[];

const diffColor  = { Easy: "#0B6623", Medium: "#C4820A", Hard: "#EF4444" };
const diffBg     = { Easy: "rgba(11,102,35,0.08)", Medium: "rgba(196,130,10,0.08)", Hard: "rgba(239,68,68,0.08)" };

interface ProblemsListPageProps {
  onSelectProblem: (id: string) => void;
}

export function ProblemsListPage({ onSelectProblem }: ProblemsListPageProps) {
  const [search,      setSearch]      = useState("");
  const [diffFilter,  setDiffFilter]  = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [tagFilter,   setTagFilter]   = useState<string>("all");
  const [courseFilter,setCourseFilter]= useState<string>("all");
  const [statusFilter,setStatusFilter]= useState<"all" | "solved" | "unsolved">("all");
  const [viewMode,    setViewMode]    = useState<"list" | "grid">("list");

  const filtered = useMemo(() => PROBLEMS.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (diffFilter   !== "all" && p.difficulty !== diffFilter)               return false;
    if (tagFilter    !== "all" && !p.tags.includes(tagFilter))               return false;
    if (courseFilter !== "all" && p.course !== courseFilter)                 return false;
    if (statusFilter === "solved"   && !p.solved)                            return false;
    if (statusFilter === "unsolved" && p.solved)                             return false;
    return true;
  }), [search, diffFilter, tagFilter, courseFilter, statusFilter]);

  const solvedCount = PROBLEMS.filter(p => p.solved).length;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div className="px-6 lg:px-8 py-5 border-b flex-shrink-0" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: "#1A1A1A", letterSpacing: "-0.01em" }}>Problem Bank</h1>
            <p style={{ fontSize: 13, color: "#6B6058", marginTop: 2 }}>
              <span style={{ color: "#0B6623", fontWeight: 600 }}>{solvedCount}</span> solved · {PROBLEMS.length} total problems
            </p>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3 min-w-48">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#EDE8D8" }}>
              <div className="h-full rounded-full" style={{ width: `${(solvedCount / PROBLEMS.length) * 100}%`, background: "#0B6623" }} />
            </div>
            <span style={{ fontSize: 12, color: "#6B6058", whiteSpace: "nowrap" }}>{Math.round(solvedCount / PROBLEMS.length * 100)}%</span>
          </div>
        </div>

        {/* Difficulty summary */}
        <div className="flex gap-4 mt-4">
          {(["Easy", "Medium", "Hard"] as const).map(d => {
            const total  = PROBLEMS.filter(p => p.difficulty === d).length;
            const solved = PROBLEMS.filter(p => p.difficulty === d && p.solved).length;
            return (
              <button
                key={d}
                onClick={() => setDiffFilter(diffFilter === d ? "all" : d)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
                style={{
                  background: diffFilter === d ? diffBg[d] : "transparent",
                  borderColor: diffFilter === d ? diffColor[d] + "40" : "rgba(123,17,19,0.1)",
                }}
              >
                <span style={{ fontSize: 12, color: diffColor[d], fontWeight: 700 }}>{d}</span>
                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{solved}/{total}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters bar */}
      <div className="px-6 lg:px-8 py-3 border-b flex-shrink-0 flex flex-wrap gap-3 items-center" style={{ background: "#F5F1E3", borderColor: "rgba(123,17,19,0.1)" }}>
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 min-w-52" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.15)" }}>
          <Search size={14} style={{ color: "#9A8A80", flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or ID…"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#1A1A1A" }}
          />
        </div>

        {/* Course */}
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.15)", color: courseFilter === "all" ? "#6B6058" : "#1A1A1A" }}>
          <option value="all">All Courses</option>
          {ALL_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Tag */}
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.15)", color: tagFilter === "all" ? "#6B6058" : "#1A1A1A" }}>
          <option value="all">All Topics</option>
          {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Status */}
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "#EDE8D8" }}>
          {(["all", "solved", "unsolved"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-md text-xs capitalize transition-all"
              style={{ background: statusFilter === s ? "#FDFAF2" : "transparent", color: statusFilter === s ? "#1A1A1A" : "#6B6058", fontWeight: statusFilter === s ? 600 : 400 }}
            >
              {s === "all" ? "All" : s === "solved" ? "✓ Solved" : "Unsolved"}
            </button>
          ))}
        </div>

        <span style={{ fontSize: 12, color: "#9A8A80", marginLeft: "auto" }}>{filtered.length} problem{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Problem list */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: "#9A8A80" }}>
            <Code2 size={40} className="opacity-20" />
            <p style={{ fontSize: 14 }}>No problems match your filters.</p>
          </div>
        ) : (
          <table className="w-full" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead className="sticky top-0 z-10" style={{ background: "#FDFAF2" }}>
              <tr className="border-b" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
                {["#", "Title", "Difficulty", "Topics", "Course", "Acceptance", ""].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs" style={{ color: "#9A8A80", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((prob, i) => (
                <motion.tr
                  key={prob.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="border-b group hover:bg-secondary/40 transition-colors"
                  style={{ borderColor: "rgba(123,17,19,0.06)", background: prob.solved ? "rgba(11,102,35,0.018)" : "transparent" }}
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 w-20">
                    <div className="flex items-center gap-2">
                      {prob.solved
                        ? <CheckCircle2 size={14} style={{ color: "#0B6623", flexShrink: 0 }} />
                        : <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#C8C0B0" }} />}
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#9A8A80" }}>{prob.id}</span>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-4">
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{prob.title}</div>
                    {prob.rating && (
                      <div style={{ fontSize: 11, color: "#9A8A80", fontFamily: "JetBrains Mono, monospace", marginTop: 1 }}>CF rating ~{prob.rating}</div>
                    )}
                  </td>

                  {/* Difficulty */}
                  <td className="py-3.5 px-4 w-28">
                    <span className="px-2 py-1 rounded-md text-xs" style={{ background: diffBg[prob.difficulty], color: diffColor[prob.difficulty], fontWeight: 600 }}>
                      {prob.difficulty}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {prob.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded border" style={{ borderColor: "rgba(30,58,138,0.15)", color: "#1E3A8A", background: "rgba(30,58,138,0.05)" }}>{t}</span>
                      ))}
                      {prob.tags.length > 2 && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: "#9A8A80" }}>+{prob.tags.length - 2}</span>
                      )}
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-3.5 px-4 w-24">
                    {prob.course && (
                      <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 500 }}>{prob.course}</span>
                    )}
                  </td>

                  {/* Acceptance */}
                  <td className="py-3.5 px-4 w-36">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE8D8" }}>
                        <div className="h-full rounded-full" style={{ width: `${prob.acceptance}%`, background: prob.acceptance >= 70 ? "#0B6623" : prob.acceptance >= 50 ? "#C4820A" : "#7B1113" }} />
                      </div>
                      <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#6B6058", whiteSpace: "nowrap" }}>{prob.acceptance}%</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#9A8A80", marginTop: 2 }}>{prob.solveCount.toLocaleString()} solves</div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 w-28">
                    <button
                      onClick={() => onSelectProblem(prob.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: "#7B1113", color: "#FFF", fontWeight: 600 }}
                    >
                      {prob.solved ? "Retry" : "Solve"} <ArrowRight size={12} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
