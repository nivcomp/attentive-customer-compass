
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DynamicBoardColumn } from "@/api/dynamicBoard";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";
import { useToast } from "@/hooks/use-toast";

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  columns: DynamicBoardColumn[];
  onRecordAdded: () => void;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  boardId,
  columns,
  onRecordAdded
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { createItem } = useDynamicBoardItems(boardId);
  const { toast } = useToast();

  const handleFieldChange = (columnName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [columnName]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // בדיקת שדות חובה
      const missingFields = columns
        .filter(col => col.is_required && !formData[col.name])
        .map(col => col.name);

      if (missingFields.length > 0) {
        toast({
          title: "שגיאה",
          description: `השדות הבאים הם חובה: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      // יצירת הרשומה החדשה
      const newItem = await createItem({
        board_id: boardId,
        data: formData,
        item_order: 0
      });

      if (newItem) {
        toast({
          title: "הצלחה!",
          description: "הרשומה נוספה בהצלחה",
        });
        
        // איפוס הטופס
        setFormData({});
        
        // סגירת המודל
        onClose();
        
        // רענון הטבלה
        onRecordAdded();
      }
    } catch (error) {
      console.error('Error creating record:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בהוספת הרשומה",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (column: DynamicBoardColumn) => {
    const value = formData[column.name] || '';

    switch (column.column_type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(column.name, e.target.value)}
            placeholder={`הכנס ${column.name}`}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(column.name, parseFloat(e.target.value) || 0)}
            placeholder={`הכנס ${column.name}`}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(column.name, e.target.value)}
          />
        );

      case 'single_select':
        const options = column.options?.options || [];
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(column.name, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`בחר ${column.name}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'status':
        const statusOptions = column.options?.statusOptions || ['חדש', 'בעבודה', 'הושלם'];
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(column.name, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`בחר ${column.name}`} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status: string, index: number) => (
                <SelectItem key={index} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(column.name, e.target.value)}
            placeholder={`הכנס ${column.name}`}
            rows={3}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>הוסף רשומה חדשה</DialogTitle>
          <DialogDescription>
            מלא את השדות הבאים כדי להוסיף רשומה חדשה לבורד
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {columns.map(column => (
            <div key={column.id} className="space-y-2">
              <Label htmlFor={column.name} className="flex items-center gap-1">
                {column.name}
                {column.is_required && <span className="text-red-500">*</span>}
              </Label>
              {renderField(column)}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            בטל
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'שומר...' : 'שמור'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordModal;
