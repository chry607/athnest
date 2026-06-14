type Verdict = "AC" | "WA" | "TLE" | "RE" | "CE" | "MLE" | "Pending" | "Running";

const config: Record<Verdict, { label: string; className: string }> = {
  AC:      { label: "Accepted",          className: "bg-green-100 text-green-800 border-green-200" },
  WA:      { label: "Wrong Answer",      className: "bg-red-100 text-red-800 border-red-200" },
  TLE:     { label: "Time Limit",        className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  RE:      { label: "Runtime Error",     className: "bg-orange-100 text-orange-800 border-orange-200" },
  CE:      { label: "Compile Error",     className: "bg-purple-100 text-purple-800 border-purple-200" },
  MLE:     { label: "Memory Limit",      className: "bg-blue-100 text-blue-800 border-blue-200" },
  Pending: { label: "Pending",           className: "bg-gray-100 text-gray-600 border-gray-200" },
  Running: { label: "Running…",          className: "bg-indigo-100 text-indigo-700 border-indigo-200 animate-pulse" },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const c = config[verdict] ?? config.Pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-medium ${c.className}`}>
      {verdict === "AC" && <span>✓</span>}
      {c.label}
    </span>
  );
}
