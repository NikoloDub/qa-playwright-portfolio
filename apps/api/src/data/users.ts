export interface UserRecord {
  username: string;
  password: string;
  displayName: string;
  token: string;
}

export const users: UserRecord[] = [
  {
    username: 'demo',
    password: 'demo123',
    displayName: 'Demo User',
    token: 'mock-token-demo',
  },
];
