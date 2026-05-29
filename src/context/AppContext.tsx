import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { MOCK_REPORTS, BHOPAL_COORDINATES } from '@/constants/mapHtml';
import { apiService } from '@/services/apiService';

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
  aiReview?: string;
}

interface AppContextType {
  reports: Report[];
  userPoints: number;
  addReport: (report: Omit<Report, 'id' | 'date' | 'upvotes' | 'status'>) => void;
  verifyReport: (reportId: string) => void;
  userRank: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userName: string;
  setUserName: (name: string) => void;
  profilePhoto: string;
  setProfilePhoto: (photo: string) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [userPoints, setUserPoints] = useState(() => {
    if (Platform.OS === 'web') {
      try {
        const saved = localStorage.getItem('civictwin_user_points');
        return saved ? Number(saved) : 120;
      } catch (e) {
        return 120;
      }
    }
    return 120;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark theme
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem('civictwin_logged_in') === 'true';
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const login = () => {
    setIsLoggedIn(true);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('civictwin_logged_in', 'true');
      } catch (e) {}
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem('civictwin_logged_in');
      } catch (e) {}
    }
  };

  const [userName, setUserNameState] = useState(() => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem('civictwin_user_name') || 'Bhopal Whistleblower';
      } catch (e) {
        return 'Bhopal Whistleblower';
      }
    }
    return 'Bhopal Whistleblower';
  });

  const [profilePhoto, setProfilePhotoState] = useState(() => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem('civictwin_profile_photo') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
      } catch (e) {
        return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
      }
    }
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
  });

  // Load reports from database or fallback on mount
  useEffect(() => {
    const loadReports = async () => {
      const data = await apiService.getReports();
      setReports(data);
    };
    loadReports();
  }, []);

  // Sync theme from localStorage on initial load
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const savedTheme = localStorage.getItem('civictwin_theme') as 'light' | 'dark';
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch (e) {}
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      if (Platform.OS === 'web') {
        try {
          localStorage.setItem('civictwin_theme', nextTheme);
        } catch (e) {}
      }
      return nextTheme;
    });
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('civictwin_user_name', name);
      } catch (e) {}
    }
  };

  const setProfilePhoto = (photo: string) => {
    setProfilePhotoState(photo);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('civictwin_profile_photo', photo);
      } catch (e) {}
    }
  };

  const addReport = async (newReportData: Omit<Report, 'id' | 'date' | 'upvotes' | 'status'>) => {
    try {
      // 1. Submit through apiService
      await apiService.submitReport({
        latitude: newReportData.coordinates[1],
        longitude: newReportData.coordinates[0],
        category: newReportData.category,
        severity: newReportData.severity,
        description: newReportData.description,
        imageUrl: newReportData.image,
        department: newReportData.department,
        aiReview: newReportData.aiReview
      });

      // 2. Refetch updated list
      const data = await apiService.getReports();
      setReports(data);

      // 3. Increment user points
      setUserPoints((prev) => {
        const next = prev + 25;
        if (Platform.OS === 'web') {
          try {
            localStorage.setItem('civictwin_user_points', String(next));
          } catch (e) {}
        }
        return next;
      });
    } catch (e) {
      console.error("[CivicTwin Context] Failed to submit report:", e);
    }
  };

  const verifyReport = async (reportId: string) => {
    try {
      // 1. Update in database
      await apiService.verifyReport(reportId, 'mock-user-id');

      // 2. Update state locally
      setReports((prev) =>
        prev.map((r) => {
          if (r.id === reportId && !r.verifiedByUser) {
            return { ...r, upvotes: r.upvotes + 1, verifiedByUser: true };
          }
          return r;
        })
      );

      // 3. Increment user points
      setUserPoints((prev) => {
        const next = prev + 50;
        if (Platform.OS === 'web') {
          try {
            localStorage.setItem('civictwin_user_points', String(next));
          } catch (e) {}
        }
        return next;
      });
    } catch (e) {
      console.error("[CivicTwin Context] Failed to verify report:", e);
    }
  };

  // User rank calculated dynamically
  const userRank = userPoints > 200 ? 2 : userPoints > 150 ? 4 : 5;

  return (
    <AppContext.Provider value={{ 
      reports, 
      userPoints, 
      addReport, 
      verifyReport, 
      userRank, 
      theme, 
      toggleTheme,
      userName,
      setUserName,
      profilePhoto,
      setProfilePhoto,
      isLoggedIn,
      login,
      logout
    }}>
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
