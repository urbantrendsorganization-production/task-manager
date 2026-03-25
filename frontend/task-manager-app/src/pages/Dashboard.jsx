import DashHeader from '@/components/DashHeader'
import TaskList from '@/components/tasks/task-list'
import { useTasks } from '@/components/task-context'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Clock, ListTodo, Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import React from 'react'
import { cn } from '@/lib/utils'

function StatCard({ label, value, icon: Icon, className }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  )
}

function Dashboard() {
  const { tasks, loading } = useTasks()
  const [search, setSearch] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  /* ── stats ── */
  const total = tasks.length
  const completed = tasks.filter((t) => t.is_completed).length
  const pending = total - completed
  const overdue = tasks.filter((t) => {
    if (!t.due_date || t.is_completed) return false
    return new Date(t.due_date) < new Date()
  }).length

  /* ── filtered task list ── */
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(search.toLowerCase())

      const matchesPriority = filterPriority === "all" || t.priority === filterPriority

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && t.is_completed) ||
        (filterStatus === "pending" && !t.is_completed)

      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [tasks, search, filterPriority, filterStatus])

  return (
    <div className="min-h-screen bg-background">
      <DashHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">

        {/* Stats row */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Tasks" value={total} icon={ListTodo} />
            <StatCard label="Completed" value={completed} icon={CheckCircle2} className="border-green-200 dark:border-green-900" />
            <StatCard label="Pending" value={pending} icon={Circle} />
            <StatCard label="Overdue" value={overdue} icon={Clock} className={overdue > 0 ? "border-destructive/40" : ""} />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {(search || filterPriority !== "all" || filterStatus !== "all") && (
            <Badge
              variant="secondary"
              className="self-center cursor-pointer whitespace-nowrap"
              onClick={() => { setSearch(""); setFilterPriority("all"); setFilterStatus("all") }}
            >
              Clear filters ×
            </Badge>
          )}
        </div>

        {/* Task list — pass filtered tasks down */}
        <section>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-lg" />
              ))}
            </div>
          ) : (
            <TaskList tasks={filtered} />
          )}
        </section>
      </main>
    </div>
  )
}

export default Dashboard
