
import { useState, useEffect, useCallback } from 'react';

export interface TopBarTab {
  id: string;
  label: string;
  icon: string;
  to: string;
  visible: boolean;
  recordCount?: number;
  showNewBoard?: boolean;
}

export interface TopBarSettings {
  tabs: TopBarTab[];
  customizationMode: boolean;
}

const DEFAULT_TABS: TopBarTab[] = [
  { id: 'home', label: 'דף הבית', icon: 'Home', to: '/', visible: true },
  { id: 'contacts', label: 'אנשי קשר', icon: 'Phone', to: '/contacts', visible: true, showNewBoard: true },
  { id: 'activities', label: 'פעילויות', icon: 'Activity', to: '/activities', visible: true },
  { id: 'deals', label: 'עסקאות', icon: 'DollarSign', to: '/deals', visible: true, showNewBoard: true },
  { id: 'dynamic-boards', label: 'בורדים דינמיים', icon: 'BarChart3', to: '/dynamic-boards', visible: true },
  { id: 'board-management', label: 'ניהול בורדים', icon: 'FolderOpen', to: '/board-management', visible: true },
  { id: 'board-builder', label: 'בונה לוחות', icon: 'Layers', to: '/board-builder', visible: true },
  { id: 'automations', label: 'אוטומציות', icon: 'Workflow', to: '/automations', visible: true },
  { id: 'settings', label: 'הגדרות', icon: 'Settings', to: '/settings', visible: true },
];

const STORAGE_KEY = 'topbar_settings';

export const useTopBarSettings = () => {
  const [settings, setSettings] = useState<TopBarSettings>({
    tabs: DEFAULT_TABS,
    customizationMode: false
  });

  // טעינת הגדרות מ-localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, tabs: parsed.tabs || DEFAULT_TABS }));
      }
    } catch (error) {
      console.error('Error loading top bar settings:', error);
    }
  }, []);

  // שמירת הגדרות ל-localStorage
  const saveSettings = useCallback((newSettings: Partial<TopBarSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tabs: updatedSettings.tabs
      }));
    } catch (error) {
      console.error('Error saving top bar settings:', error);
    }
  }, [settings]);

  // סידור מחדש של טאבים
  const reorderTabs = useCallback((startIndex: number, endIndex: number) => {
    const newTabs = [...settings.tabs];
    const [removed] = newTabs.splice(startIndex, 1);
    newTabs.splice(endIndex, 0, removed);
    
    saveSettings({ tabs: newTabs });
  }, [settings.tabs, saveSettings]);

  // הצגה/הסתרה של טאב
  const toggleTabVisibility = useCallback((tabId: string) => {
    const newTabs = settings.tabs.map(tab =>
      tab.id === tabId ? { ...tab, visible: !tab.visible } : tab
    );
    saveSettings({ tabs: newTabs });
  }, [settings.tabs, saveSettings]);

  // שינוי שם טאב
  const renameTab = useCallback((tabId: string, newLabel: string) => {
    const newTabs = settings.tabs.map(tab =>
      tab.id === tabId ? { ...tab, label: newLabel } : tab
    );
    saveSettings({ tabs: newTabs });
  }, [settings.tabs, saveSettings]);

  // מעבר למצב התאמה
  const toggleCustomizationMode = useCallback(() => {
    setSettings(prev => ({ ...prev, customizationMode: !prev.customizationMode }));
  }, []);

  // איפוס לברירת מחדל
  const resetToDefault = useCallback(() => {
    saveSettings({ tabs: DEFAULT_TABS });
  }, [saveSettings]);

  return {
    settings,
    reorderTabs,
    toggleTabVisibility,
    renameTab,
    toggleCustomizationMode,
    resetToDefault,
    visibleTabs: settings.tabs.filter(tab => tab.visible)
  };
};
