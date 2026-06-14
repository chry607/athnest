import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Users, CheckCircle2, BarChart3, Trash2, Edit,
  Clock, BookOpen, Code2, Tag, Zap, Upload, X, ChevronDown,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PolicyEngine } from "./PolicyEngine";

// ─── Static data ──────────────────────────────────────────────────────────────

const classStats = [
  { name: "CS 32",  label: "Data Structures", students: 38, avgScore: 74, submissions: 312, color: "#7B1113" },
  { name: "CS 135", label: "Algorithms",      students: 27, avgScore: 68, submissions: 189, color: "#0B6623" },
  { name: "CS 11",  label: "Intro CS",        students: 52, avgScore: 82, submissions: 421, color: "#1E3A8A" },
];

const scoreDistData = [
  { range: "0–20",   cs32: 2,  cs135: 4 },
  { range: "21–40",  cs32: 4,  cs135: 6 },
  { range: "41–60",  cs32: 8,  cs135: 7 },
  { range: "61–80",  cs32: 14, cs135: 6 },
  { range: "81–100", cs32: 10, cs135: 4 },
];

const assignments = [
  { id: 1, title: "Lab 4: Sorting Algorithms", course: "CS 32",  problems: 3, due: "Jun 15", status: "active", submissions: 22, total: 38 },
  { id: 2, title: "PS 3: Recursion and DP",    course: "CS 135", problems: 5, due: "Jun 18", status: "active", submissions: 0,  total: 27 },
  { id: 3, title: "Lab 2: Basic I/O",          course: "CS 11",  problems: 4, due: "Jun 20", status: "active", submissions: 52, total: 52 },
  { id: 4, title: "PS 2: Sorting Methods",     course: "CS 135", problems: 3, due: "Jun 5",  status: "closed", submissions: 27, total: 27 },
];

// Pre-existing bank problems contributed by the teacher
const INITIAL_BANK: BankProblem[] = [
  { id: "P014", title: "0-1 Knapsack",       difficulty: "Hard",   tags: ["DP"],              timeLimit: "2", memLimit: "256", rating: 1600, statement: "", testCases: [], published: true  },
  { id: "P016", title: "Segment Tree Range Sum", difficulty: "Hard", tags: ["Data Structures","Trees"], timeLimit: "3", memLimit: "512", rating: 1800, statement: "", testCases: [], published: true  },
  { id: "P017", title: "Strongly Connected Components", difficulty: "Hard", tags: ["Graphs"], timeLimit: "3", memLimit: "512", rating: 1900, statement: "", testCases: [], published: true  },
];

const ALL_TAGS = ["Arrays", "Binary Search", "Data Structures", "DP", "Graphs", "Greedy", "I/O", "Implementation", "Loops", "Math", "Recursion", "Search", "Sorting", "Strings", "Trees"];

interface TestCase { input: string; expected: string; }

interface BankProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  timeLimit: string;
  memLimit: string;
  rating?: number;
  statement: string;
  testCases: TestCase[];
  published: boolean;
}

const diffColor = { Easy: "#0B6623", Medium: "#C4820A", Hard: "#EF4444" };
const diffBg    = { Easy: "rgba(11,102,35,0.08)", Medium: "rgba(196,130,10,0.08)", Hard: "rgba(239,68,68,0.08)" };

// ─── Problem Bank tab ─────────────────────────────────────────────────────────

function ProblemBankTab() {
  const [bankProblems, setBankProblems] = useState<BankProblem[]>(INITIAL_BANK);
  const [showForm, setShowForm]         = useState(false);
  const [saved, setSaved]               = useState(false);

  // Form state
  const [title,      setTitle]      = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [tags,       setTags]       = useState<string[]>([]);
  const [tagInput,   setTagInput]   = useState("");
  const [timeLimit,  setTimeLimit]  = useState("2");
  const [memLimit,   setMemLimit]   = useState("256");
  const [rating,     setRating]     = useState("");
  const [statement,  setStatement]  = useState("");
  const [testCases,  setTestCases]  = useState<TestCase[]>([{ input: "", expected: "" }]);
  const [showTagDrop,setShowTagDrop]= useState(false);

  function toggleTag(t: string) {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  function addTestCase() {
    setTestCases(tc => [...tc, { input: "", expected: "" }]);
  }

  function removeTestCase(i: number) {
    setTestCases(tc => tc.filter((_, idx) => idx !== i));
  }

  function updateTestCase(i: number, field: "input" | "expected", val: string) {
    setTestCases(tc => tc.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
  }

  function handleSave(publish: boolean) {
    if (!title.trim()) return;
    const newId = `P${String(bankProblems.length + 19).padStart(3, "0")}`;
    setBankProblems(prev => [{
      id: newId, title, difficulty, tags, timeLimit, memLimit,
      rating: rating ? Number(rating) : undefined,
      statement, testCases, published: publish,
    }, ...prev]);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
      // Reset
      setTitle(""); setDifficulty("Medium"); setTags([]); setRating("");
      setStatement(""); setTestCases([{ input: "", expected: "" }]);
    }, 1500);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 17, color: "#1A1A1A" }}>Problem Bank</h2>
          <p style={{ fontSize: 13, color: "#6B6058", marginTop: 2 }}>
            Problems here are not tied to any course — they appear in the global problem list available to all students.
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-90"
          style={{ background: showForm ? "#EDE8D8" : "#7B1113", color: showForm ? "#7B1113" : "#FFF", fontWeight: 600 }}
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "Add Problem"}
        </button>
      </div>

      {/* Creation form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border p-6 flex flex-col gap-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.18)" }}>
              <div className="flex items-center gap-2">
                <Code2 size={16} style={{ color: "#7B1113" }} />
                <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>New Problem</span>
                <span className="text-xs px-2 py-0.5 rounded ml-1" style={{ background: "rgba(11,102,35,0.08)", color: "#0B6623", fontWeight: 600 }}>No course required</span>
              </div>

              {/* Row 1 — Title + Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Problem Title <span style={{ color: "#EF4444" }}>*</span></label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Longest Increasing Subsequence"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Difficulty</label>
                  <div className="flex gap-1.5">
                    {(["Easy", "Medium", "Hard"] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className="flex-1 py-2 rounded-lg text-xs transition-all"
                        style={{
                          background: difficulty === d ? diffBg[d] : "transparent",
                          color: difficulty === d ? diffColor[d] : "#9A8A80",
                          border: `1px solid ${difficulty === d ? diffColor[d] + "40" : "rgba(123,17,19,0.12)"}`,
                          fontWeight: difficulty === d ? 700 : 400,
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2 — Tags, limits, CF rating */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Tags */}
                <div className="col-span-2 relative">
                  <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Topics / Tags</label>
                  <button
                    onClick={() => setShowTagDrop(v => !v)}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm text-left flex items-center justify-between"
                    style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: tags.length ? "#1A1A1A" : "#9A8A80" }}
                  >
                    <span className="truncate">{tags.length ? tags.join(", ") : "Select tags…"}</span>
                    <ChevronDown size={14} style={{ flexShrink: 0, color: "#9A8A80" }} />
                  </button>
                  {showTagDrop && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border shadow-lg p-3 grid grid-cols-2 gap-1.5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.15)" }}>
                      {ALL_TAGS.map(t => (
                        <button
                          key={t}
                          onClick={() => toggleTag(t)}
                          className="text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                          style={{
                            background: tags.includes(t) ? "rgba(123,17,19,0.08)" : "transparent",
                            color: tags.includes(t) ? "#7B1113" : "#3A2A22",
                            fontWeight: tags.includes(t) ? 600 : 400,
                          }}
                        >
                          {tags.includes(t) ? "✓ " : ""}{t}
                        </button>
                      ))}
                      <button onClick={() => setShowTagDrop(false)} className="col-span-2 text-xs mt-1 py-1 text-center rounded-lg" style={{ background: "#EDE8D8", color: "#6B6058" }}>Done</button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Time Limit (s)</label>
                  <input type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} min="1" max="10"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "JetBrains Mono, monospace" }} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Memory (MB)</label>
                  <input type="number" value={memLimit} onChange={e => setMemLimit(e.target.value)} min="64" max="512"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "JetBrains Mono, monospace" }} />
                </div>
              </div>

              {/* CF rating (optional) */}
              <div className="max-w-xs">
                <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>
                  Codeforces-style Rating <span style={{ color: "#9A8A80", fontWeight: 400 }}>(optional)</span>
                </label>
                <input type="number" value={rating} onChange={e => setRating(e.target.value)} placeholder="e.g. 1400"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "JetBrains Mono, monospace" }} />
              </div>

              {/* Problem statement */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Problem Statement</label>
                <textarea
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  rows={5}
                  placeholder="Describe the problem. You can use plain text — LaTeX notation like $O(n \log n)$ is also supported."
                  className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none outline-none leading-relaxed"
                  style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "Inter, sans-serif" }}
                />
              </div>

              {/* Test cases */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs" style={{ color: "#6B6058", fontWeight: 600 }}>Test Cases</label>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: "rgba(11,102,35,0.25)", color: "#0B6623", fontWeight: 500 }}>
                      <Upload size={12} /> Upload .zip
                    </button>
                    <button onClick={addTestCase} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 500 }}>
                      <Plus size={12} /> Add case
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {testCases.map((tc, i) => (
                    <div key={i} className="rounded-xl border p-3" style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.1)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#6B6058", fontFamily: "JetBrains Mono, monospace" }}>Case #{i + 1}</span>
                        {testCases.length > 1 && (
                          <button onClick={() => removeTestCase(i)}>
                            <X size={13} style={{ color: "#9A8A80" }} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(["input", "expected"] as const).map(field => (
                          <div key={field}>
                            <div className="text-xs mb-1 capitalize" style={{ color: "#9A8A80", fontWeight: 500 }}>{field === "expected" ? "Expected Output" : "Input"}</div>
                            <textarea
                              rows={3}
                              value={tc[field]}
                              onChange={e => updateTestCase(i, field, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border text-xs resize-none outline-none"
                              style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.15)", color: "#1A1A1A", fontFamily: "JetBrains Mono, monospace" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
                <button
                  onClick={() => handleSave(true)}
                  disabled={!title.trim() || saved}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: saved ? "#0B6623" : "#7B1113", color: "#FFF", fontWeight: 600 }}
                >
                  {saved ? <><CheckCircle2 size={15} /> Published!</> : <><Zap size={15} /> Publish to Problem Bank</>}
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={!title.trim() || saved}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm border transition-all disabled:opacity-40"
                  style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 500 }}
                >
                  Save as Draft
                </button>
                <p className="text-xs ml-auto" style={{ color: "#9A8A80" }}>
                  This problem will appear in the global Problem Bank — no course association.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing bank problems */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(123,17,19,0.08)", background: "#F5F1E3" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#6B6058" }}>Your contributed problems ({bankProblems.length})</span>
          <span style={{ fontSize: 12, color: "#9A8A80" }}>Visible to all students in Problem Bank</span>
        </div>
        {bankProblems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12" style={{ color: "#9A8A80" }}>
            <Code2 size={32} className="opacity-20" />
            <p style={{ fontSize: 13 }}>No problems contributed yet.</p>
          </div>
        ) : (
          <table className="w-full" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
                {["ID", "Title", "Difficulty", "Tags", "Limits", "Status", ""].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs" style={{ color: "#9A8A80", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bankProblems.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b hover:bg-secondary/30 transition-colors"
                  style={{ borderColor: "rgba(123,17,19,0.06)" }}
                >
                  <td className="py-3 px-4">
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#9A8A80" }}>{p.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{p.title}</div>
                    {p.rating && <div style={{ fontSize: 11, color: "#9A8A80", fontFamily: "JetBrains Mono, monospace" }}>CF ~{p.rating}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: diffBg[p.difficulty], color: diffColor[p.difficulty], fontWeight: 700 }}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded border" style={{ borderColor: "rgba(30,58,138,0.15)", color: "#1E3A8A", background: "rgba(30,58,138,0.05)" }}>{t}</span>
                      ))}
                      {p.tags.length > 2 && <span className="text-xs" style={{ color: "#9A8A80" }}>+{p.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B6058" }}>{p.timeLimit}s · {p.memLimit}MB</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded border hover:bg-secondary transition-colors" style={{ borderColor: "rgba(123,17,19,0.15)" }}>
                        <Edit size={13} style={{ color: "#7B1113" }} />
                      </button>
                      <button
                        onClick={() => setBankProblems(prev => prev.filter((_, idx) => idx !== i))}
                        className="p-1.5 rounded border hover:bg-red-50 transition-colors"
                        style={{ borderColor: "rgba(123,17,19,0.15)" }}
                      >
                        <Trash2 size={13} style={{ color: "#EF4444" }} />
                      </button>
                    </div>
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

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = "overview" | "assignments" | "problems" | "create";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",     label: "Overview"          },
  { id: "assignments",  label: "Assignments"        },
  { id: "problems",     label: "Problem Bank"       },
  { id: "create",       label: "Create Assignment"  },
];

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="px-6 lg:px-8 py-5 border-b flex items-center gap-4 flex-shrink-0" style={{ borderColor: "rgba(123,17,19,0.12)", background: "#FDFAF2" }}>
        <div className="flex-1">
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: "#1A1A1A", letterSpacing: "-0.01em" }}>Teacher Dashboard</h1>
          <p style={{ fontSize: 13, color: "#6B6058", marginTop: 1 }}>Dr. Ramon Reyes · UP Diliman · CS Department</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("problems")}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border transition-all"
            style={{ borderColor: "rgba(123,17,19,0.25)", color: "#7B1113", fontWeight: 600 }}
          >
            <Code2 size={15} /> Add Problem
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all hover:opacity-90"
            style={{ background: "#7B1113", color: "#FFF", fontWeight: 600 }}
          >
            <Plus size={15} /> New Assignment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b px-6 lg:px-8 flex-shrink-0" style={{ borderColor: "rgba(123,17,19,0.1)", background: "#FDFAF2" }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2.5 text-sm whitespace-nowrap transition-colors"
            style={{
              fontWeight: activeTab === t.id ? 600 : 400,
              color: activeTab === t.id ? "#7B1113" : "#6B6058",
              borderBottom: activeTab === t.id ? "2px solid #7B1113" : "2px solid transparent",
              background: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6 p-6 lg:p-8 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {classStats.map(c => (
                <div key={c.name} className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs" style={{ background: c.color, color: "#FFF", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                      {c.name.replace(" ", "")}
                    </div>
                    <div>
                      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#6B6058" }}>{c.label}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[["Students", c.students], ["Avg Score", `${c.avgScore}%`], ["Submissions", c.submissions]].map(([label, val]) => (
                      <div key={String(label)}>
                        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A1A" }}>{val}</div>
                        <div style={{ fontSize: 11, color: "#6B6058" }}>{String(label)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A", marginBottom: 16 }}>Score Distribution — CS 32 vs CS 135</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scoreDistData} barCategoryGap="30%">
                  <XAxis dataKey="range" tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
                  <Bar dataKey="cs32"  name="CS 32"  fill="#7B1113" radius={[4,4,0,0]} />
                  <Bar dataKey="cs135" name="CS 135" fill="#0B6623" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ASSIGNMENTS */}
        {activeTab === "assignments" && (
          <div className="flex flex-col gap-4 p-6 lg:p-8 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
            {assignments.map(a => {
              const pct = Math.round((a.submissions / a.total) * 100);
              return (
                <div key={a.id} className="rounded-xl border p-5 flex items-center gap-4" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{a.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 500 }}>{a.course}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${a.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{ fontWeight: 500 }}>
                        {a.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs flex items-center gap-1" style={{ color: "#6B6058" }}><Clock size={11} /> Due {a.due}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "#6B6058" }}><BookOpen size={11} /> {a.problems} problems</span>
                      <span className="text-xs" style={{ color: "#6B6058" }}>{a.submissions}/{a.total} submitted</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE8D8" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? "#0B6623" : "#7B1113" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="p-2 rounded-md border transition-colors hover:bg-secondary" style={{ borderColor: "rgba(123,17,19,0.15)" }}>
                      <Edit size={14} style={{ color: "#7B1113" }} />
                    </button>
                    <button className="p-2 rounded-md border transition-colors hover:bg-red-50" style={{ borderColor: "rgba(123,17,19,0.15)" }}>
                      <Trash2 size={14} style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PROBLEM BANK */}
        {activeTab === "problems" && (
          <div className="p-6 lg:p-8 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
            <ProblemBankTab />
          </div>
        )}

        {/* CREATE ASSIGNMENT — Policy Engine */}
        {activeTab === "create" && (
          <div className="h-full">
            <PolicyEngine onBack={() => setActiveTab("assignments")} />
          </div>
        )}
      </div>
    </div>
  );
}
