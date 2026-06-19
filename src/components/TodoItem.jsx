function TodoItem({ task, onToggleTask, onEditTask, onDeleteTask, formatDate }) {
  return (
    <article className={task.completed ? 'task-item done' : 'task-item'}>
      <label className="task-main">
        <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
        <div>
          <div className="task-title-row">
            <h3>{task.title}</h3>
            <span className={`priority priority-${task.priority}`}>{task.priority}</span>
          </div>
          {task.notes ? <p>{task.notes}</p> : <p className="muted">No notes added.</p>}
          <div className="task-meta">
            <span>Due {formatDate(task.dueDate)}</span>
            <span>
              Added{' '}
              {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
                new Date(task.createdAt),
              )}
            </span>
          </div>
        </div>
      </label>

      <div className="task-actions">
        <button type="button" className="ghost-button" onClick={() => onEditTask(task)}>
          Edit
        </button>
        <button type="button" className="ghost-button danger" onClick={() => onDeleteTask(task.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default TodoItem
