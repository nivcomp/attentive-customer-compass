
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface ColumnEditorActionsProps {
  saving: boolean;
  columnName: string;
  onSave: () => void;
  onCancel: () => void;
}

const ColumnEditorActions: React.FC<ColumnEditorActionsProps> = ({
  saving,
  columnName,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={saving}
      >
        <X className="h-4 w-4 mr-1" />
        בטל
      </Button>
      <Button
        onClick={onSave}
        disabled={saving || !columnName.trim()}
      >
        <Save className="h-4 w-4 mr-1" />
        {saving ? 'שומר...' : 'שמור'}
      </Button>
    </div>
  );
};

export default ColumnEditorActions;
