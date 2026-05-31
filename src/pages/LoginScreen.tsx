import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, MapPin } from 'lucide-react';
import { AcrylicCard } from '../components/AcrylicCard';
import { useTheme } from '../context/ThemeContext';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setForcedTheme } = useTheme();

  useEffect(() => {
    // Force light mode on login screen regardless of user preference
    setForcedTheme('light');
    return () => setForcedTheme(null); // Cleanup on unmount
  }, [setForcedTheme]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'superadmin' || username === 'admin') {
      localStorage.setItem('role', username);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials. Use admin or superadmin');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Pastel floating blobs - Larger and more prominent for light theme */}
      <div className="absolute top-[0%] left-[10%] w-[600px] h-[600px] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob-1" />
      <div className="absolute top-[20%] right-[5%] w-[700px] h-[700px] bg-orange-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob-2" />
      <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[130px] animate-blob-3" />

      <AcrylicCard className="w-full max-w-md p-8 z-10 mx-4" variant="panel">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-4 border border-white shadow-sm">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">CivicTwin</h1>
          <p className="text-slate-500 mt-2 font-medium">Central Authority Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Authority ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-white/50 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all backdrop-blur-md shadow-sm"
                placeholder="Enter admin ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Secure Passkey</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-3 border border-white/50 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all backdrop-blur-md shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-white/50 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-white transition-all"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2 font-medium">
          <MapPin className="w-4 h-4" />
          Restricted access for authorized personnel only
        </div>
      </AcrylicCard>
    </div>
  );
}
