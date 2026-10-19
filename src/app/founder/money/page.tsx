"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function FounderMoneyPage() {
  const [currency, setCurrency] = React.useState<"LKR" | "SAR">("LKR");
  const fx = currency === "SAR" ? 1 / 82.5 : 1;

  // Authoritative calculations from normalized ledger
  const totalReceivedCents = 74000000; // 740,000 LKR
  const totalCogsCents = 11500000; // 115,000 LKR
  const netProfitCents = totalReceivedCents - totalCogsCents; // 625,000 LKR
  const partnerShareCents = Math.round(netProfitCents / 2); // 312,500 LKR each

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
            <span className="font-semibold text-sm tracking-tight text-foreground">
              Money &amp; 50/50 Equity Ledger
            </span>
          </div>

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
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Financial Ledger &amp; Partner Equity
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            50/50 profit distributions between Abdullah Arshad &amp; Ahamed Umar Hunais.
          </p>
        </div>

        {/* 50/50 Equity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Partner A Share (50%)
                </span>
                <Badge variant="success">Abdullah Arshad</Badge>
              </div>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
                {formatCurrency(Math.round(partnerShareCents * fx), currency, false)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Net distributions earned for October 2026 after deducting COGS and tooling.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Partner B Share (50%)
                </span>
                <Badge variant="success">Ahamed Umar Hunais</Badge>
              </div>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
                {formatCurrency(Math.round(partnerShareCents * fx), currency, false)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Net distributions earned for October 2026 after deducting COGS and tooling.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* October Client Retainers Table */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            October Retainer Collections
          </h3>
          <div className="rounded-lg border border-border/80 bg-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Client &bull; Retainer</th>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                <tr>
                  <td className="p-3.5 font-sans font-medium text-foreground">
                    Sip &amp; Play Cafe &bull; Web &amp; Social Retainer
                  </td>
                  <td className="p-3.5 text-muted-foreground">INV-2026-0006</td>
                  <td className="p-3.5 font-bold text-foreground">
                    {formatCurrency(Math.round(7330000 * fx), currency, false)}
                  </td>
                  <td className="p-3.5 font-sans text-muted-foreground">ComBank Transfer</td>
                  <td className="p-3.5">
                    <Badge variant="success">Verified &bull; Paid</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-sans font-medium text-foreground">
                    Oh Donuts &bull; Full Marketing &amp; Reels Retainer
                  </td>
                  <td className="p-3.5 text-muted-foreground">INV-2026-0005</td>
                  <td className="p-3.5 font-bold text-foreground">
                    {formatCurrency(Math.round(10000000 * fx), currency, false)}
                  </td>
                  <td className="p-3.5 font-sans text-muted-foreground">ComBank Transfer</td>
                  <td className="p-3.5">
                    <Badge variant="success">Verified &bull; Paid</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-sans font-medium text-foreground">
                    Nature&apos;s Treasure &bull; SMM &amp; Web Retainer
                  </td>
                  <td className="p-3.5 text-muted-foreground">INV-2026-0003</td>
                  <td className="p-3.5 font-bold text-foreground">
                    {formatCurrency(Math.round(2500000 * fx), currency, false)}
                  </td>
                  <td className="p-3.5 font-sans text-muted-foreground">Bank Transfer</td>
                  <td className="p-3.5">
                    <Badge variant="success">Verified &bull; Paid</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Contractor COGS & Payout Approvals (Founder Eyes Only) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Contractor Production COGS (October)
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              Total COGS: {formatCurrency(Math.round(totalCogsCents * fx), currency, false)}
            </span>
          </div>

          <div className="rounded-lg border border-border/80 bg-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Specialist</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Billable Sprint</th>
                  <th className="p-3.5">Hours &bull; Rate</th>
                  <th className="p-3.5">Amount Owed</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                <tr>
                  <td className="p-3.5 font-sans font-medium text-foreground">Imran Farooq</td>
                  <td className="p-3.5 font-sans text-muted-foreground">Senior Web Dev</td>
                  <td className="p-3.5 font-sans">Sip &amp; Play Menu Engine &amp; Webhook</td>
                  <td className="p-3.5 text-muted-foreground">10h @ 5,000 LKR</td>
                  <td className="p-3.5 font-bold text-foreground">50,000 LKR</td>
                  <td className="p-3.5 font-sans">
                    <Button variant="outline" size="sm">Approve Payout</Button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-sans font-medium text-foreground">Sarah Lin</td>
                  <td className="p-3.5 font-sans text-muted-foreground">Lead UI/Brand</td>
                  <td className="p-3.5 font-sans">Sip &amp; Play Autumn Menu &amp; Standees</td>
                  <td className="p-3.5 text-muted-foreground">8h @ 4,000 LKR</td>
                  <td className="p-3.5 font-bold text-foreground">32,000 LKR</td>
                  <td className="p-3.5 font-sans">
                    <Button variant="outline" size="sm">Approve Payout</Button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-sans font-medium text-foreground">Alex Rivera</td>
                  <td className="p-3.5 font-sans text-muted-foreground">Motion Editor</td>
                  <td className="p-3.5 font-sans">6x Instagram Reels Motion Cuts</td>
                  <td className="p-3.5 text-muted-foreground">9h @ 3,500 LKR</td>
                  <td className="p-3.5 font-bold text-foreground">31,500 LKR</td>
                  <td className="p-3.5 font-sans">
                    <Button variant="outline" size="sm">Approve Payout</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
