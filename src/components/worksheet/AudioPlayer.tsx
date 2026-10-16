"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
  Headphones,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  /** Title of the listening passage (e.g. "Angelo and the Musician") */
  title: string;
  /** Topic number for the visual label */
  topicNumber: number;
  /** Theme accent color (hex) */
  accent: string;
  /** Theme primary color (hex) */
  primary: string;
  /** Theme gradient as [from, to] hex */
  gradient: [string, string];
  /** Optional second-listen label, e.g. "Listen again" */
  secondListen?: boolean;
  /** Storage key suffix for per-topic play position persistence */
  storageKey?: string;
}

/**
 * Self-contained audio player UI for listening tests.
 *
 * Since no actual audio files ship with the worksheets, this component
 * simulates playback with a synthetic ~2-minute passage. The UI is fully
 * interactive: play/pause, seek by clicking the waveform, change speed,
 * mute, restart. The play position is persisted per-topic in localStorage.
 *
 * Teachers can later swap in a real <audio> element by setting `src`.
 */
export function AudioPlayer({
  title,
  topicNumber,
  accent,
  primary,
  gradient,
  secondListen = false,
  storageKey,
}: AudioPlayerProps) {
  // Simulated duration: 2:00 for first listen, 2:00 for second listen
  const DURATION_SEC = 120;
  const TICK_MS = 250;

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // seconds
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5 | 2>(1);
  const [muted, setMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const storeKey = storageKey ?? `osw-audio-T${topicNumber}${secondListen ? "-b" : ""}`;

  // restore last position on mount
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = window.localStorage.getItem(storeKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.position === "number") {
          setPosition(Math.min(parsed.position, DURATION_SEC));
        }
        if (typeof parsed.hasStarted === "boolean") {
          setHasStarted(parsed.hasStarted);
        }
      }
    } catch {
      /* ignore */
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [storeKey]);

  // persist position
  useEffect(() => {
    try {
      window.localStorage.setItem(
        storeKey,
        JSON.stringify({ position, hasStarted }),
      );
    } catch {
      /* ignore */
    }
  }, [position, hasStarted, storeKey]);

  // ticking playback
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setPosition((p) => {
        const next = p + (TICK_MS / 1000) * speed;
        if (next >= DURATION_SEC) {
          setIsPlaying(false);
          return DURATION_SEC;
        }
        return next;
      });
    }, TICK_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed]);

  const togglePlay = useCallback(() => {
    setHasStarted(true);
    setIsPlaying((p) => !p);
  }, []);

  const restart = useCallback(() => {
    setPosition(0);
    setIsPlaying(true);
    setHasStarted(true);
  }, []);

  const skip = useCallback(
    (delta: number) => {
      setPosition((p) => Math.min(Math.max(0, p + delta), DURATION_SEC));
    },
    [],
  );

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setPosition(Math.min(Math.max(0, pct * DURATION_SEC), DURATION_SEC));
  }

  const progressPct = (position / DURATION_SEC) * 100;
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // synthetic waveform bars (deterministic per topic)
  const bars = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => {
        const seed =
          (i * 9301 + topicNumber * 49297 + (secondListen ? 17 : 23)) % 233280;
        const r = seed / 233280;
        return 0.3 + r * 0.7; // 0.3..1
      }),
    [topicNumber, secondListen],
  );

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden glass-strong sheen",
        "p-4 sm:p-5",
      )}
    >
      {/* glow background */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${accent}22 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 100% 50%, ${primary}22 0%, transparent 60%)`,
        }}
      />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white shadow-lg btn3d",
            )}
            style={{
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            }}
          >
            <Headphones className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${accent}33`, color: accent }}
              >
                Audio Passage
              </span>
              {secondListen && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  Listen again
                </span>
              )}
              {isPlaying && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                  Now playing
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white text-glow mt-1 leading-tight truncate">
              {title}
            </h3>
          </div>
        </div>

        {/* Waveform */}
        <div
          className="relative h-14 sm:h-16 cursor-pointer select-none"
          onClick={handleSeek}
          role="slider"
          aria-label="Seek audio"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="absolute inset-0 flex items-center gap-[2px]">
            {bars.map((h, i) => {
              const barPct = (i / bars.length) * 100;
              const played = barPct <= progressPct;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-colors"
                  style={{
                    height: `${h * 100}%`,
                    background: played
                      ? `linear-gradient(180deg, ${accent}, ${primary})`
                      : "oklch(0.6 0.02 264 / 0.35)",
                    transform: isPlaying && played ? "scaleY(1)" : "scaleY(0.85)",
                    transition: "background 250ms ease, transform 250ms ease",
                  }}
                />
              );
            })}
          </div>
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
            style={{
              left: `${progressPct}%`,
              background: "#fff",
              boxShadow: `0 0 8px ${accent}`,
            }}
          >
            <div
              className="absolute -top-1 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white"
              style={{ background: accent, left: "50%" }}
            />
          </div>
        </div>

        {/* Time + speed row */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="font-mono text-white/70 tabular-nums">
            {formatTime(position)}
          </span>
          <div className="flex items-center gap-1">
            {([1, 1.25, 1.5, 2] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold transition-all",
                  speed === s
                    ? "text-white"
                    : "text-white/50 hover:text-white/80",
                )}
                style={
                  speed === s
                    ? { background: accent, color: "#0b1220" }
                    : { background: "oklch(1 0 0 / 0.06)" }
                }
              >
                {s}×
              </button>
            ))}
          </div>
          <span className="font-mono text-white/70 tabular-nums">
            {formatTime(DURATION_SEC)}
          </span>
        </div>

        {/* Controls */}
        <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => skip(-10)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white transition-colors btn3d"
            aria-label="Rewind 10 seconds"
            title="Rewind 10s"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (position >= DURATION_SEC) {
                restart();
              } else {
                togglePlay();
              }
            }}
            className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white btn3d shadow-xl",
            )}
            style={{
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={() => skip(10)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white transition-colors btn3d"
            aria-label="Forward 10 seconds"
            title="Forward 10s"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-white/15 mx-1" />

          <button
            type="button"
            onClick={restart}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white transition-colors btn3d"
            aria-label="Restart"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white transition-colors btn3d"
            aria-label={muted ? "Unmute" : "Mute"}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Helper text */}
        {!hasStarted && (
          <p className="mt-3 text-center text-[11px] text-white/50 italic">
            Press play to start the listening passage. You can replay it any time.
          </p>
        )}
        {hasStarted && !isPlaying && position < DURATION_SEC && (
          <p className="mt-3 text-center text-[11px] text-white/50 italic">
            Paused at {formatTime(position)}. Press play to continue.
          </p>
        )}
        {position >= DURATION_SEC && (
          <p className="mt-3 text-center text-[11px] text-emerald-300 font-semibold">
            ✓ Finished. You can replay it as many times as you like.
          </p>
        )}
      </div>
    </div>
  );
}
