
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Save, X } from "lucide-react";
import { BoardColumn } from "@/types/board";

interface FieldEditorProps {
  column: BoardColumn;
  onUpdateColumn: (id: string, updates: Partial<BoardColumn>) => Promise<BoardColumn | null>;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ column, onUpdateColumn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [columnType, setColumnType] = useState<BoardColumn['column_type']>(column.column_type);
  const [columnRequired, setColumnRequired] = useState(column.is_required);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!columnName.trim()) return;
    
    setSaving(true);
    const updated = await onUpdateColumn(column.id, {
      name: columnName,
      column_type: columnType,
      is_required: columnRequired,
    });
    
    if (updated) {
      setIsOpen(false);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setColumnName(column.name);
    setColumnType(column.column_type);
    setColumnRequired(column.is_required);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          title="התאם עמודה"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>התאמת עמודה</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="column-name">שם העמודה</Label>
            <Input
              id="column-name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="הכנס שם לעמודה"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="column-type">סוג השדה</Label>
            <Select value={columnType} onValueChange={(value: BoardColumn['column_type']) => setColumnType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">טקסט</SelectItem>
                <SelectItem value="number">מספר</SelectItem>
                <SelectItem value="date">תאריך</SelectItem>
                <SelectItem value="select">רשימה</SelectItem>
                <SelectItem value="status">סטטוס</SelectItem>
                <SelectItem value="single_select">בחירה יחידה</SelectItem>
                <SelectItem value="multi_select">בחירה מרובה</SelectItem>
                <SelectItem value="file">קובץ</SelectItem>
                <SelectItem value="image">תמונה</SelectItem>
                <SelectItem value="board_link">קישור לבורד</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="required"
              checked={columnRequired}
              onChange={(e) => setColumnRequired(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="required" className="text-sm font-medium">
              שדה חובה
            </Label>
          </div>
          
          <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-1" />
              בטל
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !columnName.trim()}
            >
              <Save className="h-4 w-4 mr-1" />
              {saving ? 'שומר...' : 'שמור'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldEditor;
