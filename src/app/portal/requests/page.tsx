"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Send, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Drawer } from "@/components/ui/drawer";

interface ClientTicket {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  status: "submitted" | "in_production" | "completed";
  priority: "rush" | "normal";
  created: string;
}

export default function ClientRequestsPage() {
  const [isNewOpen, setIsNewOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("Web Development");
  const [description, setDescription] = React.useState("");
  const [isRush, setIsRush] = React.useState(false);

  const [tickets, setTickets] = React.useState<ClientTicket[]>([
    {
      id: "t-1",
      ticketNumber: "REQ-2026-0102",
      title: "Table Reservation & Tournament Booking Engine",
      category: "Web Development",
      status: "in_production",
      priority: "rush",
      created: "Oct 17",
    },
    {
      id: "t-2",
      ticketNumber: "REQ-2026-0101",
      title: "Autumn Menu Refresh & Acrylic Table Standees",
      category: "Print & Packaging",
      status: "in_production",
      priority: "normal",
      created: "Oct 18",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: ClientTicket = {
      id: `t-${Date.now()}`,
      ticketNumber: `REQ-2026-0${103 + tickets.length}`,
      title,
      category,
      status: "submitted",
      priority: isRush ? "rush" : "normal",
      created: "Today",
    };
    setTickets([newTicket, ...tickets]);
    setIsNewOpen(false);
    setTitle("");
    setDescription("");
    setIsRush(false);
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
              Client Requests &amp; Production Tickets
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsNewOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> New Request
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Active Creative Tickets
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submit new design, web, video, or print deliverables covered by your retainer.
          </p>
        </div>

        {/* Ticket List */}
        <div className="rounded-lg border border-border/80 bg-card divide-y divide-border/40 text-xs">
          {tickets.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-muted-foreground">
                    {t.ticketNumber}
                  </span>
                  <Badge variant="outline">{t.category}</Badge>
                  {t.priority === "rush" && <Badge variant="rush">Rush &lt;24h</Badge>}
                </div>
                <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
                <p className="text-muted-foreground">Submitted {t.created}</p>
              </div>

              <div>
                {t.status === "in_production" && (
                  <Badge variant="warning">In Production</Badge>
                )}
                {t.status === "submitted" && (
                  <Badge variant="secondary">Queued</Badge>
                )}
                {t.status === "completed" && (
                  <Badge variant="success">Completed</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Clean 4-Field Request Drawer */}
      <Drawer
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        title="Submit New Client Request"
        description="Our studio responds within guaranteed 24h turnaround"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsNewOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              Send Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Request Title"
            id="req-title"
            placeholder="e.g. November Board Game Tournament Poster"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label htmlFor="req-cat" className="text-xs font-medium text-muted-foreground">
              Deliverable Category
            </label>
            <select
              id="req-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Web Development">Web Development &bull; Menu &amp; Booking</option>
              <option value="Print & Packaging">Print &amp; Packaging &bull; Table Tents / Posters</option>
              <option value="Video & Motion">Video &amp; Motion &bull; Reels / TikTok</option>
              <option value="AI Automation">AI Automation &bull; WhatsApp Lead Bot</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="req-desc" className="text-xs font-medium text-muted-foreground">
              Brief &amp; Exact Requirements
            </label>
            <textarea
              id="req-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include copy, dimensions, sample links, or specific deadlines."
              className="w-full rounded-md border border-input bg-background/50 p-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              required
            />
          </div>

          <div className="rounded-md border border-border p-3 flex items-start gap-3 bg-muted/20">
            <input
              type="checkbox"
              id="rush-checkbox"
              checked={isRush}
              onChange={(e) => setIsRush(e.target.checked)}
              className="mt-0.5 accent-primary h-4 w-4 rounded cursor-pointer"
            />
            <label htmlFor="rush-checkbox" className="text-xs cursor-pointer">
              <span className="font-semibold text-foreground block">
                ⚡ Priority Rush Turnaround (&lt;24 hours)
              </span>
              <span className="text-muted-foreground">
                Bypasses queue and assigns dedicated lead specialist (+5,000 LKR sprint fee).
              </span>
            </label>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
