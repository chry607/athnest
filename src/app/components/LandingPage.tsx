import { motion } from "motion/react";
import { CheckCircle2, BookOpen, Zap, BarChart3, ArrowRight, Code2, Users, Clock } from "lucide-react";

interface LandingPageProps {
  onEnter: (page: string) => void;
}

const features = [
  { icon: CheckCircle2, title: "Auto Code Checking", desc: "Codeforces-style verdicts — AC, WA, TLE, RE delivered in seconds with per-test-case granularity.", color: "#0B6623" },
  { icon: BookOpen,     title: "Classroom Assignments", desc: "Create and distribute coding tasks like Google Classroom. Track per-student submission status at a glance.", color: "#7B1113" },
  { icon: Zap,          title: "Real-time Evaluation", desc: "Submissions compile and run against hidden test cases. Live status from queue to verdict.", color: "#C4820A" },
  { icon: BarChart3,    title: "Progress Analytics", desc: "Monitor class performance over time. Rating curves, solved-problem heatmaps, per-topic breakdowns.", color: "#1E3A8A" },
];

const mockSubmissions = [
  { name: "Maria Santos",   problem: "Binary Search",    verdict: "AC",  time: "12ms",  lang: "C++" },
  { name: "Juan dela Cruz", problem: "Fibonacci DP",     verdict: "WA",  time: "—",     lang: "Python" },
  { name: "Ana Reyes",      problem: "Graph BFS",        verdict: "TLE", time: "2001ms",lang: "Java" },
  { name: "Carlos Mendoza", problem: "Binary Search",    verdict: "AC",  time: "8ms",   lang: "C++" },
];

const verdictStyle: Record<string, string> = {
  AC:  "bg-green-100 text-green-700 border-green-200",
  WA:  "bg-red-100 text-red-700 border-red-200",
  TLE: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: "#F5F1E3", scrollbarWidth: "none" }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b" style={{ background: "#7B1113", borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: "#F5F1E3" }}>
            <span style={{ color: "#7B1113", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 14 }}>AN</span>
          </div>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#F5F1E3", letterSpacing: "-0.01em" }}>AthNest</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnter("dashboard")}
            className="px-4 py-2 rounded-md text-sm transition-all"
            style={{ color: "rgba(245,241,227,0.8)", fontFamily: "Inter, sans-serif" }}
          >
            Sign In
          </button>
          <button
            onClick={() => onEnter("teacher")}
            className="px-4 py-2 rounded-md text-sm transition-all"
            style={{ background: "#F5F1E3", color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Teacher Portal
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 lg:px-20 py-20 max-w-7xl mx-auto items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6 border" style={{ background: "rgba(123,17,19,0.07)", borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            <span>🎓</span> University of the Philippines — Diliman
          </div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem,5vw,3.6rem)", lineHeight: 1.1, color: "#1A1A1A", letterSpacing: "-0.02em" }}>
            Competitive<br />Programming<br /><span style={{ color: "#7B1113" }}>for Classrooms.</span>
          </h1>
          <p className="mt-5 max-w-md" style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: "#5A4A42", lineHeight: 1.65 }}>
            A Codeforces-style judge built for academic use — create assignments, auto-grade code, and track student progress in one unified platform.
          </p>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => onEnter("dashboard")}
              className="flex items-center gap-2 px-6 py-3 rounded-md text-sm transition-all hover:opacity-90"
              style={{ background: "#7B1113", color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
            >
              Get Started <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onEnter("problem")}
              className="flex items-center gap-2 px-6 py-3 rounded-md text-sm border transition-all hover:bg-white"
              style={{ borderColor: "rgba(123,17,19,0.3)", color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              <Code2 size={16} /> Try a Problem
            </button>
          </div>
          <div className="flex gap-6 mt-10">
            {[["1,200+", "Students"], ["340+", "Problems"], ["24", "Active Classes"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: "#7B1113" }}>{n}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B6058" }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mock UI */}
        <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <div className="rounded-xl border overflow-hidden shadow-xl" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.15)" }}>
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ background: "#7B1113", borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="w-3 h-3 rounded-full bg-red-400 opacity-70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-70" />
              <div className="w-3 h-3 rounded-full bg-green-400 opacity-70" />
              <span className="ml-2 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(245,241,227,0.6)" }}>athnest.up.edu.ph/problem/P042</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded border" style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>P042</span>
                <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>BMI Classifier</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: "#D1FAE5", color: "#065F46", fontFamily: "Inter, sans-serif" }}>Easy</span>
              </div>
              <p className="text-xs mb-4" style={{ fontFamily: "Inter, sans-serif", color: "#5A4A42", lineHeight: 1.6 }}>
                Given weight (kg) and height (m), compute BMI and output the category: Underweight, Normal, Overweight, or Obese.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[["Sample Input", "70\n1.75"], ["Sample Output", "Normal"]].map(([label, val]) => (
                  <div key={label} className="rounded p-3" style={{ background: "#EDE8D8" }}>
                    <div className="text-xs mb-1" style={{ fontFamily: "Inter, sans-serif", color: "#6B6058", fontWeight: 600 }}>{label}</div>
                    <pre className="text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#1A1A1A" }}>{val}</pre>
                  </div>
                ))}
              </div>
              <div className="rounded p-3 mb-3" style={{ background: "#1A1A2E" }}>
                <pre className="text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#A8E6CF", lineHeight: 1.7 }}>{`#include <iostream>
using namespace std;
int main() {
  double w, h;
  cin >> w >> h;
  double bmi = w/(h*h);
  // ...`}</pre>
              </div>
              <div className="flex items-center gap-2">
                <select className="text-xs px-3 py-1.5 rounded border" style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "Inter, sans-serif" }}>
                  <option>C++17</option>
                </select>
                <button className="ml-auto px-4 py-1.5 rounded text-xs" style={{ background: "#7B1113", color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Submit</button>
              </div>
            </div>
            <div className="px-5 py-3 border-t" style={{ borderColor: "rgba(123,17,19,0.1)" }}>
              <div className="text-xs mb-2" style={{ fontFamily: "Inter, sans-serif", color: "#6B6058", fontWeight: 600 }}>Recent Submissions</div>
              <div className="flex flex-col gap-1.5">
                {mockSubmissions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: "Inter, sans-serif", color: "#3A2A22" }}>{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>{s.time}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${verdictStyle[s.verdict]}`} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{s.verdict}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-8 lg:px-20 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#1A1A1A", letterSpacing: "-0.01em" }}>
            Everything you need for CS education
          </h2>
          <p className="mt-2" style={{ fontFamily: "Inter, sans-serif", color: "#6B6058", fontSize: 16 }}>Built at UP Diliman, designed for every classroom.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl p-5 border"
              style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B6058", lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 lg:px-20 py-16 max-w-7xl mx-auto">
        <div className="rounded-2xl p-10 grid grid-cols-1 lg:grid-cols-3 gap-10" style={{ background: "#7B1113" }}>
          <div className="lg:col-span-1">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,3vw,1.9rem)", color: "#F5F1E3", letterSpacing: "-0.01em" }}>
              How AthNest works
            </h2>
            <p className="mt-3" style={{ fontFamily: "Inter, sans-serif", color: "rgba(245,241,227,0.7)", fontSize: 15, lineHeight: 1.65 }}>
              From problem creation to automatic grading — everything runs in one unified workflow.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", icon: Users, label: "Teacher creates class", desc: "Set up a classroom, add students, configure assignment settings." },
              { step: "02", icon: Code2, label: "Assign problems", desc: "Pick from the problem bank or write your own with custom test cases." },
              { step: "03", icon: CheckCircle2, label: "Auto-graded instantly", desc: "Students submit code. The judge runs it against all test cases and returns a verdict." },
            ].map(({ step, icon: Icon, label, desc }) => (
              <div key={step} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, fontSize: 12, color: "rgba(245,241,227,0.4)" }}>{step}</span>
                  <Icon size={18} style={{ color: "#F5F1E3" }} />
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#F5F1E3" }}>{label}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(245,241,227,0.65)", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 lg:px-20 py-16 max-w-7xl mx-auto text-center">
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#1A1A1A" }}>Ready to transform your CS class?</h2>
        <p className="mt-3 mb-8" style={{ fontFamily: "Inter, sans-serif", color: "#6B6058", fontSize: 16 }}>Join 24 classes already running on AthNest.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onEnter("teacher")}
            className="px-7 py-3 rounded-md text-sm transition-all hover:opacity-90"
            style={{ background: "#7B1113", color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Open Teacher Portal
          </button>
          <button
            onClick={() => onEnter("dashboard")}
            className="px-7 py-3 rounded-md text-sm border transition-all"
            style={{ borderColor: "rgba(123,17,19,0.3)", color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            Student Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-8 lg:px-20 py-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: "rgba(123,17,19,0.12)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#7B1113" }}>
            <span style={{ color: "#F5F1E3", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 10 }}>AN</span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B6058" }}>AthNest · University of the Philippines, Diliman</span>
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9A8A80" }}>© 2026 AthNest. All rights reserved.</span>
      </footer>
    </div>
  );
}
