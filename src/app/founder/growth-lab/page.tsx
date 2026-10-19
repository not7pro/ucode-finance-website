"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Cpu,
  FileCheck,
  Send,
  Zap,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function GrowthLabPage() {
  const [retainerClientsCount, setRetainerClientsCount] = React.useState(3);
  const [avgRetainerFeeLkr, setAvgRetainerFeeLkr] = React.useState(85000);
  const [churnRatePct, setChurnRatePct] = React.useState(8);
  const [newLeadsPerMonth, setNewLeadsPerMonth] = React.useState(2);

  // Gaussian 1,000-run Monte Carlo Simulation
  const simulationResults = React.useMemo(() => {
    const runs = 1000;
    const months = 6;
    const outcomes: number[] = [];

    for (let i = 0; i < runs; i++) {
      let clients = retainerClientsCount;
      let totalRevenue = 0;

      for (let m = 0; m < months; m++) {
        // Stochastic monthly churn (binomial approximation)
        for (let c = 0; c < clients; c++) {
          if (Math.random() < churnRatePct / 100) {
            clients = Math.max(0, clients - 1);
          }
        }
        // Stochastic signed new clients (Poisson-like approximation)
        const won = Math.random() < 0.4 ? newLeadsPerMonth : Math.floor(Math.random() * (newLeadsPerMonth + 1));
        clients += won;

        // Gaussian noise on project addon upsells (+/- 15%)
        const stochasticFee = avgRetainerFeeLkr * (1 + (Math.random() - 0.5) * 0.3);
        totalRevenue += clients * stochasticFee;
      }
      outcomes.push(totalRevenue);
    }

    outcomes.sort((a, b) => a - b);

    const p10 = outcomes[Math.floor(runs * 0.1)]; // Conservative (P10)
    const p50 = outcomes[Math.floor(runs * 0.5)]; // Expected (P50)
    const p90 = outcomes[Math.floor(runs * 0.9)]; // Optimistic (P90)

    return { p10, p50, p90 };
  }, [retainerClientsCount, avgRetainerFeeLkr, churnRatePct, newLeadsPerMonth]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/founder"
              className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Home
            </Link>
            <span className="text-border">|</span>
            <span className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> Growth Lab &bull; Monte Carlo Engine
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Strategic Revenue Simulation &bull; Monte Carlo (1,000 Runs)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Statistical probabilistic modeling of 6-month agency revenue incorporating random client churn and signed retainers.
          </p>
        </div>

        {/* Simulator Controls & P10/P50/P90 Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Simulation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Retainer Clients</span>
                  <span className="font-mono font-bold">{retainerClientsCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={retainerClientsCount}
                  onChange={(e) => setRetainerClientsCount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Monthly Retainer</span>
                  <span className="font-mono font-bold">{avgRetainerFeeLkr.toLocaleString()} LKR</span>
                </div>
                <input
                  type="range"
                  min="40000"
                  max="200000"
                  step="5000"
                  value={avgRetainerFeeLkr}
                  onChange={(e) => setAvgRetainerFeeLkr(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Churn Probability</span>
                  <span className="font-mono font-bold">{churnRatePct}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={churnRatePct}
                  onChange={(e) => setChurnRatePct(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Client Acquisition / Mo</span>
                  <span className="font-mono font-bold">{newLeadsPerMonth} clients</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={newLeadsPerMonth}
                  onChange={(e) => setNewLeadsPerMonth(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Probabilistic Forecast Outcomes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>6-Month Projected Cash Generation</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  1,000 Iterations Computed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* P10 */}
                <div className="p-4 rounded-md border border-border bg-muted/20 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    P10 (Conservative)
                  </span>
                  <div className="text-lg font-bold font-mono text-foreground">
                    {Math.round(simulationResults.p10).toLocaleString()} LKR
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    90% probability of exceeding this floor.
                  </p>
                </div>

                {/* P50 */}
                <div className="p-4 rounded-md border border-primary/40 bg-primary/5 space-y-1">
                  <span className="text-[11px] font-semibold text-primary uppercase">
                    P50 (Median Target)
                  </span>
                  <div className="text-lg font-bold font-mono text-primary">
                    {Math.round(simulationResults.p50).toLocaleString()} LKR
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    50% probability realistic baseline.
                  </p>
                </div>

                {/* P90 */}
                <div className="p-4 rounded-md border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase">
                    P90 (High Growth)
                  </span>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {Math.round(simulationResults.p90).toLocaleString()} LKR
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    10% probability upside case.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-md bg-muted/30 border border-border/40 text-xs text-muted-foreground">
                <strong>Executive Takeaway:</strong> With your current 74% net margin, the 6-month expected partner distribution pool is approximately{" "}
                <span className="font-mono font-bold text-foreground">
                  {Math.round((simulationResults.p50 * 0.74) / 2).toLocaleString()} LKR each
                </span>{" "}
                for Abdullah &amp; Umar.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* High-Ticket Addon Catalog */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Standardized High-Margin Add-on Catalog
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 space-y-3">
                <Badge variant="default">AI Automation</Badge>
                <h4 className="font-semibold text-sm text-foreground">
                  Productized WhatsApp &amp; Instagram AI Bot
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  24/7 menu ordering, table reservation bot, and directions auto-responder.
                </p>
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-mono">
                  <span>Setup: 75,000 LKR</span>
                  <span className="text-primary font-bold">25,000 / mo</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-3">
                <Badge variant="secondary">Print &bull; Physical</Badge>
                <h4 className="font-semibold text-sm text-foreground">
                  Smart Tap NFC Google Review Standees
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Laser cut acrylic table standees with encoded chips to boost Google Maps cafe reviews.
                </p>
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-mono">
                  <span>Unit Cost: 6,500 LKR</span>
                  <span className="text-primary font-bold">Price: 18,500 LKR</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-3">
                <Badge variant="outline">Performance</Badge>
                <h4 className="font-semibold text-sm text-foreground">
                  Cloudflare Edge CDN &amp; Speed Shield
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Full SSL, WebP image compression, edge caching, and 99.9% uptime SLA.
                </p>
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-mono">
                  <span>One-time Setup</span>
                  <span className="text-primary font-bold">25,000 LKR</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
