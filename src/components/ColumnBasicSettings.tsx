
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColumnTypeSelector from "./ColumnTypeSelector";
import { DynamicBoardColumn } from "@/api/dynamicBoard";

interface ColumnBasicSettingsProps {
  columnName: string;
  columnType: DynamicBoardColumn['column_type'];
  columnRequired: boolean;
  onColumnNameChange: (value: string) => void;
  onColumnTypeChange: (value: DynamicBoardColumn['column_type']) => void;
  onColumnRequiredChange: (value: boolean) => void;
}

const ColumnBasicSettings: React.FC<ColumnBasicSettingsProps> = ({
  columnName,
  columnType,
  columnRequired,
  onColumnNameChange,
  onColumnTypeChange,
  onColumnRequiredChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="column-name">שם העמודה</Label>
        <Input
          id="column-name"
          value={columnName}
          onChange={(e) => onColumnNameChange(e.target.value)}
          placeholder="הכנס שם לעמודה"
          className="w-full"
        />
      </div>
      
      <ColumnTypeSelector 
        columnType={columnType}
        onColumnTypeChange={onColumnTypeChange}
      />
      
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <input
          type="checkbox"
          id="required"
          checked={columnRequired}
          onChange={(e) => onColumnRequiredChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="required" className="text-sm font-medium">
          שדה חובה
        </Label>
      </div>
    </div>
  );
};

export default ColumnBasicSettings;
