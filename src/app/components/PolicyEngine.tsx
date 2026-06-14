import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2, Circle, ChevronRight, ChevronDown, AlertTriangle,
  Shield, EyeOff, Zap, BookOpen, Code2, FileCode, Cpu,
  Plus, Minus, Info, Lock, Eye, AlertCircle, Terminal,
  ClipboardList, Settings2, Play, Check, Copy,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type EnforcementMode = "warning" | "strict" | "hidden";

interface Rule {
  id: string;
  label: string;
  category: string;
  enabled: boolean;
  mode: EnforcementMode;
}

interface LangConfig {
  id: string;
  enabled: boolean;
  rules: Rule[];
}

type LangId = "python" | "cpp" | "c" | "java" | "javascript" | "typescript" | "riscv";

// ─── Static data ─────────────────────────────────────────────────────────────

const LANGUAGES: { id: LangId; label: string; icon: string; color: string; ext: string }[] = [
  { id: "python",     label: "Python",          icon: "🐍", color: "#3B82F6", ext: ".py"  },
  { id: "cpp",        label: "C++",             icon: "⚙️", color: "#7B1113", ext: ".cpp" },
  { id: "c",          label: "C",               icon: "🔧", color: "#5A0C0E", ext: ".c"   },
  { id: "java",       label: "Java",            icon: "☕", color: "#C4820A", ext: ".java"},
  { id: "javascript", label: "JavaScript",      icon: "🌐", color: "#EAB308", ext: ".js"  },
  { id: "typescript", label: "TypeScript",      icon: "📘", color: "#1E3A8A", ext: ".ts"  },
  { id: "riscv",      label: "RISC-V Assembly", icon: "⚡", color: "#6D4C41", ext: ".s"   },
];

const LANGUAGE_RULES: Record<LangId, Omit<Rule, "enabled" | "mode">[]> = {
  python: [
    { id: "no_for",           label: "No for loops",             category: "Control Flow" },
    { id: "no_while",         label: "No while loops",           category: "Control Flow" },
    { id: "no_comprehension", label: "No list comprehensions",   category: "Control Flow" },
    { id: "no_recursion",     label: "No recursion",             category: "Control Flow" },
    { id: "no_builtin_sort",  label: "No built-in sort()",       category: "Built-ins" },
    { id: "no_imports",       label: "No import statements",     category: "Imports" },
    { id: "no_math",          label: "No math library",          category: "Imports" },
    { id: "no_itertools",     label: "No itertools library",     category: "Imports" },
    { id: "no_lambda",        label: "No lambda expressions",    category: "Functional" },
  ],
  cpp: [
    { id: "no_stl",           label: "No STL (vector, map, set)", category: "Libraries" },
    { id: "no_algorithm",     label: "No <algorithm> header",     category: "Libraries" },
    { id: "no_iostream",      label: "No <iostream> header",      category: "Libraries" },
    { id: "no_for",           label: "No for loops",              category: "Control Flow" },
    { id: "no_while",         label: "No while loops",            category: "Control Flow" },
    { id: "no_recursion",     label: "No recursion",              category: "Control Flow" },
    { id: "no_pointers",      label: "No pointers (beginner mode)", category: "Memory" },
    { id: "no_dynamic_alloc", label: "No dynamic allocation (new/delete)", category: "Memory" },
    { id: "no_templates",     label: "No templates",              category: "Advanced" },
  ],
  c: [
    { id: "no_for",           label: "No for loops",              category: "Control Flow" },
    { id: "no_while",         label: "No while loops",            category: "Control Flow" },
    { id: "no_recursion",     label: "No recursion",              category: "Control Flow" },
    { id: "no_pointers",      label: "No pointers",               category: "Memory" },
    { id: "no_malloc",        label: "No malloc/free",            category: "Memory" },
    { id: "no_stdio",         label: "No stdio.h",                category: "Libraries" },
    { id: "no_stdlib",        label: "No stdlib.h",               category: "Libraries" },
    { id: "no_goto",          label: "No goto statement",         category: "Control Flow" },
  ],
  java: [
    { id: "no_for",           label: "No for loops",              category: "Control Flow" },
    { id: "no_while",         label: "No while loops",            category: "Control Flow" },
    { id: "no_recursion",     label: "No recursion",              category: "Control Flow" },
    { id: "no_collections",   label: "No Collections framework",  category: "Libraries" },
    { id: "no_arrays_sort",   label: "No Arrays.sort()",          category: "Built-ins" },
    { id: "no_stream",        label: "No Stream API",             category: "Functional" },
    { id: "no_lambda",        label: "No lambda expressions",     category: "Functional" },
    { id: "no_generics",      label: "No generics",               category: "Advanced" },
    { id: "no_multi_class",   label: "Single class only",         category: "Structure" },
  ],
  javascript: [
    { id: "no_for",           label: "No for / for-of / for-in",  category: "Control Flow" },
    { id: "no_while",         label: "No while loops",            category: "Control Flow" },
    { id: "no_foreach",       label: "No forEach()",              category: "Control Flow" },
    { id: "no_array_map",     label: "No .map()",                 category: "Array Methods" },
    { id: "no_array_filter",  label: "No .filter()",             category: "Array Methods" },
    { id: "no_array_reduce",  label: "No .reduce()",             category: "Array Methods" },
    { id: "no_async",         label: "No async/await",            category: "Advanced" },
    { id: "no_promise",       label: "No Promises",              category: "Advanced" },
    { id: "no_recursion",     label: "No recursion",             category: "Control Flow" },
  ],
  typescript: [
    { id: "no_for",           label: "No for loops",             category: "Control Flow" },
    { id: "no_while",         label: "No while loops",           category: "Control Flow" },
    { id: "no_any",           label: "No any type",              category: "Type Safety" },
    { id: "no_generics",      label: "No generics",              category: "Advanced" },
    { id: "no_async",         label: "No async/await",           category: "Advanced" },
    { id: "no_array_map",     label: "No .map()",                category: "Array Methods" },
    { id: "no_array_filter",  label: "No .filter()",            category: "Array Methods" },
    { id: "no_recursion",     label: "No recursion",            category: "Control Flow" },
  ],
  riscv: [
    { id: "no_pseudo",        label: "No pseudo-instructions (li, la, mv…)", category: "Instructions" },
    { id: "no_float",         label: "No floating-point instructions",        category: "Instructions" },
    { id: "no_mul_div",       label: "No multiply/divide (mul, div)",         category: "Instructions" },
    { id: "no_mem_access",    label: "No memory access (lw, sw, lb, sb)",     category: "Memory" },
    { id: "no_ecall",         label: "No ecall / system calls",               category: "System" },
    { id: "no_jump",          label: "No unconditional jumps (j, jal)",       category: "Control Flow" },
    { id: "base_only",        label: "Base ISA only (RV32I subset)",           category: "Instructions" },
  ],
};

const PRESETS: {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
  langs: LangId[];
  rules: Partial<Record<LangId, string[]>>;
  mode: EnforcementMode;
  singleLang?: LangId;
}[] = [
  {
    id: "recursion",
    name: "Recursion Training",
    icon: "🔁",
    desc: "All loops disabled — forces recursive solutions. Ideal for teaching divide-and-conquer.",
    color: "#7B1113",
    langs: ["python", "cpp", "java"],
    rules: {
      python: ["no_for", "no_while", "no_comprehension"],
      cpp:    ["no_for", "no_while"],
      java:   ["no_for", "no_while"],
    },
    mode: "strict",
  },
  {
    id: "beginner",
    name: "Beginner Mode",
    icon: "🔰",
    desc: "No STL, no libraries, no advanced constructs. Clean fundamentals only.",
    color: "#0B6623",
    langs: ["python", "cpp", "c"],
    rules: {
      python: ["no_imports", "no_lambda", "no_comprehension", "no_builtin_sort"],
      cpp:    ["no_stl", "no_algorithm", "no_templates", "no_dynamic_alloc"],
      c:      ["no_pointers", "no_malloc"],
    },
    mode: "warning",
  },
  {
    id: "algorithm",
    name: "Algorithm Focus",
    icon: "🧠",
    desc: "No built-in sorting or utility helpers. Students must implement algorithms from scratch.",
    color: "#1E3A8A",
    langs: ["python", "cpp", "java"],
    rules: {
      python: ["no_builtin_sort", "no_itertools", "no_math"],
      cpp:    ["no_algorithm", "no_stl"],
      java:   ["no_arrays_sort", "no_collections", "no_stream"],
    },
    mode: "strict",
  },
  {
    id: "exam",
    name: "Exam Mode",
    icon: "⚡",
    desc: "Hidden rules, strict enforcement, single language only. For high-stakes assessments.",
    color: "#6D4C41",
    langs: ["python"],
    rules: {
      python: ["no_imports", "no_math", "no_itertools", "no_builtin_sort"],
    },
    mode: "hidden",
    singleLang: "python",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildDefaultLangConfig(id: LangId): LangConfig {
  return {
    id,
    enabled: false,
    rules: LANGUAGE_RULES[id].map(r => ({ ...r, enabled: false, mode: "strict" })),
  };
}

function initConfigs(): Record<LangId, LangConfig> {
  const out = {} as Record<LangId, LangConfig>;
  LANGUAGES.forEach(l => { out[l.id] = buildDefaultLangConfig(l.id); });
  return out;
}

const MODE_META: Record<EnforcementMode, { label: string; color: string; bg: string; icon: typeof Shield; desc: string }> = {
  warning: { label: "Warning",  color: "#C4820A", bg: "rgba(196,130,10,0.08)",  icon: AlertTriangle, desc: "Code accepted · student receives feedback" },
  strict:  { label: "Strict",   color: "#7B1113", bg: "rgba(123,17,19,0.08)",   icon: Shield,        desc: "Submission rejected if rule is violated"  },
  hidden:  { label: "Hidden",   color: "#6D4C41", bg: "rgba(109,76,65,0.1)",    icon: EyeOff,        desc: "Rules not visible to students (exam use)" },
};

const STEPS = [
  { id: 1, label: "Details",     icon: ClipboardList },
  { id: 2, label: "Languages",   icon: Code2 },
  { id: 3, label: "Policy Rules",icon: Shield },
  { id: 4, label: "Templates",   icon: Zap },
  { id: 5, label: "Review",      icon: CheckCircle2 },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepHeader({ step, total, title, desc }: { step: number; total: number; title: string; desc: string }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9A8A80" }}>Step {step} of {total}</span>
        <div className="flex-1 h-px" style={{ background: "rgba(123,17,19,0.1)" }} />
      </div>
      <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "#1A1A1A", letterSpacing: "-0.01em" }}>{title}</h2>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B6058", marginTop: 4 }}>{desc}</p>
    </div>
  );
}

function ModeSelector({ value, onChange }: { value: EnforcementMode; onChange: (m: EnforcementMode) => void }) {
  return (
    <div className="flex gap-1.5">
      {(Object.entries(MODE_META) as [EnforcementMode, typeof MODE_META.strict][]).map(([mode, meta]) => {
        const Icon = meta.icon;
        const active = value === mode;
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all"
            style={{
              background: active ? meta.bg : "transparent",
              color: active ? meta.color : "#9A8A80",
              border: `1px solid ${active ? meta.color + "40" : "rgba(123,17,19,0.12)"}`,
              fontWeight: active ? 600 : 400,
            }}
            title={meta.desc}
          >
            <Icon size={12} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

function RuleRow({ rule, onToggle, onModeChange }: {
  rule: Rule;
  onToggle: () => void;
  onModeChange: (m: EnforcementMode) => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all"
      style={{
        background: rule.enabled ? MODE_META[rule.mode].bg : "transparent",
        borderColor: rule.enabled ? MODE_META[rule.mode].color + "30" : "rgba(123,17,19,0.08)",
      }}
    >
      <button onClick={onToggle} className="shrink-0">
        {rule.enabled
          ? <CheckCircle2 size={16} style={{ color: MODE_META[rule.mode].color }} />
          : <Circle size={16} style={{ color: "#C8C0B0" }} />}
      </button>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: rule.enabled ? "#1A1A1A" : "#9A8A80", fontWeight: rule.enabled ? 500 : 400, flex: 1 }}>
        {rule.label}
      </span>
      <span className="text-xs px-2 py-0.5 rounded shrink-0" style={{ background: "#EDE8D8", color: "#6B6058", fontFamily: "Inter, sans-serif" }}>
        {rule.category}
      </span>
      {rule.enabled && (
        <div className="shrink-0">
          <ModeSelector value={rule.mode} onChange={onModeChange} />
        </div>
      )}
    </div>
  );
}

function LangRulePanel({ lang, config, onChange }: {
  lang: typeof LANGUAGES[0];
  config: LangConfig;
  onChange: (c: LangConfig) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [globalMode, setGlobalMode] = useState<EnforcementMode>("strict");

  const enabledCount = config.rules.filter(r => r.enabled).length;
  const categories = [...new Set(config.rules.map(r => r.category))];

  function toggleRule(ruleId: string) {
    onChange({
      ...config,
      rules: config.rules.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r),
    });
  }

  function setRuleMode(ruleId: string, mode: EnforcementMode) {
    onChange({
      ...config,
      rules: config.rules.map(r => r.id === ruleId ? { ...r, mode } : r),
    });
  }

  function applyGlobalMode(mode: EnforcementMode) {
    setGlobalMode(mode);
    onChange({
      ...config,
      rules: config.rules.map(r => r.enabled ? { ...r, mode } : r),
    });
  }

  function enableAll() {
    onChange({ ...config, rules: config.rules.map(r => ({ ...r, enabled: true, mode: globalMode })) });
  }
  function disableAll() {
    onChange({ ...config, rules: config.rules.map(r => ({ ...r, enabled: false })) });
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: lang.color + "30" }}>
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
        style={{ background: lang.color + "0D" }}
        onClick={() => setExpanded(e => !e)}
      >
        <span style={{ fontSize: 18 }}>{lang.icon}</span>
        <div className="flex-1">
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14.5, color: "#1A1A1A" }}>{lang.label}</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B6058" }}>
            {enabledCount === 0 ? "No restrictions configured" : `${enabledCount} restriction${enabledCount !== 1 ? "s" : ""} active`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {enabledCount > 0 && (
            <span className="px-2 py-0.5 rounded text-xs" style={{ background: lang.color + "18", color: lang.color, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
              {enabledCount}/{config.rules.length}
            </span>
          )}
          <ChevronDown size={16} style={{ color: "#9A8A80", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </button>

      {expanded && (
        <div className="px-5 py-4" style={{ background: "#FDFAF2" }}>
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B6058", fontWeight: 500 }}>Bulk mode:</span>
            <ModeSelector value={globalMode} onChange={applyGlobalMode} />
            <div className="ml-auto flex gap-2">
              <button onClick={enableAll}  className="text-xs px-3 py-1.5 rounded border transition-colors" style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 500 }}>Enable all</button>
              <button onClick={disableAll} className="text-xs px-3 py-1.5 rounded border transition-colors" style={{ borderColor: "rgba(123,17,19,0.1)", color: "#9A8A80" }}>Clear all</button>
            </div>
          </div>

          {/* Rules by category */}
          <div className="flex flex-col gap-5">
            {categories.map(cat => (
              <div key={cat}>
                <div className="text-xs mb-2 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif", color: "#9A8A80", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <div className="h-px flex-1" style={{ background: "rgba(123,17,19,0.08)" }} />
                  {cat}
                  <div className="h-px flex-1" style={{ background: "rgba(123,17,19,0.08)" }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  {config.rules.filter(r => r.category === cat).map(rule => (
                    <RuleRow
                      key={rule.id}
                      rule={rule}
                      onToggle={() => toggleRule(rule.id)}
                      onModeChange={mode => setRuleMode(rule.id, mode)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface Details {
  title: string;
  course: string;
  due: string;
  timeLimit: string;
  memLimit: string;
}

export function PolicyEngine({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<Details>({ title: "", course: "CS 32", due: "", timeLimit: "1", memLimit: "256" });
  const [configs, setConfigs]   = useState(initConfigs);
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  const selectedLangs = LANGUAGES.filter(l => configs[l.id].enabled);
  const isSingleLang  = selectedLangs.length === 1;

  function toggleLang(id: LangId) {
    setConfigs(c => ({ ...c, [id]: { ...c[id], enabled: !c[id].enabled } }));
    setAppliedPreset(null);
  }

  function updateConfig(id: LangId, next: LangConfig) {
    setConfigs(c => ({ ...c, [id]: next }));
  }

  function applyPreset(preset: typeof PRESETS[0]) {
    setAppliedPreset(preset.id);
    const next = initConfigs();
    preset.langs.forEach(lid => {
      next[lid].enabled = true;
      const ruleIds = preset.rules[lid] ?? [];
      next[lid].rules = next[lid].rules.map(r => ({
        ...r,
        enabled: ruleIds.includes(r.id),
        mode: preset.mode,
      }));
    });
    setConfigs(next);
  }

  // Validation summary data
  const summaryRules = useMemo(() => {
    const out: { lang: string; rule: string; mode: EnforcementMode; icon: string }[] = [];
    selectedLangs.forEach(l => {
      configs[l.id].rules.filter(r => r.enabled).forEach(r => {
        out.push({ lang: l.label, rule: r.label, mode: r.mode, icon: l.icon });
      });
    });
    return out;
  }, [configs, selectedLangs]);

  const totalRestrictions   = summaryRules.length;
  const strictCount  = summaryRules.filter(r => r.mode === "strict").length;
  const warningCount = summaryRules.filter(r => r.mode === "warning").length;
  const hiddenCount  = summaryRules.filter(r => r.mode === "hidden").length;

  function canProceed() {
    if (step === 1) return details.title.trim().length > 0;
    if (step === 2) return selectedLangs.length > 0;
    return true;
  }

  function handlePublish() {
    setPublished(true);
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Left step nav */}
      <div className="flex flex-col border-r py-6 px-4 gap-1 flex-shrink-0" style={{ width: 220, background: "#3A0C0E", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="mb-6 px-2">
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: "#F5F1E3", letterSpacing: "-0.01em" }}>Policy Engine</div>
          <div style={{ fontSize: 11, color: "rgba(245,241,227,0.45)", marginTop: 2 }}>Assignment Rule Configurator</div>
        </div>
        {STEPS.map(s => {
          const Icon = s.icon;
          const done = step > s.id;
          const active = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
              style={{
                background: active ? "rgba(245,241,227,0.1)" : "transparent",
                color: done ? "rgba(245,241,227,0.7)" : active ? "#F5F1E3" : "rgba(245,241,227,0.35)",
                cursor: s.id < step ? "pointer" : "default",
              }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: done ? "#0B6623" : active ? "#7B1113" : "rgba(245,241,227,0.08)" }}>
                {done
                  ? <Check size={12} style={{ color: "#FFF" }} />
                  : <Icon size={12} style={{ color: active ? "#FFF" : "rgba(245,241,227,0.4)" }} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{s.label}</span>
              {active && <ChevronRight size={13} className="ml-auto" style={{ color: "rgba(245,241,227,0.4)" }} />}
            </button>
          );
        })}

        {/* Selected lang summary */}
        {selectedLangs.length > 0 && (
          <div className="mt-auto pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "rgba(245,241,227,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Active Languages</div>
            <div className="flex flex-col gap-1.5">
              {selectedLangs.map(l => {
                const ruleCount = configs[l.id].rules.filter(r => r.enabled).length;
                return (
                  <div key={l.id} className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 14 }}>{l.icon}</span>
                    <span style={{ fontSize: 12, color: "rgba(245,241,227,0.75)", flex: 1 }}>{l.label}</span>
                    {ruleCount > 0 && (
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#F5D08A" }}>{ruleCount}R</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b flex-shrink-0" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="text-sm flex items-center gap-1" style={{ color: "#6B6058" }}>
                ← Back
              </button>
            )}
            <Shield size={16} style={{ color: "#7B1113" }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>
              {details.title || "New Assignment"} — Policy Configuration
            </span>
            {isSingleLang && (
              <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(123,17,19,0.08)", color: "#7B1113", fontWeight: 600 }}>
                {selectedLangs[0].label} Only Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: "#9A8A80" }}>
              {totalRestrictions} restriction{totalRestrictions !== 1 ? "s" : ""} configured
            </span>
            {step < 5 && (
              <button
                onClick={() => canProceed() && setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition-all disabled:opacity-40"
                style={{ background: "#7B1113", color: "#FFF", fontWeight: 600 }}
              >
                Next <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ scrollbarWidth: "none" }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>

              {/* ── STEP 1: Details ── */}
              {step === 1 && (
                <div className="max-w-xl">
                  <StepHeader step={1} total={5} title="Assignment Details" desc="Basic information about the assignment." />
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Assignment Title <span style={{ color: "#EF4444" }}>*</span></label>
                      <input
                        value={details.title}
                        onChange={e => setDetails(d => ({ ...d, title: e.target.value }))}
                        placeholder="e.g. Lab 6: Recursive Sorting"
                        className="w-full px-3 py-2.5 rounded-md border text-sm outline-none"
                        style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "Inter, sans-serif" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Course</label>
                        <select value={details.course} onChange={e => setDetails(d => ({ ...d, course: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-md border text-sm outline-none"
                          style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A" }}>
                          {["CS 11", "CS 32", "CS 135", "CS 150"].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Due Date</label>
                        <input type="date" value={details.due} onChange={e => setDetails(d => ({ ...d, due: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-md border text-sm outline-none"
                          style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A" }} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Time Limit (s)</label>
                        <input type="number" value={details.timeLimit} onChange={e => setDetails(d => ({ ...d, timeLimit: e.target.value }))} min="1" max="10"
                          className="w-full px-3 py-2.5 rounded-md border text-sm outline-none"
                          style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "JetBrains Mono, monospace" }} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#6B6058", fontWeight: 600 }}>Memory Limit (MB)</label>
                        <input type="number" value={details.memLimit} onChange={e => setDetails(d => ({ ...d, memLimit: e.target.value }))} min="64" max="512"
                          className="w-full px-3 py-2.5 rounded-md border text-sm outline-none"
                          style={{ background: "#EDE8D8", borderColor: "rgba(123,17,19,0.2)", color: "#1A1A1A", fontFamily: "JetBrains Mono, monospace" }} />
                      </div>
                    </div>
                    <div className="rounded-lg p-4 border" style={{ background: "rgba(30,58,138,0.04)", borderColor: "rgba(30,58,138,0.15)" }}>
                      <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "#1E3A8A", fontWeight: 600 }}>
                        <Info size={13} /> About the Policy Engine
                      </div>
                      <p style={{ fontSize: 13, color: "#3A4A6A", lineHeight: 1.6 }}>
                        The next steps will let you define exactly which programming languages are allowed, what syntax patterns are forbidden, and how violations are enforced — at the level of a compiler policy system.
                      </p>
                    </div>
                    <button
                      onClick={() => canProceed() && setStep(2)}
                      disabled={!canProceed()}
                      className="px-6 py-2.5 rounded-md text-sm mt-2 transition-all disabled:opacity-40 flex items-center gap-2"
                      style={{ background: "#7B1113", color: "#FFF", fontWeight: 600 }}
                    >
                      Configure Language Policy <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Language Selection ── */}
              {step === 2 && (
                <div className="max-w-2xl">
                  <StepHeader step={2} total={5} title="Language Selection" desc="Define which programming languages are permitted. This is the primary gate — students can only submit in the selected languages." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {LANGUAGES.map(lang => {
                      const on = configs[lang.id].enabled;
                      return (
                        <button
                          key={lang.id}
                          onClick={() => toggleLang(lang.id)}
                          className="flex items-center gap-3 p-4 rounded-xl border text-left transition-all"
                          style={{
                            background: on ? lang.color + "0D" : "#FDFAF2",
                            borderColor: on ? lang.color + "50" : "rgba(123,17,19,0.12)",
                            borderWidth: on ? 2 : 1,
                            boxShadow: on ? `0 0 0 3px ${lang.color}10` : "none",
                          }}
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ background: on ? lang.color + "18" : "#EDE8D8" }}>
                            {lang.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{lang.label}</div>
                            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9A8A80" }}>{lang.ext}</div>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                            style={{ borderColor: on ? lang.color : "#C8C0B0", background: on ? lang.color : "transparent" }}>
                            {on && <Check size={11} style={{ color: "#FFF" }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mode announcement */}
                  {selectedLangs.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border p-4"
                      style={{ background: isSingleLang ? "rgba(123,17,19,0.06)" : "rgba(11,102,35,0.06)", borderColor: isSingleLang ? "rgba(123,17,19,0.25)" : "rgba(11,102,35,0.25)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Lock size={14} style={{ color: isSingleLang ? "#7B1113" : "#0B6623" }} />
                        <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: isSingleLang ? "#7B1113" : "#0B6623" }}>
                          {isSingleLang ? `Single Language Mode — ${selectedLangs[0].label} Only` : `Multi-Language Mode — ${selectedLangs.length} languages permitted`}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "#5A4A42", lineHeight: 1.5 }}>
                        {isSingleLang
                          ? `Submissions in any language other than ${selectedLangs[0].label} will be automatically rejected at the gate.`
                          : `Students may submit in any of: ${selectedLangs.map(l => l.label).join(", ")}. Policy rules will be configured per language in the next step.`}
                      </p>
                    </motion.div>
                  )}
                  {selectedLangs.length === 0 && (
                    <div className="rounded-xl border p-4 border-dashed" style={{ borderColor: "rgba(123,17,19,0.2)" }}>
                      <p style={{ fontSize: 13, color: "#9A8A80", textAlign: "center" }}>Select at least one language to continue.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 3: Policy Rules ── */}
              {step === 3 && (
                <div className="max-w-3xl">
                  <StepHeader step={3} total={5} title="Policy Rules" desc="Configure per-language restrictions. Each rule can be set to Warning, Strict, or Hidden enforcement." />
                  <div className="rounded-lg border p-4 mb-6 flex flex-wrap gap-4" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.12)" }}>
                    {(Object.entries(MODE_META) as [EnforcementMode, typeof MODE_META.strict][]).map(([mode, m]) => {
                      const Icon = m.icon;
                      return (
                        <div key={mode} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: m.bg }}>
                            <Icon size={13} style={{ color: m.color }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{m.label}</div>
                            <div style={{ fontSize: 11, color: "#9A8A80" }}>{m.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-4">
                    {selectedLangs.map(lang => (
                      <LangRulePanel
                        key={lang.id}
                        lang={lang}
                        config={configs[lang.id]}
                        onChange={next => updateConfig(lang.id, next)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 4: Templates ── */}
              {step === 4 && (
                <div className="max-w-2xl">
                  <StepHeader step={4} total={5} title="Rule Templates" desc="Apply a preset to automatically configure rules and enforcement modes. You can still customize after applying." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {PRESETS.map(preset => {
                      const active = appliedPreset === preset.id;
                      const totalRules = Object.values(preset.rules).reduce((s, arr) => s + arr.length, 0);
                      return (
                        <button
                          key={preset.id}
                          onClick={() => applyPreset(preset)}
                          className="rounded-xl border p-5 text-left transition-all"
                          style={{
                            background: active ? preset.color + "0D" : "#FDFAF2",
                            borderColor: active ? preset.color + "50" : "rgba(123,17,19,0.12)",
                            borderWidth: active ? 2 : 1,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span style={{ fontSize: 22 }}>{preset.icon}</span>
                            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A1A" }}>{preset.name}</span>
                            {active && <Check size={15} className="ml-auto" style={{ color: preset.color }} />}
                          </div>
                          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#5A4A42", lineHeight: 1.55, marginBottom: 12 }}>{preset.desc}</p>
                          <div className="flex flex-wrap gap-2">
                            {preset.langs.map(l => {
                              const lang = LANGUAGES.find(x => x.id === l)!;
                              return (
                                <span key={l} className="text-xs px-2 py-0.5 rounded" style={{ background: lang.color + "14", color: lang.color, fontWeight: 500 }}>
                                  {lang.icon} {lang.label}
                                </span>
                              );
                            })}
                            <span className="text-xs px-2 py-0.5 rounded ml-auto" style={{ background: MODE_META[preset.mode].bg, color: MODE_META[preset.mode].color, fontWeight: 600 }}>
                              {MODE_META[preset.mode].label}
                            </span>
                          </div>
                          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#9A8A80", marginTop: 8 }}>
                            {totalRules} rule{totalRules !== 1 ? "s" : ""} · {preset.langs.length} language{preset.langs.length !== 1 ? "s" : ""}
                            {preset.singleLang ? " · Single Language Mode" : ""}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="rounded-lg border p-4" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.1)" }}>
                    <div className="flex items-center gap-2 mb-1 text-sm" style={{ fontWeight: 600, color: "#1A1A1A" }}>
                      <Settings2 size={14} style={{ color: "#7B1113" }} /> Custom Configuration
                    </div>
                    <p style={{ fontSize: 13, color: "#6B6058" }}>No template applied — you've configured rules manually in Step 3. That configuration is preserved.</p>
                  </div>
                </div>
              )}

              {/* ── STEP 5: Review & Publish ── */}
              {step === 5 && !published && (
                <div className="max-w-2xl">
                  <StepHeader step={5} total={5} title="Review & Publish" desc="Review the full policy configuration before publishing this assignment." />

                  {/* Summary card */}
                  <div className="rounded-xl border overflow-hidden mb-5" style={{ borderColor: "rgba(123,17,19,0.2)" }}>
                    <div className="px-5 py-4 border-b" style={{ background: "#7B1113", borderColor: "rgba(255,255,255,0.1)" }}>
                      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#F5F1E3" }}>{details.title || "Untitled Assignment"}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(245,241,227,0.6)", marginTop: 2 }}>{details.course} · Due {details.due || "—"} · {details.timeLimit}s · {details.memLimit}MB</div>
                    </div>
                    <div className="p-5" style={{ background: "#FDFAF2" }}>
                      <div className="grid grid-cols-3 gap-4 mb-5">
                        {[
                          { label: "Strict",  count: strictCount,  color: "#7B1113" },
                          { label: "Warning", count: warningCount, color: "#C4820A" },
                          { label: "Hidden",  count: hiddenCount,  color: "#6D4C41" },
                        ].map(({ label, count, color }) => (
                          <div key={label} className="rounded-lg p-3 text-center border" style={{ borderColor: color + "25", background: color + "08" }}>
                            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 24, color }}>{count}</div>
                            <div style={{ fontSize: 12, color, fontWeight: 600 }}>{label} rule{count !== 1 ? "s" : ""}</div>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs mb-3" style={{ color: "#9A8A80", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Allowed Languages</div>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {selectedLangs.length === 0
                          ? <span style={{ fontSize: 13, color: "#EF4444" }}>⚠ No language selected</span>
                          : selectedLangs.map(l => (
                            <span key={l.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border" style={{ background: l.color + "0D", borderColor: l.color + "30", color: "#1A1A1A", fontWeight: 500 }}>
                              {l.icon} {l.label}
                              {isSingleLang && <Lock size={11} style={{ color: l.color }} />}
                            </span>
                          ))}
                      </div>

                      {summaryRules.length > 0 && (
                        <>
                          <div className="text-xs mb-3" style={{ color: "#9A8A80", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Configured Restrictions</div>
                          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "rgba(123,17,19,0.1)" }}>
                            {summaryRules.map((r, i) => {
                              const m = MODE_META[r.mode];
                              const Icon = m.icon;
                              return (
                                <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 text-sm"
                                  style={{ borderColor: "rgba(123,17,19,0.06)", background: i % 2 === 0 ? "transparent" : "rgba(123,17,19,0.018)" }}>
                                  <span style={{ fontSize: 14 }}>{r.icon}</span>
                                  <span style={{ fontFamily: "Inter, sans-serif", color: "#3A2A22", flex: 1 }}>{r.rule}</span>
                                  <span style={{ fontSize: 12, color: "#9A8A80" }}>{r.lang}</span>
                                  <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: m.bg }}>
                                    <Icon size={11} style={{ color: m.color }} />
                                    <span style={{ fontSize: 11, color: m.color, fontWeight: 600 }}>{m.label}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {summaryRules.length === 0 && (
                        <div className="text-center py-4" style={{ color: "#9A8A80", fontSize: 13 }}>
                          No syntax restrictions configured — only language gating will apply.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enforcement engine preview */}
                  <div className="rounded-xl border p-5 mb-5" style={{ background: "#1A1A2E", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Terminal size={14} style={{ color: "#A8E6CF" }} />
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 13, color: "#A8E6CF" }}>How Code Will Be Checked</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { step: "01", label: "Language Gate",       desc: `Accept only: ${selectedLangs.map(l => l.label).join(", ") || "none configured"}`, color: "#A8E6CF" },
                        { step: "02", label: "Lexical Analysis",    desc: "Token-level scan for forbidden keywords and patterns", color: "#FFD580" },
                        { step: "03", label: "AST Inspection",      desc: "Abstract Syntax Tree walk — detects structural violations (loops, recursion, imports)", color: "#C5A3FF" },
                        { step: "04", label: "Rule Engine",         desc: `Apply ${strictCount} strict / ${warningCount} warning / ${hiddenCount} hidden rules`, color: "#FF9F7E" },
                        { step: "05", label: "Verdict",             desc: "Pass → compile & run. Fail strict → reject. Fail warning → annotate & run.", color: "#69E083" },
                      ].map(({ step: s, label, desc, color }) => (
                        <div key={s} className="flex items-start gap-3">
                          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "rgba(255,255,255,0.25)", minWidth: 20 }}>{s}</span>
                          <div>
                            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color, fontWeight: 600 }}>{label}</span>
                            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 8 }}>{desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePublish}
                    className="w-full py-3 rounded-md text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: "#7B1113", color: "#FFF", fontWeight: 700, fontSize: 15 }}
                  >
                    <Zap size={16} /> Publish Assignment with Policy Rules
                  </button>
                </div>
              )}

              {/* ── Published ── */}
              {step === 5 && published && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(11,102,35,0.1)" }}>
                    <CheckCircle2 size={40} style={{ color: "#0B6623" }} />
                  </div>
                  <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: "#1A1A1A", marginBottom: 8 }}>
                    Assignment Published!
                  </h2>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B6058", lineHeight: 1.65, marginBottom: 16 }}>
                    <strong>{details.title || "Assignment"}</strong> is now live for {details.course} students.
                    The policy engine is active — {selectedLangs.map(l => l.label).join(", ")} only
                    {totalRestrictions > 0 ? `, ${totalRestrictions} restriction${totalRestrictions !== 1 ? "s" : ""} enforced` : ""}.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => { setPublished(false); setStep(1); setConfigs(initConfigs()); setDetails({ title: "", course: "CS 32", due: "", timeLimit: "1", memLimit: "256" }); setAppliedPreset(null); }}
                      className="px-5 py-2.5 rounded-md text-sm" style={{ background: "#7B1113", color: "#FFF", fontWeight: 600 }}>
                      Create Another
                    </button>
                    {onBack && (
                      <button onClick={onBack} className="px-5 py-2.5 rounded-md text-sm border" style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 500 }}>
                        Back to Dashboard
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav bar */}
        {!published && (
          <div className="flex items-center justify-between px-6 py-3 border-t flex-shrink-0" style={{ background: "#FDFAF2", borderColor: "rgba(123,17,19,0.1)" }}>
            <button
              onClick={() => step > 1 && setStep(s => s - 1)}
              disabled={step === 1}
              className="px-4 py-2 rounded-md text-sm border transition-all disabled:opacity-30"
              style={{ borderColor: "rgba(123,17,19,0.2)", color: "#7B1113", fontWeight: 500 }}
            >
              ← Previous
            </button>
            <div className="flex items-center gap-2">
              {STEPS.map(s => (
                <div key={s.id} className="w-2 h-2 rounded-full transition-all" style={{ background: s.id === step ? "#7B1113" : s.id < step ? "#0B6623" : "#EDE8D8" }} />
              ))}
            </div>
            {step < 5 ? (
              <button
                onClick={() => canProceed() && setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition-all disabled:opacity-40"
                style={{ background: "#7B1113", color: "#FFF", fontWeight: 600 }}
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition-all hover:opacity-90"
                style={{ background: "#0B6623", color: "#FFF", fontWeight: 600 }}
              >
                <Zap size={14} /> Publish
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
