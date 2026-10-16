"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Persistent state hook backed by localStorage with cross-tab sync.
 * Each worksheet keeps: student name, answers per question id, submitted flag, score.
 *
 * Built with useSyncExternalStore so the linter is happy and so SSR/hydration
 * is well-defined (server returns {} — no localStorage; client hydrates after mount).
 */

export type AnswerValue =
  | string // mcq selected option id, yesno "yes"|"no", check "tick"|"cross"
  | string[] // ordering: ordered list of item ids
  | Record<string, "tick" | "cross" | "">; // check-group: per-statement answer

export interface WorksheetState {
  name: string;
  answers: Record<string, AnswerValue>;
  submitted: boolean;
  // ISO timestamp of student submission (null if not submitted)
  submittedAt: number | null;
  // teacher-provided answer key (optional)
  answerKey: Record<string, AnswerValue>;
  lastUpdated: number;
}

export type AllStates = Record<string, WorksheetState>; // keyed by topic id

const STORAGE_KEY = "osw-ls3-worksheets-v1";

function emptyState(): WorksheetState {
  return {
    name: "",
    answers: {},
    submitted: false,
    submittedAt: null,
    answerKey: {},
    lastUpdated: 0,
  };
}

// Migration: gracefully handle older saved states that don't have submittedAt
function migrateState(s: Partial<WorksheetState>): WorksheetState {
  return {
    ...emptyState(),
    ...s,
    submittedAt: s.submittedAt ?? (s.submitted ? Date.now() : null),
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadAll(): AllStates {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const result: AllStates = {};
    for (const [k, v] of Object.entries(parsed as Record<string, Partial<WorksheetState>>)) {
      result[k] = migrateState(v);
    }
    return result;
  } catch {
    return {};
  }
}

// --- module-level in-memory cache + listeners (for useSyncExternalStore) ---
let cachedSnapshot: AllStates = {};
let initialized = false;
const listeners = new Set<() => void>();

function getSnapshot(): AllStates {
  if (!initialized && isBrowser()) {
    cachedSnapshot = loadAll();
    initialized = true;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): AllStates {
  return {};
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!initialized && isBrowser()) {
    cachedSnapshot = loadAll();
    initialized = true;
  }
  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_KEY) {
      cachedSnapshot = loadAll();
      listeners.forEach((l) => l());
    }
  }
  if (isBrowser()) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (isBrowser()) window.removeEventListener("storage", onStorage);
  };
}

function commit(next: AllStates) {
  cachedSnapshot = next;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors silently
    }
  }
  listeners.forEach((l) => l());
}

function updateOne(topicId: string, updater: (prev: WorksheetState) => WorksheetState) {
  const prevAll = getSnapshot();
  const prev = prevAll[topicId] ?? emptyState();
  const next = updater(prev);
  next.lastUpdated = Date.now();
  commit({ ...prevAll, [topicId]: next });
}

export function useWorksheetState(topicId: string) {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const current = all[topicId] ?? emptyState();

  const setName = useCallback(
    (name: string) => updateOne(topicId, (p) => ({ ...p, name })),
    [topicId],
  );

  const setAnswer = useCallback(
    (questionId: string, value: AnswerValue) =>
      updateOne(topicId, (p) => ({ ...p, answers: { ...p.answers, [questionId]: value } })),
    [topicId],
  );

  const setSubmitted = useCallback(
    (submitted: boolean) =>
      updateOne(topicId, (p) => ({
        ...p,
        submitted,
        submittedAt: submitted ? Date.now() : null,
      })),
    [topicId],
  );

  const setAnswerKey = useCallback(
    (questionId: string, value: AnswerValue) =>
      updateOne(topicId, (p) => ({ ...p, answerKey: { ...p.answerKey, [questionId]: value } })),
    [topicId],
  );

  const reset = useCallback(
    () =>
      updateOne(topicId, (p) => ({
        ...emptyState(),
        answerKey: p.answerKey, // keep answer key
      })),
    [topicId],
  );

  const resetAll = useCallback(() => updateOne(topicId, () => emptyState()), [topicId]);

  return {
    state: current,
    hydrated: true,
    setName,
    setAnswer,
    setSubmitted,
    setAnswerKey,
    reset,
    resetAll,
  };
}

export function useAllWorksheetStates() {
  const all = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { all, hydrated: true };
}

export function countAnswered(state: WorksheetState): number {
  return Object.values(state.answers).filter(isAnswerFilled).length;
}

export function isAnswerFilled(v: AnswerValue | undefined): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") {
    const vals = Object.values(v);
    if (vals.length === 0) return false;
    return vals.every((x) => x === "tick" || x === "cross");
  }
  return false;
}
