import React, { createContext, useContext, useEffect, useState } from "react"
import api from "@/lib/apis"
import { toast } from "sonner"

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await api.get("task-flow/tasks/")
      setTasks(res.data.results || res.data)
    } catch {
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = (task) => {
    setTasks((prev) => [task, ...prev])
  }

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    )
  }

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const ctx = useContext(TaskContext)
  if (!ctx) {
    throw new Error("useTasks must be used inside TaskProvider")
  }
  return ctx
}
