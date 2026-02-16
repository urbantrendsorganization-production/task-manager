import DashHeader from '@/components/DashHeader'
import TaskList from '@/components/tasks/task-list'
import React from 'react'

function Dashboard() {
  return (
    <div>
        <DashHeader />

        <section>
            <TaskList />
        </section>
    </div>
  )
}

export default Dashboard