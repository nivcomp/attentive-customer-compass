
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Grid3X3, Kanban, List } from "lucide-react";

export type ViewType = 'table' | 'cards' | 'kanban' | 'list';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  itemCount?: number;
}

const ViewSelector = ({ currentView, onViewChange, itemCount }: ViewSelectorProps) => {
  const views = [
    {
      type: 'table' as ViewType,
      label: 'טבלה',
      icon: Table,
      description: 'תצוגת טבלה מסורתית'
    },
    {
      type: 'cards' as ViewType,
      label: 'כרטיסים',
      icon: Grid3X3,
      description: 'תצוגת כרטיסי מידע'
    },
    {
      type: 'kanban' as ViewType,
      label: 'קנבן',
      icon: Kanban,
      description: 'לוח קנבן לפי סטטוס'
    },
    {
      type: 'list' as ViewType,
      label: 'רשימה',
      icon: List,
      description: 'רשימה פשוטה'
    }
  ];

  return (
    <div className="flex items-center gap-3 p-1 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-1">
        {views.map((view, index) => {
          const Icon = view.icon;
          const isActive = currentView === view.type;
          
          return (
            <Button
              key={view.type}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(view.type)}
              className={`
                flex items-center gap-2 transition-all duration-200 h-8
                ${isActive 
                  ? 'bg-white shadow-soft text-gray-900 hover:bg-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              title={view.description}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs font-medium">
                {view.label}
              </span>
            </Button>
          );
        })}
      </div>
      
      {itemCount !== undefined && (
        <Badge 
          variant="secondary" 
          className="ml-2 bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium"
        >
          {itemCount.toLocaleString('he-IL')} פריטים
        </Badge>
      )}
    </div>
  );
};

export default ViewSelector;
