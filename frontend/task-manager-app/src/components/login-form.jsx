import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, GalleryVerticalEnd } from "lucide-react"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      const res = await axios.post(
        "https://te.urbantrends.dev/auth/login/",
        {
          username: data.username,
          password: data.password,
        }
      )

      // Save token if backend returns one
      if (res.data.token) localStorage.setItem("token", res.data.token)

      toast.success("Login successful 🎉")

      setTimeout(() => {
        navigate("/dashboard") // change to your actual route
      }, 1200)

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = Object.values(error.response.data)
          .flat()
          .join(" ")
        toast.error(backendErrors)
      } else {
        toast.error("Something went wrong. Try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to TaskFlow.</h1>
            <FieldDescription>
              Don't have an account? <a href="/sign">Sign up</a>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input
              type="text"
              placeholder="muchemi"
              {...register("username")}
            />
            {errors.username && (
              <FieldDescription className="text-red-500">
                {errors.username.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel>Password</FieldLabel>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <FieldDescription className="text-red-500">
                {errors.password.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>

          <Field className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button">
              Continue with Github
            </Button>
            <Button variant="outline" type="button">
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our Terms of Service and Privacy Policy.
      </FieldDescription>
    </div>
  )
}
