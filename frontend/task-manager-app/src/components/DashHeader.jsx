import {
  BellDotIcon,
  CheckCircle,
  PlusCircleIcon,
  User,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "./auth-context"
import { toast } from "sonner"
import { Card } from "./ui/card"
import { Button } from "./ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"

import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import api from "@/lib/apis"
import { taskSchema } from "@/lib/task-schema"

function DashHeader() {
  const { user, logout } = useAuth()
  const [openAccountMenu, setOpenAccountMenu] = useState(false)
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const menuRef = useRef(null)

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  })

  const toggleAccountMenu = () => {
    if (!user) {
      toast.error("You are not logged in")
      return
    }
    setOpenAccountMenu((prev) => !prev)
  }

  const handleLogout = () => {
    logout()
    setOpenAccountMenu(false)
    toast.success("Logged out successfully")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenAccountMenu(false)
      }
    }

    if (openAccountMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openAccountMenu])

  const onSubmit = async (data) => {
    try {
      await api.post("/task-flow/tasks/", data) // ✅ CORRECT

      toast.success("Task created")
      setOpenTaskDialog(false)
      form.reset()
    } catch (err) {
      const message =
        err?.response?.data?.title?.[0] ||
        "Failed to create task"
      toast.error(message)
    }
  }

  return (
    <header className="w-full sticky top-0 z-50 shadow p-4 flex items-center justify-between bg-background relative">
      {openAccountMenu && user && (
        <Card
          ref={menuRef}
          className="absolute right-4 top-16 w-56 p-4 space-y-3"
        >
          <div>
            <h1 className="font-bold">Taskflow Account</h1>
            <p>{user.username}</p>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Card>
      )}

      <div className="flex items-center gap-2 text-xl font-bold">
        <CheckCircle size={24} />
        <span>TaskFlow</span>
      </div>

      <div className="flex items-center gap-6">
        <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add new tasks
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
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
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Create Task
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <BellDotIcon size={24} />
        <ModeToggle />

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={toggleAccountMenu}
        >
          <User size={24} />
          <span>Account</span>
        </div>
      </div>
    </header>
  )
}

export default DashHeader
