"use client";

import Link from "next/link";
import { Brain, BookOpen, ShieldCheck, Github, Linkedin } from "lucide-react";

export function AppFooter() {
  return (
    <footer
      className="
        relative z-40
        border-t
        border-border/60
        bg-white/70 dark:bg-[#0b1020]/70
        backdrop-blur-xl
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
          {/* LEFT: Brand + purpose */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <Brain size={16} />
              AI Study Buddy
            </div>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              Built for students of Bharat 🇮🇳
            </span>
          </div>

          {/* CENTER: Quick links */}
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link
              href="/dashboard"
              className="hover:text-foreground transition"
            >
              Dashboard
            </Link>
            <Link
              href="/study-planner"
              className="hover:text-foreground transition"
            >
              Study Planner
            </Link>
            <Link
              href="/doubt-solver"
              className="hover:text-foreground transition"
            >
              Doubt Solver
            </Link>
            <Link
              href="/notes-summarizer"
              className="hover:text-foreground transition"
            >
              Notes
            </Link>
          </div>

          {/* RIGHT: Trust + credits */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>Privacy-first</span>
            </div>

            <span className="hidden sm:inline">·</span>

            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
