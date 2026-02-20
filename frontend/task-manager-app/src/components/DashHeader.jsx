import {
  BellDotIcon,
  CheckCircle,
  PlusCircleIcon,
  User,
  LogOut,
  Settings,
  CloudLightningIcon,
  Loader2, // Added for loading state feedback
} from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "./auth-context"
import { toast } from "sonner"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { useTasks } from "./task-context"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils" // Ensure you have this utility for conditional classes

function DashHeader() {
  const { user, logout } = useAuth()
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addTask } = useTasks()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      due_date: ""
    },
  })

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await api.post("/task-flow/tasks/", data)
      addTask(response.data)
      toast.success("Task created successfully")
      setOpenTaskDialog(false)
      form.reset()
    } catch (err) {
      const message = err?.response?.data?.title?.[0] || "Failed to create task"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // UX Improvement: Reset form state when the dialog is manually closed
  const handleOpenChange = (open) => {
    setOpenTaskDialog(open)
    if (!open) form.reset()
  }

  const focusModeActivation = () => {
    toast.info("Focus mode activated!")
    navigate('/timer')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 select-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <CheckCircle size={20} strokeWidth={2.5} />
          </div>
          <span className="hidden font-bold sm:inline-block text-xl tracking-tight">
            TaskFlow
          </span>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Create Task Dialog */}
          <Dialog open={openTaskDialog} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 px-3 md:px-4 shadow-sm transition-all hover:translate-y-[-1px]">
                <PlusCircleIcon className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Add Task</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="What needs to be done?" 
                            disabled={isSubmitting}
                            {...field} 
                          />
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
                          <Textarea 
                            placeholder="Add details..." 
                            disabled={isSubmitting}
                            className="min-h-[100px] resize-none"
                            {...field} 
                          />
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
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
                            <Input 
                              type="date" 
                              disabled={isSubmitting}
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full font-semibold" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Task"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <div className="h-6 w-px bg-border hidden md:block" />

          {/* Utils */}
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <BellDotIcon size={20} />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <Button 
            onClick={focusModeActivation} 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground flex gap-2"
          >
            <CloudLightningIcon size={20} />
            <span className="hidden lg:inline">Focus Mode</span>
          </Button>
          
          <ModeToggle />

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-muted flex items-center justify-center border hover:bg-muted/80">
                <User size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  )
}

export default DashHeader