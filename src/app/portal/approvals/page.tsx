"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, MessageSquare, Eye, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ClientApprovalsPage() {
  const [isApproved, setIsApproved] = React.useState(false);
  const [pins, setPins] = React.useState<Array<{ x: number; y: number; text: string }>>([
    { x: 38, y: 44, text: "QR code size is perfect now, scans instantly." },
  ]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isApproved) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const comment = window.prompt("Add proofing comment at this pin location:");
    if (comment && comment.trim()) {
      setPins((prev) => [...prev, { x, y, text: comment.trim() }]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-6">
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/portal"
              className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Home
            </Link>
            <span className="text-border">|</span>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              Visual Proofing &bull; Autumn Menu Standee v1.2
            </span>
          </div>

          {!isApproved ? (
            <Button variant="primary" size="sm" onClick={() => setIsApproved(true)}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve &amp; Lock v1.2
            </Button>
          ) : (
            <Badge variant="success">Version Locked &bull; In Production</Badge>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Interactive Visual Proofing Canvas
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click anywhere on the visual draft to pin feedback directly for our studio designers.
          </p>
        </div>

        {/* Interactive Proof Canvas */}
        <div
          onClick={handleCanvasClick}
          className="relative h-96 w-full rounded-lg border border-border bg-card/60 flex items-center justify-center cursor-crosshair overflow-hidden select-none"
        >
          {/* Mock Graphic Artboard */}
          <div className="w-80 h-80 rounded-md border border-border/80 bg-background/80 p-6 flex flex-col justify-between shadow-lg text-center pointer-events-none">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-primary">
                Sip &amp; Play Cafe &bull; Autumn 2026
              </span>
              <h3 className="text-base font-bold text-foreground">
                Specialty Refreshments &amp; Drinks Menu
              </h3>
            </div>

            <div className="py-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span>Iced Matcha Cloud Latte</span>
                <span className="font-bold font-mono text-primary">1,250 LKR</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span>Salted Caramel Cold Brew</span>
                <span className="font-bold font-mono text-primary">1,100 LKR</span>
              </div>
              <div className="flex justify-between">
                <span>Belgian Nutella Waffle</span>
                <span className="font-bold font-mono text-primary">1,450 LKR</span>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground border-t border-border/40 pt-2 font-mono">
              [ Scan Table QR Code for Instant Ordering ]
            </div>
          </div>

          {/* Interactive Pinned Comments */}
          {pins.map((pin, i) => (
            <div
              key={i}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
            >
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-md animate-bounce">
                {i + 1}
              </div>
              <div className="hidden group-hover:block absolute left-full ml-2 top-0 bg-popover text-popover-foreground border border-border p-2 rounded-md shadow-xl text-xs w-48 z-30 pointer-events-none">
                {pin.text}
              </div>
            </div>
          ))}
        </div>

        {/* Pinned Feedback Threads */}
        <section className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Proofing Notes ({pins.length})
          </span>
          <div className="rounded-lg border border-border/80 bg-card divide-y divide-border/40 text-xs">
            {pins.map((p, idx) => (
              <div key={idx} className="p-3 flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{p.text}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Pinned at {p.x}% x {p.y}% by Vivian Vance
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
