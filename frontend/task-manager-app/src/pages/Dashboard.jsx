import DashHeader from "@/components/DashHeader"
import TaskList from "@/components/TaskList"
import TasksTab from "@/components/TasksTab"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ArrowBigRightDash,
    CheckCircle,
    Clock11Icon,
    CloudLightning,
    LucideFileExclamationPoint,
    PlusCircleIcon,
    TrendingUp,
} from "lucide-react"
import React from "react"

function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col gap-6">
            <DashHeader />

            <section className="w-full sm:w-11/12 lg:w-4/5 mx-auto flex-1 p-4 sm:p-6 flex flex-col gap-6">
                {/* title */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            TaskFlow
                        </h1>
                        <p className="text-muted-foreground mt-1 md:mt-0">
                            6 active tasks, 8 completed tasks
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button>
                            <CloudLightning className="h-4 w-4 mr-1" /> Focus Mode
                        </Button>
                        <Button>
                            <PlusCircleIcon className="h-4 w-4 mr-1" /> Add new tasks
                        </Button>
                    </div>
                </div>

                {/* stats cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <CheckCircle className="h-8 w-8" />
                            <div className="flex flex-col">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <span className="text-lg">8</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <Clock11Icon className="h-8 w-8" />
                            <div className="flex flex-col">
                                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                                <span className="text-lg">6</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <LucideFileExclamationPoint className="h-8 w-8" />
                            <div className="flex flex-col">
                                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                                <span className="text-lg">2</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <TrendingUp className="h-8 w-8" />
                            <div className="flex flex-col">
                                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                                <span className="text-lg">75%</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                <TasksTab />

                <TaskList />
            </section>
        </div>
    )
}

export default Dashboard
