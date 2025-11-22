import React, { useState } from 'react';

type RegisterProps = {
  onRegisterSuccess: (token: string, user: { id: string; email: string; firstName: string; lastName: string }) => void;
  onSwitchToLogin: () => void;
};

export function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, firstName, lastName, password })
    })
      .then(async res => {
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          let msg = `Registration failed (${res.status})`;
          try {
            const body = JSON.parse(txt || '{}');
            if (body && body.error) msg = body.error;
          } catch {}
          throw new Error(msg);
        }
        return res.json();
      })
      .then(() => {
        // auto-login after register
        return fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, password })
        });
      })
      .then(async res => {
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          let msg = `Login failed after register (${res.status})`;
          try {
            const body = JSON.parse(txt || '{}');
            if (body && body.error) msg = body.error;
          } catch {}
          throw new Error(msg);
        }
        return res.json();
      })
      .then((data) => onRegisterSuccess(data.token, data.user))
      .catch(err => {
        console.error('Register error:', err);
        setError(String(err.message || err));
      });
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-gray-900 mb-6">Create Account</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input className="w-full px-3 py-2 border" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">First Name</label>
            <input className="w-full px-3 py-2 border" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Last Name</label>
            <input className="w-full px-3 py-2 border" value={lastName} onChange={e => setLastName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input type="password" className="w-full px-3 py-2 border" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded">Create Account</button>
            <button type="button" onClick={onSwitchToLogin} className="text-sm text-blue-600">Already have an account?</button>
          </div>
        </form>
      </div>
    </div>
  );
}
