import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, CheckCircle, Clock, LogOut, Map as MapIcon, ListTodo, Settings } from 'lucide-react';
import { AcrylicCard } from '../components/AcrylicCard';
import { MapViewer } from '../components/MapViewer';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'map' | 'tickets'>('map');
  const role = localStorage.getItem('role') || 'Unknown';

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      {/* Larger Pastel floating blobs for light theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-orange-300/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob-2" />
      <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[110px] animate-blob-3" />

      {/* Navbar as a floating pill */}
      <nav className="z-50 m-4">
        <AcrylicCard variant="panel" className="h-16 px-6 flex items-center justify-between rounded-full shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-blue-500 flex items-center justify-center shadow-md">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-wide">CivicTwin Authority</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              <span className="text-slate-500">Logged in as: </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600 font-bold uppercase">{role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 bg-slate-200/50 hover:bg-slate-300/50 rounded-full transition-colors text-slate-600 hover:text-slate-900 border border-white/50"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </AcrylicCard>
      </nav>

      <div className="flex flex-1 overflow-hidden z-40 px-4 pb-4 gap-4">
        {/* Sidebar as a floating island */}
        <AcrylicCard variant="panel" className="w-64 flex flex-col p-4 gap-2 rounded-3xl h-full shadow-sm">
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold ${
              activeTab === 'map' ? 'bg-gradient-to-r from-orange-500/10 to-blue-500/10 text-blue-700 border border-white/60 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 border border-transparent'
            }`}
          >
            <MapIcon className="w-5 h-5" />
            Live Heatmap
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold ${
              activeTab === 'tickets' ? 'bg-gradient-to-r from-orange-500/10 to-blue-500/10 text-blue-700 border border-white/60 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 border border-transparent'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            Ticket Management
          </button>

          <div className="mt-auto">
            <button className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 w-full border border-transparent">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </AcrylicCard>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
            <AcrylicCard variant="panel" className="p-5 flex items-center gap-4 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/10 flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Critical</p>
                <p className="text-2xl font-black text-slate-800">24</p>
              </div>
            </AcrylicCard>
            <AcrylicCard variant="panel" className="p-5 flex items-center gap-4 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/10 flex items-center justify-center shadow-inner">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-black text-slate-800">156</p>
              </div>
            </AcrylicCard>
            <AcrylicCard variant="panel" className="p-5 flex items-center gap-4 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/10 flex items-center justify-center shadow-inner">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Resolved</p>
                <p className="text-2xl font-black text-slate-800">89</p>
              </div>
            </AcrylicCard>
            <AcrylicCard variant="panel" className="p-5 flex items-center gap-4 rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/10 flex items-center justify-center shadow-inner">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Departments</p>
                <p className="text-2xl font-black text-slate-800">12</p>
              </div>
            </AcrylicCard>
          </div>

          {/* Conditional Rendering based on active tab */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {activeTab === 'map' ? (
              <AcrylicCard variant="panel" className="flex-1 w-full p-0 md:p-2 rounded-3xl shadow-sm relative z-0 flex flex-col">
                <MapViewer />
              </AcrylicCard>
            ) : (
              <AcrylicCard variant="panel" className="flex-1 w-full p-8 rounded-3xl shadow-sm overflow-y-auto flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">Ticket Management Console</h2>
                <div className="text-slate-600 font-medium">
                  <p>Ticket table and assignment interface will be implemented here.</p>
                </div>
              </AcrylicCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
