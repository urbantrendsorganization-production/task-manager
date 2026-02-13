import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

function TaskList() {
  const tasks = [
    {
      id: 1,
      title: "Design landing page",
      description: "Create hero section and feature blocks",
      status: "active",
      priority: "high",
      due: "Feb 20, 2026",
    },
    {
      id: 2,
      title: "Fix authentication bug",
      description: "Resolve token refresh issue",
      status: "completed",
      priority: "medium",
      due: "Feb 12, 2026",
    },
  ]

  const getPriorityBadge = (priority) => {
    return <Badge variant="outline">{priority}</Badge>
  }

  const getStatusIcon = (status) => {
    if (status === "completed") return <CheckCircle className="h-5 w-5" />
    return <Clock className="h-5 w-5" />
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(task.status)}
              <CardTitle className="text-base font-semibold">
                {task.title}
              </CardTitle>
            </div>

            {getPriorityBadge(task.priority)}
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {task.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Due: {task.due}
              </span>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm">
                  Mark Done
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default TaskList
