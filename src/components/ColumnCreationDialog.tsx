
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface ColumnCreationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  columnName: string;
  setColumnName: (name: string) => void;
  columnType: 'text' | 'number' | 'date' | 'select' | 'status';
  setColumnType: (type: 'text' | 'number' | 'date' | 'select' | 'status') => void;
  columnRequired: boolean;
  setColumnRequired: (required: boolean) => void;
  onCreateColumn: () => void;
  disabled?: boolean;
}

const ColumnCreationDialog: React.FC<ColumnCreationDialogProps> = ({
  isOpen,
  onOpenChange,
  columnName,
  setColumnName,
  columnType,
  setColumnType,
  columnRequired,
  setColumnRequired,
  onCreateColumn,
  disabled = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          עמודה חדשה
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>הוספת עמודה חדשה</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="column-name">שם העמודה</Label>
            <Input
              id="column-name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="הכנס שם לעמודה"
            />
          </div>
          <div>
            <Label htmlFor="column-type">סוג העמודה</Label>
            <Select value={columnType} onValueChange={(value: any) => setColumnType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">טקסט</SelectItem>
                <SelectItem value="number">מספר</SelectItem>
                <SelectItem value="date">תאריך</SelectItem>
                <SelectItem value="select">רשימה</SelectItem>
                <SelectItem value="status">סטטוס</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="required"
              checked={columnRequired}
              onChange={(e) => setColumnRequired(e.target.checked)}
            />
            <Label htmlFor="required">שדה חובה</Label>
          </div>
          <Button onClick={onCreateColumn} className="w-full">
            הוסף עמודה
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnCreationDialog;
