import TodoItem from './TodoItem'

function TodoList({
  tasks,
  allTasks,
  activeCount,
  completedCount,
  completionRate,
  filter,
  filterOptions,
  search,
  onFilterChange,
  onSearchChange,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  formatDate,
}) {
  return (
    <section className="board card">
      <div className="card-heading board-heading">
        <div>
          <p className="section-label">Task board</p>
          <h2>{tasks.length ? 'Current work' : 'No matching tasks'}</h2>
        </div>

        <div className="toolbar">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={filter === option.key ? 'filter-button active' : 'filter-button'}
              onClick={() => onFilterChange(option.key)}
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
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title, note, or priority"
        />
      </label>

      <div className="board-meta">
        <span>{activeCount} active</span>
        <span>{completedCount} done</span>
        <span>{allTasks.length ? `${completionRate}% complete` : 'No tasks yet'}</span>
      </div>

      <div className="task-list">
        {tasks.length ? (
          tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onToggleTask={onToggleTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No tasks match the current view.</h3>
            <p>Try another filter or create a new task from the editor on the left.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default TodoList
