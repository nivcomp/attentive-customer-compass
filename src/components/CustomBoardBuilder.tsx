
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Eye, Save, Palette } from "lucide-react";
import { DynamicBoardColumn } from "@/api/dynamicBoard";
import ColumnTypeSelector from "./ColumnTypeSelector";

interface BoardColumn {
  id: string;
  name: string;
  column_type: DynamicBoardColumn['column_type'];
  is_required: boolean;
  options?: string[];
}

interface CustomBoardBuilderProps {
  onCreateBoard: (boardData: any) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BOARD_TEMPLATES = [
  {
    id: 'project-tasks',
    name: 'משימות פרויקט',
    description: 'בורד לניהול משימות וסטטוסים',
    columns: [
      { name: 'שם המשימה', column_type: 'text', is_required: true },
      { name: 'סטטוס', column_type: 'status', is_required: true, options: ['חדש', 'בתהליך', 'הושלם'] },
      { name: 'אחראי', column_type: 'single_select', is_required: false, options: ['יוסי', 'שירה', 'דני'] }
    ],
    color: '#3B82F6'
  },
  {
    id: 'sales-tracking',
    name: 'מעקב מכירות',
    description: 'בורד למעקב אחר הזדמנויות מכירה',
    columns: [
      { name: 'שם הלקוח', column_type: 'text', is_required: true },
      { name: 'סכום עסקה', column_type: 'number', is_required: true },
      { name: 'שלב', column_type: 'status', is_required: true, options: ['ליד', 'הצעה', 'משא ומתן', 'נסגר'] }
    ],
    color: '#10B981'
  },
  {
    id: 'inventory',
    name: 'ניהול מלאי',
    description: 'בורד למעקב אחר מלאי ומוצרים',
    columns: [
      { name: 'שם המוצר', column_type: 'text', is_required: true },
      { name: 'כמות במלאי', column_type: 'number', is_required: true },
      { name: 'תאריך עדכון', column_type: 'date', is_required: false }
    ],
    color: '#F59E0B'
  },
  {
    id: 'custom',
    name: 'בורד ריק',
    description: 'בורד מותאם לחלוטין',
    columns: [
      { name: 'עמודה 1', column_type: 'text', is_required: false },
      { name: 'עמודה 2', column_type: 'text', is_required: false },
      { name: 'עמודה 3', column_type: 'text', is_required: false }
    ],
    color: '#6B7280'
  }
];

const CustomBoardBuilder: React.FC<CustomBoardBuilderProps> = ({
  onCreateBoard,
  isOpen,
  onOpenChange,
}) => {
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [boardColor, setBoardColor] = useState('#3B82F6');
  const [columns, setColumns] = useState<BoardColumn[]>([
    { id: '1', name: 'עמודה 1', column_type: 'text', is_required: false },
    { id: '2', name: 'עמודה 2', column_type: 'text', is_required: false },
    { id: '3', name: 'עמודה 3', column_type: 'text', is_required: false }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleAddColumn = () => {
    const newColumn: BoardColumn = {
      id: Date.now().toString(),
      name: `עמודה ${columns.length + 1}`,
      column_type: 'text',
      is_required: false
    };
    setColumns([...columns, newColumn]);
  };

  const handleRemoveColumn = (columnId: string) => {
    if (columns.length > 1) {
      setColumns(columns.filter(col => col.id !== columnId));
    }
  };

  const handleColumnChange = (columnId: string, field: keyof BoardColumn, value: any) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, [field]: value } : col
    ));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = BOARD_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setBoardName(template.name);
      setBoardDescription(template.description);
      setBoardColor(template.color);
      setColumns(template.columns.map((col, index) => ({
        id: (index + 1).toString(),
        ...col
      })));
      setSelectedTemplate(templateId);
    }
  };

  const handleCreateBoard = () => {
    const boardData = {
      name: boardName,
      description: boardDescription,
      color: boardColor,
      columns: columns.map((col, index) => ({
        ...col,
        column_order: index
      }))
    };
    
    onCreateBoard(boardData);
    
    // Reset form
    setBoardName('');
    setBoardDescription('');
    setBoardColor('#3B82F6');
    setColumns([
      { id: '1', name: 'עמודה 1', column_type: 'text', is_required: false },
      { id: '2', name: 'עמודה 2', column_type: 'text', is_required: false },
      { id: '3', name: 'עמודה 3', column_type: 'text', is_required: false }
    ]);
    setSelectedTemplate(null);
    onOpenChange(false);
  };

  const getColumnTypeLabel = (type: string) => {
    const labels = {
      text: 'טקסט',
      number: 'מספר',
      date: 'תאריך',
      single_select: 'בחירה יחידה',
      multi_select: 'בחירה מרובה',
      status: 'סטטוס',
      file: 'קובץ',
      image: 'תמונה',
      board_link: 'קישור לבורד'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">יצירת בורד מותאם</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Board Templates */}
          <div>
            <Label className="text-base font-semibold">בחר תבנית בורד</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {BOARD_TEMPLATES.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: template.color }}
                      />
                      <div>
                        <h4 className="font-semibold text-sm">{template.name}</h4>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Board Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="boardName">שם הבורד</Label>
              <Input
                id="boardName"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="הכנס שם לבורד"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="boardColor">צבע הבורד</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="boardColor"
                  value={boardColor}
                  onChange={(e) => setBoardColor(e.target.value)}
                  className="w-10 h-10 border-2 border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={boardColor}
                  onChange={(e) => setBoardColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="boardDescription">תיאור הבורד</Label>
            <Input
              id="boardDescription"
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              placeholder="תיאור קצר של הבורד (אופציונלי)"
            />
          </div>

          {/* Columns Configuration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">הגדרת עמודות</Label>
              <Button onClick={handleAddColumn} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                הוסף עמודה
              </Button>
            </div>
            
            <div className="space-y-3">
              {columns.map((column, index) => (
                <Card key={column.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>שם העמודה</Label>
                      <Input
                        value={column.name}
                        onChange={(e) => handleColumnChange(column.id, 'name', e.target.value)}
                        placeholder="שם העמודה"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <ColumnTypeSelector
                        columnType={column.column_type}
                        onColumnTypeChange={(type) => handleColumnChange(column.id, 'column_type', type)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        id={`required-${column.id}`}
                        checked={column.is_required}
                        onChange={(e) => handleColumnChange(column.id, 'is_required', e.target.checked)}
                      />
                      <Label htmlFor={`required-${column.id}`} className="text-sm">
                        שדה חובה
                      </Label>
                    </div>
                    
                    <div className="flex gap-2">
                      {columns.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveColumn(column.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4" />
                <Label className="font-semibold">תצוגה מקדימה</Label>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: boardColor }}
                  />
                  <h3 className="font-bold">{boardName || 'שם הבורד'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {columns.map((column) => (
                    <div key={column.id} className="border rounded p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{column.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {getColumnTypeLabel(column.column_type)}
                        </Badge>
                        {column.is_required && (
                          <Badge variant="destructive" className="text-xs">חובה</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'הסתר תצוגה מקדימה' : 'הצג תצוגה מקדימה'}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                ביטול
              </Button>
              <Button 
                onClick={handleCreateBoard}
                disabled={!boardName.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                צור בורד
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBoardBuilder;
