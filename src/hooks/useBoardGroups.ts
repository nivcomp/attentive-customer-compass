
import { useState, useEffect, useCallback } from 'react';
import { BoardGroup, GroupedBoardViewSettings } from '@/types/boardGroups';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'board_groups_settings';

export const useBoardGroups = () => {
  const [settings, setSettings] = useState<GroupedBoardViewSettings>({
    groups: [],
    selectedGroupId: null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // טעינת הגדרות מ-localStorage
  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading board groups settings:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת הגדרות הקבוצות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // שמירת הגדרות ל-localStorage
  const saveSettings = useCallback((newSettings: GroupedBoardViewSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving board groups settings:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת הגדרות הקבוצות",
        variant: "destructive",
      });
    }
  }, [toast]);

  // יצירת קבוצה חדשה
  const createGroup = useCallback((name: string, boardIds: string[] = []) => {
    const newGroup: BoardGroup = {
      id: Date.now().toString(),
      name,
      boardIds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newSettings = {
      ...settings,
      groups: [...settings.groups, newGroup]
    };

    saveSettings(newSettings);
    
    toast({
      title: "הצלחה",
      description: "הקבוצה נוצרה בהצלחה",
    });

    return newGroup;
  }, [settings, saveSettings, toast]);

  // עדכון קבוצה
  const updateGroup = useCallback((groupId: string, updates: Partial<Omit<BoardGroup, 'id' | 'created_at'>>) => {
    const updatedGroups = settings.groups.map(group => 
      group.id === groupId 
        ? { ...group, ...updates, updated_at: new Date().toISOString() }
        : group
    );

    const newSettings = {
      ...settings,
      groups: updatedGroups
    };

    saveSettings(newSettings);

    toast({
      title: "הצלחה",
      description: "הקבוצה עודכנה בהצלחה",
    });
  }, [settings, saveSettings, toast]);

  // מחיקת קבוצה
  const deleteGroup = useCallback((groupId: string) => {
    const newSettings = {
      ...settings,
      groups: settings.groups.filter(group => group.id !== groupId),
      selectedGroupId: settings.selectedGroupId === groupId ? null : settings.selectedGroupId
    };

    saveSettings(newSettings);

    toast({
      title: "הצלחה",
      description: "הקבוצה נמחקה בהצלחה",
    });
  }, [settings, saveSettings, toast]);

  // בחירת קבוצה
  const selectGroup = useCallback((groupId: string | null) => {
    const newSettings = {
      ...settings,
      selectedGroupId: groupId
    };

    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // טעינה ראשונית
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    createGroup,
    updateGroup,
    deleteGroup,
    selectGroup,
    refetch: loadSettings
  };
};
