import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, GalleryVerticalEnd } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import api from "@/lib/apis"
import { useAuth } from "./auth-context"
import publicApi from "@/lib/public-api"

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (user?.id) navigate("/dashboard", { replace: true })
  }, [user?.id, navigate])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const res = await publicApi.post("auth/login/", data)
      const { user: userData, accessToken, refreshToken } = res.data
      login({ user: userData, accessToken, refreshToken })
      toast.success("Login successful!")
      navigate("/dashboard", { replace: true })
    } catch (err) {
      toast.error("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Button variant="ghost" size="sm" className="w-fit gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </Button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link to="/" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-16 w-16 items-center justify-center rounded-md">
                <GalleryVerticalEnd size={24} />
              </div>
              <span className="sr-only">TaskFlow</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to TaskFlow</h1>
            <FieldDescription>
              Don&apos;t have an account? <Link to="/sign">Sign up</Link>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input type="text" placeholder="Enter username" {...register("username")} />
            {errors.username && <FieldDescription className="text-red-500">{errors.username.message}</FieldDescription>}
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel>Password</FieldLabel>
              <Link to="/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline">
                Forgot your password?
              </Link>
            </div>
            <Input type="password" {...register("password")} />
            {errors.password && <FieldDescription className="text-red-500">{errors.password.message}</FieldDescription>}
          </Field>

          <Field>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>

          <Field className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button">Continue with GitHub</Button>
            <Button variant="outline" type="button">Continue with Google</Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our Terms of Service and Privacy Policy.
      </FieldDescription>
    </div>
  )
}
