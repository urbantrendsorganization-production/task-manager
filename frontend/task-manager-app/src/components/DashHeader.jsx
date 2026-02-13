import { BellDotIcon, CheckCircle, User } from "lucide-react"
import React from "react"
import { ModeToggle } from "./mode-toggle"

function DashHeader() {
  return (
    <header className="w-full sticky top-0 z-50 shadow p-4 flex items-center justify-between bg-background">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 text-xl font-bold">
        <CheckCircle size={24} />
        <span>TaskFlow</span>
      </div>

      {/* Right: Notifications & Account */}
      <div className="flex items-center gap-6">
        <BellDotIcon size={24} className="cursor-pointer" />

        <ModeToggle />

        <div className="flex items-center gap-2 cursor-pointer">
          <User size={24} />
          <span className="font-medium">Account</span>
        </div>
      </div>
    </header>
  )
}

export default DashHeader
