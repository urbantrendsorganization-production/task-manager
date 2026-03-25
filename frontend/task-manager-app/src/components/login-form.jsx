import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, GalleryVerticalEnd, Github } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useAuth } from "./auth-context"
import publicApi from "@/lib/public-api"

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Google "G" icon as an inline SVG — no extra library needed
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(null) // "google" | "github" | null

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
    } catch {
      toast.error("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  /* ── Social OAuth helpers ── */

  // After the OAuth redirect returns with ?code=..., the callback page (or
  // this same page if configured as the redirect URI) sends the code to our
  // backend.  The simpler SPA approach used here opens a popup so the main
  // page doesn't navigate away — the popup closes itself and the parent page
  // receives the result via postMessage.

  const handleSocialCallback = async (provider, code) => {
    try {
      const endpoint = provider === "google" ? "auth/social/google/" : "auth/social/github/"
      const payload = provider === "google" ? { access_token: code } : { code }
      const res = await publicApi.post(endpoint, payload)
      const { user: userData, accessToken, refreshToken } = res.data
      login({ user: userData, accessToken, refreshToken })
      toast.success(`Signed in with ${provider === "google" ? "Google" : "GitHub"}`)
      navigate("/dashboard", { replace: true })
    } catch {
      toast.error(`${provider === "google" ? "Google" : "GitHub"} sign-in failed. Try again.`)
    } finally {
      setSocialLoading(null)
    }
  }

  const openOAuthPopup = (url, provider) => {
    setSocialLoading(provider)
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open(url, `${provider}_oauth`, `width=${width},height=${height},left=${left},top=${top}`)

    const onMessage = (event) => {
      // Only accept messages from our own origin
      if (event.origin !== window.location.origin) return
      if (event.data?.provider !== provider) return

      window.removeEventListener("message", onMessage)
      popup?.close()

      const { code, error } = event.data
      if (error || !code) {
        toast.error(`${provider === "google" ? "Google" : "GitHub"} sign-in was cancelled.`)
        setSocialLoading(null)
        return
      }

      handleSocialCallback(provider, code)
    }

    window.addEventListener("message", onMessage)

    // Detect if the user closed the popup manually
    const pollClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(pollClosed)
        window.removeEventListener("message", onMessage)
        setSocialLoading(null)
      }
    }, 500)
  }

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      toast.error("Google sign-in is not configured yet.")
      return
    }
    const redirectUri = `${window.location.origin}/auth/callback/google`
    const scope = "openid email profile"
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}`
    openOAuthPopup(url, "google")
  }

  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    if (!clientId) {
      toast.error("GitHub sign-in is not configured yet.")
      return
    }
    const redirectUri = `${window.location.origin}/auth/callback/github`
    const url =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=user:email`
    openOAuthPopup(url, "github")
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
            <Button type="submit" disabled={loading || !!socialLoading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>

          <Field className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              disabled={!!socialLoading}
              onClick={handleGithubLogin}
              className="gap-2"
            >
              {socialLoading === "github" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Github size={16} />
              )}
              Continue with GitHub
            </Button>

            <Button
              variant="outline"
              type="button"
              disabled={!!socialLoading}
              onClick={handleGoogleLogin}
              className="gap-2"
            >
              {socialLoading === "google" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <GoogleIcon className="h-4 w-4" />
              )}
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
