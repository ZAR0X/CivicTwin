import { X } from 'lucide-react';
import { AcrylicCard } from './AcrylicCard';
import { useTheme } from '../context/ThemeContext';
import { DraggableWidget } from './DraggableWidget';

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { theme, setTheme, opacity, setOpacity, blur, setBlur } = useTheme();

  return (
    <DraggableWidget defaultPosition={{ x: 100, y: 100 }} id="settings-panel">
      <AcrylicCard variant="panel" className="w-[400px] overflow-hidden shadow-2xl flex flex-col pointer-events-auto">
        {/* Title Bar - Drag Handle */}
        <div className="drag-handle h-10 border-b border-white/20 bg-black/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-sm font-semibold text-slate-500">Settings</span>
          <div className="w-12"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Personalisation</h2>
            
            <div className="flex flex-col gap-4 bg-black/5 p-4 rounded-xl border border-white/10">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Theme Mode</label>
                <div className="flex gap-2 mt-2">
                  <button 
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${theme === 'light' ? 'bg-white shadow-sm text-blue-600' : 'bg-transparent text-slate-500 hover:bg-black/5'}`}
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </button>
                  <button 
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${theme === 'dark' ? 'bg-slate-800 shadow-sm text-white' : 'bg-transparent text-slate-500 hover:bg-black/5'}`}
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="h-px bg-white/20 my-2" />

              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Acrylic Effect</label>
                <p className="text-xs text-slate-500 mb-4">Adjust window transparency and blur effect</p>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium w-24">Background Opacity</span>
                    <input 
                      type="range" 
                      min="0.1" max="1" step="0.05"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="flex-1 accent-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium w-24">Blurriness</span>
                    <input 
                      type="range" 
                      min="0" max="60" step="2"
                      value={blur}
                      onChange={(e) => setBlur(parseInt(e.target.value))}
                      className="flex-1 accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AcrylicCard>
    </DraggableWidget>
  );
}
