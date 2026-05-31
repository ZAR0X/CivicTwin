import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  blur: number;
  setBlur: (blur: number) => void;
  forcedTheme: Theme | null;
  setForcedTheme: (theme: Theme | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Try to load from localStorage first, with defaults if not found
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('civictwin-theme') as Theme) || 'dark'
  );
  
  const [opacity, setOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('civictwin-opacity');
    return saved ? parseFloat(saved) : 0.50; // Default to 0.50
  });
  
  const [blur, setBlur] = useState<number>(() => {
    const saved = localStorage.getItem('civictwin-blur');
    return saved ? parseInt(saved, 10) : 32; // Default to 32px
  });

  const [forcedTheme, setForcedTheme] = useState<Theme | null>(null);

  // Apply CSS variables whenever state changes
  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = forcedTheme || theme;
    
    // Save to localStorage
    localStorage.setItem('civictwin-theme', theme);
    localStorage.setItem('civictwin-opacity', opacity.toString());
    localStorage.setItem('civictwin-blur', blur.toString());

    // Apply specific variables
    root.style.setProperty('--glass-blur', `${blur}px`);
    root.style.setProperty('--glass-opacity', opacity.toString());
    
    // Apply theme variables (RGB components for rgba use)
    if (activeTheme === 'dark') {
      root.style.setProperty('--glass-bg-rgb', '0, 0, 0'); // Pure black
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--text-adaptive', '#ffffff');
      root.style.setProperty('--text-adaptive-muted', '#94a3b8'); // slate-400
      root.style.setProperty('--text-adaptive-dim', '#64748b'); // slate-500
      document.body.classList.add('dark');
    } else {
      root.style.setProperty('--glass-bg-rgb', '255, 255, 255'); // white
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.8)');
      
      // Dynamic text color for light mode: if opacity is low, map shows through (dark), so text must be white
      if (opacity < 0.6) {
        root.style.setProperty('--text-adaptive', '#ffffff');
        root.style.setProperty('--text-adaptive-muted', '#e2e8f0'); // slate-200
        root.style.setProperty('--text-adaptive-dim', '#cbd5e1'); // slate-300
      } else {
        root.style.setProperty('--text-adaptive', '#0f172a'); // slate-900
        root.style.setProperty('--text-adaptive-muted', '#475569'); // slate-600
        root.style.setProperty('--text-adaptive-dim', '#64748b'); // slate-500
      }
      
      document.body.classList.remove('dark');
    }
  }, [theme, forcedTheme, opacity, blur]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, opacity, setOpacity, blur, setBlur, forcedTheme, setForcedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
