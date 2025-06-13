
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
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-1">
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.type;
          
          return (
            <Button
              key={view.type}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(view.type)}
              className="flex items-center gap-2"
              title={view.description}
            >
              <Icon className="h-4 w-4" />
              {view.label}
            </Button>
          );
        })}
      </div>
      
      {itemCount !== undefined && (
        <Badge variant="secondary" className="ml-auto">
          {itemCount} פריטים
        </Badge>
      )}
    </div>
  );
};

export default ViewSelector;
