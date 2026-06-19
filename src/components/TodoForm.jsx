function TodoForm({
  title,
  values,
  onChange,
  onSubmit,
  onReset,
  onClearCompleted,
  isEditing,
}) {
  return (
    <form className="composer card" onSubmit={onSubmit}>
      <div className="card-heading">
        <div>
          <p className="section-label">Task editor</p>
          <h2>{title}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onReset}>
          Reset
        </button>
      </div>

      <label>
        Title
        <input
          value={values.title}
          onChange={(event) => onChange({ ...values, title: event.target.value })}
          placeholder="Example: Finalize the React project"
          maxLength={80}
          required
        />
      </label>

      <label>
        Notes
        <textarea
          value={values.notes}
          onChange={(event) => onChange({ ...values, notes: event.target.value })}
          placeholder="Add a short note about the task or submission detail."
          rows={4}
        />
      </label>

      <div className="field-row">
        <label>
          Priority
          <select
            value={values.priority}
            onChange={(event) => onChange({ ...values, priority: event.target.value })}
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
            value={values.dueDate}
            onChange={(event) => onChange({ ...values, dueDate: event.target.value })}
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {isEditing ? 'Save changes' : 'Add task'}
        </button>
        <button type="button" className="secondary-button" onClick={onClearCompleted}>
          Clear completed
        </button>
      </div>
    </form>
  )
}

export default TodoForm
