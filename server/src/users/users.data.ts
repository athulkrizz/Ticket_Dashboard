export interface User {
  username: string;
  password: string;
  displayName: string;
  role: 'admin' | 'agent';
  avatar: string;
}

// Passwords are stored in plain text for demo purposes only.
// In production, use bcrypt hashed passwords.
export const USERS: User[] = [
  {
    username: 'admin',
    password: 'admin123',
    displayName: 'Admin User',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6C63FF&color=fff',
  },
  {
    username: 'Athul.Krishnan',
    password: 'password',
    displayName: 'Athul Krishnan',
    role: 'agent',
    avatar: 'https://ui-avatars.com/api/?name=Athul.Krishnan&background=00C9A7&color=fff',
  },
  {
    username: 'Surya.Lekshmi',
    password: 'password',
    displayName: 'Surya Lekshmi',
    role: 'agent',
    avatar: 'https://ui-avatars.com/api/?name=Surya+Lekshmi&background=FF6B6B&color=fff',
  },
  {
    username: 'Manu.Kuttan',
    password: 'password',
    displayName: 'Manu Kuttan',
    role: 'agent',
    avatar: 'https://ui-avatars.com/api/?name=Manu+Kuttan&background=FFA62B&color=fff',
  },
];
