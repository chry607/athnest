import { useState } from "react";
import { motion } from "motion/react";
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const globalRankings = [
  { rank: 1,  name: "Carlos Mendoza",  studentId: "2021-00004", rating: 1842, change: +45, solved: 214, country: "🇵🇭" },
  { rank: 2,  name: "Ana Reyes",       studentId: "2021-00003", rating: 1791, change: +12, solved: 198, country: "🇵🇭" },
  { rank: 3,  name: "Maria Santos",    studentId: "2021-00001", rating: 1756, change: -8,  solved: 187, country: "🇵🇭" },
  { rank: 4,  name: "Jose Bautista",   studentId: "2020-00018", rating: 1704, change: +31, solved: 172, country: "🇵🇭" },
  { rank: 5,  name: "Luisa dela Cruz", studentId: "2022-00072", rating: 1688, change: +5,  solved: 165, country: "🇵🇭" },
  { rank: 6,  name: "Ramon Torres",    studentId: "2021-00091", rating: 1651, change: -22, solved: 158, country: "🇵🇭" },
  { rank: 7,  name: "Elena Garcia",    studentId: "2022-00011", rating: 1623, change: +19, solved: 143, country: "🇵🇭" },
  { rank: 8,  name: "Miguel Ramos",    studentId: "2020-00054", rating: 1598, change: +3,  solved: 139, country: "🇵🇭" },
  { rank: 9,  name: "Sofia Lim",       studentId: "2021-00033", rating: 1571, change: -5,  solved: 128, country: "🇵🇭" },
  { rank: 10, name: "Juan dela Cruz",  studentId: "2021-00002", rating: 1548, change: +8,  solved: 121, country: "🇵🇭" },
  { rank: 11, name: "Tomas Villanueva",studentId: "2022-00055", rating: 1512, change: +15, solved: 114, country: "🇵🇭" },
  { rank: 12, name: "Rosa Gonzales",   studentId: "2021-00077", rating: 1489, change: -11, solved: 108, country: "🇵🇭" },
];

const classRankings = [
  { rank: 1, name: "Carlos Mendoza",  rating: 1342, change: +53, solved: 84 },
  { rank: 2, name: "Ana Reyes",       rating: 1298, change: +21, solved: 71 },
  { rank: 3, name: "Maria Santos",    rating: 1251, change: -8,  solved: 65 },
  { rank: 4, name: "Jose Bautista",   rating: 1204, change: +18, solved: 58 },
  { rank: 5, name: "Luisa dela Cruz", rating: 1182, change: +5,  solved: 52 },
];

const ratingHistory = [
  { round: "R1", carlos: 1100, ana: 1050, maria: 1200 },
  { round: "R2", carlos: 1180, ana: 1120, maria: 1170 },
  { round: "R3", carlos: 1250, ana: 1195, maria: 1220 },
  { round: "R4", carlos: 1290, ana: 1240, maria: 1208 },
  { round: "R5", carlos: 1342, ana: 1298, maria: 1251 },
];

const ratingTiers = [
  { name: "Grandmaster",   min: 2400, color: "#EF4444" },
  { name: "International Master", min: 2100, color: "#F97316" },
  { name: "Master",        min: 1900, color: "#F59E0B" },
  { name: "Candidate Master", min: 1600, color: "#A855F7" },
  { name: "Expert",        min: 1400, color: "#3B82F6" },
  { name: "Pupil",         min: 1200, color: "#22C55E" },
  { name: "Newbie",        min: 0,    color: "#6B7280" },
];

function getTier(rating: number) {
  return ratingTiers.find(t => rating >= t.min) ?? ratingTiers[ratingTiers.length - 1];
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={16} style={{ color: "#F59E0B" }} />;
  if (rank === 2) return <Medal size={16} style={{ color: "#9CA3AF" }} />;
  if (rank === 3) return <Medal size={16} style={{ color: "#C4820A" }} />;
  return <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#9A8A80", fontWeight: 500 }}>{rank}</span>;
}

export function RankingsPage() {
  const [tab, setTab] = useState<"global" | "class">("global");
  const rankings = tab === "global" ? globalRankings : classRankings.map(r => ({ ...r, studentId: "CS 32", country: "🎓" }));

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 24, color: "#1A1A1A", letterSpacing: "-0.01em" }}>Rankings</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B6058", marginTop: 2 }}>Leaderboard updated after every contest round</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { ...globalRankings[1], podium: 2, h: "h-24" },
          { ...globalRankings[0], podium: 1, h: "h-32" },
          { ...globalRankings[2], podium: 3, h: "h-20" },
        ].map((r, i) => {
          const tier = getTier(r.rating);
          const isFirst = r.podium === 1;
          return (
            <motion.div
              key={r.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm border-2"
                style={{
                  background: isFirst ? "#7B1113" : "#EDE8D8",
                  borderColor: isFirst ? "#7B1113" : "rgba(123,17,19,0.2)",
                  color: isFirst ? "#FFF" : "#1A1A1A",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                }}
              >
                {r.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="text-center">
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1A1A" }}>{r.name.split(" ")[0]}</div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: tier.color, fontWeight: 600 }}>{r.rating}</div>
              </div>
              <div
                className={`w-full rounded-t-lg flex items-end justify-center pb-2 ${r.h}`}
                style={{ background: isFirst ? "#7B1113" : r.podium === 2 ? "#EDE8D8" : "#E8E4D6" }}
              >
                <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 20, color: isFirst ? "#FFF" : "#9A8A80" }}>#{r.podium}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rating chart */}
      <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A", marginBottom: 12 }}>Rating Trends — Top 3</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={ratingHistory}>
            <XAxis dataKey="round" tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} />
            <YAxis domain={[1000, 1450]} tick={{ fontSize: 12, fontFamily: "Inter, sans-serif", fill: "#9A8A80" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ background: "#FDFAF2", border: "1px solid rgba(123,17,19,0.15)", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
            <Line type="monotone" dataKey="carlos" name="C. Mendoza" stroke="#7B1113" strokeWidth={2} dot={{ r: 3, fill: "#7B1113" }} />
            <Line type="monotone" dataKey="ana"    name="A. Reyes"   stroke="#0B6623" strokeWidth={2} dot={{ r: 3, fill: "#0B6623" }} />
            <Line type="monotone" dataKey="maria"  name="M. Santos"  stroke="#1E3A8A" strokeWidth={2} dot={{ r: 3, fill: "#1E3A8A" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        <div className="flex border-b px-5" style={{ borderColor: "rgba(123,17,19,0.1)" }}>
          {(["global", "class"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2.5 text-sm capitalize transition-colors"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "#7B1113" : "#6B6058",
                borderBottom: tab === t ? "2px solid #7B1113" : "2px solid transparent",
                background: "transparent",
              }}
            >
              {t === "global" ? "Global Leaderboard" : "Class — CS 32"}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(123,17,19,0.08)" }}>
                {["#", "Student", "Rating", "Change", "Solved", "Tier"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs" style={{ color: "#9A8A80", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankings.map((r, i) => {
                const tier = getTier(r.rating);
                return (
                  <motion.tr
                    key={r.rank}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b hover:bg-secondary/30 transition-colors"
                    style={{ borderColor: "rgba(123,17,19,0.06)", background: r.rank <= 3 ? `${r.rank === 1 ? "#7B1113" : "#EDE8D8"}18` : "transparent" }}
                  >
                    <td className="py-3 px-4 w-12">
                      <div className="flex items-center justify-center w-6"><RankIcon rank={r.rank} /></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: r.rank === 1 ? "#7B1113" : "#EDE8D8", color: r.rank === 1 ? "#FFF" : "#1A1A1A", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                          {r.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1A1A1A" }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: "#9A8A80", fontFamily: "JetBrains Mono, monospace" }}>{(r as any).studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 14, color: tier.color }}>{r.rating}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-sm" style={{ color: r.change > 0 ? "#0B6623" : r.change < 0 ? "#EF4444" : "#9A8A80", fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
                        {r.change > 0 ? <TrendingUp size={13} /> : r.change < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                        {r.change > 0 ? `+${r.change}` : r.change}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#1A1A1A", fontWeight: 500 }}>{r.solved}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${tier.color}18`, color: tier.color, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{tier.name}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rating tier legend */}
      <div className="rounded-xl border p-5" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
        <h3 className="mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>Rating Tiers</h3>
        <div className="flex flex-wrap gap-2">
          {ratingTiers.map(t => (
            <div key={t.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${t.color}14` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: t.color, fontWeight: 600 }}>{t.name}</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9A8A80" }}>≥{t.min}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
