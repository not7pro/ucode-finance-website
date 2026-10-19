"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  FileCheck,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  FileText,
  DollarSign,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";

export default function ClientPortalHomePage() {
  const [hasApproved, setHasApproved] = React.useState(false);
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);

  const handleApprove = () => {
    setHasApproved(true);
    setIsReviewOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-6">
      {/* Client Header (Max 5 items) */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/portal" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                SP
              </div>
              <div className="leading-tight">
                <span className="font-semibold text-sm tracking-tight text-foreground block">
                  SIP &amp; PLAY CAFE
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Powered by Ucode Agency
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/portal"
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-muted text-foreground"
              >
                Home
              </Link>
              <Link
                href="/portal/approvals"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Approvals
              </Link>
              <Link
                href="/portal/requests"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Requests
              </Link>
              <Link
                href="/portal/files"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Files
              </Link>
              <Link
                href="/portal/invoices"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Invoices
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Vivian Vance
            </span>
            <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-foreground">
              VV
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Project Header & Single Progress Line */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Omnichannel Web &amp; Social Retainer
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              Launch Milestone: Oct 30, 2026
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Phase 3 of 4: Dynamic Web Application &amp; Table Booking</span>
              <span className="font-mono font-semibold text-primary">75% complete</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[75%] transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Action Required Card */}
        <section className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Action Required
          </span>

          {!hasApproved ? (
            <div className="rounded-lg border border-primary/40 bg-primary/5 p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Ready for Sign-Off</Badge>
                    <span className="text-xs text-muted-foreground font-mono">v1.2</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Autumn Drinks Menu &amp; QR Table Standees v1.2
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Uploaded by Sarah Lin today at 11:30 AM &bull; 2 revision rounds remaining in your retainer.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsReviewOpen(true)}
                  className="shrink-0"
                >
                  Review &amp; Sign Off <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center space-y-2">
                <CheckCircle2 className="h-7 w-7 text-primary mx-auto" />
                <h4 className="text-sm font-semibold text-foreground">
                  You&apos;re all caught up!
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Autumn Drinks Menu v1.2 was signed off and dispatched to Dehiwala Print Express. Our dev team is currently finalizing the Commercial Bank IPG webhook.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Recent Updates (3 items) */}
        <section className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Studio Updates
          </span>

          <div className="rounded-lg border border-border/80 bg-card divide-y divide-border/40">
            <div className="p-4 flex items-center justify-between text-xs hover:bg-muted/30 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">
                  Table reservation booking engine pushed to staging
                </p>
                <p className="text-muted-foreground">
                  Tested calendar slots, player limits, and mobile drinks ordering.
                </p>
              </div>
              <span className="text-muted-foreground font-mono shrink-0 ml-4">
                Oct 18
              </span>
            </div>

            <div className="p-4 flex items-center justify-between text-xs hover:bg-muted/30 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">
                  6x October Instagram Reels scheduled
                </p>
                <p className="text-muted-foreground">
                  Board game tournaments and weekend waffle promo clips approved.
                </p>
              </div>
              <span className="text-muted-foreground font-mono shrink-0 ml-4">
                Oct 16
              </span>
            </div>

            <div className="p-4 flex items-center justify-between text-xs hover:bg-muted/30 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">
                  Invoice INV-2026-0006 marked Paid
                </p>
                <p className="text-muted-foreground">
                  Initial retainer deposit of 73,300.00 LKR verified &bull; Receipt #REC-2026-0001 issued.
                </p>
              </div>
              <span className="text-muted-foreground font-mono shrink-0 ml-4">
                Oct 04
              </span>
            </div>
          </div>
        </section>

        {/* Retainer Health Summary */}
        <section className="p-4 rounded-lg border border-border/60 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>
              <strong>Retainer Status:</strong> Active &bull; 10 of 12 Monthly Reels Delivered
            </span>
          </div>
          <span>Guaranteed 24h Turnaround SLA &bull; Priority Studio Support</span>
        </section>
      </main>

      {/* Review & Sign-Off Slide-Over Drawer */}
      <Drawer
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="Review & Sign Off Deliverable"
        description="Autumn Drinks Menu & QR Table Standees v1.2"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsReviewOpen(false)}>
              Request Change
            </Button>
            <Button variant="primary" size="sm" onClick={handleApprove}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve &amp; Lock Version
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-md border border-border bg-background p-3 space-y-1">
            <div className="font-semibold text-foreground">Sarah&apos;s Revision Notes:</div>
            <p className="text-muted-foreground">
              &quot;Adjusted iced matcha cloud latte price to 1,250 LKR, enlarged QR code by 20% for easy table scanning, and applied 300 DPI Fogra39 CMYK color profile.&quot;
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-foreground">Pre-Press Specifications:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
              <li>Paper: 350gsm Silk Artboard with Matte Thermal Lamination</li>
              <li>Dimensions: 148mm x 210mm (A5 Double Sided)</li>
              <li>Bleed: 3mm exterior cutting allowance verified</li>
            </ul>
          </div>

          <div className="h-48 rounded-md border border-dashed border-border/80 bg-background/50 flex flex-col items-center justify-center text-center p-4">
            <FileCheck className="h-8 w-8 text-primary mb-2" />
            <span className="font-semibold text-foreground">
              Autumn_Menu_Standee_v1.2_Fogra39.pdf
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              4.2 MB &bull; SHA-256 Verified
            </span>
          </div>
        </div>
      </Drawer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border/80 h-16 flex items-center justify-around z-30 px-4">
        <Link
          href="/portal"
          className="flex flex-col items-center gap-1 text-primary text-[10px] font-semibold"
        >
          <Layers className="h-5 w-5" />
          Home
        </Link>
        <Link
          href="/portal/approvals"
          className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"
        >
          <FileCheck className="h-5 w-5" />
          Approvals
        </Link>
        <Link
          href="/portal/requests"
          className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"
        >
          <MessageSquare className="h-5 w-5" />
          Requests
        </Link>
        <Link
          href="/portal/invoices"
          className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"
        >
          <DollarSign className="h-5 w-5" />
          Invoices
        </Link>
      </nav>
    </div>
  );
}
