import { BellDotIcon, CheckCircle, User } from "lucide-react"
import React, { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "./auth-context"
import { toast } from "sonner"
import { Card } from "./ui/card"
import { Button } from "./ui/button"

function DashHeader() {
  const { user, logout } = useAuth()
  const [openAccountMenu, setOpenAccountMenu] = useState(false)

  const handleUserModal = async () => {
    try {
      if (user) setOpenAccountMenu(true)
    } catch (error) {
      toast.error(error)
    }
  }


  console.log(user)

  return (
    <header className="w-full sticky top-0 z-50 shadow p-4 flex items-center justify-between bg-background">

      {openAccountMenu && (
        <Card>
          <h1>{user.username}</h1>
          <span>{user.email}</span>

          <Button onClick={logout}>logout</Button>

        </Card>
      )}
      {/* Left: Logo */}
      <div className="flex items-center gap-2 text-xl font-bold">
        <CheckCircle size={24} />
        <span>TaskFlow</span>
      </div>

      {/* Right: Notifications & Account */}
      <div className="flex items-center gap-6">
        <BellDotIcon size={24} className="cursor-pointer" />

        <ModeToggle />

        <div className="flex items-center gap-2 cursor-pointer" onClick={handleUserModal}>
          <User size={24} />
          <span className="font-medium">Account</span>
        </div>
      </div>
    </header>
  )
}

export default DashHeader
