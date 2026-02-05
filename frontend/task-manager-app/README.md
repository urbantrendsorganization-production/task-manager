# TaskFlow - Task Manager Application

## Overview
A modern, responsive task management application built with React, TypeScript, and Tailwind CSS. Features include task CRUD operations, smart filtering, focus mode, and notification reminders.

## Key Features

### 1. Authentication (UI Only)
- Clean login and signup screens
- Form validation
- Navigation to dashboard

### 2. Task Management
- **Create**: Modal form with title, description, priority, due date, and reminder
- **Read**: Card-based task display with all details
- **Update**: Edit existing tasks inline
- **Delete**: Confirmation dialog before deletion

### 3. Filtering System
- All tasks
- Active (pending) tasks
- Completed tasks
- Important (high priority) tasks

### 4. Smart Focus Mode
- Displays high-priority tasks
- Shows tasks due within 3 days
- Distraction-free dark overlay
- Sorted by priority and due date

### 5. Notifications & Reminders
- Bell icon with badge count
- Shows upcoming reminders (next 24 hours)
- Popover with reminder details
- Toast notifications for actions

### 6. Task Statistics
- Completed task count
- Active task count
- High priority count
- Completion rate percentage

## Component Architecture

### State Management
- Local React state for task data
- No external state management library needed
- Ready for backend integration

### UI Components
- Built with Radix UI primitives
- Styled with Tailwind CSS
- Fully responsive design
- Accessible by default

### Data Flow
```
Dashboard (state)
  ↓
TaskList → TaskCard
  ↓
TaskFormDialog (create/edit)
DeleteConfirmDialog (delete)
```

## Integration Points

### Backend Integration
To connect to a real backend:

1. Replace mock data in `Dashboard.tsx`:
   ```tsx
   const [tasks, setTasks] = useState<Task[]>([]);
   
   useEffect(() => {
     // Fetch tasks from API
     fetchTasks().then(setTasks);
   }, []);
   ```

2. Update CRUD operations:
   - `handleSaveTask`: POST/PUT to API
   - `handleDelete`: DELETE to API
   - `toggleTaskComplete`: PATCH to API

3. Add authentication:
   - Store JWT token on login
   - Add protected routes
   - Include auth headers in API calls

### Supabase Integration (Optional)
The app is ready for Supabase:
- Task table schema matches `Task` interface
- Row-level security for user privacy
- Real-time subscriptions for live updates

## Responsive Design

- **Mobile**: Optimized for touch interactions, compact layout
- **Tablet**: Medium layout with adjusted spacing
- **Desktop**: Full feature set with hover states

## Accessibility

- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

## Future Enhancements

Potential additions:
- Task categories/tags
- Drag-and-drop reordering
- Task search functionality
- Calendar view
- Recurring tasks
- Task collaboration
- File attachments
- Dark mode toggle