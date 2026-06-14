import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight, Shield, GraduationCap, BookOpen, CheckCircle2 } from "lucide-react";

type Role = "student" | "teacher";

interface LoginPageProps {
  onLogin: (role: Role) => void;
  onViewLanding: () => void;
}

const STUDENT_CREDS = { email: "maria.santos@up.edu.ph",    password: "student123" };
const TEACHER_CREDS = { email: "r.reyes@up.edu.ph",         password: "teacher123" };

const highlights = [
  { icon: Shield,        text: "Codeforces-style auto judge" },
  { icon: BookOpen,      text: "Google Classroom-style assignments" },
  { icon: GraduationCap,text: "Submission Policy Rules Engine" },
  { icon: CheckCircle2,  text: "AthGraph — unified CP profile" },
];

export function LoginPage({ onLogin, onViewLanding }: LoginPageProps) {
  const [role, setRole]         = useState<Role>("student");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function fillDemo() {
    const creds = role === "student" ? STUDENT_CREDS : TEACHER_CREDS;
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const creds = role === "student" ? STUDENT_CREDS : TEACHER_CREDS;
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (email === creds.email && password === creds.password) {
        onLogin(role);
      } else {
        setError("Invalid credentials. Use the demo fill button below.");
        setLoading(false);
      }
    }, 900);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2" style={{ background: "#F5F1E3" }}>

      {/* Left — Branding panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden" style={{ background: "#7B1113" }}>
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #FFF 0, #FFF 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FFF, transparent)", transform: "translate(30%, 30%)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F5F1E3" }}>
              <span style={{ color: "#7B1113", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 16 }}>AN</span>
            </div>
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: "#F5F1E3", letterSpacing: "-0.01em" }}>AthNest</span>
          </div>

          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", color: "#F5F1E3", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Competitive<br />Programming<br />for Every<br />Classroom.
          </h1>
          <p className="mt-5 max-w-sm" style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "rgba(245,241,227,0.7)", lineHeight: 1.65 }}>
            The academic judge built at UP Diliman — where learning meets competitive programming rigor.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="relative z-10 flex flex-col gap-3">
          {highlights.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(245,241,227,0.1)" }}>
                <Icon size={15} style={{ color: "rgba(245,241,227,0.8)" }} />
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(245,241,227,0.75)" }}>{text}</span>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(245,241,227,0.12)" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(245,241,227,0.4)" }}>
              University of the Philippines, Diliman · Department of Computer Science
            </span>
          </div>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: "#7B1113" }}>
            <span style={{ color: "#F5F1E3", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 13 }}>AN</span>
          </div>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#1A1A1A" }}>AthNest</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <div className="mb-7">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 26, color: "#1A1A1A", letterSpacing: "-0.01em" }}>
              Sign in
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B6058", marginTop: 4 }}>
              Welcome back. Use your UP email to continue.
            </p>
          </div>

          {/* Role selector */}
          <div className="rounded-xl p-1 mb-6 grid grid-cols-2 gap-1" style={{ background: "#EDE8D8" }}>
            {(["student", "teacher"] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(""); setEmail(""); setPassword(""); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all capitalize"
                style={{
                  background: role === r ? "#7B1113" : "transparent",
                  color: role === r ? "#FFF" : "#6B6058",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: role === r ? 600 : 400,
                }}
              >
                {r === "student" ? <BookOpen size={15} /> : <GraduationCap size={15} />}
                {r === "student" ? "Student" : "Teacher"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                UP Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder={role === "student" ? "yourname@up.edu.ph" : "faculty@up.edu.ph"}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: "#FDFAF2",
                  borderColor: error ? "#EF444460" : "rgba(123,17,19,0.18)",
                  color: "#1A1A1A",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs" style={{ color: "#6B6058", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>Password</label>
                <button type="button" className="text-xs" style={{ color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all pr-11"
                  style={{
                    background: "#FDFAF2",
                    borderColor: error ? "#EF444460" : "rgba(123,17,19,0.18)",
                    color: "#1A1A1A",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9A8A80" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg px-3 py-2.5 text-xs"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#B91C1C", fontFamily: "Inter, sans-serif", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70 mt-1"
              style={{ background: "#7B1113", color: "#FFF", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 15 }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ArrowRight size={16} /> Sign In</>
              )}
            </button>
          </form>

          {/* Demo fill */}
          <div className="mt-4 rounded-xl border border-dashed p-4" style={{ borderColor: "rgba(123,17,19,0.2)" }}>
            <div className="text-xs mb-2" style={{ color: "#9A8A80", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
              Demo Credentials — {role === "student" ? "Student" : "Teacher"} Account
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <code className="text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>
                {role === "student" ? STUDENT_CREDS.email : TEACHER_CREDS.email}
              </code>
              <code className="text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#6B6058" }}>
                {role === "student" ? STUDENT_CREDS.password : TEACHER_CREDS.password}
              </code>
            </div>
            <button
              onClick={fillDemo}
              className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-secondary w-full"
              style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              Fill demo credentials
            </button>
          </div>

          {/* Landing link */}
          <div className="mt-6 text-center">
            <button
              onClick={onViewLanding}
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "#6B6058", fontFamily: "Inter, sans-serif" }}
            >
              Learn more about AthNest →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
