import { useState } from 'react';
import { Login } from '../components/Login';
import { Register } from '../components/Register';

export function RegisterPage() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return (
      <Login onSwitchToRegister={() => setShowLogin(false)} />
    );
  }

  return (
    <Register onSwitchToLogin={() => setShowLogin(true)} />
  );
}
