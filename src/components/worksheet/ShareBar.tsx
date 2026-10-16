"use client";

import { useState } from "react";
import {
  Printer,
  Share2,
  Link2,
  RefreshCw,
  Check,
  Clipboard,
  Twitter,
  Facebook,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareBarProps {
  topicId: string;
  topicTitle: string;
  theme: { primary: string; accent: string };
  onPrint?: () => void;
  onReset?: () => void;
}

export function ShareBar({ topicId, topicTitle, theme, onPrint, onReset }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}#/${topicId}`
      : "";

  const shareText = `Oxford Skills World 3 — Topic ${topicId.slice(1)} Listening Test: "${topicTitle}"`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: shareText,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      copyLink();
    }
  }

  function openShare(provider: "twitter" | "facebook" | "email") {
    const u = encodeURIComponent(shareUrl);
    const t = encodeURIComponent(shareText);
    let url = "";
    if (provider === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
    } else if (provider === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`;
    } else if (provider === "email") {
      url = `mailto:?subject=${t}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onPrint ?? (() => typeof window !== "undefined" && window.print())}
        className="gap-2 glass text-white hover:bg-white/15 border border-white/15"
        style={{ color: theme.accent }}
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>

      <Button
        type="button"
        size="sm"
        onClick={copyLink}
        className="gap-2 text-white btn3d"
        style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
          borderColor: theme.accent,
          boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.25), 0 6px 16px -4px ${theme.accent}aa`,
        }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy link"}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-2 glass text-white hover:bg-white/15 border border-white/15"
            style={{ color: theme.accent }}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass-strong border border-white/15 text-white">
          <DropdownMenuLabel className="text-white/80">Share this worksheet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={nativeShare} className="gap-2 cursor-pointer text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
            <Share2 className="w-4 h-4" /> System share…
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyLink} className="gap-2 cursor-pointer text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
            <Clipboard className="w-4 h-4" /> Copy link
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={() => openShare("twitter")}
            className="gap-2 cursor-pointer text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <Twitter className="w-4 h-4" /> Twitter / X
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openShare("facebook")}
            className="gap-2 cursor-pointer text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <Facebook className="w-4 h-4" /> Facebook
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openShare("email")}
            className="gap-2 cursor-pointer text-white/80 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          >
            <Mail className="w-4 h-4" /> Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {onReset && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onReset}
          className="gap-2 text-white/60 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      )}
    </div>
  );
}
