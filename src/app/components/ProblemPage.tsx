import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Clock, Database, Tag, BarChart2, CheckCircle2, XCircle, ChevronLeft } from "lucide-react";
import { VerdictBadge } from "./VerdictBadge";

const STARTER_CODE: Record<string, string> = {
  "C++17": `#include <iostream>
using namespace std;

int main() {
    double weight, height;
    cin >> weight >> height;

    double bmi = weight / (height * height);

    if (bmi < 18.5)
        cout << "Underweight" << endl;
    else if (bmi < 25.0)
        cout << "Normal" << endl;
    else if (bmi < 30.0)
        cout << "Overweight" << endl;
    else
        cout << "Obese" << endl;

    return 0;
}`,
  Python: `weight = float(input())
height = float(input())

bmi = weight / (height ** 2)

if bmi < 18.5:
    print("Underweight")
elif bmi < 25.0:
    print("Normal")
elif bmi < 30.0:
    print("Overweight")
else:
    print("Obese")`,
  Java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double weight = sc.nextDouble();
        double height = sc.nextDouble();

        double bmi = weight / (height * height);

        if (bmi < 18.5) System.out.println("Underweight");
        else if (bmi < 25.0) System.out.println("Normal");
        else if (bmi < 30.0) System.out.println("Overweight");
        else System.out.println("Obese");
    }
}`,
};

type SubmissionStatus = "idle" | "compiling" | "running" | "done";

const sampleTests = [
  { input: "70\n1.75", expected: "Normal",      result: "Normal",      pass: true },
  { input: "50\n1.70", expected: "Underweight", result: "Underweight", pass: true },
  { input: "90\n1.75", expected: "Overweight",  result: "Overweight",  pass: true },
  { input: "110\n1.75",expected: "Obese",        result: "Obese",       pass: true },
];

interface ProblemPageProps {
  problemId?: string | null;
  onBack?: () => void;
}

export function ProblemPage({ problemId, onBack }: ProblemPageProps) {
  const [lang, setLang] = useState("C++17");
  const [code, setCode] = useState(STARTER_CODE["C++17"]);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [activeTab, setActiveTab] = useState<"statement" | "submissions">("statement");

  function handleLangChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLang(e.target.value);
    setCode(STARTER_CODE[e.target.value] ?? "");
  }

  function handleSubmit() {
    setStatus("compiling");
    setTimeout(() => setStatus("running"), 1200);
    setTimeout(() => setStatus("done"), 2800);
  }

  const statusMessages: Record<SubmissionStatus, string> = {
    idle: "",
    compiling: "Compiling your code…",
    running: "Running test cases (4/4)…",
    done: "",
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left — Problem statement */}
      <div className="flex flex-col border-r overflow-y-auto" style={{ width: 420, flexShrink: 0, borderColor: "rgba(123,17,19,0.12)", scrollbarWidth: "none" }}>
        {/* Problem header */}
        <div className="px-5 py-4 border-b sticky top-0 z-10" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1 text-xs mb-3 transition-opacity hover:opacity-70" style={{ color: "#6B6058", fontFamily: "Inter, sans-serif" }}>
              <ChevronLeft size={13} /> Back to Problems
            </button>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded border" style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 600 }}>P042</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: "#D1FAE5", color: "#065F46", fontWeight: 500 }}>Easy</span>
          </div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A1A", letterSpacing: "-0.01em" }}>BMI Classifier</h1>
          <div className="flex flex-wrap gap-3 mt-2">
            {[{ icon: Clock, label: "1s" }, { icon: Database, label: "256 MB" }, { icon: BarChart2, label: "CS 32" }, { icon: Tag, label: "Implementation" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1 text-xs" style={{ color: "#6B6058" }}>
                <Icon size={12} /> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: "rgba(123,17,19,0.1)" }}>
          {(["statement", "submissions"] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-5 py-2.5 text-xs capitalize transition-colors"
              style={{
                fontWeight: activeTab === t ? 600 : 400,
                color: activeTab === t ? "#7B1113" : "#6B6058",
                borderBottom: activeTab === t ? "2px solid #7B1113" : "2px solid transparent",
                background: "transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "statement" ? (
          <div className="p-5 flex flex-col gap-5">
            <div>
              <h4 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#7B1113" }}>Problem Statement</h4>
              <p className="text-sm leading-relaxed" style={{ color: "#3A2A22" }}>
                Given a person's weight in kilograms and height in meters, compute their Body Mass Index (BMI) and classify it into one of four categories:
              </p>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm" style={{ color: "#3A2A22" }}>
                {[["Underweight", "BMI < 18.5"], ["Normal", "18.5 ≤ BMI < 25.0"], ["Overweight", "25.0 ≤ BMI < 30.0"], ["Obese", "BMI ≥ 30.0"]].map(([cat, range]) => (
                  <li key={cat} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#7B1113" }} />
                    <span style={{ fontWeight: 500 }}>{cat}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B6058" }}>({range})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#3A2A22" }}>
                Formula: <code style={{ fontFamily: "JetBrains Mono, monospace", background: "#EDE8D8", padding: "0 4px", borderRadius: 3 }}>BMI = weight / (height²)</code>
              </p>
            </div>

            <div>
              <h4 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#7B1113" }}>Input Format</h4>
              <p className="text-sm" style={{ color: "#3A2A22" }}>Two lines: weight (kg) then height (m), both as floating point numbers.</p>
            </div>

            <div>
              <h4 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#7B1113" }}>Output Format</h4>
              <p className="text-sm" style={{ color: "#3A2A22" }}>A single line with the classification string.</p>
            </div>

            <div>
              <h4 className="mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#7B1113" }}>Sample Cases</h4>
              <div className="flex flex-col gap-3">
                {sampleTests.slice(0, 2).map((t, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border" style={{ borderColor: "rgba(123,17,19,0.1)" }}>
                    <div className="px-3 py-1.5 text-xs border-b" style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.1)", color: "#7B1113", fontWeight: 600 }}>
                      Sample {i + 1}
                    </div>
                    <div className="grid grid-cols-2">
                      {[["Input", t.input], ["Output", t.expected]].map(([label, val]) => (
                        <div key={label} className="p-3">
                          <div className="text-xs mb-1" style={{ color: "#9A8A80", fontWeight: 500 }}>{label}</div>
                          <pre className="text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#1A1A1A" }}>{val}</pre>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-4 border" style={{ background: "#FEF9EE", borderColor: "#C4820A30" }}>
              <h4 className="mb-1 text-xs" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#C4820A" }}>Constraints</h4>
              <ul className="text-xs flex flex-col gap-1" style={{ fontFamily: "JetBrains Mono, monospace", color: "#5A4A20" }}>
                <li>1 ≤ weight ≤ 500</li>
                <li>0.5 ≤ height ≤ 3.0</li>
                <li>Time limit: 1 second</li>
                <li>Memory limit: 256 MB</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex flex-col gap-2">
              {[
                { id: "#5821", verdict: "AC" as const, time: "12ms", memory: "3.2 MB", lang: "C++17", when: "Today, 10:23 AM" },
                { id: "#5780", verdict: "WA" as const, time: "—",    memory: "—",      lang: "C++17", when: "Yesterday, 4:12 PM" },
                { id: "#5741", verdict: "TLE" as const,time: "1001ms",memory: "—",     lang: "Python",when: "Jun 11, 9:05 AM" },
              ].map(s => (
                <div key={s.id} className="rounded-lg border p-3 hover:border-primary/30 cursor-pointer transition-colors" style={{ borderColor: "rgba(123,17,19,0.1)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#6B6058" }}>{s.id}</span>
                    <VerdictBadge verdict={s.verdict} />
                  </div>
                  <div className="flex gap-3 text-xs" style={{ color: "#9A8A80" }}>
                    <span>{s.lang}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{s.time}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{s.memory}</span>
                    <span className="ml-auto">{s.when}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right — Editor + Results */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Editor toolbar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ background: "#2A2A3E", borderColor: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div className="flex items-center gap-1.5">
            {["#EF4444", "#FACC15", "#22C55E"].map(c => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
            ))}
          </div>
          <select
            value={lang}
            onChange={handleLangChange}
            className="ml-auto text-xs px-3 py-1 rounded border appearance-none"
            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.1)", color: "#A8E6CF", fontFamily: "JetBrains Mono, monospace" }}
          >
            {["C++17", "Python", "Java"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button
            onClick={handleSubmit}
            disabled={status !== "idle" && status !== "done"}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs transition-all disabled:opacity-60"
            style={{ background: "#7B1113", color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            <Play size={13} />
            {status === "idle" || status === "done" ? "Submit" : "Judging…"}
          </button>
        </div>

        {/* Code area */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#1A1A2E", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full h-full resize-none outline-none p-5 text-sm"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              lineHeight: 1.7,
              color: "#A8E6CF",
              background: "transparent",
              minHeight: "100%",
            }}
            spellCheck={false}
          />
        </div>

        {/* Bottom panel */}
        <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#22223A", flexShrink: 0 }}>
          <AnimatePresence>
            {status !== "idle" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {(status === "compiling" || status === "running") && (
                  <div className="px-5 py-4 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: "#7B1113 transparent transparent transparent" }} />
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "#A8E6CF" }}>
                      {statusMessages[status]}
                    </span>
                  </div>
                )}
                {status === "done" && (
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 size={20} className="text-green-400" />
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#22C55E" }}>Accepted</span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>4/4 test cases passed</span>
                      <span className="ml-auto" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>12ms · 3.2 MB</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {sampleTests.map((t, i) => (
                        <div key={i} className="rounded-lg p-2.5 border" style={{ background: t.pass ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", borderColor: t.pass ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)" }}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Test {i + 1}</span>
                            {t.pass ? <CheckCircle2 size={13} className="text-green-400" /> : <XCircle size={13} className="text-red-400" />}
                          </div>
                          <pre style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{t.expected}</pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="px-5 py-2 flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <span>{lang}</span>
            <span>·</span>
            <span>{code.split("\n").length} lines</span>
            <span>·</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
