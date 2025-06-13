
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, X } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";

interface BoardCreatorProps {
  onClose: () => void;
  onBoardCreated?: (boardId: string) => void;
}

interface FieldConfig {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'single_select' | 'multi_select' | 'status';
  isRequired: boolean;
  options?: string[];
}

const BoardCreator: React.FC<BoardCreatorProps> = ({ onClose, onBoardCreated }) => {
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [boardType, setBoardType] = useState<string>('');
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const { createBoard } = useDynamicBoards();
  const { createColumn } = useDynamicBoardColumns(null);

  const boardTypes = [
    { value: 'companies', label: 'חברות' },
    { value: 'contacts', label: 'אנשי קשר' },
    { value: 'deals', label: 'עסקאות' },
    { value: 'leads', label: 'לידים' }
  ];

  const fieldTypes = [
    { value: 'text', label: 'טקסט' },
    { value: 'number', label: 'מספר' },
    { value: 'date', label: 'תאריך' },
    { value: 'single_select', label: 'בחירה יחידה' },
    { value: 'multi_select', label: 'בחירה מרובה' },
    { value: 'status', label: 'סטטוס' }
  ];

  const getDefaultFields = (type: string): FieldConfig[] => {
    switch (type) {
      case 'companies':
        return [
          { id: '1', name: 'שם החברה', type: 'text', isRequired: true },
          { id: '2', name: 'טלפון', type: 'text', isRequired: false },
          { id: '3', name: 'אימייל', type: 'text', isRequired: false },
          { id: '4', name: 'אתר', type: 'text', isRequired: false }
        ];
      case 'contacts':
        return [
          { id: '1', name: 'שם מלא', type: 'text', isRequired: true },
          { id: '2', name: 'טלפון', type: 'text', isRequired: false },
          { id: '3', name: 'אימייל', type: 'text', isRequired: true },
          { id: '4', name: 'תפקיד', type: 'text', isRequired: false }
        ];
      case 'deals':
        return [
          { id: '1', name: 'שם העסקה', type: 'text', isRequired: true },
          { id: '2', name: 'סכום', type: 'number', isRequired: true },
          { id: '3', name: 'סטטוס', type: 'status', isRequired: true, options: ['מוקדם', 'הצעה', 'משא ומתן', 'נסגר'] },
          { id: '4', name: 'תאריך סגירה צפוי', type: 'date', isRequired: false }
        ];
      case 'leads':
        return [
          { id: '1', name: 'שם הליד', type: 'text', isRequired: true },
          { id: '2', name: 'מקור', type: 'single_select', isRequired: false, options: ['אתר', 'מדיה חברתית', 'הפניה', 'פרסום'] },
          { id: '3', name: 'עניין', type: 'text', isRequired: false },
          { id: '4', name: 'איכות', type: 'status', isRequired: false, options: ['חם', 'חמים', 'קר'] }
        ];
      default:
        return [];
    }
  };

  const handleBoardTypeChange = (value: string) => {
    setBoardType(value);
    setFields(getDefaultFields(value));
  };

  const addField = () => {
    const newField: FieldConfig = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      isRequired: false
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateFieldOptions = (id: string, optionsText: string) => {
    const options = optionsText.split(',').map(opt => opt.trim()).filter(opt => opt);
    updateField(id, { options });
  };

  const saveBoardSettings = (boardId: string, boardData: any) => {
    const settings = {
      id: boardId,
      name: boardData.name,
      description: boardData.description,
      type: boardType,
      fields: fields,
      createdAt: new Date().toISOString()
    };
    
    const existingBoards = JSON.parse(localStorage.getItem('customBoards') || '[]');
    existingBoards.push(settings);
    localStorage.setItem('customBoards', JSON.stringify(existingBoards));
  };

  const handleSave = async () => {
    if (!boardName.trim()) {
      alert('יש להזין שם לבורד');
      return;
    }

    if (fields.length === 0) {
      alert('יש להוסיף לפחות שדה אחד');
      return;
    }

    // בדיקה שכל השדות החובה מוגדרים
    const invalidFields = fields.filter(field => !field.name.trim());
    if (invalidFields.length > 0) {
      alert('יש למלא שמות לכל השדות');
      return;
    }

    setIsCreating(true);
    try {
      // יצירת הבורד
      const newBoard = await createBoard({
        name: boardName,
        description: boardDescription || `בורד ${boardTypes.find(t => t.value === boardType)?.label || boardType}`
      });

      if (newBoard) {
        // שמירת הגדרות הבורד ב-localStorage
        saveBoardSettings(newBoard.id, newBoard);

        // יצירת עמודות לבורד
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          await createColumn({
            board_id: newBoard.id,
            name: field.name,
            column_type: field.type,
            column_order: i,
            is_required: field.isRequired,
            options: field.options ? { options: field.options } : null
          });
        }

        if (onBoardCreated) {
          onBoardCreated(newBoard.id);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error creating board:', error);
      alert('שגיאה ביצירת הבורד');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-semibold">יצירת בורד חדש</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* פרטי הבורד */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="boardName">שם הבורד *</Label>
              <Input
                id="boardName"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="הזן שם לבורד"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="boardDescription">תיאור הבורד</Label>
              <Input
                id="boardDescription"
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
                placeholder="תיאור קצר של הבורד (רשות)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="boardType">סוג הבורד</Label>
              <Select value={boardType} onValueChange={handleBoardTypeChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="בחר סוג בורד" />
                </SelectTrigger>
                <SelectContent>
                  {boardTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* שדות הבורד */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">שדות הבורד</h3>
              <Button onClick={addField} size="sm">
                <Plus className="h-4 w-4 ml-2" />
                הוסף שדה
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>שם השדה</Label>
                      <Input
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        placeholder="שם השדה"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>סוג השדה</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value: any) => updateField(field.id, { type: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id={`required-${field.id}`}
                        checked={field.isRequired}
                        onCheckedChange={(checked) => updateField(field.id, { isRequired: !!checked })}
                      />
                      <Label htmlFor={`required-${field.id}`} className="text-sm">
                        שדה חובה
                      </Label>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {(field.type === 'single_select' || field.type === 'multi_select' || field.type === 'status') && (
                    <div className="mt-4">
                      <Label>אפשרויות (מופרדות בפסיק)</Label>
                      <Input
                        value={field.options?.join(', ') || ''}
                        onChange={(e) => updateFieldOptions(field.id, e.target.value)}
                        placeholder="אפשרות 1, אפשרות 2, אפשרות 3"
                        className="mt-1"
                      />
                      {field.options && field.options.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.options.map((option, i) => (
                            <Badge key={i} variant="outline">{option}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button onClick={handleSave} disabled={isCreating}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  יוצר...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  צור בורד
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardCreator;
