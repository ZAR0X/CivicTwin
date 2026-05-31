import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, CheckCircle, Clock, LogOut, Map as MapIcon, ListTodo, Settings, LayoutGrid } from 'lucide-react';
import { AcrylicCard } from '../components/AcrylicCard';
import { MapViewer } from '../components/MapViewer';
import { DraggableWidget } from '../components/DraggableWidget';
import { SettingsPanel } from '../components/SettingsPanel';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeWindows, setActiveWindows] = useState<string[]>(['sidebar', 'stats']);
  const role = localStorage.getItem('role') || 'Unknown';

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleWindow = (id: string) => {
    setActiveWindows(prev => 
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen w-screen bg-slate-900 overflow-hidden font-sans fixed inset-0">
      {/* Background Map Layer */}
      <MapViewer />

      {/* Floating UI Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10">
        
        {/* Navigation Bar - Top Center */}
        <DraggableWidget defaultPosition={{ x: window.innerWidth / 2 - 200, y: 20 }}>
          <AcrylicCard variant="panel" className="h-14 px-6 flex items-center justify-between rounded-full shadow-lg pointer-events-auto w-[400px]">
            <div className="drag-handle flex items-center gap-3 cursor-grab active:cursor-grabbing flex-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-blue-500 flex items-center justify-center shadow-md">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white tracking-wide">CivicTwin</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleWindow('sidebar')} className="p-2 hover:bg-black/10 rounded-full transition-colors text-slate-600 dark:text-slate-300">
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button onClick={handleLogout} className="p-2 hover:bg-black/10 rounded-full transition-colors text-red-500">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </AcrylicCard>
        </DraggableWidget>

        {/* Floating Sidebar (Tools) */}
        {activeWindows.includes('sidebar') && (
          <DraggableWidget defaultPosition={{ x: 30, y: 100 }}>
            <AcrylicCard variant="panel" className="w-64 flex flex-col pointer-events-auto rounded-3xl shadow-xl overflow-hidden border border-white/20">
              <div className="drag-handle h-10 bg-black/10 flex items-center px-4 cursor-grab active:cursor-grabbing border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Applications</span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                <button 
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5 border border-transparent`}
                >
                  <MapIcon className="w-5 h-5" />
                  Live Heatmap
                </button>
                <button 
                  onClick={() => toggleWindow('tickets')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                    activeWindows.includes('tickets') ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-white/20' : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 border-transparent'
                  }`}
                >
                  <ListTodo className="w-5 h-5" />
                  Ticket System
                </button>
                
                <div className="h-px bg-black/10 my-2" />
                
                <button 
                  onClick={() => toggleWindow('settings')}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5"
                >
                  <Settings className="w-5 h-5" />
                  Personalisation
                </button>
              </div>
            </AcrylicCard>
          </DraggableWidget>
        )}

        {/* Floating Quick Stats */}
        {activeWindows.includes('stats') && (
          <DraggableWidget defaultPosition={{ x: window.innerWidth - 300, y: 100 }}>
            <AcrylicCard variant="panel" className="w-64 flex flex-col pointer-events-auto rounded-3xl shadow-xl overflow-hidden border border-white/20">
              <div className="drag-handle h-10 bg-black/10 flex items-center px-4 cursor-grab active:cursor-grabbing border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">System Status</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors">
                  <ShieldAlert className="w-5 h-5 text-red-500 mb-1" />
                  <p className="text-xl font-black text-slate-800 dark:text-white">24</p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Critical</p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors">
                  <Clock className="w-5 h-5 text-orange-500 mb-1" />
                  <p className="text-xl font-black text-slate-800 dark:text-white">156</p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Pending</p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                  <p className="text-xl font-black text-slate-800 dark:text-white">89</p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Resolved</p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5 hover:bg-black/10 transition-colors">
                  <Users className="w-5 h-5 text-blue-500 mb-1" />
                  <p className="text-xl font-black text-slate-800 dark:text-white">12</p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Depts</p>
                </div>
              </div>
            </AcrylicCard>
          </DraggableWidget>
        )}

        {/* Tickets Window */}
        {activeWindows.includes('tickets') && (
          <DraggableWidget defaultPosition={{ x: 350, y: 150 }}>
            <AcrylicCard variant="panel" className="w-[600px] h-[400px] flex flex-col pointer-events-auto rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="drag-handle h-12 bg-black/10 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing border-b border-white/10">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Ticket Console</span>
                <button onClick={() => toggleWindow('tickets')} className="w-4 h-4 rounded-full bg-red-400 hover:bg-red-500" />
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="text-slate-600 dark:text-slate-400 font-medium">
                  <p>Ticket table and assignment interface will be implemented here.</p>
                </div>
              </div>
            </AcrylicCard>
          </DraggableWidget>
        )}

        {/* Settings Window */}
        {activeWindows.includes('settings') && (
          <SettingsPanel onClose={() => toggleWindow('settings')} />
        )}
      </div>
    </div>
  );
}
