"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Download, Upload, CheckCircle2, Clock, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

export default function ClientInvoicesPage() {
  const [isSlipOpen, setIsSlipOpen] = React.useState(false);
  const [slipFile, setSlipFile] = React.useState<string>("");
  const [isUploaded, setIsUploaded] = React.useState(false);

  const handleUploadSlip = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploaded(true);
    setIsSlipOpen(false);
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
              Billing, Invoices &amp; Receipts
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsSlipOpen(true)}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Upload Payment Slip
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Sip &amp; Play Cafe Retainer Invoices
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Clear line items, verified receipts, and direct bank transfer instructions.
          </p>
        </div>

        {/* Invoices Table */}
        <div className="rounded-lg border border-border/80 bg-card overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold font-sans">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Milestone Description</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <tr>
                <td className="p-3.5 font-bold text-foreground">INV-2026-0007</td>
                <td className="p-3.5 font-sans">
                  <div className="font-semibold text-foreground">Final Launch Balance</div>
                  <div className="text-[11px] text-muted-foreground">
                    Table Booking &amp; Live Deployment Sign-off
                  </div>
                </td>
                <td className="p-3.5 font-bold text-primary">15,000.00 LKR</td>
                <td className="p-3.5 text-muted-foreground">Oct 30, 2026</td>
                <td className="p-3.5 font-sans">
                  {isUploaded ? (
                    <Badge variant="warning">Slip Under Verification</Badge>
                  ) : (
                    <Badge variant="warning">Awaiting Payment</Badge>
                  )}
                </td>
                <td className="p-3.5 font-sans">
                  <Button variant="outline" size="sm" onClick={() => setIsSlipOpen(true)}>
                    Upload Slip
                  </Button>
                </td>
              </tr>

              <tr>
                <td className="p-3.5 font-bold text-foreground">INV-2026-0006</td>
                <td className="p-3.5 font-sans">
                  <div className="font-semibold text-foreground">Initial Retainer Deposit</div>
                  <div className="text-[11px] text-muted-foreground">
                    Phase 1/2 UI/UX, Front-end &amp; 12x October Reels
                  </div>
                </td>
                <td className="p-3.5 font-bold text-foreground">73,300.00 LKR</td>
                <td className="p-3.5 text-muted-foreground">Oct 04, 2026</td>
                <td className="p-3.5 font-sans">
                  <Badge variant="success">Paid &bull; Verified</Badge>
                </td>
                <td className="p-3.5 font-sans">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="h-3 w-3 mr-1" /> Receipt
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bank Wire Details (Shown only to the client debtor) */}
        <section className="p-5 rounded-lg border border-border/80 bg-card space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Official Agency Bank Details for Direct Transfer
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-md bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px] font-sans">Bank Name</span>
              <span className="font-bold text-foreground">Commercial Bank of Ceylon</span>
            </div>
            <div className="p-3 rounded-md bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px] font-sans">Branch</span>
              <span className="font-bold text-foreground">Dehiwala, Colombo</span>
            </div>
            <div className="p-3 rounded-md bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px] font-sans">Account Number</span>
              <span className="font-bold text-primary">8029132085</span>
            </div>
            <div className="p-3 rounded-md bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px] font-sans">Account Beneficiary</span>
              <span className="font-bold text-foreground">Ahamed Umar Hunais</span>
            </div>
          </div>
        </section>
      </main>

      {/* Upload Slip Drawer */}
      <Drawer
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        title="Upload Bank Transfer Slip"
        description="Invoice INV-2026-0007 (15,000.00 LKR)"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsSlipOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleUploadSlip}>
              Submit Slip
            </Button>
          </>
        }
      >
        <form onSubmit={handleUploadSlip} className="space-y-4 text-xs">
          <Input
            label="Transfer Reference / Cheque #"
            id="slip-ref"
            placeholder="e.g. COMBANK-REF-892104"
            required
          />

          <div className="space-y-1.5">
            <span className="font-medium text-muted-foreground">Upload Slip Photo or PDF:</span>
            <div className="h-32 rounded-md border border-dashed border-border flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors">
              <Upload className="h-6 w-6 text-primary mb-1" />
              <span className="font-semibold text-foreground">Click to select receipt file</span>
              <span className="text-[10px] text-muted-foreground">PNG, JPG, or PDF up to 25MB</span>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
