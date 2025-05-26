import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // For now, just return children without theme functionality
  // This can be expanded later to support theme switching
  return <>{children}</>;
}
