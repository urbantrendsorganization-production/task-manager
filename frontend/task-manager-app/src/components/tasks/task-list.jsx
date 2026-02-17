import api from "@/lib/apis"
import React, { useState } from "react"
import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useForm } from "react-hook-form"
import { useTasks } from "../task-context"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

function TaskList() {
  const { tasks, updateTask, deleteTask, setTasks } = useTasks()
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
    },
  })

  /* ---------------- TOGGLE COMPLETE ---------------- */
  const toggleCompleted = async (task) => {
    const optimistic = { ...task, is_completed: !task.is_completed }
    updateTask(optimistic)

    try {
      await api.patch(`task-flow/tasks/${task.id}/`, {
        is_completed: optimistic.is_completed,
      })
    } catch {
      updateTask(task)
      toast.error("Failed to update status")
    }
  }

  /* ---------------- DELETE TASK ---------------- */
  const handleDelete = async (taskId) => {
    deleteTask(taskId)

    try {
      await api.delete(`task-flow/tasks/${taskId}/`)
      toast.success("Task deleted")
    } catch {
      toast.error("Delete failed, restoring state")

      try {
        const res = await api.get("task-flow/tasks/")
        setTasks(res.data.results || res.data)
      } catch {
        toast.error("State recovery failed")
      }
    }
  }

  /* ---------------- EDIT TASK ---------------- */
  const openEdit = (task) => {
    setEditingTask(task)
    form.reset({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
    })
    setOpenEditDialog(true)
  }

  const submitEdit = async (data) => {
    try {
      const res = await api.patch(
        `task-flow/tasks/${editingTask.id}/`,
        {
          ...data,
          due_date: data.due_date || null,
        }
      )
      updateTask(res.data)
      toast.success("Task updated")
      setOpenEditDialog(false)
    } catch {
      toast.error("Update failed")
    }
  }

  /* ---------------- EMPTY STATE ---------------- */
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg m-4">
        <CheckCircle2 className="h-10 w-10 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-sm text-muted-foreground">
          You’re clear for now. Touch grass 🌱
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={cn(
              "group transition hover:shadow-md",
              task.is_completed && "opacity-75 bg-muted/30"
            )}
          >
            <CardHeader className="flex flex-row justify-between pb-3 space-y-0">
              <div className="flex gap-3">
                <button
                  onClick={() => toggleCompleted(task)}
                  className="mt-1 text-muted-foreground hover:text-primary"
                >
                  {task.is_completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                <div>
                  <CardTitle
                    className={cn(
                      "text-base",
                      task.is_completed &&
                        "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </CardTitle>

                  <div className="flex gap-2 items-center mt-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] capitalize",
                        task.priority === "high" &&
                          "bg-red-50 text-red-700",
                        task.priority === "medium" &&
                          "bg-yellow-50 text-yellow-700",
                        task.priority === "low" &&
                          "bg-blue-50 text-blue-700"
                      )}
                    >
                      {task.priority}
                    </Badge>

                    {task.due_date && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEdit(task)}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description || "No description"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* -------- EDIT DIALOG -------- */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitEdit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TaskList
