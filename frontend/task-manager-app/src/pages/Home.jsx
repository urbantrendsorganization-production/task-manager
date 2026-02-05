import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Target,
  Bell,
  Layout,
  Zap,
  Shield,
  ArrowRight,
  CheckSquare,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-gradient-to-b from-blue-500/60 to-blue-950/70 text-primary-foreground p-4 rounded-2xl mb-6">
            <CheckSquare className="size-12" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6">
            Stay Organized with{" "}
            <span className="text-primary">Task<span className="text-blue-700">Flow</span></span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A modern task management application focused on simplicity,
            usability, and productivity. Manage your tasks effortlessly
            with our intuitive interface.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/sign">
              <Button size="lg" className="gap-2 text-base">
                Get Started Free
                <ArrowRight className="size-5" />
              </Button>
            </Link>

            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base">
                Sign In
              </Button>
            </Link>

            <ModeToggle />
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
          <div className="relative bg-card text-card-foreground rounded-2xl shadow-2xl border p-4 sm:p-8">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <div className="flex gap-2">
                <div className="size-3 rounded-full bg-destructive" />
                <div className="size-3 rounded-full bg-yellow-500" />
                <div className="size-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-muted-foreground ml-4">
                TaskFlow Dashboard
              </span>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg border"
                >
                  <CheckCircle2 className="size-5 text-primary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gradient-to-r from-blue-500/50 to-blue-800/50 rounded w-48" />
                    <div className="h-2 bg-gradient-to-r from-green-500/50 to-blue-800/50 rounded w-32" />
                  </div>
                  <div className="size-8 bg-muted-foreground/20 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">
            How TaskFlow Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, powerful task management in three easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Layout, title: "Create Tasks" },
            { icon: Target, title: "Focus Mode" },
            { icon: CheckCircle2, title: "Track Progress" },
          ].map(({ icon: Icon, title }) => (
            <Card
              key={title}
              className="transition-colors hover:border-primary/50"
            >
              <CardContent className="pt-8 text-center">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-4 rounded-full mb-4">
                  <Icon className="size-8" />
                </div>
                <h3 className="text-2xl mb-3">{title}</h3>
                <p className="text-muted-foreground">
                  Efficiently manage tasks with a clean, focused interface
                  designed to boost productivity.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your tasks effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle2, title: "Task Management" },
              { icon: Target, title: "Priority Levels" },
              { icon: Bell, title: "Smart Notifications" },
              { icon: Layout, title: "Filter & Search" },
              { icon: Zap, title: "Responsive Design" },
              { icon: Shield, title: "Statistics Dashboard" },
            ].map(({ icon: Icon, title }) => (
              <div key={title} className="flex gap-4">
                <div className="flex items-center justify-center size-12 bg-primary text-primary-foreground rounded-lg">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground">
                    Built with modern UX principles to keep you productive
                    and focused.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl border bg-card p-12 text-center">
          <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users managing tasks more efficiently
            with TaskFlow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Free Account
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg">View Demo Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <CheckSquare className="size-5" />
            </div>
            <span className="text-lg font-medium">TaskFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
