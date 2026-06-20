import { Router } from 'express';
import { users } from '../data/users.js';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const user = users.find(
    (entry) => entry.username === username && entry.password === password,
  );

  if (!user) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }

  res.status(200).json({
    token: user.token,
    user: {
      username: user.username,
      displayName: user.displayName,
    },
  });
});
