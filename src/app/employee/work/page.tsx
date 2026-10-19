"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Clock, Send, Eye, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";

interface TaskItem {
  id: string;
  ticket: string;
  title: string;
  client: string;
  category: string;
  status: "in_progress" | "review" | "completed";
  due: string;
  brief: string;
}

export default function EmployeeWorkPage() {
  const [filter, setFilter] = React.useState<"all" | "in_progress" | "review" | "completed">("all");
  const [selectedTask, setSelectedTask] = React.useState<TaskItem | null>(null);

  const tasks: TaskItem[] = [
    {
      id: "w-1",
      ticket: "REQ-2026-0102",
      title: "Table Reservation & Tournament Booking Engine",
      client: "Sip & Play Cafe",
      category: "Web Dev",
      status: "in_progress",
      due: "Today 17:00",
      brief: "Integrate Commercial Bank IPG webhook for online tournament table deposit bookings with mobile responsive calendar.",
    },
    {
      id: "w-2",
      ticket: "REQ-2026-0101",
      title: "Autumn Menu Refresh & Acrylic Table Standees",
      client: "Sip & Play Cafe",
      category: "Print/Vector",
      status: "review",
      due: "Oct 24",
      brief: "Finalize double-sided A5 table tents in 300 DPI Fogra39 CMYK with 3mm bleed guides for Dehiwala Print Express.",
    },
    {
      id: "w-3",
      ticket: "REQ-2026-0098",
      title: "DNS & Cloudflare Edge CDN Configuration",
      client: "Sip & Play Cafe",
      category: "Infrastructure",
      status: "completed",
      due: "Oct 18",
      brief: "SSL certificate setup, edge caching, and universalcode.site/sipandplay staging proxy.",
    },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

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
              My Assigned Work
            </span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center rounded-md border border-border/80 bg-background/50 p-0.5 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded ${
                filter === "all" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("in_progress")}
              className={`px-2.5 py-1 rounded ${
                filter === "in_progress" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("review")}
              className={`px-2.5 py-1 rounded ${
                filter === "review" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              In Review
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-2.5 py-1 rounded ${
                filter === "completed" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-4">
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="rounded-lg border border-border/80 bg-card p-4 hover:border-primary/50 cursor-pointer transition-colors flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground font-semibold">
                    {task.ticket}
                  </span>
                  <Badge variant="outline">{task.category}</Badge>
                  {task.status === "in_progress" && <Badge variant="warning">In Progress</Badge>}
                  {task.status === "review" && <Badge variant="secondary">In Review</Badge>}
                  {task.status === "completed" && <Badge variant="success">Completed</Badge>}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                <p className="text-xs text-muted-foreground">{task.client} &bull; Due {task.due}</p>
              </div>

              <Button variant="ghost" size="sm" className="shrink-0 text-xs">
                View Brief &rarr;
              </Button>
            </div>
          ))}
        </div>
      </main>

      <Drawer
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || ""}
        description={`${selectedTask?.client} • ${selectedTask?.ticket}`}
      >
        {selectedTask && (
          <div className="space-y-4 text-xs">
            <div className="rounded-md border border-border bg-muted/30 p-3 space-y-1">
              <span className="font-semibold text-foreground">Task Brief:</span>
              <p className="text-muted-foreground leading-relaxed">{selectedTask.brief}</p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-foreground">Project References:</span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Staging URL: universalcode.site/sipandplay</li>
                <li>Design Assets: Figma &bull; Sip &amp; Play Menu v1.2</li>
              </ul>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
