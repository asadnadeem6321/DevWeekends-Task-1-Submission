import { useEffect, useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import './App.css'

const STORAGE_KEY = 'react-todo-practice-v1'

const initialTasks = [
  {
    id: 'task-1',
    title: 'Prepare the React demo',
    notes: 'Outline the app flow and highlight the state management choices.',
    priority: 'high',
    dueDate: '2026-06-21',
    completed: false,
    createdAt: '2026-06-18T09:30:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Review the final UI copy',
    notes: 'Keep the wording concise so the project looks submission-ready.',
    priority: 'medium',
    dueDate: '2026-06-22',
    completed: true,
    createdAt: '2026-06-17T13:20:00.000Z',
  },
  {
    id: 'task-3',
    title: 'Capture a screenshot for submission',
    notes: 'Use the polished board view with a few live tasks visible.',
    priority: 'low',
    dueDate: '2026-06-23',
    completed: false,
    createdAt: '2026-06-19T08:45:00.000Z',
  },
]

const blankForm = {
  title: '',
  notes: '',
  priority: 'medium',
  dueDate: '',
}

const filterOptions = [
  { key: 'all', label: 'All tasks' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

function getStoredTasks() {
  if (typeof window === 'undefined') {
    return initialTasks
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    const parsedValue = storedValue ? JSON.parse(storedValue) : null

    return Array.isArray(parsedValue) ? parsedValue : initialTasks
  } catch {
    return initialTasks
  }
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `task-${Date.now()}`
}

function formatDate(dateValue) {
  if (!dateValue) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateValue}T00:00:00`))
}

function filterTasks(tasks, filter, search) {
  const searchValue = search.trim().toLowerCase()

  return tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed)
    const matchesSearch =
      searchValue.length === 0 ||
      [task.title, task.notes, task.priority]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchValue))

    return matchesFilter && matchesSearch
  })
}

function App() {
  const [tasks, setTasks] = useState(getStoredTasks)
  const [formValues, setFormValues] = useState(blankForm)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = filterTasks(tasks, filter, search)

  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.length - completedCount
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)

  function handleSubmit(event) {
    event.preventDefault()

    const title = formValues.title.trim()

    if (!title) {
      return
    }

    if (editingId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title,
                notes: formValues.notes.trim(),
                priority: formValues.priority,
                dueDate: formValues.dueDate,
              }
            : task,
        ),
      )
      setEditingId(null)
    } else {
      setTasks((currentTasks) => [
        {
          id: createId(),
          title,
          notes: formValues.notes.trim(),
          priority: formValues.priority,
          dueDate: formValues.dueDate,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        ...currentTasks,
      ])
    }

    setFormValues(blankForm)
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function removeTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
    if (editingId === taskId) {
      setEditingId(null)
      setFormValues(blankForm)
    }
  }

  function startEditing(task) {
    setEditingId(task.id)
    setFormValues({
      title: task.title,
      notes: task.notes,
      priority: task.priority,
      dueDate: task.dueDate,
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setFormValues(blankForm)
  }

  function clearCompleted() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
    if (editingId) {
      cancelEditing()
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">React practice project</p>
          <h1>Task Forge</h1>
          <p className="lead">
            A polished todo app with React state, filters, inline editing, and local storage
            persistence. Built to present as a clean submission-ready practice project.
          </p>
          <div className="hero-stats" aria-label="Task summary">
            <article>
              <strong>{tasks.length}</strong>
              <span>Total tasks</span>
            </article>
            <article>
              <strong>{activeCount}</strong>
              <span>Open items</span>
            </article>
            <article>
              <strong>{completionRate}%</strong>
              <span>Completion</span>
            </article>
          </div>
        </div>

        <div className="hero-card">
          <h2>Submission snapshot</h2>
          <p>
            Everything below is functional: add tasks, edit them, filter the board, and keep the
            data after refresh.
          </p>
          <ul>
            <li>Persistent state through localStorage</li>
            <li>Task priorities and due dates</li>
            <li>Search and status filters</li>
          </ul>
        </div>
      </section>

      <section className="workspace-grid">
        <TodoForm
          title={editingId ? 'Update task' : 'Create a task'}
          values={formValues}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          onReset={cancelEditing}
          onClearCompleted={clearCompleted}
          isEditing={editingId !== null}
        />

        <TodoList
          tasks={visibleTasks}
          allTasks={tasks}
          activeCount={activeCount}
          completedCount={completedCount}
          completionRate={completionRate}
          filter={filter}
          filterOptions={filterOptions}
          search={search}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
          onToggleTask={toggleTask}
          onEditTask={startEditing}
          onDeleteTask={removeTask}
          formatDate={formatDate}
        />
      </section>
    </main>
  )
}

export default App
