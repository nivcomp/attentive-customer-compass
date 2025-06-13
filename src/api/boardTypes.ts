
export type BoardType = 'tasks' | 'customers' | 'projects' | 'custom';

export interface SystemTemplate {
  id: string;
  name: string;
  board_type: BoardType;
  description?: string;
  template_columns: any[];
  is_system_template: boolean;
  created_at: string;
}

export const BOARD_TYPES: Record<BoardType, { label: string; description: string; icon: string }> = {
  tasks: {
    label: 'משימות',
    description: 'ניהול משימות וטודו ליסטים',
    icon: '✓'
  },
  customers: {
    label: 'לקוחות',
    description: 'ניהול לקוחות וקשרי לקוחות',
    icon: '👥'
  },
  projects: {
    label: 'פרויקטים', 
    description: 'ניהול פרויקטים ותכנון',
    icon: '📋'
  },
  custom: {
    label: 'מותאם אישית',
    description: 'בונה לוח מותאם לצרכים שלך',
    icon: '🔧'
  }
};

export const getSmartSuggestions = (boardType: BoardType) => {
  const suggestions: Record<BoardType, string[]> = {
    tasks: ['יצירת בורד פרויקטים קשור', 'הוספת עמודת אחראי', 'קישור לקלנדר'],
    customers: ['יצירת בורד עסקאות קשור', 'הוספת היסטוריית פעילות', 'אינטגרציה עם CRM'],
    projects: ['יצירת בורד משימות קשור', 'הוספת ניהול זמנים', 'מעקב אחר תקציב'],
    custom: ['שמירה כתבנית', 'הוספת אוטומציות', 'יצירת תצוגות מותאמות']
  };
  
  return suggestions[boardType] || [];
};
