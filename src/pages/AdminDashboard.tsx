import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, CheckCircle, Clock, LogOut, Map as MapIcon, ListTodo, Settings, LayoutGrid } from 'lucide-react';
import { AcrylicCard } from '../components/AcrylicCard';
import { MapViewer } from '../components/MapViewer';
import { SettingsPanel } from '../components/SettingsPanel';

export function AdminDashboard() {
  const navigate = useNavigate();
  // By default, no center window is open, so just the map is visible in the center space.
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  
  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleWindow = (id: string) => {
    setActiveWindow(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen w-screen bg-black overflow-hidden font-sans fixed inset-0">
      {/* Background Map Layer */}
      <MapViewer />

      {/* Floating UI Overlay - Bento Grid Layout */}
      <div className="fixed inset-0 pointer-events-none z-10 p-6 flex gap-6">
        
        {/* Left Column (320px) */}
        <div className="w-[300px] flex flex-col gap-6">
          
          {/* Header / Brand */}
          <AcrylicCard variant="panel" className="h-[72px] px-6 flex items-center justify-between rounded-3xl shadow-lg pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-md">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-[var(--text-adaptive)] tracking-wide">CivicTwin</span>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-red-500">
              <LogOut className="w-4 h-4" />
            </button>
          </AcrylicCard>

          {/* Applications Sidebar */}
          <AcrylicCard variant="panel" className="flex-1 flex flex-col pointer-events-auto rounded-3xl shadow-xl overflow-hidden">
            <div className="h-12 bg-black/5 dark:bg-white/5 flex items-center px-6 border-b border-black/5 dark:border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-adaptive-dim)]">Applications</span>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <button 
                onClick={() => setActiveWindow(null)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
                  activeWindow === null ? 'bg-blue-500/10 text-blue-500' : 'text-[var(--text-adaptive-muted)] hover:text-[var(--text-adaptive)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Live Heatmap
              </button>
              
              <button 
                onClick={() => toggleWindow('tickets')}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
                  activeWindow === 'tickets' ? 'bg-blue-500/10 text-blue-500' : 'text-[var(--text-adaptive-muted)] hover:text-[var(--text-adaptive)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                Ticket System
              </button>
              
              <div className="h-px bg-black/5 dark:bg-white/10 my-2" />
              
              <button 
                onClick={() => toggleWindow('settings')}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
                  activeWindow === 'settings' ? 'bg-blue-500/10 text-blue-500' : 'text-[var(--text-adaptive-muted)] hover:text-[var(--text-adaptive)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </AcrylicCard>
        </div>

        {/* Right Column (Flexible space) */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Top Row: System Status (Stretches full width of right column) */}
          <AcrylicCard variant="panel" className="h-[120px] pointer-events-auto rounded-3xl shadow-xl flex flex-col overflow-hidden">
            <div className="h-10 bg-black/5 dark:bg-white/5 flex items-center px-6 border-b border-black/5 dark:border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-adaptive-dim)]">System Status</span>
            </div>
            <div className="flex-1 flex items-center justify-around px-4">
              <div className="flex items-center gap-4 p-2">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[var(--text-adaptive)] leading-none">24</p>
                  <p className="text-[10px] font-bold uppercase text-[var(--text-adaptive-dim)] mt-1">Critical</p>
                </div>
              </div>
              
              <div className="w-px h-10 bg-black/5 dark:bg-white/10" />

              <div className="flex items-center gap-4 p-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[var(--text-adaptive)] leading-none">156</p>
                  <p className="text-[10px] font-bold uppercase text-[var(--text-adaptive-dim)] mt-1">Pending</p>
                </div>
              </div>

              <div className="w-px h-10 bg-black/5 dark:bg-white/10" />

              <div className="flex items-center gap-4 p-2">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[var(--text-adaptive)] leading-none">89</p>
                  <p className="text-[10px] font-bold uppercase text-[var(--text-adaptive-dim)] mt-1">Resolved</p>
                </div>
              </div>

              <div className="w-px h-10 bg-black/5 dark:bg-white/10" />

              <div className="flex items-center gap-4 p-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[var(--text-adaptive)] leading-none">12</p>
                  <p className="text-[10px] font-bold uppercase text-[var(--text-adaptive-dim)] mt-1">Depts</p>
                </div>
              </div>
            </div>
          </AcrylicCard>

          {/* Main Content Area (Fills remaining space) */}
          <div className="flex-1 relative">
            
            {/* Tickets Window */}
            {activeWindow === 'tickets' && (
              <AcrylicCard variant="panel" className="absolute inset-0 pointer-events-auto rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="h-14 bg-black/5 dark:bg-white/5 flex items-center justify-between px-6 border-b border-black/5 dark:border-white/10">
                  <span className="text-sm font-bold text-[var(--text-adaptive)]">Ticket Console</span>
                  <button onClick={() => setActiveWindow(null)} className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
                    <span className="text-xs font-bold leading-none">×</span>
                  </button>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="text-base text-[var(--text-adaptive-muted)] font-medium">
                    <p>Ticket table and assignment interface will be implemented here.</p>
                  </div>
                </div>
              </AcrylicCard>
            )}

            {/* Settings Window */}
            {activeWindow === 'settings' && (
              <div className="absolute inset-0 pointer-events-auto">
                <SettingsPanel onClose={() => setActiveWindow(null)} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
