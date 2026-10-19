"use client";

import * as React from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Upload,
  Send,
  Calendar,
  FileCheck,
  Briefcase,
  Layers,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

interface EmployeeTask {
  id: string;
  title: string;
  client: string;
  dueTime: string;
  isOverdue?: boolean;
  priority: "rush" | "normal";
  status: "todo" | "in_progress" | "completed";
  actionType: "start" | "submit" | "upload";
  description: string;
}

export default function EmployeeTodayPage() {
  const [tasks, setTasks] = React.useState<EmployeeTask[]>([
    {
      id: "task-1",
      title: "Table Reservation & Tournament Booking Engine",
      client: "Sip & Play Cafe",
      dueTime: "5:00 PM Today",
      isOverdue: false,
      priority: "rush",
      status: "todo",
      actionType: "start",
      description: "Finalize Commercial Bank webhook integration and mobile calendar picker.",
    },
    {
      id: "task-2",
      title: "Autumn Menu Refresh & Acrylic Table Standees",
      client: "Sip & Play Cafe",
      dueTime: "7:00 PM Today",
      isOverdue: false,
      priority: "normal",
      status: "in_progress",
      actionType: "submit",
      description: "Verify Fogra39 CMYK color profile and 3mm laser cut standee bleed guides.",
    },
    {
      id: "task-3",
      title: "SSL & Cloudflare Edge CDN Configuration",
      client: "Sip & Play Cafe",
      dueTime: "Completed 11:20 AM",
      isOverdue: false,
      priority: "normal",
      status: "completed",
      actionType: "start",
      description: "Configure DNS records and edge image caching.",
    },
  ]);

  // Focus Session Pomodoro Timer
  const [timerSeconds, setTimerSeconds] = React.useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const [activeTaskTitle, setActiveTaskTitle] = React.useState<string | null>(null);

  // Accordion states
  const [showUpcoming, setShowUpcoming] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);

  // 3-Field Submission Drawer
  const [submittingTask, setSubmittingTask] = React.useState<EmployeeTask | null>(null);
  const [submitLink, setSubmitLink] = React.useState("");
  const [submitVersion, setSubmitVersion] = React.useState("v1.1");
  const [submitNote, setSubmitNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dynamic Greeting
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Timer Interval
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const handleStartTask = (task: EmployeeTask) => {
    setActiveTaskTitle(task.title);
    setIsTimerRunning(true);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: "in_progress", actionType: "submit" } : t
      )
    );
  };

  const handleToggleDone = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === "completed" ? "todo" : "completed",
            }
          : t
      )
    );
  };

  const handleOpenSubmit = (task: EmployeeTask) => {
    setSubmittingTask(task);
    setSubmitLink("");
    setSubmitVersion("v1.1");
    setSubmitNote("");
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === submittingTask.id ? { ...t, status: "completed" } : t
        )
      );
      setSubmittingTask(null);
    }, 600);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const activeTasksCount = tasks.filter((t) => t.status !== "completed").length;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-6">
      {/* Employee Header (Max 4 items) */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/employee/today" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center font-mono font-bold text-primary-foreground text-xs">
                U
              </div>
              <span className="font-semibold text-sm tracking-tight text-foreground">
                UCODE STUDIO
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/employee/today"
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-muted text-foreground"
              >
                Today
              </Link>
              <Link
                href="/employee/work"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                My Work
              </Link>
              <Link
                href="/employee/hours"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Hours
              </Link>
              <Link
                href="/employee/files"
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Files
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Imran Farooq (Web Dev Lead)
            </span>
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              IF
            </div>
          </div>
        </div>
      </header>

      {/* Main Focus Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Dynamic Greeting & Today's Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {greeting}, Imran
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              You have {activeTasksCount} active task{activeTasksCount === 1 ? "" : "s"} today. 1 is due at 5:00 PM.
            </p>
          </div>

          {/* Compact Focus Session Timer */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-card border border-border/80 rounded-md p-1.5 px-3">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-semibold tracking-wider text-foreground w-12">
              {formatTimer(timerSeconds)}
            </span>
            <Button
              variant={isTimerRunning ? "secondary" : "primary"}
              size="sm"
              onClick={toggleTimer}
              className="h-7 px-2.5 text-xs font-semibold"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="h-3 w-3 mr-1" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" /> Focus
                </>
              )}
            </Button>
            <button
              onClick={resetTimer}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Today's Tasks List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Agenda
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {tasks.filter((t) => t.status === "completed").length} of {tasks.length} done
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => {
              const isDone = task.status === "completed";
              return (
                <div
                  key={task.id}
                  className={`rounded-lg border bg-card p-4 transition-all duration-150 flex items-start justify-between gap-4 ${
                    isDone
                      ? "opacity-50 border-border/40 bg-card/40"
                      : "border-border/80 hover:border-border"
                  }`}
                >
                  {/* Left: Tick-Circle and Task Details */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleDone(task.id)}
                      className="mt-0.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                      title={isDone ? "Mark incomplete" : "Mark complete"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-border hover:border-primary transition-colors" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.priority === "rush" && !isDone && (
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Rush <24h" />
                        )}
                        <span className="text-xs font-mono text-muted-foreground">
                          {task.client}
                        </span>
                        <span className="text-xs text-muted-foreground/60">&bull;</span>
                        <span
                          className={`text-xs ${
                            task.priority === "rush" && !isDone
                              ? "text-red-400 font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {task.dueTime}
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-medium ${
                          isDone
                            ? "line-through text-muted-foreground"
                            : "text-foreground font-semibold"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Exactly ONE Action Button */}
                  {!isDone && (
                    <div className="self-center">
                      {task.actionType === "start" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartTask(task)}
                        >
                          <Play className="h-3 w-3 mr-1 text-primary" /> Start
                        </Button>
                      )}
                      {task.actionType === "submit" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenSubmit(task)}
                        >
                          <Send className="h-3 w-3 mr-1" /> Submit
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Collapsed by default: Coming up this week */}
        <section className="border border-border/60 rounded-lg overflow-hidden bg-card">
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                Coming up this week (4 tasks)
              </span>
            </div>
            {showUpcoming ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showUpcoming && (
            <div className="p-4 pt-0 border-t border-border/40 space-y-2 text-xs">
              <div className="py-2 flex items-center justify-between text-muted-foreground border-b border-border/20">
                <span>Nature&apos;s Treasure &bull; Honey Jar vector dieline</span>
                <span>Due Oct 24</span>
              </div>
              <div className="py-2 flex items-center justify-between text-muted-foreground border-b border-border/20">
                <span>Sip &amp; Play &bull; Table ordering checkout flow</span>
                <span>Due Oct 25</span>
              </div>
              <div className="py-2 flex items-center justify-between text-muted-foreground">
                <span>Oh Donuts &bull; Halloween reel motion cut</span>
                <span>Due Oct 26</span>
              </div>
            </div>
          )}
        </section>

        {/* Collapsed by default: Waiting on feedback */}
        <section className="border border-border/60 rounded-lg overflow-hidden bg-card">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                Waiting on client feedback (2 deliverables)
              </span>
            </div>
            {showFeedback ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showFeedback && (
            <div className="p-4 pt-0 border-t border-border/40 space-y-2 text-xs">
              <div className="py-2 flex items-center justify-between text-muted-foreground border-b border-border/20">
                <span>Sip &amp; Play &bull; Autumn Menu v1.2 Standees</span>
                <Badge variant="secondary">In Review</Badge>
              </div>
              <div className="py-2 flex items-center justify-between text-muted-foreground">
                <span>Oh Donuts &bull; 4-Pack TikTok Reel</span>
                <Badge variant="secondary">In Review</Badge>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 3-Field Submission Drawer */}
      <Drawer
        isOpen={!!submittingTask}
        onClose={() => setSubmittingTask(null)}
        title="Submit Work for Review"
        description={submittingTask?.title}
        footer={
          submittingTask && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSubmittingTask(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                onClick={handleSubmitDeliverable}
              >
                Submit Deliverable
              </Button>
            </>
          )
        }
      >
        <form onSubmit={handleSubmitDeliverable} className="space-y-4">
          <Input
            label="File or Deliverable URL"
            id="deliverable-url"
            placeholder="https://universalcode.site/sipandplay or Figma link"
            value={submitLink}
            onChange={(e) => setSubmitLink(e.target.value)}
            required
          />

          <Input
            label="Version Tag"
            id="deliverable-version"
            placeholder="v1.1"
            value={submitVersion}
            onChange={(e) => setSubmitVersion(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label
              htmlFor="deliverable-notes"
              className="text-xs font-medium text-muted-foreground"
            >
              Short Note for Founder &amp; Client
            </label>
            <textarea
              id="deliverable-notes"
              rows={3}
              value={submitNote}
              onChange={(e) => setSubmitNote(e.target.value)}
              placeholder="e.g. Updated beverage pricing and verified 3mm bleed margin."
              className="w-full rounded-md border border-input bg-background/50 p-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </form>
      </Drawer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border/80 h-16 flex items-center justify-around z-30 px-4">
        <Link
          href="/employee/today"
          className="flex flex-col items-center gap-1 text-primary text-[10px] font-semibold"
        >
          <Clock className="h-5 w-5" />
          Today
        </Link>
        <Link
          href="/employee/work"
          className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"
        >
          <Briefcase className="h-5 w-5" />
          My Work
        </Link>
        <Link
          href="/employee/hours"
          className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"
        >
          <Layers className="h-5 w-5" />
          Hours
        </Link>
        <Link
          href="/employee/files"
          className="flex flex-col items-center gap-1 text-muted-foreground text-[10px]"
        >
          <FileText className="h-5 w-5" />
          Files
        </Link>
      </nav>
    </div>
  );
}
