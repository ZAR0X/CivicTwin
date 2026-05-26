import React, { createContext, useState, useContext } from 'react';
import { MOCK_REPORTS, BHOPAL_COORDINATES } from '@/constants/mapHtml';

export interface Report {
  id: string;
  coordinates: number[]; // [lng, lat]
  category: string;
  severity: number;
  description: string;
  image: string;
  upvotes: number;
  department: string;
  status: string;
  date: string;
  verifiedByUser?: boolean;
}

interface AppContextType {
  reports: Report[];
  userPoints: number;
  addReport: (report: Omit<Report, 'id' | 'date' | 'upvotes' | 'status'>) => void;
  verifyReport: (reportId: string) => void;
  userRank: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [userPoints, setUserPoints] = useState(120); // Starting points for demo
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default to light theme

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addReport = (newReportData: Omit<Report, 'id' | 'date' | 'upvotes' | 'status'>) => {
    const newReport: Report = {
      ...newReportData,
      id: `rep-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      upvotes: 0,
      status: 'Pending',
    };
    setReports((prev) => [newReport, ...prev]);
    setUserPoints((prev) => prev + 25); // +25 points for submitting a new report
  };

  const verifyReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId && !r.verifiedByUser) {
          return { ...r, upvotes: r.upvotes + 1, verifiedByUser: true };
        }
        return r;
      })
    );
    setUserPoints((prev) => prev + 50); // +50 points for verifying an issue
  };

  // User rank calculated dynamically
  const userRank = userPoints > 200 ? 2 : userPoints > 150 ? 4 : 5;

  return (
    <AppContext.Provider value={{ reports, userPoints, addReport, verifyReport, userRank, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
