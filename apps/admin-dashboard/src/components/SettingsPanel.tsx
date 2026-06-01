import { AcrylicCard } from './AcrylicCard';
import { useTheme } from '../context/ThemeContext';

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { theme, setTheme, opacity, setOpacity, blur, setBlur } = useTheme();

  return (
    <AcrylicCard variant="panel" className="w-full h-full overflow-hidden shadow-2xl flex flex-col rounded-3xl">
      {/* Title Bar */}
      <div className="h-14 bg-black/5 dark:bg-white/5 flex items-center justify-between px-6 border-b border-black/5 dark:border-white/10">
        <span className="text-sm font-bold text-[var(--text-adaptive)]">Settings</span>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
          <span className="text-xs font-bold leading-none">×</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col gap-8 max-w-2xl">
        
        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-adaptive)] mb-1">Theme Mode</h3>
            <p className="text-xs text-[var(--text-adaptive-muted)]">Switch between light and dark appearance</p>
          </div>
          
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${theme === 'dark' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Acrylic Settings */}
        <div className="flex flex-col gap-6 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-adaptive)] mb-1">Acrylic Effect</h3>
            <p className="text-xs text-[var(--text-adaptive-muted)]">Adjust the transparency and blur of all floating panels</p>
          </div>
          
          <div className="flex flex-col gap-6 mt-2">
            <div className="flex items-center gap-6">
              <span className="text-xs font-bold w-24 text-[var(--text-adaptive-dim)]">Opacity</span>
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="flex-1 accent-blue-500 h-1.5 bg-black/10 dark:bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
              <span className="text-xs font-mono w-10 text-right text-[var(--text-adaptive-dim)]">{Math.round(opacity * 100)}%</span>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-xs font-bold w-24 text-[var(--text-adaptive-dim)]">Blurriness</span>
              <input 
                type="range" 
                min="0" max="60" step="2"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                className="flex-1 accent-blue-500 h-1.5 bg-black/10 dark:bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
              <span className="text-xs font-mono w-10 text-right text-[var(--text-adaptive-dim)]">{blur}px</span>
            </div>
          </div>
        </div>
        
      </div>
    </AcrylicCard>
  );
}
