
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, X, Edit, Trash2 } from "lucide-react";
import { DynamicBoardItem } from "@/api/dynamicBoard";

interface TableActionsProps {
  item: DynamicBoardItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  item,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  return (
    <div className="flex gap-1">
      {isEditing ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            title="שמור"
          >
            <Save className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            title="בטל"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            title="ערוך"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            title="מחק"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </>
      )}
    </div>
  );
};

export default TableActions;
