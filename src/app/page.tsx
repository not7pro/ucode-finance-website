"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, User, Users, Briefcase } from "lucide-react";

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      {/* Calm minimal header */}
      <header className="border-b border-border/40 px-6 py-4 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center font-mono font-bold text-primary-foreground text-sm">
            U
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              UCODE AGENCY OS
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Colombo &bull; Gulf
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main calm entrance */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Production Operating System v2.0
        </div>

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
          Calm, un-cluttered studio execution.
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-xl">
          Engineered for Ucode Agency creative sprints, partner financial splits, and friction-free client approvals.
        </p>

        {/* 3 Role Entrances (Linear-style cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-10 text-left">
          {/* Founder */}
          <Link
            href="/founder"
            className="group p-5 rounded-lg border border-border/80 bg-card hover:border-primary/50 transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>Founder OS</span>
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                4-number financial pulse, 50/50 equity ledger, client approvals, and Growth Lab.
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground/80 mt-6 pt-3 border-t border-border/40">
              Role: Founder & CEO
            </span>
          </Link>

          {/* Employee */}
          <Link
            href="/employee/today"
            className="group p-5 rounded-lg border border-border/80 bg-card hover:border-primary/50 transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>Employee Today</span>
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Good morning agenda, priority task list, 1-click focus timer, and 3-field submission drawer.
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground/80 mt-6 pt-3 border-t border-border/40">
              Role: Production Specialist
            </span>
          </Link>

          {/* Client */}
          <Link
            href="/portal"
            className="group p-5 rounded-lg border border-border/80 bg-card hover:border-primary/50 transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>VIP Client Portal</span>
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Project progress milestone, visual proof sign-off, new requests, and transparent invoicing.
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground/80 mt-6 pt-3 border-t border-border/40">
              Client: Sip & Play Cafe
            </span>
          </Link>
        </div>
      </main>

      {/* Subtle footer */}
      <footer className="border-t border-border/40 px-6 py-4 text-center text-xs text-muted-foreground">
        Ucode Media (Pvt) Ltd &bull; 109 Quarry Road, Dehiwala, Sri Lanka &bull; universalcode.site
      </footer>
    </div>
  );
}
