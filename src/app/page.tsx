"use client";

import { useEffect, useState } from "react";
import { Dashboard } from "@/components/worksheet/Dashboard";
import { WorksheetView } from "@/components/worksheet/WorksheetView";
import { TOPICS, getTopic } from "@/lib/worksheets";

type Route = { name: "home" } | { name: "worksheet"; topicId: string };

function parseHash(): Route {
  if (typeof window === "undefined") return { name: "home" };
  const h = window.location.hash.replace(/^#\/?/, "").trim();
  if (!h) return { name: "home" };
  const topic = getTopic(h);
  if (topic) return { name: "worksheet", topicId: topic.id };
  return { name: "home" };
}

// SSR-safe initial route (server sees "home", client also defaults to "home",
// then the effect below syncs the actual hash on mount).
function getInitialRoute(): Route {
  return { name: "home" };
}

export default function Home() {
  const [route, setRoute] = useState<Route>(getInitialRoute);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    setRoute(parseHash());
    /* eslint-enable react-hooks/set-state-in-effect */
    function onHash() {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function navigate(topicId: string) {
    if (typeof window !== "undefined") {
      window.location.hash = `/${topicId}`;
    }
    setRoute({ name: "worksheet", topicId });
    window.scrollTo({ top: 0 });
  }

  function backHome() {
    if (typeof window !== "undefined") {
      history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search,
      );
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    setRoute({ name: "home" });
    window.scrollTo({ top: 0 });
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-300/70 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  if (route.name === "worksheet") {
    const topic = getTopic(route.topicId);
    if (!topic) {
      return <Dashboard onOpen={navigate} />;
    }
    const idx = TOPICS.findIndex((t) => t.id === topic.id);
    const prev = idx > 0 ? TOPICS[idx - 1] : undefined;
    const next = idx < TOPICS.length - 1 ? TOPICS[idx + 1] : undefined;
    return (
      <WorksheetView
        topic={topic}
        onBack={backHome}
        onNavigate={navigate}
        prevTopic={prev}
        nextTopic={next}
      />
    );
  }

  return <Dashboard onOpen={navigate} />;
}
