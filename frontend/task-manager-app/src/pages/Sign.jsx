import { SignupForm } from "@/components/signup-form"

export default function Sign() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}
