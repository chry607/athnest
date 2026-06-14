import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import {
  Link2, CheckCircle2, ExternalLink, Flame, TrendingUp,
  Code2, Trophy, Target, Star, ChevronDown, Search,
  BookOpen, BarChart3, Activity, MapPin, Calendar,
  GraduationCap, Edit3, Camera, Github, Twitter,
  Award, Zap, Check,
} from "lucide-react";

// ─── Personal data ───────────────────────────────────────────────────────────

const USER = {
  name:      "Maria Isabel Santos",
  handle:    "@maria_santos_up",
  avatar:    "MS",
  role:      "Student",
  course:    "BS Computer Science",
  year:      "3rd Year",
  college:   "UP Diliman",
  location:  "Quezon City, Philippines",
  joined:    "January 2024",
  bio:       "CS student at UP Diliman passionate about competitive programming, algorithms, and building tools that help fellow students learn. Currently diving deep into graph theory and dynamic programming.",
  links: {
    github:  "github.com/mariasantos",
    twitter: "twitter.com/mariasantosph",
  },
  badges: [
    { label: "Top 20% · CS 32",      color: "#7B1113" },
    { label: "7-day streak",          color: "#C4820A" },
    { label: "100 ACs",               color: "#0B6623" },
    { label: "First Contest",         color: "#1E3A8A" },
  ],
};

// ─── Platform data ───────────────────────────────────────────────────────────

const PLATFORMS = {
  cf: { label: "Codeforces", color: "#7B1113", badge: "CF" },
  hr: { label: "HackerRank", color: "#0B6623", badge: "HR" },
};

const linkedAccounts = {
  cf: { handle: "maria_santos_up", verified: true, rating: 1342, rank: "Pupil",  solved: 214 },
  hr: { handle: "maria.santos",    verified: true, score: 1850,  level: "5-Star",solved: 97  },
};

// ─── Stats / chart data ───────────────────────────────────────────────────────

const skillData = [
  { topic: "DP",            cf: 72, hr: 60 },
  { topic: "Graphs",        cf: 88, hr: 45 },
  { topic: "Greedy",        cf: 65, hr: 78 },
  { topic: "Math",          cf: 80, hr: 70 },
  { topic: "Strings",       cf: 55, hr: 85 },
  { topic: "Trees",         cf: 70, hr: 50 },
  { topic: "Binary Search", cf: 90, hr: 62 },
  { topic: "Sorting",       cf: 95, hr: 90 },
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
  { icon: Star,       label: "First AC",       date: "Jan 4, 2026",  color: "#F59E0B" },
  { icon: Trophy,     label: "First Contest",  date: "Jan 12, 2026", color: "#7B1113" },
  { icon: TrendingUp, label: "Rating hit 1200",date: "Apr 5, 2026",  color: "#0B6623" },
  { icon: Flame,      label: "7-day streak",   date: "May 18, 2026", color: "#EF4444" },
  { icon: Code2,      label: "100th AC",       date: "Jun 1, 2026",  color: "#1E3A8A" },
];

type Tag = "DP" | "Graphs" | "Greedy" | "Math" | "Strings" | "Trees" | "Binary Search" | "Sorting";

interface Problem {
  name: string; platform: "cf" | "hr"; difficulty: "Easy" | "Medium" | "Hard";
  tags: Tag[]; date: string; rating?: number; verdict: "AC" | "WA";
}

const problems: Problem[] = [
  { name: "Educational DP: Frog 1",       platform: "cf", difficulty: "Easy",   tags: ["DP"],            date: "Jun 12", rating: 800,  verdict: "AC" },
  { name: "Graph BFS Shortest Path",       platform: "cf", difficulty: "Medium", tags: ["Graphs"],        date: "Jun 11", rating: 1300, verdict: "AC" },
  { name: "Greedy Coin Change",            platform: "hr", difficulty: "Easy",   tags: ["Greedy"],        date: "Jun 10",              verdict: "AC" },
  { name: "Segment Tree Range Query",      platform: "cf", difficulty: "Hard",   tags: ["Trees"],         date: "Jun 9",  rating: 1700, verdict: "WA" },
  { name: "String Hashing",               platform: "hr", difficulty: "Medium", tags: ["Strings"],       date: "Jun 9",               verdict: "AC" },
  { name: "Binary Search Lower Bound",     platform: "cf", difficulty: "Easy",   tags: ["Binary Search"], date: "Jun 8",  rating: 900,  verdict: "AC" },
  { name: "Maximum Subarray (Kadane's)",   platform: "hr", difficulty: "Medium", tags: ["DP"],            date: "Jun 7",               verdict: "AC" },
  { name: "Dijkstra's Single Source",      platform: "cf", difficulty: "Hard",   tags: ["Graphs"],        date: "Jun 6",  rating: 1900, verdict: "AC" },
  { name: "Longest Common Subsequence",    platform: "hr", difficulty: "Hard",   tags: ["DP", "Strings"], date: "Jun 5",               verdict: "AC" },
  { name: "Merge Sort Implementation",     platform: "cf", difficulty: "Easy",   tags: ["Sorting"],       date: "Jun 4",  rating: 800,  verdict: "AC" },
];

// ─── Heatmap ─────────────────────────────────────────────────────────────────

function buildHeatmap() {
  const weeks: { count: number; date: string }[][] = [];
  const today = new Date(2026, 5, 13);
  const cur = new Date(today);
  cur.setDate(cur.getDate() - 7 * 15 + 1);
  for (let w = 0; w < 15; w++) {
    const week: { count: number; date: string }[] = [];
    for (let d = 0; d < 7; d++) {
      const count = Math.random() < 0.35 ? 0 : Math.floor(Math.random() * 5) + 1;
      week.push({ count, date: new Date(cur).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
const heatmapData = buildHeatmap();
function heatColor(n: number) {
  return n === 0 ? "#E8E4D6" : n === 1 ? "#C5A0A2" : n === 2 ? "#A36065" : n === 3 ? "#883038" : "#7B1113";
}

const strengthColor = (v: number) => v >= 80 ? "#0B6623" : v >= 60 ? "#C4820A" : "#7B1113";
const strengthLabel = (v: number) => v >= 80 ? "Strong" : v >= 60 ? "Medium" : "Weak";

const allTags: Tag[] = ["DP", "Graphs", "Greedy", "Math", "Strings", "Trees", "Binary Search", "Sorting"];

// ─── Connect card ─────────────────────────────────────────────────────────────

function ConnectCard({ pid, onConnect }: { pid: "cf" | "hr"; onConnect: () => void }) {
  const [handle, setHandle] = useState("");
  const [verifying, setVerifying] = useState(false);
  const p = PLATFORMS[pid];
  function verify() {
    if (!handle.trim()) return;
    setVerifying(true);
    setTimeout(() => { setVerifying(false); onConnect(); }, 1400);
  }
  return (
    <div className="rounded-xl border border-dashed p-4 flex flex-col gap-3" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.2)" }}>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs" style={{ background: p.color, color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{p.badge}</span>
        <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{p.label}</span>
      </div>
      <div className="flex gap-2">
        <input value={handle} onChange={e => setHandle(e.target.value)} onKeyDown={e => e.key === "Enter" && verify()}
          placeholder={pid === "cf" ? "CF handle" : "HR username"}
          className="flex-1 px-3 py-2 rounded-md border text-sm outline-none"
          style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "JetBrains Mono, monospace" }} />
        <button onClick={verify} disabled={verifying || !handle.trim()}
          className="px-3 py-2 rounded-md text-xs disabled:opacity-60 flex items-center gap-1.5"
          style={{ background: p.color, color: "#FFF", fontWeight: 600 }}>
          {verifying ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Link2 size={13} />Verify</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = "overview" | "athgraph" | "skills" | "problems" | "timeline";

export function ProfilePage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(USER.bio);
  const [draftBio, setDraftBio] = useState(USER.bio);
  const [connected, setConnected] = useState({ cf: true, hr: true });
  const [platformFilter, setPlatformFilter] = useState<"all" | "cf" | "hr">("all");
  const [diffFilter, setDiffFilter]         = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [tagFilter, setTagFilter]           = useState<Tag | "all">("all");
  const [showOnlyAC, setShowOnlyAC]         = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");

  const totalSolved = linkedAccounts.cf.solved + linkedAccounts.hr.solved;

  const filtered = useMemo(() => problems.filter(p => {
    if (platformFilter !== "all" && p.platform !== platformFilter) return false;
    if (diffFilter     !== "all" && p.difficulty !== diffFilter)  return false;
    if (tagFilter      !== "all" && !p.tags.includes(tagFilter))  return false;
    if (showOnlyAC     && p.verdict !== "AC")                     return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [platformFilter, diffFilter, tagFilter, showOnlyAC, searchQuery]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview",  label: "Overview"  },
    { id: "athgraph",  label: "AthGraph"  },
    { id: "skills",    label: "Skill Map" },
    { id: "problems",  label: "Problems"  },
    { id: "timeline",  label: "Timeline"  },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Profile hero ── */}
      <div className="flex-shrink-0 border-b" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        {/* Cover strip */}
        <div className="h-28 relative" style={{ background: "linear-gradient(135deg, #7B1113 0%, #5A0C0E 60%, #3A0C0E 100%)" }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "repeating-linear-gradient(45deg, #FFF 0, #FFF 1px, transparent 0, transparent 50%)",
            backgroundSize: "18px 18px",
          }} />
        </div>

        <div className="px-6 lg:px-8 pb-5">
          <div className="flex items-end gap-5 -mt-10 mb-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl border-4 flex items-center justify-center text-2xl font-bold"
                style={{ background: "#3A0C0E", borderColor: "#F5F1E3", color: "#F5F1E3", fontFamily: "Poppins, sans-serif" }}>
                {USER.avatar}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2"
                style={{ background: "#7B1113", borderColor: "#F5F1E3" }}>
                <Camera size={11} style={{ color: "#FFF" }} />
              </button>
            </div>

            {/* Name block */}
            <div className="flex-1 min-w-0 pt-10">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: "#1A1A1A", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                    {USER.name}
                  </h1>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#7B1113", marginTop: 1 }}>{USER.handle}</div>
                </div>
                <button
                  onClick={() => { setEditing(e => !e); setDraftBio(bio); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all"
                  style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 500 }}
                >
                  <Edit3 size={13} /> {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3">
            {[
              { icon: GraduationCap, text: `${USER.course} · ${USER.year}` },
              { icon: MapPin,        text: `${USER.college} · ${USER.location}` },
              { icon: Calendar,      text: `Joined ${USER.joined}` },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-sm" style={{ color: "#6B6058" }}>
                <Icon size={13} style={{ color: "#9A8A80" }} /> {text}
              </div>
            ))}
          </div>

          {/* Bio */}
          {editing ? (
            <div className="mb-3">
              <textarea
                value={draftBio}
                onChange={e => setDraftBio(e.target.value)}
                rows={3}
                className="w-full max-w-2xl px-3 py-2.5 rounded-xl border text-sm resize-none outline-none"
                style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setBio(draftBio); setEditing(false); }}
                  className="px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                  style={{ background: "#7B1113", color: "#FFF", fontWeight: 600 }}>
                  <Check size={12} /> Save
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-4 py-1.5 rounded-lg text-xs border"
                  style={{ borderColor: "rgba(123,17,19,0.2)", color: "#6B6058" }}>
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <p className="max-w-2xl mb-3 text-sm leading-relaxed" style={{ color: "#3A2A22" }}>{bio}</p>
          )}

          {/* Badges + social */}
          <div className="flex flex-wrap items-center gap-2">
            {USER.badges.map(b => (
              <span key={b.label} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border"
                style={{ background: b.color + "10", borderColor: b.color + "30", color: b.color, fontWeight: 600 }}>
                <Award size={11} /> {b.label}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-2">
              {[{ icon: Github, href: USER.links.github }, { icon: Twitter, href: USER.links.twitter }].map(({ icon: Icon, href }) => (
                <a key={href} href="#" className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors hover:bg-secondary"
                  style={{ borderColor: "rgba(123,17,19,0.15)" }}>
                  <Icon size={14} style={{ color: "#6B6058" }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t px-6 lg:px-8 overflow-x-auto" style={{ borderColor: "rgba(123,17,19,0.1)", scrollbarWidth: "none" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-2.5 text-sm whitespace-nowrap transition-colors"
              style={{
                fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? "#7B1113" : "#6B6058",
                borderBottom: tab === t.id ? "2px solid #7B1113" : "2px solid transparent",
                background: "transparent",
              }}>
              {t.id === "athgraph" ? "⚡ AthGraph" : t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ scrollbarWidth: "none" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="flex flex-col gap-6 max-w-4xl">
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Solved",  value: totalSolved, icon: CheckCircle2, color: "#0B6623",  sub: "All platforms" },
                { label: "CF Rating",     value: 1342,        icon: TrendingUp,   color: "#7B1113",  sub: "Pupil · +53 this month" },
                { label: "Day Streak",    value: "7d",        icon: Flame,        color: "#C4820A",  sub: "Best: 14d" },
                { label: "Contests",      value: 6,           icon: Trophy,       color: "#1E3A8A",  sub: "Participated" },
              ].map(({ label, value, icon: Icon, color, sub }) => (
                <div key={label} className="rounded-xl border p-4" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <span style={{ fontSize: 12, color: "#6B6058", fontWeight: 500 }}>{label}</span>
                    <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: color + "14" }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 24, color: "#1A1A1A", lineHeight: 1.2 }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#9A8A80", marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Contribution heatmap */}
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Contribution Graph</h2>
                <span style={{ fontSize: 12, color: "#9A8A80" }}>Last 15 weeks</span>
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {heatmapData.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day, di) => (
                      <div key={`${wi}-${di}`} title={`${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}`}
                        className="w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125"
                        style={{ background: heatColor(day.count) }} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span style={{ fontSize: 11, color: "#9A8A80" }}>Less</span>
                {[0,1,2,3,4].map(n => <div key={n} className="w-3 h-3 rounded-sm" style={{ background: heatColor(n) }} />)}
                <span style={{ fontSize: 11, color: "#9A8A80" }}>More</span>
              </div>
            </div>

            {/* Platforms + Pie side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* CF card */}
              {connected.cf ? (
                <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "#7B111330" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs" style={{ background: "#7B1113", color: "#FFF", fontWeight: 700 }}>CF</span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>Codeforces</span>
                    </div>
                    <CheckCircle2 size={15} style={{ color: "#0B6623" }} />
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#6B6058", marginBottom: 12 }}>@{linkedAccounts.cf.handle}</div>
                  <div className="grid grid-cols-3 gap-2 border-t pt-3" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
                    {[["Rating", linkedAccounts.cf.rating, "#7B1113"], ["Solved", linkedAccounts.cf.solved, "#1A1A1A"], ["Rank", linkedAccounts.cf.rank, "#1A1A1A"]].map(([l, v, c]) => (
                      <div key={String(l)}><div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: c as string }}>{v}</div><div style={{ fontSize: 11, color: "#6B6058" }}>{l}</div></div>
                    ))}
                  </div>
                </div>
              ) : (
                <ConnectCard pid="cf" onConnect={() => setConnected(c => ({ ...c, cf: true }))} />
              )}
              {/* HR card */}
              {connected.hr ? (
                <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "#0B662330" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs" style={{ background: "#0B6623", color: "#FFF", fontWeight: 700 }}>HR</span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>HackerRank</span>
                    </div>
                    <CheckCircle2 size={15} style={{ color: "#0B6623" }} />
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#6B6058", marginBottom: 12 }}>@{linkedAccounts.hr.handle}</div>
                  <div className="grid grid-cols-3 gap-2 border-t pt-3" style={{ borderColor: "rgba(11,102,35,0.08)" }}>
                    {[["Score", linkedAccounts.hr.score, "#0B6623"], ["Solved", linkedAccounts.hr.solved, "#1A1A1A"], ["Level", linkedAccounts.hr.level, "#1A1A1A"]].map(([l, v, c]) => (
                      <div key={String(l)}><div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: c as string }}>{v}</div><div style={{ fontSize: 11, color: "#6B6058" }}>{l}</div></div>
                    ))}
                  </div>
                </div>
              ) : (
                <ConnectCard pid="hr" onConnect={() => setConnected(c => ({ ...c, hr: true }))} />
              )}
            </div>

            {/* Recent problems */}
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Recent Activity</h2>
                <button onClick={() => setTab("problems")} style={{ fontSize: 12, color: "#7B1113", fontWeight: 500 }}>See all →</button>
              </div>
              <div className="flex flex-col gap-2">
                {problems.slice(0, 5).map((p, i) => {
                  const pl = PLATFORMS[p.platform];
                  const diffColor = p.difficulty === "Easy" ? "#0B6623" : p.difficulty === "Medium" ? "#C4820A" : "#EF4444";
                  return (
                    <div key={i} className="flex items-center gap-3 py-2 border-b last:border-b-0" style={{ borderColor: "rgba(123,17,19,0.06)" }}>
                      <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ background: pl.color, color: "#FFF", fontWeight: 700, fontSize: 10 }}>{pl.badge}</span>
                      <span className="flex-1 text-sm" style={{ color: "#1A1A1A", fontWeight: 500 }}>{p.name}</span>
                      {p.rating && <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9A8A80" }}>#{p.rating}</span>}
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: diffColor + "12", color: diffColor, fontWeight: 500 }}>{p.difficulty}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${p.verdict === "AC" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                        {p.verdict === "AC" ? "✓ AC" : "✗ WA"}
                      </span>
                      <span style={{ fontSize: 11, color: "#9A8A80" }}>{p.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ATHGRAPH */}
        {tab === "athgraph" && (
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#7B1113" }}>
                <Activity size={16} style={{ color: "#F5F1E3" }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A1A" }}>AthGraph</h2>
                <p style={{ fontSize: 13, color: "#6B6058" }}>Your complete competitive programming footprint across all platforms.</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs ml-2" style={{ background: "rgba(123,17,19,0.08)", color: "#7B1113", fontWeight: 600 }}>Beta</span>
            </div>

            {/* Unified stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Solved",    value: totalSolved, color: "#0B6623" },
                { label: "CF Rating",       value: 1342,        color: "#7B1113" },
                { label: "HR Score",        value: 1850,        color: "#0B6623" },
                { label: "Topics ≥ Medium", value: `${skillData.filter(s => (s.cf + s.hr) / 2 >= 60).length}/${skillData.length}`, color: "#1E3A8A" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border p-4 text-center" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 26, color, lineHeight: 1.2 }}>{value}</div>
                  <div style={{ fontSize: 12, color: "#6B6058", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Heatmap + pie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>Contribution Graph</h3>
                <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map((day, di) => (
                        <div key={`ag-${wi}-${di}`} title={`${day.date}: ${day.count}`}
                          className="w-3 h-3 rounded-sm cursor-pointer hover:scale-125 transition-transform"
                          style={{ background: heatColor(day.count) }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                <h3 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>Platform Split</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie key="ag-pie" data={platformDist} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                      {platformDist.map((e, i) => <Cell key={`ag-cell-${i}`} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} formatter={(v: number, n: string) => [`${v} problems`, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 mt-1">
                  {platformDist.map(p => (
                    <div key={p.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span style={{ color: "#3A2A22", fontWeight: 500 }}>{p.name}</span>
                      </div>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{p.value} ({Math.round(p.value / totalSolved * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Classroom sync */}
            <div className="rounded-xl border p-5" style={{ background: "#FEF9EE", borderColor: "#C4820A30" }}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={15} style={{ color: "#C4820A" }} />
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#C4820A" }}>Classroom Sync</h3>
              </div>
              <p style={{ fontSize: 13, color: "#5A4A20", marginBottom: 10, lineHeight: 1.6 }}>
                Based on your CF history, here are adaptive suggestions for your active assignments.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Skip intro DP",     desc: "You've solved 18 DP problems. Start from medium-level tasks.", action: "Jump to Medium" },
                  { label: "Strengthen Graphs", desc: "Strong in BFS (88/100). Try Dijkstra variants.", action: "Find Problems" },
                  { label: "Explore Strings",   desc: "Weakest tag. 3 HR problems match this week's syllabus.", action: "View Problems" },
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

        {/* SKILLS */}
        {tab === "skills" && (
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Skill Radar</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={skillData}>
                    <PolarGrid stroke="rgba(123,17,19,0.1)" />
                    <PolarAngleAxis dataKey="topic" tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: "#6B6058" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Codeforces" dataKey="cf" stroke="#7B1113" fill="#7B1113" fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="HackerRank" dataKey="hr" stroke="#0B6623" fill="#0B6623" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 justify-center mt-1">
                  {[["Codeforces", "#7B1113"], ["HackerRank", "#0B6623"]].map(([n, c]) => (
                    <div key={n} className="flex items-center gap-1.5 text-xs" style={{ color: "#6B6058" }}>
                      <div className="w-3 h-1.5 rounded-full" style={{ background: c }} />{n}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Topic Breakdown</h2>
                <div className="flex flex-col gap-4">
                  {skillData.map(s => {
                    const avg = Math.round((s.cf + s.hr) / 2);
                    return (
                      <div key={s.topic}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>{s.topic}</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: strengthColor(avg) + "14", color: strengthColor(avg), fontWeight: 600 }}>{strengthLabel(avg)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[["CF", s.cf, "#7B1113"], ["HR", s.hr, "#0B6623"]].map(([lbl, val, col]) => (
                            <div key={String(lbl)}>
                              <div className="flex justify-between mb-1">
                                <span style={{ fontSize: 11, color: "#9A8A80" }}>{lbl}</span>
                                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{val}/100</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE8D8" }}>
                                <div className="h-full rounded-full" style={{ width: `${val}%`, background: col as string }} />
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
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Combined Score by Topic</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={skillData.map(s => ({ ...s, avg: Math.round((s.cf + s.hr) / 2) }))} layout="vertical">
                  <XAxis type="number" domain={[0,100]} tick={{ fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="topic" tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#3A2A22" }} width={100} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
                  <Bar dataKey="avg" radius={[0,4,4,0]}>
                    {skillData.map((s, i) => <Cell key={`sk-cell-${i}`} fill={strengthColor(Math.round((s.cf + s.hr) / 2))} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* PROBLEMS */}
        {tab === "problems" && (
          <div className="flex flex-col gap-4 max-w-4xl">
            <div className="rounded-xl border p-4 flex flex-wrap gap-3 items-center" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <div className="flex items-center gap-2 flex-1 min-w-40 border-b pb-0" style={{ borderColor: "transparent" }}>
                <Search size={14} style={{ color: "#9A8A80" }} />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search problems…"
                  className="flex-1 text-sm outline-none bg-transparent" style={{ color: "#1A1A1A" }} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["all", "cf", "hr"] as const).map(p => (
                  <button key={p} onClick={() => setPlatformFilter(p)}
                    className="px-3 py-1.5 rounded-md text-xs transition-colors"
                    style={{ background: platformFilter === p ? "#7B1113" : "#EDE8D8", color: platformFilter === p ? "#FFF" : "#3A2A22", fontWeight: 500 }}>
                    {p === "all" ? "All" : PLATFORMS[p].label}
                  </button>
                ))}
                {(["all", "Easy", "Medium", "Hard"] as const).map(d => (
                  <button key={d} onClick={() => setDiffFilter(d)}
                    className="px-3 py-1.5 rounded-md text-xs transition-colors"
                    style={{ background: diffFilter === d ? "#7B1113" : "#EDE8D8", color: diffFilter === d ? "#FFF" : "#3A2A22", fontWeight: 500 }}>
                    {d === "all" ? "All Difficulty" : d}
                  </button>
                ))}
                <button onClick={() => setShowOnlyAC(v => !v)}
                  className="px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors"
                  style={{ background: showOnlyAC ? "#0B6623" : "#EDE8D8", color: showOnlyAC ? "#FFF" : "#3A2A22", fontWeight: 500 }}>
                  <CheckCircle2 size={12} /> AC Only
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap w-full">
                {(["all", ...allTags] as const).map(t => (
                  <button key={t} onClick={() => setTagFilter(t as Tag | "all")}
                    className="px-2.5 py-1 rounded text-xs transition-colors"
                    style={{ background: tagFilter === t ? "#1E3A8A" : "transparent", color: tagFilter === t ? "#FFF" : "#6B6058", border: `1px solid ${tagFilter === t ? "#1E3A8A" : "rgba(123,17,19,0.12)"}`, fontWeight: tagFilter === t ? 600 : 400 }}>
                    {t === "all" ? "All Tags" : t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#6B6058" }}>{filtered.length} problem{filtered.length !== 1 ? "s" : ""}</div>
            <div className="flex flex-col gap-2">
              {filtered.map((prob, i) => {
                const pl = PLATFORMS[prob.platform];
                const dc = prob.difficulty === "Easy" ? "#0B6623" : prob.difficulty === "Medium" ? "#C4820A" : "#EF4444";
                return (
                  <motion.div key={`${prob.name}-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="rounded-xl border p-4 flex items-center gap-4 cursor-pointer transition-colors hover:border-primary/30"
                    style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: pl.color, color: "#FFF", fontWeight: 700, fontSize: 10 }}>{pl.badge}</span>
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{prob.name}</span>
                        {prob.rating && <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9A8A80" }}>#{prob.rating}</span>}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: dc + "14", color: dc, fontWeight: 500 }}>{prob.difficulty}</span>
                        {prob.tags.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: "rgba(30,58,138,0.2)", color: "#1E3A8A", background: "rgba(30,58,138,0.05)" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${prob.verdict === "AC" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                        {prob.verdict === "AC" ? "✓ AC" : "✗ WA"}
                      </span>
                      <span style={{ fontSize: 11, color: "#9A8A80" }}>{prob.date}</span>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12" style={{ color: "#9A8A80" }}>
                  <Code2 size={32} className="mx-auto mb-2 opacity-30" />
                  No problems match your filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {tab === "timeline" && (
          <div className="flex flex-col gap-6 max-w-3xl">
            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Codeforces Rating History</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={ratingTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(123,17,19,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1000,1500]} tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }}
                    formatter={(v: number) => [v, "Rating"]}
                    labelFormatter={(l: string, payload: any[]) => payload?.[0]?.payload?.contest ?? l} />
                  <Line type="monotone" dataKey="rating" stroke="#7B1113" strokeWidth={2.5}
                    dot={{ fill: "#7B1113", r: 5, strokeWidth: 2, stroke: "#FFF" }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Milestones</h2>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: "rgba(123,17,19,0.15)" }} />
                <div className="flex flex-col gap-5">
                  {milestones.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <motion.div key={m.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center gap-4">
                        <div className="absolute left-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: m.color, transform: "translateX(-1px)" }}>
                          <Icon size={9} style={{ color: "#FFF" }} />
                        </div>
                        <div className="flex-1 rounded-lg border p-3" style={{ borderColor: m.color + "20", background: m.color + "06" }}>
                          <div className="flex items-center justify-between">
                            <span style={{ fontWeight: 600, fontSize: 13.5, color: "#1A1A1A" }}>{m.label}</span>
                            <span style={{ fontSize: 12, color: "#9A8A80", fontFamily: "JetBrains Mono, monospace" }}>{m.date}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Weekly Submission Activity</h2>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={[
                  { day: "Mon", n: 3 }, { day: "Tue", n: 7 }, { day: "Wed", n: 2 },
                  { day: "Thu", n: 5 }, { day: "Fri", n: 8 }, { day: "Sat", n: 4 }, { day: "Sun", n: 1 },
                ]}>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
                  <Bar dataKey="n" fill="#7B1113" radius={[4,4,0,0]} name="Submissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
