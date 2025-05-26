import { useState } from 'react';
import { Login } from '../components/Login';
import { Register } from '../components/Register';

export function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    );
  }

  return (
    <Login onSwitchToRegister={() => setShowRegister(true)} />
  );
}
