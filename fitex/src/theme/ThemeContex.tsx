import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'system';
export type ActualTheme = 'light' | 'dark';

interface ThemeColors {
  // Основные цвета
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Фоны
  background: string;
  card: string;
  cardSecondary: string;
  
  // Текст
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Границы и разделители
  border: string;
  separator: string;
  
  // Статусы
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Дополнительные
  overlay: string;
  shadow: string;
  tint: string;
}

const lightColors: ThemeColors = {
  // Основные цвета
  primary: '#007AFF',
  primaryLight: '#E3F2FD',
  primaryDark: '#0056CC',
  
  // Фоны
  background: '#FFFFFF',
  card: '#F8F8F8',
  cardSecondary: '#F0F0F0',
  
  // Текст
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#8E8E93',
  
  // Границы и разделители
  border: '#E5E5EA',
  separator: '#F5F5F5',
  
  // Статусы
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5856D6',
  
  // Дополнительные
  overlay: 'rgba(0, 0, 0, 0.3)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  tint: '#007AFF',
};

const darkColors: ThemeColors = {
  // Основные цвета
  primary: '#0A84FF',
  primaryLight: '#1C1C1E',
  primaryDark: '#409CFF',
  
  // Фоны
  background: '#000000',
  card: '#1C1C1E',
  cardSecondary: '#2C2C2E',
  
  // Текст
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  
  // Границы и разделители
  border: '#38383A',
  separator: '#2C2C2E',
  
  // Статусы
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#5E5CE6',
  
  // Дополнительные
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  tint: '#0A84FF',
};

interface ThemeContextType {
  themeType: ThemeType;
  actualTheme: ActualTheme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeType: 'system',
  actualTheme: 'light',
  colors: lightColors,
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: false,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Определяем актуальную тему
  const actualTheme: ActualTheme = themeType === 'system' 
    ? (systemTheme === 'dark' ? 'dark' : 'light')
    : themeType;

  // Цвета в зависимости от темы
  const colors = actualTheme === 'dark' ? darkColors : lightColors;

  // Загрузка темы из AsyncStorage
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeType(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Сохранение темы в AsyncStorage
  const saveTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleSetTheme = (newTheme: ThemeType) => {
    setThemeType(newTheme);
    saveTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = themeType === 'light' ? 'dark' : 'light';
    handleSetTheme(newTheme);
  };

  if (!isLoaded) {
    return null; // или LoadingScreen
  }

  return (
    <ThemeContext.Provider
      value={{
        themeType,
        actualTheme,
        colors,
        toggleTheme,
        setTheme: handleSetTheme,
        isDark: actualTheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};