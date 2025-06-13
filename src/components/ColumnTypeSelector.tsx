
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DynamicBoardColumn } from "@/api/dynamicBoard";

interface ColumnTypeSelectorProps {
  columnType: DynamicBoardColumn['column_type'];
  onColumnTypeChange: (value: DynamicBoardColumn['column_type']) => void;
}

const ColumnTypeSelector: React.FC<ColumnTypeSelectorProps> = ({ 
  columnType, 
  onColumnTypeChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="column-type">סוג השדה</Label>
      <Select value={columnType} onValueChange={onColumnTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">טקסט</SelectItem>
          <SelectItem value="number">מספר</SelectItem>
          <SelectItem value="date">תאריך</SelectItem>
          <SelectItem value="single_select">בחירה יחידה</SelectItem>
          <SelectItem value="multi_select">בחירה מרובה</SelectItem>
          <SelectItem value="status">סטטוס</SelectItem>
          <SelectItem value="file">קובץ</SelectItem>
          <SelectItem value="image">תמונה</SelectItem>
          <SelectItem value="board_link">קישור לבורד</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ColumnTypeSelector;
