import { useEffect, useMemo, useState } from 'react'
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

function App() {
  const [tasks, setTasks] = useState(getStoredTasks)
  const [formValues, setFormValues] = useState(blankForm)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = useMemo(() => {
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
  }, [filter, search, tasks])

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
        <form className="composer card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <div>
              <p className="section-label">Task editor</p>
              <h2>{editingId ? 'Update task' : 'Create a task'}</h2>
            </div>
            <button type="button" className="ghost-button" onClick={cancelEditing}>
              Reset
            </button>
          </div>

          <label>
            Title
            <input
              value={formValues.title}
              onChange={(event) => setFormValues({ ...formValues, title: event.target.value })}
              placeholder="Example: Finalize the React project"
              maxLength={80}
              required
            />
          </label>

          <label>
            Notes
            <textarea
              value={formValues.notes}
              onChange={(event) => setFormValues({ ...formValues, notes: event.target.value })}
              placeholder="Add a short note about the task or submission detail."
              rows={4}
            />
          </label>

          <div className="field-row">
            <label>
              Priority
              <select
                value={formValues.priority}
                onChange={(event) =>
                  setFormValues({ ...formValues, priority: event.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label>
              Due date
              <input
                type="date"
                value={formValues.dueDate}
                onChange={(event) => setFormValues({ ...formValues, dueDate: event.target.value })}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId ? 'Save changes' : 'Add task'}
            </button>
            <button type="button" className="secondary-button" onClick={clearCompleted}>
              Clear completed
            </button>
          </div>
        </form>

        <section className="board card">
          <div className="card-heading board-heading">
            <div>
              <p className="section-label">Task board</p>
              <h2>{visibleTasks.length ? 'Current work' : 'No matching tasks'}</h2>
            </div>

            <div className="toolbar">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={filter === option.key ? 'filter-button active' : 'filter-button'}
                  onClick={() => setFilter(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <label className="search-field">
            Search
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, note, or priority"
            />
          </label>

          <div className="board-meta">
            <span>{activeCount} active</span>
            <span>{completedCount} done</span>
            <span>{tasks.length ? `${completionRate}% complete` : 'No tasks yet'}</span>
          </div>

          <div className="task-list">
            {visibleTasks.length ? (
              visibleTasks.map((task) => (
                <article key={task.id} className={task.completed ? 'task-item done' : 'task-item'}>
                  <label className="task-main">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <div>
                      <div className="task-title-row">
                        <h3>{task.title}</h3>
                        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                      </div>
                      {task.notes ? <p>{task.notes}</p> : <p className="muted">No notes added.</p>}
                      <div className="task-meta">
                        <span>Due {formatDate(task.dueDate)}</span>
                        <span>
                          Added {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
                            new Date(task.createdAt),
                          )}
                        </span>
                      </div>
                    </div>
                  </label>

                  <div className="task-actions">
                    <button type="button" className="ghost-button" onClick={() => startEditing(task)}>
                      Edit
                    </button>
                    <button type="button" className="ghost-button danger" onClick={() => removeTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h3>No tasks match the current view.</h3>
                <p>Try another filter or create a new task from the editor on the left.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
