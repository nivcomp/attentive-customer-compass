
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { DynamicBoardColumn } from "@/api/dynamicBoard";

interface DynamicColumnEditorProps {
  column: DynamicBoardColumn;
  onUpdateColumn: (id: string, updates: Partial<DynamicBoardColumn>) => Promise<DynamicBoardColumn | null>;
}

const DynamicColumnEditor: React.FC<DynamicColumnEditorProps> = ({ column, onUpdateColumn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [columnType, setColumnType] = useState<'text' | 'number' | 'date' | 'single_select' | 'multi_select' | 'status'>(column.column_type);
  const [columnRequired, setColumnRequired] = useState(column.is_required);
  const [options, setOptions] = useState<string[]>(column.options?.options || []);
  const [newOption, setNewOption] = useState('');
  const [saving, setSaving] = useState(false);

  const needsOptions = columnType === 'single_select' || columnType === 'multi_select' || columnType === 'status';

  const handleSave = async () => {
    if (!columnName.trim()) return;
    
    setSaving(true);
    const optionsData = needsOptions ? { options } : {};
    
    const updated = await onUpdateColumn(column.id, {
      name: columnName,
      column_type: columnType,
      is_required: columnRequired,
      options: optionsData,
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
    setOptions(column.options?.options || []);
    setNewOption('');
    setIsOpen(false);
  };

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const getColumnTypeLabel = (type: string) => {
    const labels = {
      text: 'טקסט',
      number: 'מספר',
      date: 'תאריך',
      single_select: 'בחירה יחידה',
      multi_select: 'בחירה מרובה',
      status: 'סטטוס'
    };
    return labels[type as keyof typeof labels] || type;
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
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
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
            <Select value={columnType} onValueChange={(value: any) => setColumnType(value)}>
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
              </SelectContent>
            </Select>
          </div>
          
          {needsOptions && (
            <div className="space-y-2">
              <Label>אפשרויות</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="אפשרות חדשה"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addOption()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={!newOption.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
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

export default DynamicColumnEditor;
