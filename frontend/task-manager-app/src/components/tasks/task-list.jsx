import api from "@/lib/apis"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card"

function TaskList() {
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    try {
      const response = await api.get("task-flow/tasks/")
      // support paginated DRF response
      const data = response.data.results || response.data
      setTasks(data)
      toast.success("Tasks fetched successfully")
    } catch (error) {
      toast.error("Failed to fetch tasks", { description: error.message })
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  if (!tasks || tasks.length === 0) {
    return <p className="text-muted-foreground">No tasks available</p>
  }

  return (
    <div className="space-y-4 p-3">
      {tasks.map((task) => (
        <Card key={task.id} className="border hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              {task.title}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.is_completed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.is_completed ? "Completed" : "Pending"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {task.description && <p>{task.description}</p>}
            <p>
              <strong>Priority:</strong>{" "}
              <span className="capitalize">{task.priority}</span>
            </p>
            {task.due_date && (
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(task.due_date).toLocaleDateString()}
              </p>
            )}
            <p>
              <strong>Created:</strong>{" "}
              {new Date(task.created_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default TaskList
