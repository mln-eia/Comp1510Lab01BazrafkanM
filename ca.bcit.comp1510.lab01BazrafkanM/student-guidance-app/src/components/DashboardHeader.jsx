import { useEffect, useMemo, useState } from 'react';

export default function DashboardHeader({ userId, profile, latestRecommendation, onUpdateUser }) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile?.displayName ?? '');
  const [draftId, setDraftId] = useState(userId);

  useEffect(() => {
    setDraftName(profile?.displayName ?? '');
  }, [profile?.displayName]);

  useEffect(() => {
    setDraftId(userId);
  }, [userId]);

  const dominantThemeLabel = useMemo(() => {
    if (!latestRecommendation) {
      return 'Take the quiz to see tailored guidance';
    }
    return `Your leading theme: ${latestRecommendation.dominantTheme}`;
  }, [latestRecommendation]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onUpdateUser({ id: draftId.trim(), displayName: draftName.trim() });
    setEditing(false);
  };

  return (
    <header className="card header">
      <div className="identity">
        <h1>Pathfinder Dashboard</h1>
        <p className="subhead">{dominantThemeLabel}</p>
      </div>
      {editing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="displayName">Name</label>
            <input
              id="displayName"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              placeholder="Student name"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="userId">Student ID</label>
            <input
              id="userId"
              value={draftId}
              onChange={(event) => setDraftId(event.target.value)}
              placeholder="unique-id"
              required
            />
          </div>
          <div className="actions">
            <button type="submit" className="primary">
              Save profile
            </button>
            <button type="button" className="ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile">
          <div>
            <h2>{profile?.displayName ?? 'Pathfinder Student'}</h2>
            <span className="user-id">{userId}</span>
          </div>
          <button className="ghost" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        </div>
      )}
    </header>
  );
}
