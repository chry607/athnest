import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import {
  Link2, CheckCircle2, ExternalLink, Filter, Flame,
  TrendingUp, Code2, Trophy, Target, Calendar, Zap,
  GitCommit, Star, AlertCircle, ChevronDown, Search,
  BookOpen, BarChart3, Clock, Activity,
} from "lucide-react";

// ─── Mock data ──────────────────────────────────────────────────────────────

const PLATFORMS = {
  cf: { label: "Codeforces", color: "#7B1113", badge: "CF" },
  hr: { label: "HackerRank", color: "#0B6623", badge: "HR" },
};

const linkedAccounts = {
  cf: { handle: "maria_santos_up", verified: true,  rating: 1342, rank: "Pupil",         solved: 214 },
  hr: { handle: "maria.santos",    verified: true,  score: 1850,  level: "5-Star",       solved: 97  },
};

const skillData = [
  { topic: "Dynamic\nProgramming", cf: 72, hr: 60 },
  { topic: "Graphs",               cf: 88, hr: 45 },
  { topic: "Greedy",               cf: 65, hr: 78 },
  { topic: "Math",                 cf: 80, hr: 70 },
  { topic: "Strings",              cf: 55, hr: 85 },
  { topic: "Trees",                cf: 70, hr: 50 },
  { topic: "Binary Search",        cf: 90, hr: 62 },
  { topic: "Sorting",              cf: 95, hr: 90 },
];

const platformDist = [
  { name: "Codeforces", value: 214, color: "#7B1113" },
  { name: "HackerRank", value: 97,  color: "#0B6623" },
];

const ratingTimeline = [
  { date: "Jan", rating: 1100, contest: "Codeforces R#871" },
  { date: "Feb", rating: 1145, contest: "Codeforces R#889" },
  { date: "Mar", rating: 1092, contest: "Codeforces R#902" },
  { date: "Apr", rating: 1210, contest: "Codeforces R#915" },
  { date: "May", rating: 1289, contest: "Codeforces R#928" },
  { date: "Jun", rating: 1342, contest: "Codeforces R#941" },
];

const milestones = [
  { icon: Star,      label: "First AC",          date: "Jan 4, 2026",  color: "#F59E0B" },
  { icon: Trophy,    label: "First Contest",      date: "Jan 12, 2026", color: "#7B1113" },
  { icon: TrendingUp,label: "Rating hit 1200",   date: "Apr 5, 2026",  color: "#0B6623" },
  { icon: Flame,     label: "7-day streak",       date: "May 18, 2026", color: "#EF4444" },
  { icon: Code2,     label: "100th AC",           date: "Jun 1, 2026",  color: "#1E3A8A" },
];

type Tag = "DP" | "Graphs" | "Greedy" | "Math" | "Strings" | "Trees" | "Binary Search" | "Sorting";
interface Problem {
  name: string;
  platform: "cf" | "hr";
  difficulty: "Easy" | "Medium" | "Hard";
  tags: Tag[];
  date: string;
  rating?: number;
  verdict: "AC" | "WA";
  url: string;
}

const problems: Problem[] = [
  { name: "Educational DP Contest: Frog 1",    platform: "cf", difficulty: "Easy",   tags: ["DP"],           date: "Jun 12, 2026", rating: 800,  verdict: "AC", url: "#" },
  { name: "Graph BFS Shortest Path",           platform: "cf", difficulty: "Medium", tags: ["Graphs"],       date: "Jun 11, 2026", rating: 1300, verdict: "AC", url: "#" },
  { name: "Greedy Coin Change",                platform: "hr", difficulty: "Easy",   tags: ["Greedy"],       date: "Jun 10, 2026", verdict: "AC", url: "#" },
  { name: "Segment Tree Range Query",          platform: "cf", difficulty: "Hard",   tags: ["Trees"],        date: "Jun 9, 2026",  rating: 1700, verdict: "WA", url: "#" },
  { name: "String Hashing",                    platform: "hr", difficulty: "Medium", tags: ["Strings"],      date: "Jun 9, 2026",  verdict: "AC", url: "#" },
  { name: "Binary Search Lower Bound",         platform: "cf", difficulty: "Easy",   tags: ["Binary Search"],date: "Jun 8, 2026",  rating: 900,  verdict: "AC", url: "#" },
  { name: "Maximum Subarray (Kadane's)",       platform: "hr", difficulty: "Medium", tags: ["DP"],           date: "Jun 7, 2026",  verdict: "AC", url: "#" },
  { name: "Dijkstra's Single Source",          platform: "cf", difficulty: "Hard",   tags: ["Graphs"],       date: "Jun 6, 2026",  rating: 1900, verdict: "AC", url: "#" },
  { name: "Longest Common Subsequence",        platform: "hr", difficulty: "Hard",   tags: ["DP", "Strings"],date: "Jun 5, 2026",  verdict: "AC", url: "#" },
  { name: "Merge Sort Implementation",         platform: "cf", difficulty: "Easy",   tags: ["Sorting"],      date: "Jun 4, 2026",  rating: 800,  verdict: "AC", url: "#" },
  { name: "Prime Sieve of Eratosthenes",       platform: "hr", difficulty: "Medium", tags: ["Math"],         date: "Jun 3, 2026",  verdict: "AC", url: "#" },
  { name: "Trie Data Structure",               platform: "cf", difficulty: "Hard",   tags: ["Trees","Strings"],date:"Jun 2, 2026", rating: 1800, verdict: "AC", url: "#" },
];

// ─── Contribution heatmap (12 weeks × 7 days) ───────────────────────────────
function buildHeatmap() {
  const weeks: { day: number; count: number; date: string }[][] = [];
  const today = new Date(2026, 5, 13); // Jun 13 2026
  let cur = new Date(today);
  cur.setDate(cur.getDate() - 7 * 15 + 1);
  for (let w = 0; w < 15; w++) {
    const week: { day: number; count: number; date: string }[] = [];
    for (let d = 0; d < 7; d++) {
      const count = Math.random() < 0.35 ? 0 : Math.floor(Math.random() * 5) + 1;
      week.push({ day: cur.getDay(), count, date: cur.toLocaleDateString("en-PH", { month: "short", day: "numeric" }) });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
const heatmapData = buildHeatmap();

function heatColor(count: number) {
  if (count === 0) return "#E8E4D6";
  if (count === 1) return "#C5A0A2";
  if (count === 2) return "#A36065";
  if (count === 3) return "#883038";
  return "#7B1113";
}

// ─── Skill bar with strength label ──────────────────────────────────────────
const strengthLabel = (v: number) => v >= 80 ? "Strong" : v >= 60 ? "Medium" : "Weak";
const strengthColor  = (v: number) => v >= 80 ? "#0B6623" : v >= 60 ? "#C4820A" : "#7B1113";

// ─── Subcomponents ──────────────────────────────────────────────────────────

function PlatformCard({ pid, data, onUnlink }: { pid: "cf" | "hr"; data: typeof linkedAccounts.cf & { score?: number; level?: string }; onUnlink: () => void }) {
  const p = PLATFORMS[pid];
  return (
    <div className="rounded-xl border p-5 flex flex-col gap-3" style={{ background: "#FDFAF2", borderColor: `${p.color}30` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs" style={{ background: p.color, color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{p.badge}</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{p.label}</span>
        </div>
        {data.verified && <CheckCircle2 size={16} style={{ color: "#0B6623" }} />}
      </div>
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#6B6058" }}>@{data.handle}</span>
        <a href="#" className="ml-auto"><ExternalLink size={13} style={{ color: "#9A8A80" }} /></a>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1 border-t" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
        {pid === "cf" ? (
          <>
            <div><div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: p.color }}>{(data as any).rating}</div><div style={{ fontSize: 11, color: "#6B6058", fontFamily: "Inter, sans-serif" }}>Rating</div></div>
            <div><div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A1A" }}>{data.solved}</div><div style={{ fontSize: 11, color: "#6B6058", fontFamily: "Inter, sans-serif" }}>Solved</div></div>
            <div><div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{(data as any).rank}</div><div style={{ fontSize: 11, color: "#6B6058", fontFamily: "Inter, sans-serif" }}>Rank</div></div>
          </>
        ) : (
          <>
            <div><div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: p.color }}>{(data as any).score}</div><div style={{ fontSize: 11, color: "#6B6058", fontFamily: "Inter, sans-serif" }}>Score</div></div>
            <div><div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A1A" }}>{data.solved}</div><div style={{ fontSize: 11, color: "#6B6058", fontFamily: "Inter, sans-serif" }}>Solved</div></div>
            <div><div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{(data as any).level}</div><div style={{ fontSize: 11, color: "#6B6058", fontFamily: "Inter, sans-serif" }}>Level</div></div>
          </>
        )}
      </div>
    </div>
  );
}

function ConnectCard({ pid, onConnect }: { pid: "cf" | "hr"; onConnect: (handle: string) => void }) {
  const [handle, setHandle] = useState("");
  const [verifying, setVerifying] = useState(false);
  const p = PLATFORMS[pid];

  function verify() {
    if (!handle.trim()) return;
    setVerifying(true);
    setTimeout(() => { setVerifying(false); onConnect(handle.trim()); }, 1400);
  }

  return (
    <div className="rounded-xl border border-dashed p-5 flex flex-col gap-3" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.2)" }}>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs" style={{ background: p.color, color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{p.badge}</span>
        <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{p.label}</span>
      </div>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B6058" }}>Connect your {p.label} account to sync your progress.</p>
      <div className="flex gap-2">
        <input
          value={handle}
          onChange={e => setHandle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && verify()}
          placeholder={pid === "cf" ? "CF handle" : "HR username"}
          className="flex-1 px-3 py-2 rounded-md border text-sm outline-none"
          style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "JetBrains Mono, monospace" }}
        />
        <button
          onClick={verify}
          disabled={verifying || !handle.trim()}
          className="px-4 py-2 rounded-md text-sm transition-all disabled:opacity-60 flex items-center gap-1.5"
          style={{ background: p.color, color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
        >
          {verifying ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Checking…</> : <><Link2 size={14} />Verify</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

type Tab = "overview" | "skills" | "problems" | "timeline";

export function AthGraph() {
  const [tab, setTab] = useState<Tab>("overview");
  const [connected, setConnected] = useState({ cf: true, hr: true });
  const [platformFilter, setPlatformFilter] = useState<"all" | "cf" | "hr">("all");
  const [diffFilter,     setDiffFilter]     = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [tagFilter,      setTagFilter]      = useState<Tag | "all">("all");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [verdictFilter,  setVerdictFilter]  = useState<"all" | "AC" | "WA">("all");
  const [showOnlyAC,     setShowOnlyAC]     = useState(false);

  const allTags: Tag[] = ["DP", "Graphs", "Greedy", "Math", "Strings", "Trees", "Binary Search", "Sorting"];

  const filtered = useMemo(() => problems.filter(p => {
    if (platformFilter !== "all" && p.platform !== platformFilter) return false;
    if (diffFilter     !== "all" && p.difficulty !== diffFilter)  return false;
    if (tagFilter      !== "all" && !p.tags.includes(tagFilter))  return false;
    if (showOnlyAC     && p.verdict !== "AC")                     return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [platformFilter, diffFilter, tagFilter, showOnlyAC, searchQuery]);

  const totalSolved = linkedAccounts.cf.solved + linkedAccounts.hr.solved;
  const totalStreak = 7;
  const topicCoverage = skillData.filter(s => (s.cf + s.hr) / 2 >= 70).length;

  const tabs: { id: Tab; label: string; icon: typeof Activity }[] = [
    { id: "overview", label: "Overview",  icon: BarChart3 },
    { id: "skills",   label: "Skill Map", icon: Target    },
    { id: "problems", label: "Problems",  icon: Code2     },
    { id: "timeline", label: "Timeline",  icon: Activity  },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="px-6 lg:px-8 py-5 border-b flex-shrink-0" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#7B1113" }}>
            <Activity size={16} style={{ color: "#F5F1E3" }} />
          </div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: "#1A1A1A", letterSpacing: "-0.01em" }}>
            AthGraph
          </h1>
          <span className="px-2 py-0.5 rounded text-xs ml-1" style={{ background: "rgba(123,17,19,0.08)", color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Beta</span>
        </div>
        <p style={{ fontSize: 13, color: "#6B6058" }}>Your complete competitive programming footprint — unified across all platforms.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b px-6 lg:px-8 flex-shrink-0" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.1)" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors"
            style={{
              fontWeight: tab === id ? 600 : 400,
              color: tab === id ? "#7B1113" : "#6B6058",
              borderBottom: tab === id ? "2px solid #7B1113" : "2px solid transparent",
              background: "transparent",
            }}
          >
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ scrollbarWidth: "none" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="flex flex-col gap-6">
            {/* Top stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Solved",    value: totalSolved, icon: CheckCircle2, color: "#0B6623",  sub: "Across all platforms" },
                { label: "CF Rating",       value: linkedAccounts.cf.rating, icon: TrendingUp, color: "#7B1113", sub: "Pupil · +53 this month" },
                { label: "Active Streak",   value: `${totalStreak}d`, icon: Flame, color: "#C4820A", sub: "Personal best: 14d" },
                { label: "Topics Mastered", value: topicCoverage, icon: Target, color: "#1E3A8A", sub: `${skillData.length} topics total` },
              ].map(({ label, value, icon: Icon, color, sub }) => (
                <div key={label} className="rounded-xl border p-4" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <span style={{ fontSize: 12, color: "#6B6058", fontWeight: 500 }}>{label}</span>
                    <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: `${color}14` }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 26, color: "#1A1A1A", lineHeight: 1.2 }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#9A8A80", marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Platform cards */}
            <div>
              <h2 className="mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Linked Accounts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {connected.cf
                  ? <PlatformCard pid="cf" data={linkedAccounts.cf as any} onUnlink={() => setConnected(c => ({ ...c, cf: false }))} />
                  : <ConnectCard  pid="cf" onConnect={() => setConnected(c => ({ ...c, cf: true }))} />}
                {connected.hr
                  ? <PlatformCard pid="hr" data={linkedAccounts.hr as any} onUnlink={() => setConnected(c => ({ ...c, hr: false }))} />
                  : <ConnectCard  pid="hr" onConnect={() => setConnected(c => ({ ...c, hr: true }))} />}
              </div>
            </div>

            {/* Contribution heatmap + Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Heatmap */}
              <div className="lg:col-span-2 rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Contribution Graph</h2>
                  <span style={{ fontSize: 12, color: "#9A8A80" }}>Last 15 weeks</span>
                </div>
                <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map((day, di) => (
                        <div
                          key={`${wi}-${di}`}
                          title={`${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}`}
                          className="w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-110"
                          style={{ background: heatColor(day.count) }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span style={{ fontSize: 11, color: "#9A8A80" }}>Less</span>
                  {[0,1,2,3,4].map(n => (
                    <div key={n} className="w-3 h-3 rounded-sm" style={{ background: heatColor(n) }} />
                  ))}
                  <span style={{ fontSize: 11, color: "#9A8A80" }}>More</span>
                </div>
              </div>

              {/* Pie */}
              <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                <h2 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Platform Split</h2>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie key="platform-pie" data={platformDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {platformDist.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }}
                      formatter={(v: number, n: string) => [`${v} problems`, n]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2">
                  {platformDist.map(p => (
                    <div key={p.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                        <span style={{ color: "#3A2A22", fontWeight: 500 }}>{p.name}</span>
                      </div>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>
                        {p.value} ({Math.round(p.value / totalSolved * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Classroom integration */}
            <div className="rounded-xl border p-5" style={{ background: "#FEF9EE", borderColor: "#C4820A30" }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} style={{ color: "#C4820A" }} />
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#C4820A" }}>Classroom Sync — Recommendations</h2>
              </div>
              <p style={{ fontSize: 13, color: "#5A4A20", marginBottom: 12, lineHeight: 1.6 }}>
                Based on your Codeforces history, your teacher's current assignment (PS 3: Recursion and DP) aligns with problems you've already explored. Here are adaptive suggestions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Skip intro DP",       desc: "You've solved 18 DP problems on CF. Start from medium-level tasks.", action: "Jump to Medium" },
                  { label: "Strengthen Graphs",   desc: "You're strong in BFS (88/100). Try Dijkstra variants next.", action: "Find Problems" },
                  { label: "Explore Strings",     desc: "Your weakest tag. 3 recommended HR problems match this week's syllabus.", action: "View 3 Problems" },
                ].map(({ label, desc, action }) => (
                  <div key={label} className="rounded-lg p-3 border" style={{ background: "#FDFAF2", borderColor: "#C4820A20" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1A1A1A", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 12, color: "#5A4A20", lineHeight: 1.5, marginBottom: 8 }}>{desc}</div>
                    <button style={{ fontSize: 12, color: "#C4820A", fontWeight: 600 }}>{action} →</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SKILL MAP ── */}
        {tab === "skills" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar */}
              <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Skill Radar</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillData}>
                    <PolarGrid stroke="rgba(123,17,19,0.1)" />
                    <PolarAngleAxis dataKey="topic" tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: "#6B6058" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Codeforces" dataKey="cf" stroke="#7B1113" fill="#7B1113" fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="HackerRank" dataKey="hr" stroke="#0B6623" fill="#0B6623" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 justify-center mt-2">
                  {[["Codeforces", "#7B1113"], ["HackerRank", "#0B6623"]].map(([name, color]) => (
                    <div key={name} className="flex items-center gap-1.5 text-xs" style={{ color: "#6B6058" }}>
                      <div className="w-3 h-1.5 rounded-full" style={{ background: color as string }} />
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Strength breakdown */}
              <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Topic Breakdown</h2>
                <div className="flex flex-col gap-4">
                  {skillData.map(s => {
                    const avg = Math.round((s.cf + s.hr) / 2);
                    return (
                      <div key={s.topic.replace("\n", " ")}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>{s.topic.replace("\n", " ")}</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${strengthColor(avg)}14`, color: strengthColor(avg), fontWeight: 600 }}>
                            {strengthLabel(avg)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[["CF", s.cf, "#7B1113"], ["HR", s.hr, "#0B6623"]].map(([lbl, val, col]) => (
                            <div key={String(lbl)}>
                              <div className="flex justify-between mb-1">
                                <span style={{ fontSize: 11, color: "#9A8A80" }}>{lbl}</span>
                                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{val}/100</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE8D8" }}>
                                <div className="h-full rounded-full transition-all" style={{ width: `${val}%`, background: col as string }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bar heatmap */}
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Combined Score by Topic</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={skillData.map(s => ({ ...s, avg: Math.round((s.cf + s.hr) / 2), topic: s.topic.replace("\n", " ") }))} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="topic" tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#3A2A22" }} width={110} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
                  <Bar dataKey="avg" radius={[0,4,4,0]}>
                    {skillData.map((s, i) => {
                      const avg = Math.round((s.cf + s.hr) / 2);
                      return <Cell key={`cell-skill-${i}`} fill={strengthColor(avg)} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── PROBLEMS ── */}
        {tab === "problems" && (
          <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="rounded-xl border p-4 flex flex-wrap gap-3 items-center" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <div className="flex items-center gap-2 flex-1 min-w-40">
                <Search size={14} style={{ color: "#9A8A80" }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search problems…"
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ fontFamily: "Inter, sans-serif", color: "#1A1A1A" }}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Platform */}
                {(["all", "cf", "hr"] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className="px-3 py-1.5 rounded-md text-xs transition-colors"
                    style={{
                      background: platformFilter === p ? "#7B1113" : "#EDE8D8",
                      color: platformFilter === p ? "#FFF" : "#3A2A22",
                      fontWeight: 500,
                    }}
                  >
                    {p === "all" ? "All Platforms" : PLATFORMS[p].label}
                  </button>
                ))}
                {/* Difficulty */}
                {(["all", "Easy", "Medium", "Hard"] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDiffFilter(d)}
                    className="px-3 py-1.5 rounded-md text-xs transition-colors"
                    style={{
                      background: diffFilter === d ? "#7B1113" : "#EDE8D8",
                      color: diffFilter === d ? "#FFF" : "#3A2A22",
                      fontWeight: 500,
                    }}
                  >
                    {d === "all" ? "All Difficulties" : d}
                  </button>
                ))}
                {/* AC only toggle */}
                <button
                  onClick={() => setShowOnlyAC(v => !v)}
                  className="px-3 py-1.5 rounded-md text-xs transition-colors flex items-center gap-1.5"
                  style={{ background: showOnlyAC ? "#0B6623" : "#EDE8D8", color: showOnlyAC ? "#FFF" : "#3A2A22", fontWeight: 500 }}
                >
                  <CheckCircle2 size={12} /> AC Only
                </button>
              </div>
              {/* Tags */}
              <div className="flex gap-1.5 flex-wrap w-full">
                {(["all", ...allTags] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTagFilter(t as Tag | "all")}
                    className="px-2.5 py-1 rounded text-xs transition-colors"
                    style={{
                      background: tagFilter === t ? "#1E3A8A" : "transparent",
                      color: tagFilter === t ? "#FFF" : "#6B6058",
                      border: tagFilter === t ? "1px solid #1E3A8A" : "1px solid rgba(123,17,19,0.12)",
                      fontWeight: tagFilter === t ? 600 : 400,
                    }}
                  >
                    {t === "all" ? "All Tags" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div style={{ fontSize: 13, color: "#6B6058" }}>{filtered.length} problem{filtered.length !== 1 ? "s" : ""} found</div>

            {/* Problem list */}
            <div className="flex flex-col gap-2">
              {filtered.map((prob, i) => {
                const pl = PLATFORMS[prob.platform];
                const diffColor = prob.difficulty === "Easy" ? "#0B6623" : prob.difficulty === "Medium" ? "#C4820A" : "#EF4444";
                return (
                  <motion.div
                    key={`${prob.name}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer"
                    style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: pl.color, color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 11 }}>{pl.badge}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{prob.name}</span>
                        {prob.rating && (
                          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9A8A80" }}>#{prob.rating}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${diffColor}14`, color: diffColor, fontWeight: 500 }}>{prob.difficulty}</span>
                        {prob.tags.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: "rgba(30,58,138,0.2)", color: "#1E3A8A", background: "rgba(30,58,138,0.05)" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${prob.verdict === "AC" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                        {prob.verdict === "AC" ? "✓ AC" : "✗ WA"}
                      </span>
                      <span style={{ fontSize: 11, color: "#9A8A80" }}>{prob.date}</span>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12" style={{ color: "#9A8A80", fontFamily: "Inter, sans-serif" }}>
                  <Code2 size={32} className="mx-auto mb-2 opacity-30" />
                  No problems match your filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {tab === "timeline" && (
          <div className="flex flex-col gap-6">
            {/* Rating chart */}
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Codeforces Rating History</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={ratingTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(123,17,19,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1000, 1500]} tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }}
                    formatter={(v: number) => [v, "Rating"]}
                    labelFormatter={(l, payload) => payload?.[0]?.payload?.contest ?? l}
                  />
                  <Line type="monotone" dataKey="rating" stroke="#7B1113" strokeWidth={2.5} dot={{ fill: "#7B1113", r: 5, strokeWidth: 2, stroke: "#FFF" }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Milestones */}
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Milestones</h2>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: "rgba(123,17,19,0.15)" }} />
                <div className="flex flex-col gap-5">
                  {milestones.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <motion.div
                        key={m.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-4"
                      >
                        <div className="absolute left-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: m.color, transform: "translateX(-1px)" }}>
                          <Icon size={9} style={{ color: "#FFF" }} />
                        </div>
                        <div className="flex-1 rounded-lg border p-3" style={{ borderColor: `${m.color}20`, background: `${m.color}06` }}>
                          <div className="flex items-center justify-between">
                            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: "#1A1A1A" }}>{m.label}</span>
                            <span style={{ fontSize: 12, color: "#9A8A80", fontFamily: "JetBrains Mono, monospace" }}>{m.date}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Daily submissions bar */}
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Daily Submission Activity</h2>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[
                  { day: "Mon", count: 3 }, { day: "Tue", count: 7 }, { day: "Wed", count: 2 },
                  { day: "Thu", count: 5 }, { day: "Fri", count: 8 }, { day: "Sat", count: 4 }, { day: "Sun", count: 1 },
                ]}>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
                  <Bar dataKey="count" fill="#7B1113" radius={[4,4,0,0]} name="Submissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
