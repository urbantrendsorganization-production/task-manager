import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function TasksTab() {
  const [filter, setFilter] = useState("all")

  const tabs = [
    { value: "all", label: "All", count: 9 },
    { value: "active", label: "Active", count: 8 },
    { value: "completed", label: "Completed", count: 7 },
    { value: "important", label: "Important", count: 4 },
  ]

  return (
    <div className="mb-6">
      <Tabs value={filter} onValueChange={(value) => setFilter(value)}>
        <div className="overflow-x-auto">
          <TabsList className="inline-flex gap-2 min-w-max px-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-2"
              >
                {tab.label}
                <Badge variant="secondary">{tab.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  )
}
