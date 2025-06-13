
import { useState, useEffect, useCallback } from 'react';
import { ViewType } from '@/components/ViewSelector';

export interface BoardSettings {
  boardId: string;
  columnOrder?: string[];
  visibleColumns?: string[];
  selectedView: ViewType;
  personalFilters?: Record<string, any>;
  searchQuery?: string;
}

export interface PersonalView {
  id: string;
  name: string;
  boardId: string;
  settings: Omit<BoardSettings, 'boardId'>;
  createdAt: string;
}

const STORAGE_KEY_PREFIX = 'board_settings_';
const PERSONAL_VIEWS_KEY = 'personal_views';

export const useBoardSettings = (boardId: string | null) => {
  const [settings, setSettings] = useState<BoardSettings | null>(null);
  const [personalViews, setPersonalViews] = useState<PersonalView[]>([]);

  // טעינת הגדרות מ-localStorage
  const loadSettings = useCallback(() => {
    if (!boardId) {
      setSettings(null);
      return;
    }

    try {
      const savedSettings = localStorage.getItem(`${STORAGE_KEY_PREFIX}${boardId}`);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } else {
        // הגדרות ברירת מחדל
        const defaultSettings: BoardSettings = {
          boardId,
          selectedView: 'table',
          personalFilters: {},
          searchQuery: ''
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading board settings:', error);
      // הגדרות ברירת מחדל במקרה של שגיאה
      setSettings({
        boardId,
        selectedView: 'table',
        personalFilters: {},
        searchQuery: ''
      });
    }
  }, [boardId]);

  // שמירת הגדרות ל-localStorage
  const saveSettings = useCallback((newSettings: Partial<BoardSettings>) => {
    if (!boardId || !settings) return;

    const updatedSettings = { ...settings, ...newSettings };
    
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${boardId}`, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving board settings:', error);
    }
  }, [boardId, settings]);

  // איפוס הגדרות לברירת מחדל
  const resetSettings = useCallback(() => {
    if (!boardId) return;

    const defaultSettings: BoardSettings = {
      boardId,
      selectedView: 'table',
      personalFilters: {},
      searchQuery: ''
    };

    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${boardId}`, JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Error resetting board settings:', error);
    }
  }, [boardId]);

  // טעינת תצוגות אישיות
  const loadPersonalViews = useCallback(() => {
    try {
      const savedViews = localStorage.getItem(PERSONAL_VIEWS_KEY);
      if (savedViews) {
        const allViews = JSON.parse(savedViews);
        const boardViews = allViews.filter((view: PersonalView) => view.boardId === boardId);
        setPersonalViews(boardViews);
      }
    } catch (error) {
      console.error('Error loading personal views:', error);
    }
  }, [boardId]);

  // שמירת תצוגה אישית
  const saveAsPersonalView = useCallback((viewName: string) => {
    if (!boardId || !settings) return;

    const newView: PersonalView = {
      id: Date.now().toString(),
      name: viewName,
      boardId,
      settings: {
        columnOrder: settings.columnOrder,
        visibleColumns: settings.visibleColumns,
        selectedView: settings.selectedView,
        personalFilters: settings.personalFilters,
        searchQuery: settings.searchQuery
      },
      createdAt: new Date().toISOString()
    };

    try {
      const savedViews = localStorage.getItem(PERSONAL_VIEWS_KEY);
      const allViews = savedViews ? JSON.parse(savedViews) : [];
      const updatedViews = [...allViews, newView];
      
      localStorage.setItem(PERSONAL_VIEWS_KEY, JSON.stringify(updatedViews));
      setPersonalViews(prev => [...prev, newView]);
      
      return newView;
    } catch (error) {
      console.error('Error saving personal view:', error);
      return null;
    }
  }, [boardId, settings]);

  // טעינת תצוגה אישית
  const loadPersonalView = useCallback((viewId: string) => {
    const view = personalViews.find(v => v.id === viewId);
    if (view) {
      saveSettings(view.settings);
    }
  }, [personalViews, saveSettings]);

  // מחיקת תצוגה אישית
  const deletePersonalView = useCallback((viewId: string) => {
    try {
      const savedViews = localStorage.getItem(PERSONAL_VIEWS_KEY);
      if (savedViews) {
        const allViews = JSON.parse(savedViews);
        const updatedViews = allViews.filter((view: PersonalView) => view.id !== viewId);
        
        localStorage.setItem(PERSONAL_VIEWS_KEY, JSON.stringify(updatedViews));
        setPersonalViews(prev => prev.filter(v => v.id !== viewId));
      }
    } catch (error) {
      console.error('Error deleting personal view:', error);
    }
  }, []);

  // טעינה ראשונית
  useEffect(() => {
    loadSettings();
    loadPersonalViews();
  }, [loadSettings, loadPersonalViews]);

  return {
    settings,
    personalViews,
    saveSettings,
    resetSettings,
    saveAsPersonalView,
    loadPersonalView,
    deletePersonalView,
    refetch: () => {
      loadSettings();
      loadPersonalViews();
    }
  };
};
