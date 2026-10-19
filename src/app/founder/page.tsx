"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  DollarSign,
  FileText,
  Users,
  Compass,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { formatCurrency } from "@/lib/utils";

interface AttentionItem {
  id: string;
  type: "slip" | "overdue" | "qa";
  title: string;
  subtitle: string;
  amountCents?: number;
  currency?: "LKR" | "SAR";
  actionLabel: string;
}

export default function FounderHomePage() {
  const [currency, setCurrency] = React.useState<"LKR" | "SAR">("LKR");
  const [attentionItems, setAttentionItems] = React.useState<AttentionItem[]>([
    {
      id: "att-1",
      type: "slip",
      title: "Bank Slip Uploaded: Sip & Play Cafe",
      subtitle: "15,000.00 LKR final balance transfer via Commercial Bank Dehiwala",
      amountCents: 1500000,
      currency: "LKR",
      actionLabel: "Verify Slip",
    },
    {
      id: "att-2",
      type: "overdue",
      title: "Overdue Invoice: Nature's Treasure",
      subtitle: "INV-2026-0004 &bull; Due Oct 15 &bull; 20,000.00 LKR outstanding",
      amountCents: 2000000,
      currency: "LKR",
      actionLabel: "Send Reminder",
    },
    {
      id: "att-3",
      type: "qa",
      title: "Creative QA Sign-Off: Autumn Menu v1.2",
      subtitle: "Sarah Lin submitted revised drinks menu layout & bleed specs",
      actionLabel: "Review Draft",
    },
  ]);

  const [activeDrawer, setActiveDrawer] = React.useState<AttentionItem | null>(null);

  // FX converter factor: 1 SAR = 82.5 LKR
  const fx = currency === "SAR" ? 1 / 82.5 : 1;

  const handleAction = (item: AttentionItem) => {
    setActiveDrawer(item);
  };

  const handleResolve = (id: string) => {
    setAttentionItems((prev) => prev.filter((i) => i.id !== id));
    setActiveDrawer(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Calm Founder Navigation (Max 5 items) */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/founder" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center font-mono font-bold text-primary-foreground text-xs">
                U
              </div>
              <span className="font-semibold text-sm tracking-tight text-foreground">
                UCODE FOUNDER
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/founder"
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-muted text-foreground"
              >
                Home
              </Link>
              <Link
                href="/founder/clients"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Clients
              </Link>
              <Link
                href="/founder/money"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Money
              </Link>
              <Link
                href="/founder/team"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Team
              </Link>
              <Link
                href="/founder/growth-lab"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1"
              >
                <Compass className="h-3.5 w-3.5 text-primary" />
                Growth Lab
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center rounded-md border border-border/80 bg-background/50 p-0.5 text-xs font-mono">
              <button
                onClick={() => setCurrency("LKR")}
                className={`px-2 py-0.5 rounded ${
                  currency === "LKR"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                LKR
              </button>
              <button
                onClick={() => setCurrency("SAR")}
                className={`px-2 py-0.5 rounded ${
                  currency === "SAR"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                SAR
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-foreground">
              AA
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Calm Greeting */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Good morning, Abdullah
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Agency net profit margin is 74%. 2 client payments require your verification today.
          </p>
        </div>

        {/* 4 Numbers Only (Hard Limit) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Cash in Bank */}
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Cash in Bank
              </span>
              <div className="text-2xl font-bold tracking-tight font-mono text-foreground tabular-nums">
                {formatCurrency(Math.round(248500000 * fx), currency, false)}
              </div>
              <p className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3" /> +12% vs September
              </p>
            </CardContent>
          </Card>

          {/* 2. Received this Month */}
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Received (October)
              </span>
              <div className="text-2xl font-bold tracking-tight font-mono text-foreground tabular-nums">
                {formatCurrency(Math.round(74000000 * fx), currency, false)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                3 client retainers collected
              </p>
            </CardContent>
          </Card>

          {/* 3. Outstanding */}
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Outstanding
              </span>
              <div className="text-2xl font-bold tracking-tight font-mono text-amber-500 tabular-nums">
                {formatCurrency(Math.round(14500000 * fx), currency, false)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                2 invoices awaiting payment
              </p>
            </CardContent>
          </Card>

          {/* 4. Profit Share (50/50) */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                Net Profit Share
              </span>
              <div className="text-2xl font-bold tracking-tight font-mono text-primary tabular-nums">
                {formatCurrency(Math.round(91850000 * fx), currency, false)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                50/50 split &bull; Abdullah &amp; Umar
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Needs Your Attention (Max 4 items) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>Needs Your Attention</span>
              <Badge variant="outline" className="font-mono text-[10px]">
                {attentionItems.length}
              </Badge>
            </h3>
          </div>

          {attentionItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                <h4 className="text-sm font-semibold text-foreground">
                  All clear!
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No unverified bank slips, overdue invoices, or QA review blocks pending your sign-off.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {attentionItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/80 bg-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-border transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {item.type === "slip" && (
                        <Badge variant="warning">Bank Slip</Badge>
                      )}
                      {item.type === "overdue" && (
                        <Badge variant="rush">Overdue</Badge>
                      )}
                      {item.type === "qa" && (
                        <Badge variant="secondary">QA Review</Badge>
                      )}
                      <h4 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h4>
                    </div>
                    <p
                      className="text-xs text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: item.subtitle }}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(item)}
                    className="self-end sm:self-center"
                  >
                    {item.actionLabel}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quiet Cashflow Trend */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              6-Month Cashflow Summary
            </h3>
            <Link
              href="/founder/money"
              className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              View complete P&L ledger <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-xs text-muted-foreground">Monthly Revenue</span>
                  <div className="text-xl font-bold font-mono mt-1">740,000 LKR</div>
                  <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full w-[85%]" />
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground">Contractor COGS</span>
                  <div className="text-xl font-bold font-mono mt-1">115,000 LKR</div>
                  <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full w-[16%]" />
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground">Net Agency Margin</span>
                  <div className="text-xl font-bold font-mono mt-1 text-primary">74.2%</div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Top 5% efficiency for boutique creative agencies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Slide-over Action Drawer */}
      <Drawer
        isOpen={!!activeDrawer}
        onClose={() => setActiveDrawer(null)}
        title={activeDrawer?.title || "Action Details"}
        description="Verify details and dispatch client confirmation"
        footer={
          activeDrawer && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setActiveDrawer(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleResolve(activeDrawer.id)}
              >
                Confirm &amp; Sign Off
              </Button>
            </>
          )
        }
      >
        {activeDrawer && (
          <div className="space-y-4 text-xs">
            <div className="rounded-md bg-muted/50 p-3 border border-border/40">
              <span className="text-muted-foreground">Action Summary:</span>
              <p className="font-medium text-foreground mt-1">
                {activeDrawer.subtitle}
              </p>
            </div>

            {activeDrawer.type === "slip" && (
              <div className="space-y-2">
                <span className="font-semibold text-foreground">Verified Bank Receipt:</span>
                <div className="h-40 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground bg-background/50">
                  [ Commercial Bank Slip: 15,000.00 LKR &bull; Ref #892104 ]
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Confirming will automatically mark Invoice INV-2026-0007 as Paid and email a tax receipt to Vivian (Sip &amp; Play).
                </p>
              </div>
            )}

            {activeDrawer.type === "overdue" && (
              <div className="space-y-2">
                <span className="font-semibold text-foreground">1-Click Reminder:</span>
                <p className="text-[11px] text-muted-foreground">
                  Sends friendly WhatsApp message &amp; email reminder to Nature&apos;s Treasure billing team with payment link.
                </p>
              </div>
            )}

            {activeDrawer.type === "qa" && (
              <div className="space-y-2">
                <span className="font-semibold text-foreground">Asset Review:</span>
                <div className="p-3 rounded-md border border-border bg-background space-y-1">
                  <div className="font-semibold">Autumn Menu &amp; QR Standee v1.2.pdf</div>
                  <div className="text-muted-foreground">300 DPI Fogra39 CMYK &bull; 3mm bleed</div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
