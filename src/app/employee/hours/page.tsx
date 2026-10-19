"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Clock, Plus, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

export default function EmployeeHoursPage() {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [taskDesc, setTaskDesc] = React.useState("");
  const [hoursSpent, setHoursSpent] = React.useState("2.5");

  // Private to Imran only
  const hourlyRateLkr = 5000;
  const loggedHoursThisWeek = 14.5;
  const totalEarnedThisWeek = loggedHoursThisWeek * hourlyRateLkr;

  const handleAddHours = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddOpen(false);
    setTaskDesc("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-6">
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/employee/today"
              className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Today
            </Link>
            <span className="text-border">|</span>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              My Hours &amp; Weekly Earnings
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Time
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            This Week&apos;s Timesheet Summary
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your personal billable hours and accrued compensation (private to you).
          </p>
        </div>

        {/* 2 Calm Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5 space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Hours Logged (Oct 13 - Oct 19)
              </span>
              <div className="text-2xl font-bold font-mono text-foreground">
                {loggedHoursThisWeek} hrs
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-logged via Focus Timer &amp; sprints
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-5 space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                Weekly Earned Compensation
              </span>
              <div className="text-2xl font-bold font-mono text-primary">
                {totalEarnedThisWeek.toLocaleString()} LKR
              </div>
              <p className="text-xs text-muted-foreground">
                Rate: 5,000 LKR/hr &bull; Weekly payout cycle
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Timesheet Entries */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Logged Sessions</h3>
          <div className="rounded-lg border border-border/80 bg-card divide-y divide-border/40 text-xs font-mono">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold text-foreground text-sm">
                  Table Reservation Webhook &amp; IPG Testing
                </p>
                <p className="font-sans text-muted-foreground text-xs mt-0.5">
                  Sip &amp; Play Cafe &bull; Auto-logged via 25-min Sprint Timer
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-foreground">2.5 hrs</span>
                <span className="block text-muted-foreground text-[10px]">12,500 LKR</span>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold text-foreground text-sm">
                  DNS &amp; Cloudflare Staging Edge Rules
                </p>
                <p className="font-sans text-muted-foreground text-xs mt-0.5">
                  Sip &amp; Play Cafe &bull; Staging Deployment
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-foreground">2.0 hrs</span>
                <span className="block text-muted-foreground text-[10px]">10,000 LKR</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Drawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Manual Time Entry"
        description="Log offline development or client sprint hours"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddHours}>
              Save Hours
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddHours} className="space-y-4">
          <Input
            label="Sprint Description"
            id="task-desc"
            placeholder="e.g. Mobile navigation layout debugging"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            required
          />

          <Input
            label="Hours Spent"
            id="task-hours"
            type="number"
            step="0.25"
            placeholder="2.0"
            value={hoursSpent}
            onChange={(e) => setHoursSpent(e.target.value)}
            required
          />
        </form>
      </Drawer>
    </div>
  );
}
