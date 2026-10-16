"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  MCQQuestion,
  OrderingQuestion,
  YesNoQuestion,
  CheckQuestion,
  Question,
} from "@/lib/worksheets";
import { getCheckStatements } from "@/lib/worksheets";
import type { AnswerValue } from "@/hooks/use-worksheet-state";

// ---------- shared bits ----------

interface QuestionShellProps {
  index: number;
  points: number;
  prompt: string;
  context?: string;
  answered: boolean;
  correct?: boolean | null; // null = not graded
  theme: { primary: string; accent: string; ring: string };
  children: React.ReactNode;
}

function QuestionShell({
  index,
  points,
  prompt,
  context,
  answered,
  correct,
  theme,
  children,
}: QuestionShellProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={cn(
        "relative rounded-2xl glass sheen p-4 sm:p-5",
        answered && "glow-ring",
      )}
      style={
        answered
          ? {
              boxShadow: `0 0 0 1px ${theme.accent}88, 0 0 24px -4px ${theme.accent}55, inset 0 1px 0 0 rgba(255,255,255,0.18)`,
            }
          : undefined
      }
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm shadow-lg btn3d text-white"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
          }}
        >
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-white text-[15px] sm:text-base leading-snug text-glow">
              {prompt}
            </p>
            <span
              className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
              style={{ background: `${theme.accent}33`, color: theme.accent }}
            >
              {points} pt{points > 1 ? "s" : ""}
            </span>
          </div>
          {context && (
            <p className="mt-1 text-xs sm:text-sm text-white/55 italic">{context}</p>
          )}
          <div className="mt-3">{children}</div>
        </div>
      </div>
      {correct !== null && correct !== undefined && (
        <div
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg btn3d text-white"
          style={{
            background: correct
              ? "linear-gradient(135deg, #4ade80, #16a34a)"
              : "linear-gradient(135deg, #f87171, #dc2626)",
          }}
        >
          {correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </div>
      )}
    </motion.div>
  );
}

// ---------- MCQ ----------

interface MCQProps {
  question: MCQQuestion;
  index: number;
  theme: QuestionShellProps["theme"];
  value: string | undefined;
  correctValue?: string;
  showCorrect?: boolean;
  onAnswer: (v: string) => void;
}

export function MCQQuestionView({
  question,
  index,
  theme,
  value,
  correctValue,
  showCorrect,
  onAnswer,
}: MCQProps) {
  const correct =
    showCorrect && correctValue !== undefined && correctValue !== ""
      ? value === correctValue
      : null;
  return (
    <QuestionShell
      index={index}
      points={question.points}
      prompt={question.prompt}
      context={question.context}
      answered={!!value}
      correct={correct}
      theme={theme}
    >
      <div className="grid gap-2 sm:grid-cols-1">
        {question.options.map((opt) => {
          const selected = value === opt.id;
          const hasKey = showCorrect && correctValue !== undefined && correctValue !== "";
          const isCorrect = hasKey && correctValue === opt.id;
          const isWrongPick = hasKey && selected && correctValue !== opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onAnswer(opt.id)}
              className={cn(
                "group text-left w-full flex items-center gap-3 rounded-xl px-3 sm:px-4 py-2.5 transition-all btn3d",
                "text-white",
              )}
              style={
                selected
                  ? {
                      background: `linear-gradient(135deg, ${theme.accent}cc, ${theme.primary}cc)`,
                      boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.25), inset 0 -2px 0 0 rgba(0,0,0,0.25), 0 0 0 1px ${theme.accent}, 0 8px 20px -6px ${theme.accent}88`,
                    }
                  : isCorrect
                    ? {
                        background: "linear-gradient(135deg, rgba(74,222,128,0.35), rgba(22,163,74,0.35))",
                        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.18), 0 0 0 1px #4ade80",
                      }
                    : isWrongPick
                      ? {
                          background: "linear-gradient(135deg, rgba(248,113,113,0.3), rgba(220,38,38,0.3))",
                          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.15), 0 0 0 1px #f87171",
                        }
                      : {
                          background: "oklch(0.3 0.02 264 / 0.5)",
                          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 -1px 0 0 rgba(0,0,0,0.2)",
                        }
              }
            >
              <span
                className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg font-bold text-sm transition-all btn3d"
                style={{
                  background: selected
                    ? "#fff"
                    : isCorrect
                      ? "linear-gradient(135deg, #4ade80, #16a34a)"
                      : isWrongPick
                        ? "linear-gradient(135deg, #f87171, #dc2626)"
                        : `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                  color: selected ? theme.primary : "#fff",
                }}
              >
                {opt.id}
              </span>
              <span className="flex-1 text-sm sm:text-[15px] text-white leading-snug text-glow">
                {opt.label}
              </span>
              {selected && !isCorrect && (
                <span
                  className="shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  Your pick
                </span>
              )}
              {isCorrect && (
                <span className="shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-400/30 text-emerald-200">
                  Correct
                </span>
              )}
              {isWrongPick && (
                <span className="shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold bg-red-400/30 text-red-200">
                  Wrong
                </span>
              )}
            </button>
          );
        })}
      </div>
    </QuestionShell>
  );
}

// ---------- Yes/No ----------

interface YesNoProps {
  question: YesNoQuestion;
  index: number;
  theme: QuestionShellProps["theme"];
  value: "yes" | "no" | undefined;
  correctValue?: "yes" | "no";
  showCorrect?: boolean;
  onAnswer: (v: "yes" | "no") => void;
}

export function YesNoQuestionView({
  question,
  index,
  theme,
  value,
  correctValue,
  showCorrect,
  onAnswer,
}: YesNoProps) {
  const correct =
    showCorrect && correctValue !== undefined && correctValue !== ""
      ? value === correctValue
      : null;
  return (
    <QuestionShell
      index={index}
      points={question.points}
      prompt={question.prompt}
      context={question.context}
      answered={!!value}
      correct={correct}
      theme={theme}
    >
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "yes", label: "Yes", emoji: "👍" },
            { id: "no", label: "No", emoji: "👎" },
          ] as const
        ).map((opt) => {
          const selected = value === opt.id;
          const hasKey =
            showCorrect && correctValue !== undefined && correctValue !== "";
          const isCorrect = hasKey && correctValue === opt.id;
          const isWrongPick = hasKey && selected && correctValue !== opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onAnswer(opt.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all btn3d text-white",
              )}
              style={
                selected
                  ? {
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                      boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.3), 0 0 0 1px ${theme.accent}, 0 8px 18px -6px ${theme.accent}aa`,
                    }
                  : isCorrect
                    ? {
                        background: "linear-gradient(135deg, #4ade80, #16a34a)",
                        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.25), 0 0 0 1px #4ade80",
                      }
                    : isWrongPick
                      ? {
                          background: "linear-gradient(135deg, #f87171, #dc2626)",
                          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.2), 0 0 0 1px #f87171",
                        }
                      : {
                          background: "oklch(0.3 0.02 264 / 0.5)",
                          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.08)",
                        }
              }
            >
              <span className="text-base">{opt.emoji}</span>
              {opt.label}
              {isCorrect && <Check className="w-4 h-4 ml-1" />}
              {isWrongPick && <X className="w-4 h-4 ml-1" />}
            </button>
          );
        })}
      </div>
    </QuestionShell>
  );
}

// ---------- Check group (✔ / ✘) ----------

interface CheckGroupProps {
  topicId: string;
  question: CheckQuestion;
  index: number;
  theme: QuestionShellProps["theme"];
  value: Record<string, "tick" | "cross" | ""> | undefined;
  correctValue?: Record<string, "tick" | "cross" | "">;
  showCorrect?: boolean;
  onAnswer: (v: Record<string, "tick" | "cross" | "">) => void;
}

export function CheckQuestionView({
  topicId,
  question,
  index,
  theme,
  value,
  correctValue,
  showCorrect,
  onAnswer,
}: CheckGroupProps) {
  const statements = getCheckStatements(topicId, question.id);
  const answers = value ?? {};
  const hasKey =
    showCorrect &&
    correctValue !== undefined &&
    Object.keys(correctValue).length > 0;
  const correct = hasKey
    ? statements.every((_, i) => answers[i] && answers[i] === correctValue[i])
    : null;

  function handlePick(i: number, choice: "tick" | "cross") {
    const next = { ...answers, [i]: answers[i] === choice ? "" : choice };
    onAnswer(next);
  }

  return (
    <QuestionShell
      index={index}
      points={question.points}
      prompt={question.prompt}
      context={question.context}
      answered={
        Object.keys(answers).length >= statements.length &&
        statements.every((_, i) => answers[i] === "tick" || answers[i] === "cross")
      }
      correct={correct}
      theme={theme}
    >
      <ol className="space-y-2">
        {statements.map((s, i) => {
          const cur = answers[i] ?? "";
          const isCorrectCell = hasKey && correctValue?.[i] === cur && cur !== "";
          const isWrongCell = hasKey && cur && correctValue?.[i] !== cur;
          return (
            <li
              key={i}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 transition-colors text-white",
              )}
              style={{
                background: isCorrectCell
                  ? "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(22,163,74,0.18))"
                  : isWrongCell
                    ? "linear-gradient(135deg, rgba(248,113,113,0.22), rgba(220,38,38,0.18))"
                    : "oklch(0.3 0.02 264 / 0.5)",
                boxShadow: cur
                  ? `inset 0 1px 0 0 rgba(255,255,255,0.12), 0 0 0 1px ${theme.accent}66`
                  : "inset 0 1px 0 0 rgba(255,255,255,0.06)",
              }}
            >
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white btn3d"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                }}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-sm sm:text-[15px] text-white leading-snug text-glow">
                {s.text}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePick(i, "tick")}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all btn3d hover:scale-105"
                  style={{
                    background:
                      cur === "tick"
                        ? "linear-gradient(135deg, #4ade80, #16a34a)"
                        : "oklch(0.35 0.02 264 / 0.6)",
                    color: cur === "tick" ? "#fff" : "#4ade80",
                    boxShadow:
                      cur === "tick"
                        ? "inset 0 1px 0 0 rgba(255,255,255,0.25), 0 0 0 1px #4ade80"
                        : "inset 0 1px 0 0 rgba(255,255,255,0.08)",
                  }}
                  aria-label={`Mark statement ${i + 1} as ✔`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handlePick(i, "cross")}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all btn3d hover:scale-105"
                  style={{
                    background:
                      cur === "cross"
                        ? "linear-gradient(135deg, #f87171, #dc2626)"
                        : "oklch(0.35 0.02 264 / 0.6)",
                    color: cur === "cross" ? "#fff" : "#f87171",
                    boxShadow:
                      cur === "cross"
                        ? "inset 0 1px 0 0 rgba(255,255,255,0.2), 0 0 0 1px #f87171"
                        : "inset 0 1px 0 0 rgba(255,255,255,0.08)",
                  }}
                  aria-label={`Mark statement ${i + 1} as ✘`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </QuestionShell>
  );
}

// ---------- Ordering ----------

interface OrderingProps {
  question: OrderingQuestion;
  index: number;
  theme: QuestionShellProps["theme"];
  value: string[] | undefined;
  correctValue?: string[];
  showCorrect?: boolean;
  onAnswer: (v: string[]) => void;
}

export function OrderingQuestionView({
  question,
  index,
  theme,
  value,
  correctValue,
  showCorrect,
  onAnswer,
}: OrderingProps) {
  const order = value ?? question.items.map((i) => i.id);
  const itemById = Object.fromEntries(question.items.map((i) => [i.id, i.label]));
  const hasKey = showCorrect && Array.isArray(correctValue) && correctValue.length > 0;
  const correct = hasKey
    ? JSON.stringify(order) === JSON.stringify(correctValue)
    : null;

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    onAnswer(next);
  }

  return (
    <QuestionShell
      index={index}
      points={question.points}
      prompt={question.prompt}
      context="Use the arrows to put these in the right order."
      answered={order.length > 0}
      correct={correct}
      theme={theme}
    >
      <ol className="space-y-2">
        {order.map((id, i) => {
          const isCorrectPos = hasKey && correctValue[i] === id;
          const isWrongPos = hasKey && correctValue[i] !== id;
          return (
            <li
              key={id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors text-white"
              style={{
                background: isCorrectPos
                  ? "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(22,163,74,0.18))"
                  : isWrongPos
                    ? "linear-gradient(135deg, rgba(248,113,113,0.22), rgba(220,38,38,0.18))"
                    : "oklch(0.3 0.02 264 / 0.55)",
                boxShadow: isCorrectPos
                  ? "inset 0 1px 0 0 rgba(255,255,255,0.15), 0 0 0 1px #4ade80"
                  : isWrongPos
                    ? "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 0 0 1px #f87171"
                    : `inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 0 1px ${theme.accent}44`,
              }}
            >
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white btn3d"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                }}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-sm sm:text-[15px] text-white leading-snug text-glow">
                {itemById[id]}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all btn3d disabled:opacity-30 disabled:cursor-not-allowed text-white"
                  style={{
                    background: "oklch(0.4 0.025 264 / 0.6)",
                  }}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all btn3d disabled:opacity-30 disabled:cursor-not-allowed text-white"
                  style={{
                    background: "oklch(0.4 0.025 264 / 0.6)",
                  }}
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-[11px] text-white/40 italic">
        Tip: use the ↑ / ↓ arrows to reorder. Touch friendly.
      </p>
    </QuestionShell>
  );
}

// ---------- Dispatcher ----------

interface QuestionDispatcherProps {
  topicId: string;
  question: Question;
  index: number;
  theme: QuestionShellProps["theme"];
  value: AnswerValue | undefined;
  correctValue?: AnswerValue;
  showCorrect?: boolean;
  onAnswer: (v: AnswerValue) => void;
}

export function QuestionView(props: QuestionDispatcherProps) {
  const { question, topicId, index, theme, value, correctValue, showCorrect, onAnswer } = props;
  switch (question.type) {
    case "mcq":
      return (
        <MCQQuestionView
          question={question}
          index={index}
          theme={theme}
          value={value as string | undefined}
          correctValue={correctValue as string | undefined}
          showCorrect={showCorrect}
          onAnswer={(v) => onAnswer(v)}
        />
      );
    case "yesno":
      return (
        <YesNoQuestionView
          question={question}
          index={index}
          theme={theme}
          value={value as "yes" | "no" | undefined}
          correctValue={correctValue as "yes" | "no" | undefined}
          showCorrect={showCorrect}
          onAnswer={(v) => onAnswer(v)}
        />
      );
    case "check":
      return (
        <CheckQuestionView
          topicId={topicId}
          question={question}
          index={index}
          theme={theme}
          value={value as Record<string, "tick" | "cross" | ""> | undefined}
          correctValue={correctValue as Record<string, "tick" | "cross" | ""> | undefined}
          showCorrect={showCorrect}
          onAnswer={(v) => onAnswer(v)}
        />
      );
    case "ordering":
      return (
        <OrderingQuestionView
          question={question}
          index={index}
          theme={theme}
          value={value as string[] | undefined}
          correctValue={correctValue as string[] | undefined}
          showCorrect={showCorrect}
          onAnswer={(v) => onAnswer(v)}
        />
      );
    default:
      return null;
  }
}
