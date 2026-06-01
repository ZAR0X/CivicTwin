import React from 'react';

interface AcrylicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'base' | 'panel';
}

export function AcrylicCard({ children, className = '', variant = 'base', ...props }: AcrylicCardProps) {
  const glassClass = variant === 'panel' ? 'glass-panel' : 'glass';
  return (
    <div className={`${glassClass} rounded-2xl ${className}`} {...props}>
      {children}
    </div>
  );
}
