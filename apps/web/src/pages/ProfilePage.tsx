import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { session, updateDisplayName } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (session) {
      setDisplayName(session.user.displayName);
    }
  }, [session]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateDisplayName(displayName.trim());
    setSaved(true);
  }

  return (
    <section className="page profile-page" data-testid="profile-page">
      <h1>Profile</h1>
      <p data-testid="profile-username">Username: {session?.user.username}</p>

      <form onSubmit={handleSubmit} data-testid="profile-form">
        <label htmlFor="displayName">Display name</label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(event) => {
            setDisplayName(event.target.value);
            setSaved(false);
          }}
          data-testid="profile-display-name"
        />
        <button type="submit" data-testid="profile-save">
          Save
        </button>
      </form>

      {saved ? (
        <p className="success" data-testid="profile-saved">
          Profile updated
        </p>
      ) : null}
    </section>
  );
}
