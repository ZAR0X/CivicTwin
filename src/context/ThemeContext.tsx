import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  blur: number;
  setBlur: (blur: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Try to load from localStorage first, with defaults if not found
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('civictwin-theme') as Theme) || 'light'
  );
  
  const [opacity, setOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('civictwin-opacity');
    return saved ? parseFloat(saved) : 0.6; // Default to 0.6
  });
  
  const [blur, setBlur] = useState<number>(() => {
    const saved = localStorage.getItem('civictwin-blur');
    return saved ? parseInt(saved, 10) : 24; // Default to 24px
  });

  // Apply CSS variables whenever state changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Save to localStorage
    localStorage.setItem('civictwin-theme', theme);
    localStorage.setItem('civictwin-opacity', opacity.toString());
    localStorage.setItem('civictwin-blur', blur.toString());

    // Apply specific variables
    root.style.setProperty('--glass-blur', `${blur}px`);
    root.style.setProperty('--glass-opacity', opacity.toString());
    
    // Apply theme variables (RGB components for rgba use)
    if (theme === 'dark') {
      root.style.setProperty('--glass-bg-rgb', '15, 23, 42'); // slate-900
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--text-primary', '#f8fafc');
      document.body.classList.add('dark');
    } else {
      root.style.setProperty('--glass-bg-rgb', '255, 255, 255'); // white
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.8)');
      root.style.setProperty('--text-primary', '#0f172a');
      document.body.classList.remove('dark');
    }
  }, [theme, opacity, blur]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, opacity, setOpacity, blur, setBlur }}>
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
