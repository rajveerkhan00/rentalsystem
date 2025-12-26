'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, getThemeById } from '@/lib/themes';

interface ThemeContextType {
    currentTheme: Theme;
    setTheme: (themeId: string) => void;
    isThemeLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
    children,
    initialThemeId = 'default'
}: {
    children: React.ReactNode;
    initialThemeId?: string;
}) {
    const [themeId, setThemeId] = useState(initialThemeId);
    const [currentTheme, setCurrentTheme] = useState<Theme>(getThemeById(initialThemeId));
    const [isThemeLoading, setIsThemeLoading] = useState(true);

    useEffect(() => {
        // Fetch domain-specific theme on mount
        const fetchTheme = async () => {
            try {
                const response = await fetch('/api/public/theme');
                const data = await response.json();
                if (data.themeId) {
                    setThemeId(data.themeId);
                }
            } catch (error) {
                console.error('Failed to resolve domain theme:', error);
            } finally {
                setIsThemeLoading(false);
            }
        };
        fetchTheme();
    }, []);

    useEffect(() => {
        const theme = getThemeById(themeId);
        setCurrentTheme(theme);

        // Apply CSS variables to root
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([variable, value]) => {
            root.style.setProperty(variable, value);
        });
    }, [themeId]);

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme: setThemeId, isThemeLoading }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
