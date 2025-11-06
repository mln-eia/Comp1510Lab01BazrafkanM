import { useMemo, useState } from 'react';
import { formatDate } from '../utils/date.js';

export default function GoalTracker({ goals, onCreate, onStatusChange }) {
  const [form, setForm] = useState({ title: '', dueDate: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const upcomingGoals = useMemo(() => {
    return goals
      .slice()
      .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
      .slice(0, 6);
  }, [goals]);

  const progress = useMemo(() => {
    const totalCount = goals.length;
    const completedCount = goals.filter((goal) => goal.completed).length;
    return {
      totalCount,
      completedCount,
      percentage: totalCount ? Math.round((completedCount / totalCount) * 100) : 0
    };
  }, [goals]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.dueDate) {
      return;
    }
    try {
      setSubmitting(true);
      await onCreate(form);
      setForm({ title: '', dueDate: '', notes: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <h2>Goal Tracker</h2>
          <p className="description">Plan your next steps, set deadlines, and celebrate progress.</p>
        </div>
        <div className="goal-progress">
          <strong>{progress.completedCount}</strong>
          <span>/{progress.totalCount} complete</span>
          <span className="percentage">{progress.percentage}%</span>
        </div>
      </div>
      <form className="goal-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="goal-title">Goal</label>
          <input
            id="goal-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Book a campus tour"
            required
          />
        </div>
        <div className="field-row">
          <label className="field-group">
            <span>Due date</span>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
          </label>
          <label className="field-group">
            <span>Notes</span>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add reminders or links"
            />
          </label>
        </div>
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add goal'}
        </button>
      </form>
      <ul className="goal-list">
        {upcomingGoals.map((goal) => (
          <li key={goal.id} className={goal.completed ? 'goal complete' : 'goal'}>
            <div>
              <h3>{goal.title}</h3>
              <p className="meta">Due {formatDate(goal.dueDate)}</p>
              {goal.notes ? <p className="notes">{goal.notes}</p> : null}
            </div>
            <button
              type="button"
              className={goal.completed ? 'ghost completed' : 'ghost'}
              onClick={() => onStatusChange(goal.id, !goal.completed)}
            >
              {goal.completed ? 'Mark incomplete' : 'Mark complete'}
            </button>
          </li>
        ))}
        {!upcomingGoals.length ? <li className="empty">Add your first goal to get started.</li> : null}
      </ul>
    </section>
  );
}
