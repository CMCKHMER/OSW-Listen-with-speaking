"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Pencil,
  Sparkles,
  Music2,
  Palette,
  BookOpen,
  Landmark,
  Mountain,
  Droplets,
  Trophy,
  TrendingUp,
  Headphones,
  FileText,
  Printer,
  Mic,
} from "lucide-react";
import { TOPICS, PROJECT_PAGES, SPEAKING_TUTORS } from "@/lib/worksheets";
import {
  useAllWorksheetStates,
  countAnswered,
} from "@/hooks/use-worksheet-state";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onOpen: (topicId: string) => void;
}

function topicIcon(emoji: string) {
  switch (emoji) {
    case "🎵":
      return Music2;
    case "🎨":
      return Palette;
    case "📚":
      return BookOpen;
    case "🏛️":
      return Landmark;
    case "🏔️":
      return Mountain;
    case "💧":
      return Droplets;
    default:
      return Sparkles;
  }
}

export function Dashboard({ onOpen }: DashboardProps) {
  const { all, hydrated } = useAllWorksheetStates();

  let totalAnswered = 0;
  let totalQuestions = 0;
  let submittedCount = 0;
  for (const t of TOPICS) {
    const state = all[t.id];
    if (!state) {
      totalQuestions += t.parts.reduce((sum, p) => sum + p.questions.length, 0);
      continue;
    }
    const tqs = t.parts.reduce((sum, p) => sum + p.questions.length, 0);
    totalQuestions += tqs;
    totalAnswered += countAnswered(state);
    if (state.submitted) submittedCount += 1;
  }
  const overallProgress =
    totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-cyan-200 mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Live worksheets · Glass UI · Audio passages
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white text-glow leading-[1.05]"
        >
          Oxford Skills World 3
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #67e8f9 0%, #a78bfa 50%, #f0abfc 100%)",
            }}
          >
            Listening Tests
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed"
        >
          Six interactive listening tests with Parts A · B · C — multiple choice,
          ordering, and Yes/No. Tap to answer, listen to the passage, track
          progress, share with a link, or print to paper. Everything saves
          automatically.
        </motion.p>

        {/* Aggregate stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 grid grid-cols-3 gap-3 max-w-2xl"
        >
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            value={hydrated ? `${overallProgress}%` : "—"}
            label="Overall progress"
            tint="#67e8f9"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            value={hydrated ? `${submittedCount}/6` : "—"}
            label="Submitted"
            tint="#86efac"
          />
          <StatCard
            icon={<Headphones className="w-5 h-5" />}
            value="6"
            label="Audio passages"
            tint="#c4b5fd"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex flex-wrap gap-2 text-xs text-white/60"
        >
          <Tip>✨ Distinct color per topic</Tip>
          <Tip>🔊 Audio passages</Tip>
          <Tip>📝 Auto-saves to this browser</Tip>
          <Tip>🔗 Share link to any worksheet</Tip>
          <Tip>👨‍🏫 Teacher answer-key mode</Tip>
        </motion.div>
      </div>

      {/* Topics grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic, i) => {
            const Icon = topicIcon(topic.theme.emoji);
            const state = all[topic.id];
            const qCount = topic.parts.reduce((s, p) => s + p.questions.length, 0);
            const answered = state ? countAnswered(state) : 0;
            const pct = qCount > 0 ? Math.round((answered / qCount) * 100) : 0;
            const submitted = state?.submitted ?? false;

            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpen(topic.id)}
                className="group relative text-left rounded-3xl overflow-hidden glass-strong sheen card3d"
              >
                {/* gradient header */}
                <div
                  className="relative px-5 pt-5 pb-4 text-white overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${topic.theme.gradient[0]} 0%, ${topic.theme.gradient[1]} 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 80% 10%, #ffffff 0%, transparent 40%), radial-gradient(circle at 10% 90%, #ffffff 0%, transparent 40%)`,
                    }}
                  />
                  <div className="relative flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider opacity-80">
                        Topic
                      </p>
                      <p className="text-2xl font-extrabold leading-none">
                        {topic.number}
                      </p>
                    </div>
                  </div>
                  <h3 className="relative mt-3 text-xl font-extrabold leading-tight text-glow">
                    {topic.passageTitle}
                  </h3>
                  <div className="relative mt-1.5 flex flex-wrap gap-1">
                    {topic.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-white/60 font-medium">
                      {qCount} questions · 10 pts
                    </span>
                    {submitted ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                      </span>
                    ) : answered === 0 ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-white/40">
                        <Pencil className="w-3.5 h-3.5" /> Not started
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 font-semibold"
                        style={{ color: topic.theme.accent }}
                      >
                        <Pencil className="w-3.5 h-3.5" /> In progress
                      </span>
                    )}
                  </div>
                  {submitted && state?.submittedAt && (
                    <p className="text-[10px] text-white/40 mb-2 italic">
                      Submitted {new Date(state.submittedAt).toLocaleDateString()}
                    </p>
                  )}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: hydrated ? `${pct}%` : "0%" }}
                      transition={{ duration: 0.7, delay: 0.25 + i * 0.06 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${topic.theme.gradient[0]}, ${topic.theme.gradient[1]})`,
                        boxShadow: `0 0 12px ${topic.theme.accent}88`,
                      }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: topic.theme.accent }}
                    >
                      {hydrated ? `${answered}/${qCount} answered` : "—"}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-1"
                      style={{ color: topic.theme.accent }}
                    >
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ===== Project Pages Section ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-amber-200 mb-3">
            <FileText className="w-3.5 h-3.5" />
            Printable project pages · One per topic
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-glow">
            Project Pages
          </h2>
          <p className="mt-2 text-sm text-white/60 max-w-2xl">
            Each topic includes a printable project page with discussion questions,
            step-by-step instructions, and materials list. Click to view and print.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECT_PAGES.map((page, i) => {
            const topic = TOPICS.find((t) => t.id === page.topicId);
            return (
              <motion.div
                key={page.topicId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.05 }}
                className="group relative rounded-3xl overflow-hidden glass-strong sheen card3d"
              >
                {/* Project page thumbnail */}
                <div
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => window.open(page.imagePath, "_blank")}
                >
                  <img
                    src={page.imagePath}
                    alt={`${page.projectName} — Project Page`}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          background: `${topic?.theme.accent}33`,
                          color: topic?.theme.accent,
                        }}
                      >
                        Topic {page.topicNumber}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white text-glow">
                      {page.projectName}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <p className="text-xs text-white/60 mb-2 italic">
                    &ldquo;{page.question}&rdquo;
                  </p>
                  <div className="space-y-1 mb-3">
                    {page.instructions.map((inst, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-white/70">
                        <span
                          className="font-bold mt-0.5"
                          style={{ color: topic?.theme.accent }}
                        >
                          {String.fromCharCode(65 + j)}
                        </span>
                        <span>{inst}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {page.materials.map((mat) => (
                      <span
                        key={mat}
                        className="text-[10px] px-2 py-0.5 rounded-full glass text-white/50"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => window.open(page.imagePath, "_blank")}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl glass text-xs font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    View & Print
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===== Speaking Tutor Section ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-teal-200 mb-3">
            <Mic className="w-3.5 h-3.5" />
            Speaking practice · 2 pages per topic
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-glow">
            Speaking Tutor
          </h2>
          <p className="mt-2 text-sm text-white/60 max-w-2xl">
            Six speaking tutor worksheets — one per topic. Each has a model conversation,
            a practice table, and a speaking task to do with a partner. Click to view and print.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SPEAKING_TUTORS.map((tutor, i) => {
            const topic = TOPICS.find((t) => t.id === tutor.topicId);
            return (
              <motion.div
                key={tutor.topicId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.05 }}
                className="group relative rounded-3xl overflow-hidden glass-strong sheen card3d"
              >
                {/* Thumbnail — page 1 */}
                <div
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => window.open(tutor.page1Path, "_blank")}
                >
                  <img
                    src={tutor.page1Path}
                    alt={`Speaking Tutor Topic ${tutor.topicNumber} — Page 1`}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          background: `${topic?.theme.accent}33`,
                          color: topic?.theme.accent,
                        }}
                      >
                        Topic {tutor.topicNumber}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white text-glow">
                      {tutor.title}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full glass"
                      style={{ color: topic?.theme.accent }}
                    >
                      {tutor.skill}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mb-3 italic">
                    &ldquo;{tutor.speakTask}&rdquo;
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(tutor.page1Path, "_blank")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl glass text-xs font-semibold text-white/80 hover:text-white transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Page 1
                    </button>
                    <button
                      onClick={() => window.open(tutor.page2Path, "_blank")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl glass text-xs font-semibold text-white/80 hover:text-white transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Page 2
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-white/40 pb-8">
        <p>
          © Oxford University Press · Permission granted to reproduce for
          instructional use. Live worksheet UI for classroom sharing.
        </p>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  tint,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl glass sheen p-3.5 relative overflow-hidden">
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-50"
        style={{ background: tint }}
      />
      <div
        className="relative w-9 h-9 rounded-xl flex items-center justify-center mb-2 btn3d"
        style={{ background: `${tint}22`, color: tint }}
      >
        {icon}
      </div>
      <p className="relative text-2xl sm:text-3xl font-extrabold text-white leading-none text-glow">
        {value}
      </p>
      <p className="relative text-[11px] text-white/55 mt-1">{label}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass text-white/70">
      {children}
    </span>
  );
}
