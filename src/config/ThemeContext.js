import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const themes = {
    light: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        primary: '#FF6B35',
        secondary: '#4ECDC4',
        text: '#333333',
        textSecondary: '#666666',
        border: '#DDDDDD',
        card: '#FFFFFF',
        error: '#FF4444',
        success: '#4CAF50',
    },
    dark: {
        background: '#121212',
        surface: '#1E1E1E',
        primary: '#FF6B35',
        secondary: '#4ECDC4',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        border: '#333333',
        card: '#1E1E1E',
        error: '#FF6B6B',
        success: '#66BB6A',
    },
    blue: {
        background: '#E3F2FD',
        surface: '#BBDEFB',
        primary: '#2196F3',
        secondary: '#03A9F4',
        text: '#0D47A1',
        textSecondary: '#1565C0',
        border: '#90CAF9',
        card: '#FFFFFF',
        error: '#F44336',
        success: '#4CAF50',
    },
    green: {
        background: '#E8F5E9',
        surface: '#C8E6C9',
        primary: '#4CAF50',
        secondary: '#8BC34A',
        text: '#1B5E20',
        textSecondary: '#388E3C',
        border: '#A5D6A7',
        card: '#FFFFFF',
        error: '#F44336',
        success: '#66BB6A',
    },
    purple: {
        background: '#F3E5F5',
        surface: '#E1BEE7',
        primary: '#9C27B0',
        secondary: '#BA68C8',
        text: '#4A148C',
        textSecondary: '#6A1B9A',
        border: '#CE93D8',
        card: '#FFFFFF',
        error: '#F44336',
        success: '#4CAF50',
    },
    orange: {
        background: '#FFF3E0',
        surface: '#FFE0B2',
        primary: '#FF9800',
        secondary: '#FFB74D',
        text: '#E65100',
        textSecondary: '#F57C00',
        border: '#FFCC80',
        card: '#FFFFFF',
        error: '#F44336',
        success: '#4CAF50',
    },
    pink: {
        background: '#FCE4EC',
        surface: '#F8BBD0',
        primary: '#E91E63',
        secondary: '#F06292',
        text: '#880E4F',
        textSecondary: '#C2185B',
        border: '#F48FB1',
        card: '#FFFFFF',
        error: '#F44336',
        success: '#4CAF50',
    },
    teal: {
        background: '#E0F2F1',
        surface: '#B2DFDB',
        primary: '#009688',
        secondary: '#26A69A',
        text: '#004D40',
        textSecondary: '#00695C',
        border: '#80CBC4',
        card: '#FFFFFF',
        error: '#F44336',
        success: '#4CAF50',
    },
    indigo: {
        background: '#E8EAF6',
        surface: '#C5CAE9',
        primary: '#3F51B5',
        secondary: '#5C6BC0',
        text: '#1A237E',
        textSecondary: '#283593',
        border: '#9FA8DA',
        card: '#FFFFFF',
        error: '#F44336',
        success: '#4CAF50',
    },
    red: {
        background: '#FFEBEE',
        surface: '#FFCDD2',
        primary: '#F44336',
        secondary: '#EF5350',
        text: '#B71C1C',
        textSecondary: '#C62828',
        border: '#EF9A9A',
        card: '#FFFFFF',
        error: '#D32F2F',
        success: '#4CAF50',
    },
    midnight: {
        background: '#0A0E27',
        surface: '#1A1F3A',
        primary: '#6C63FF',
        secondary: '#4ECDC4',
        text: '#FFFFFF',
        textSecondary: '#B8B8D1',
        border: '#2A2F4A',
        card: '#1A1F3A',
        error: '#FF6B6B',
        success: '#51CF66',
    },
    sunset: {
        background: '#FFF5E6',
        surface: '#FFE4CC',
        primary: '#FF6B6B',
        secondary: '#FFD93D',
        text: '#2C3E50',
        textSecondary: '#5D6D7E',
        border: '#F8C291',
        card: '#FFFFFF',
        error: '#E74C3C',
        success: '#2ECC71',
    },
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme && themes[savedTheme]) {
                setCurrentTheme(savedTheme);
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    const changeTheme = async (themeName) => {
        try {
            await AsyncStorage.setItem('appTheme', themeName);
            setCurrentTheme(themeName);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme: themes[currentTheme],
                currentTheme,
                changeTheme,
                isDark: currentTheme === 'dark',
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
