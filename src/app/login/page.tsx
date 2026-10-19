"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Default route determination for test convenience
    setTimeout(() => {
      setIsLoading(false);
      const lower = email.toLowerCase();
      let role = "client";
      let dest = "/portal";
      if (lower.includes("founder") || lower.includes("abdullah") || lower.includes("umar")) {
        role = "founder";
        dest = "/founder";
      } else if (lower.includes("employee") || lower.includes("imran") || lower.includes("sarah")) {
        role = "employee";
        dest = "/employee/today";
      }
      document.cookie = `ucode_demo_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      router.push(dest);
    }, 400);
  };

  const handleDemoLogin = (role: "founder" | "employee" | "client") => {
    document.cookie = `ucode_demo_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    if (role === "founder") {
      setEmail("abdullah@universalcode.site");
      setPassword("founder123");
      router.push("/founder");
    } else if (role === "employee") {
      setEmail("imran@universalcode.site");
      setPassword("employee123");
      router.push("/employee/today");
    } else {
      setEmail("vivian@sipandplay.lk");
      setPassword("customer123");
      router.push("/portal");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground mx-auto flex items-center justify-center font-mono font-bold text-base shadow-sm">
            U
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Sign in to Ucode OS
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your studio or VIP client workspace credentials
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isLoading}
              >
                Sign In <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            {/* Quick Demo Switcher */}
            <div className="mt-6 pt-5 border-t border-border/40 space-y-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground block text-center">
                Demo Workspace Switcher (1-Click)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("founder")}
                  className="py-1.5 px-2 text-[11px] font-medium rounded border border-border/80 hover:border-primary hover:bg-muted/50 transition-colors text-center text-foreground"
                >
                  Founder
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("employee")}
                  className="py-1.5 px-2 text-[11px] font-medium rounded border border-border/80 hover:border-primary hover:bg-muted/50 transition-colors text-center text-foreground"
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("client")}
                  className="py-1.5 px-2 text-[11px] font-medium rounded border border-border/80 hover:border-primary hover:bg-muted/50 transition-colors text-center text-foreground"
                >
                  Customer
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security badge */}
        <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>Encrypted Session &bull; Row Level Security Protected</span>
        </div>
      </div>
    </div>
  );
}
