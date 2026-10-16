"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PencilLine,
  Sparkles,
  Eye,
  EyeOff,
  GraduationCap,
  Send,
  PartyPopper,
  AlertTriangle,
  Undo2,
  Lock,
} from "lucide-react";
import type { Topic } from "@/lib/worksheets";
import {
  useWorksheetState,
  countAnswered,
  isAnswerFilled,
} from "@/hooks/use-worksheet-state";
import { QuestionView } from "@/components/worksheet/QuestionViews";
import { ShareBar } from "@/components/worksheet/ShareBar";
import { AudioPlayer } from "@/components/worksheet/AudioPlayer";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WorksheetViewProps {
  topic: Topic;
  onBack: () => void;
  onNavigate: (topicId: string) => void;
  prevTopic?: Topic;
  nextTopic?: Topic;
}

const ALL_TOPICS_IDS = ["T1", "T2", "T3", "T4", "T5", "T6"];

export function WorksheetView({
  topic,
  onBack,
  onNavigate,
  prevTopic,
  nextTopic,
}: WorksheetViewProps) {
  const { state, hydrated, setName, setAnswer, setAnswerKey, setSubmitted, reset } =
    useWorksheetState(topic.id);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isGradingMode, setIsGradingMode] = useState(false); // teacher enters answer key
  const [activePart, setActivePart] = useState(0); // 0 = A, 1 = B, 2 = C

  // sync with URL hash for share links
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#\//, "");
      if (hash === topic.id) {
        // already here
      }
    }
  }, [topic.id]);

  const allQuestions = useMemo(
    () => topic.parts.flatMap((p) => p.questions.map((q) => ({ part: p, q }))),
    [topic],
  );
  const answeredCount = countAnswered(state);
  const totalCount = allQuestions.length;
  const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  // Compute score when answer key is fully available
  const score = useMemo(() => {
    let earned = 0;
    let possible = 0;
    let gradeable = 0;
    for (const { q } of allQuestions) {
      possible += q.points;
      const key = state.answerKey[q.id];
      const ans = state.answers[q.id];
      if (key !== undefined && isAnswerFilled(key) && isAnswerFilled(ans)) {
        gradeable += q.points;
        if (typeof key === "string" && typeof ans === "string" && key === ans) {
          earned += q.points;
        } else if (
          Array.isArray(key) &&
          Array.isArray(ans) &&
          JSON.stringify(key) === JSON.stringify(ans)
        ) {
          earned += q.points;
        } else if (
          typeof key === "object" &&
          !Array.isArray(key) &&
          typeof ans === "object" &&
          !Array.isArray(ans)
        ) {
          const k = key as Record<string, "tick" | "cross" | "">;
          const a = ans as Record<string, "tick" | "cross" | "">;
          const keys = Object.keys(k);
          if (keys.length > 0 && keys.every((kk) => a[kk] === k[kk])) {
            earned += q.points;
          }
        }
      }
    }
    return { earned, possible, gradeable };
  }, [state.answers, state.answerKey, allQuestions]);

  const hasAnswerKey = Object.keys(state.answerKey).length > 0;

  function handlePrint() {
    if (typeof window !== "undefined") window.print();
  }

  function handleReset() {
    reset();
    setSubmitted(false);
    toast.success("Answers cleared");
  }

  // Validation: requires a name and at least one answer before submit is allowed.
  const missingName = !state.name.trim();
  const missingAnswers = totalCount - answeredCount;
  const canSubmit = !missingName && answeredCount > 0 && !state.submitted;

  function handleSubmit() {
    if (missingName) {
      toast.error("Please enter your name before submitting", {
        description: "Look for the Name field at the top of the worksheet.",
      });
      // focus the name input by id
      if (typeof document !== "undefined") {
        document.getElementById("student-name-input")?.focus();
      }
      return;
    }
    if (answeredCount === 0) {
      toast.error("No answers to submit", {
        description: "Answer at least one question first.",
      });
      return;
    }
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // success toast with score
    if (hasAnswerKey) {
      toast.success(`Assignment submitted · ${score.earned} / ${score.possible}`, {
        description: `Nice work, ${state.name.trim()}!`,
      });
    } else {
      toast.success("Assignment submitted!", {
        description: `${answeredCount} / ${totalCount} answered. Awaiting teacher grading.`,
      });
    }
  }

  function handleUnsubmit() {
    setSubmitted(false);
    toast.info("Submission reopened", {
      description: "You can edit your answers and submit again.",
    });
  }

  const theme = topic.theme;

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-cyan-300/70">Loading worksheet…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Decorative top pattern */}
      <div
        className="h-1.5 w-full print:hidden"
        style={{
          background: `linear-gradient(90deg, ${theme.gradient[0]} 0%, ${theme.gradient[1]} 100%)`,
          boxShadow: `0 0 20px ${theme.accent}66`,
        }}
      />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 glass-strong border-b border-white/10 print:hidden">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 shrink-0 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All worksheets</span>
          </Button>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs text-white btn3d"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
              }}
            >
              {topic.number}
            </span>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-bold truncate leading-tight text-white text-glow">
                {topic.passageTitle}
              </p>
              <p className="text-[11px] text-white/50 truncate leading-tight">
                {theme.tagline}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/40">
                Progress
              </p>
              <p className="text-xs font-bold text-white">
                {answeredCount}/{totalCount}
              </p>
            </div>
            <div className="w-24">
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                    boxShadow: `0 0 10px ${theme.accent}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 print:py-0 print:max-w-none">
        {/* Header card — worksheet style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:rounded-none glass-strong sheen"
        >
          {/* gradient strip */}
          <div
            className="absolute inset-x-0 top-0 h-1.5"
            style={{
              background: `linear-gradient(90deg, ${theme.gradient[0]} 0%, ${theme.gradient[1]} 100%)`,
              boxShadow: `0 0 30px ${theme.accent}`,
            }}
          />
          {/* pattern overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 20%, ${theme.accent}55 0%, transparent 40%), radial-gradient(circle at 90% 80%, ${theme.primary}55 0%, transparent 40%)`,
            }}
          />
          <div className="relative p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl btn3d shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.accent}cc, ${theme.primary}cc)`,
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {theme.emoji}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/70">
                      Oxford Skills World · Listening with Speaking 3
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-glow">
                      Topic {topic.number} Listening Test
                    </h1>
                  </div>
                </div>
                <p className="text-base sm:text-lg font-medium mb-1 text-glow">
                  📖 “{topic.passageTitle}”
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                  {topic.passageIntro}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {topic.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full glass text-white/90"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="inline-flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl glass-strong sheen btn3d">
                  <span className="text-[10px] uppercase tracking-wider text-white/70">
                    Total
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold leading-none text-glow">
                    /10
                  </span>
                </div>
              </div>
            </div>

            {/* Name + score row */}
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-3">
                <label className="text-[10px] uppercase tracking-wider text-white/70 flex items-center gap-1">
                  <PencilLine className="w-3 h-3" /> Name
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  value={state.name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type your name…"
                  disabled={state.submitted}
                  className="w-full bg-transparent border-b-2 border-white/30 focus:border-white outline-none py-1 text-white placeholder-white/40 font-medium disabled:opacity-60"
                />
              </div>
              <div className="glass rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/70">
                    Your score
                  </p>
                  <p className="text-2xl font-extrabold text-glow">
                    {hasAnswerKey ? `${score.earned} / ${score.possible}` : "— / 10"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-white/70">
                    Status
                  </p>
                  <p className="text-sm font-semibold flex items-center gap-1 justify-end text-white">
                    {state.submitted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Submitted
                      </>
                    ) : answeredCount === 0 ? (
                      "Not started"
                    ) : (
                      `In progress`
                    )}
                  </p>
                  {state.submitted && state.submittedAt && (
                    <p className="text-[10px] text-white/50 mt-0.5">
                      {new Date(state.submittedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Audio player */}
        <div className="mt-5 print:hidden">
          <AudioPlayer
            title={topic.passageTitle}
            topicNumber={topic.number}
            accent={theme.accent}
            primary={theme.primary}
            gradient={theme.gradient}
            storageKey={`osw-audio-T${topic.number}`}
          />
        </div>

        {/* Submitted success banner — celebratory state */}
        <AnimatePresence>
          {state.submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="mt-4 rounded-2xl shadow-2xl print:hidden overflow-hidden glass-strong sheen relative"
              style={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.18), 0 0 0 1px ${theme.accent}66, 0 12px 32px -8px ${theme.accent}55`,
              }}
            >
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${theme.accent}33 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 100% 50%, ${theme.primary}33 0%, transparent 60%)`,
                }}
              />
              <div className="relative flex items-start gap-3 p-4 sm:p-5">
                <div
                  className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg btn3d"
                  style={{
                    background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                  }}
                >
                  <PartyPopper className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight text-glow" style={{ color: theme.accent }}>
                    Assignment submitted{state.name.trim() ? `, ${state.name.trim()}` : ""}! 🎉
                  </h3>
                  <p className="text-sm text-white/75 mt-0.5">
                    {hasAnswerKey
                      ? `You scored ${score.earned} / ${score.possible}.`
                      : `Your ${answeredCount} / ${totalCount} answers are saved and ready for your teacher to grade.`}
                    {state.submittedAt && (
                      <span className="text-white/50">
                        {" "}
                        Submitted on{" "}
                        {new Date(state.submittedAt).toLocaleString()}.
                      </span>
                    )}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleUnsubmit}
                      className="gap-1.5 glass text-white hover:bg-white/15 border border-white/15"
                      style={{ color: theme.accent }}
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      Reopen to edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handlePrint}
                      className="gap-1.5 glass text-white hover:bg-white/15 border border-white/15"
                      style={{ color: theme.accent }}
                    >
                      Print / Save PDF
                    </Button>
                    {nextTopic && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onNavigate(nextTopic.id)}
                        className="gap-1.5 text-white btn3d"
                        style={{
                          background: `linear-gradient(135deg, ${nextTopic.theme.accent}, ${nextTopic.theme.primary})`,
                          borderColor: nextTopic.theme.accent,
                        }}
                      >
                        Next: Topic {nextTopic.number}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={showAnswers ? "default" : "outline"}
              onClick={() => setShowAnswers((v) => !v)}
              disabled={!hasAnswerKey}
              className="gap-2 glass text-white hover:bg-white/15 border border-white/15"
              style={
                showAnswers
                  ? {
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                      color: "#fff",
                      borderColor: theme.accent,
                    }
                  : undefined
              }
            >
              {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAnswers ? "Hide answers" : "Show answers"}
            </Button>

            <Button
              type="button"
              size="sm"
              variant={isGradingMode ? "default" : "outline"}
              onClick={() => setIsGradingMode((v) => !v)}
              className="gap-2 glass text-white hover:bg-white/15 border border-white/15"
              style={
                isGradingMode
                  ? { background: "linear-gradient(135deg, #475569, #1f2937)", color: "#fff", borderColor: "#475569" }
                  : undefined
              }
            >
              <GraduationCap className="w-4 h-4" />
              {isGradingMode ? "Exit teacher mode" : "Teacher answer key"}
            </Button>
          </div>

          <ShareBar
            topicId={topic.id}
            topicTitle={topic.passageTitle}
            theme={theme}
            onPrint={handlePrint}
            onReset={handleReset}
          />
        </div>

        {isGradingMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 rounded-2xl glass p-4 text-sm print:hidden"
          >
            <div className="flex items-start gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">
                  Teacher mode — enter the answer key
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Fill in the correct answer for each question. Your selections are saved
                  as the answer key and used to grade student responses when you toggle
                  “Show answers”. The answer key is stored locally in this browser only.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Parts tabs */}
        <div className="mt-5 flex gap-2 print:hidden">
          {topic.parts.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                setActivePart(i);
                document
                  .getElementById(`part-${p.key}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all btn3d text-white",
              )}
              style={
                activePart === i
                  ? {
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                      boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.25), 0 0 0 1px ${theme.accent}, 0 8px 18px -6px ${theme.accent}88`,
                    }
                  : {
                      background: "oklch(0.3 0.02 264 / 0.5)",
                      color: "rgba(255,255,255,0.7)",
                    }
              }
            >
              <span className="block text-[10px] uppercase tracking-wider opacity-80">
                Part {p.key}
              </span>
              <span className="block text-xs">{p.points} pts</span>
            </button>
          ))}
        </div>

        {/* Parts */}
        <div className="mt-6 space-y-6">
          {topic.parts.map((part, pi) => (
            <motion.section
              key={part.key}
              id={`part-${part.key}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: pi * 0.1 }}
              className="scroll-mt-32"
            >
              <div
                className="rounded-2xl p-[1.5px] mb-4"
                style={{
                  background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                  boxShadow: `0 0 24px -8px ${theme.accent}aa`,
                }}
              >
                <div className="rounded-[14px] glass-strong px-4 sm:px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-lg shadow-lg btn3d text-white"
                      style={{
                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                      }}
                    >
                      {part.key}
                    </div>
                    <div>
                      <p
                        className="text-base sm:text-lg font-bold leading-tight text-glow"
                        style={{ color: theme.accent }}
                      >
                        {part.title}
                      </p>
                      <p className="text-xs text-white/55 leading-tight">{part.subtitle}</p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: `${theme.accent}33`, color: theme.accent }}
                  >
                    {part.points} pts
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {part.questions.map((q, qi) => {
                  const globalIndex = allQuestions.findIndex(
                    (x) => x.part.key === part.key && x.q.id === q.id,
                  );
                  // once submitted (and not in teacher/grading mode), lock the answer
                  const locked =
                    state.submitted && !isGradingMode;
                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "relative",
                        locked && "pointer-events-none",
                      )}
                    >
                      <QuestionView
                        topicId={topic.id}
                        question={q}
                        index={globalIndex + 1}
                        theme={theme}
                        value={isGradingMode ? state.answerKey[q.id] : state.answers[q.id]}
                        correctValue={state.answerKey[q.id]}
                        showCorrect={showAnswers && !isGradingMode}
                        onAnswer={(v) =>
                          isGradingMode
                            ? setAnswerKey(q.id, v)
                            : setAnswer(q.id, v)
                        }
                      />
                      {locked && (
                        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full glass-strong text-white/80 text-[10px] font-semibold flex items-center gap-1 shadow-md border border-white/15">
                          <Lock className="w-3 h-3" />
                          Locked
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Submit bar — pinned to viewport bottom while scrolling through parts */}
        <div
          aria-hidden={false}
          className="fixed bottom-0 inset-x-0 z-40 print:hidden pointer-events-none"
        >
          <div className="max-w-5xl mx-auto px-3 sm:px-6 pb-3">
            <div
              className="pointer-events-auto rounded-2xl shadow-2xl p-3 sm:p-4 glass-strong"
              style={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.18), 0 12px 32px -8px oklch(0 0 0 / 0.6), 0 0 0 1px ${theme.accent}33`,
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/60 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    Auto-saved
                  </div>
                  <div className="flex items-center gap-1 text-xs flex-wrap">
                    {topic.parts.map((p) => {
                      const partAnswered = p.questions.filter((q) =>
                        isAnswerFilled(
                          isGradingMode ? state.answerKey[q.id] : state.answers[q.id],
                        ),
                      ).length;
                      const partTotal = p.questions.length;
                      return (
                        <span
                          key={p.key}
                          className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-semibold",
                            partAnswered === partTotal
                              ? "bg-emerald-400/25 text-emerald-200"
                              : partAnswered > 0
                                ? "bg-amber-400/25 text-amber-200"
                                : "bg-white/10 text-white/50",
                          )}
                        >
                          Part {p.key}: {partAnswered}/{partTotal}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {state.submitted ? (
                    <>
                      <span
                        className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-400/25 text-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Submitted
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleUnsubmit}
                        className="gap-1.5 glass text-white hover:bg-white/15 border border-white/15"
                        style={{ color: theme.accent }}
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reopen</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleReset}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        Reset
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            disabled={!canSubmit}
                            className="gap-2 text-white btn3d"
                            style={{
                              background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                              borderColor: theme.accent,
                              opacity: canSubmit ? 1 : 0.5,
                              boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.25), 0 8px 20px -6px ${theme.accent}aa`,
                            }}
                          >
                            <Send className="w-4 h-4" />
                            Submit assignment
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md glass-strong border border-white/15 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-white">
                              <Send
                                className="w-5 h-5"
                                style={{ color: theme.accent }}
                              />
                              Submit this assignment?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/70">
                              {missingName ? (
                                <span className="flex items-start gap-2 text-amber-300">
                                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                  <span>
                                    Add your name at the top of the worksheet
                                    before submitting.
                                  </span>
                                </span>
                              ) : (
                                <>
                                  You have answered{" "}
                                  <strong>
                                    {answeredCount} / {totalCount}
                                  </strong>{" "}
                                  questions
                                  {missingAnswers > 0 && (
                                    <span className="text-amber-300">
                                      {" "}
                                      ({missingAnswers} still unanswered — you
                                      can reopen the assignment later if you
                                      want to keep editing).
                                    </span>
                                  )}
                                  .{" "}
                                  {hasAnswerKey
                                    ? "You'll see your score immediately after submitting."
                                    : "Your answers will be saved and ready for your teacher to grade."}
                                </>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="gap-1.5 glass text-white border border-white/15 hover:bg-white/15">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleSubmit}
                              className="gap-2 text-white btn3d"
                              style={{
                                background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                                borderColor: theme.accent,
                              }}
                            >
                              <Send className="w-4 h-4" />
                              Yes, submit
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* spacer so content never hides behind the fixed bar */}
        <div className="h-24 print:hidden" aria-hidden="true" />

        {/* Prev / Next navigation */}
        <div className="mt-6 grid sm:grid-cols-2 gap-3 print:hidden">
          <button
            type="button"
            disabled={!prevTopic}
            onClick={() => prevTopic && onNavigate(prevTopic.id)}
            className={cn(
              "group flex items-center gap-3 rounded-2xl p-4 text-left transition-all glass sheen",
              prevTopic
                ? "hover:shadow-lg hover:-translate-y-0.5"
                : "opacity-40 cursor-not-allowed",
            )}
            style={{
              boxShadow: prevTopic ? `inset 0 0 0 1px ${prevTopic.theme.accent}44` : undefined,
            }}
          >
            <ArrowLeft className="w-5 h-5 shrink-0" style={{ color: prevTopic?.theme.accent }} />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-white/40">
                Previous
              </p>
              <p
                className="font-bold text-sm truncate text-white"
                style={{ color: prevTopic?.theme.accent }}
              >
                {prevTopic ? `Topic ${prevTopic.number} · ${prevTopic.passageTitle}` : "—"}
              </p>
            </div>
          </button>
          <button
            type="button"
            disabled={!nextTopic}
            onClick={() => nextTopic && onNavigate(nextTopic.id)}
            className={cn(
              "group flex items-center gap-3 rounded-2xl p-4 text-right justify-end transition-all glass sheen",
              nextTopic
                ? "hover:shadow-lg hover:-translate-y-0.5"
                : "opacity-40 cursor-not-allowed",
            )}
            style={{
              boxShadow: nextTopic ? `inset 0 0 0 1px ${nextTopic.theme.accent}44` : undefined,
            }}
          >
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-white/40">
                Next
              </p>
              <p
                className="font-bold text-sm truncate text-white"
                style={{ color: nextTopic?.theme.accent }}
              >
                {nextTopic ? `Topic ${nextTopic.number} · ${nextTopic.passageTitle}` : "—"}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 shrink-0" style={{ color: nextTopic?.theme.accent }} />
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-6 text-center text-xs text-white/40 print:hidden">
          <p>
            © Oxford University Press · Permission granted to reproduce for
            instructional use. Live worksheet UI for classroom sharing.
          </p>
        </footer>
      </div>

      {/* Print-only version */}
      <div className="hidden print:block">
        <PrintableWorksheet topic={topic} state={state} />
      </div>
    </div>
  );
}

// ---------- Printable worksheet (clean A4) ----------
import type { WorksheetState } from "@/hooks/use-worksheet-state";
import { getCheckStatements } from "@/lib/worksheets";

function PrintableWorksheet({ topic, state }: { topic: Topic; state: WorksheetState }) {
  const theme = topic.theme;
  return (
    <div className="p-8 text-black font-serif" style={{ fontSize: "11pt" }}>
      <div className="border-b-2 pb-3 mb-4" style={{ borderColor: theme.primary }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10pt] text-gray-600">
              Oxford Skills World: Listening with Speaking 3
            </p>
            <h1 className="text-xl font-bold" style={{ color: theme.primary }}>
              Topic {topic.number} Listening Test — {topic.passageTitle}
            </h1>
            <p className="text-[10pt] text-gray-600">{theme.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              Name:{" "}
              <span className="inline-block border-b border-gray-500 w-40">
                {state.name || "____________________"}
              </span>
            </p>
            <p className="text-sm mt-1">
              Score:{" "}
              <span className="inline-block border-b border-gray-500 w-12">{"  "}</span> / 10
            </p>
          </div>
        </div>
      </div>
      {topic.parts.map((part) => (
        <div key={part.key} className="mb-4 break-inside-avoid">
          <h2 className="font-bold text-sm" style={{ color: theme.primary }}>
            Part {part.key} — {part.subtitle} ({part.points} pts)
          </h2>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            {part.questions.map((q, i) => (
              <li key={q.id} className="text-[11pt]">
                <p>{q.prompt}</p>
                {"options" in q && q.options && (
                  <ul className="list-none ml-4 mt-1 flex flex-wrap gap-x-6">
                    {q.options.map((o) => (
                      <li key={o.id}>
                        <span className="inline-block w-3 h-3 border border-black mr-1 align-middle"></span>
                        <span className="align-middle">{o.id}. {o.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === "ordering" && "items" in q && q.items && (
                  <ol className="list-none ml-4 mt-1 space-y-1">
                    {q.items.map((it, ii) => (
                      <li key={it.id}>
                        <span className="inline-block w-6 border-b border-black text-center mr-2">{" "}</span>
                        {it.label}
                      </li>
                    ))}
                  </ol>
                )}
                {q.type === "check" && (
                  <ol className="list-none ml-4 mt-1 space-y-1">
                    {getCheckStatements(topic.id, q.id).map((s, si) => (
                      <li key={si}>
                        {si + 1}. {s.text}{" "}
                        <span className="inline-block border border-black w-6 h-4 text-center mx-1">✔</span>
                        <span className="inline-block border border-black w-6 h-4 text-center mx-1">✘</span>
                      </li>
                    ))}
                  </ol>
                )}
                {q.type === "yesno" && (
                  <span className="inline-block border border-black w-12 h-5 text-center mx-1 align-middle">
                    Yes
                  </span>
                )}
                {q.type === "yesno" && (
                  <span className="inline-block border border-black w-12 h-5 text-center mx-1 align-middle">
                    No
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
      <p className="text-[9pt] text-gray-500 mt-4 italic">
        © Oxford University Press. Permission granted to reproduce for instructional use.
      </p>
    </div>
  );
}
