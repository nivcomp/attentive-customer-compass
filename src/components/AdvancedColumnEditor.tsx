
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Plus, Trash2, Link, Settings } from "lucide-react";
import { DynamicBoardColumn } from "@/api/dynamicBoard";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";

interface AdvancedColumnEditorProps {
  column: DynamicBoardColumn;
  onUpdateColumn: (id: string, updates: Partial<DynamicBoardColumn>) => Promise<DynamicBoardColumn | null>;
}

const AdvancedColumnEditor: React.FC<AdvancedColumnEditorProps> = ({ column, onUpdateColumn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [columnType, setColumnType] = useState<DynamicBoardColumn['column_type']>(column.column_type);
  const [columnRequired, setColumnRequired] = useState(column.is_required);
  const [options, setOptions] = useState<string[]>(column.options?.options || []);
  const [newOption, setNewOption] = useState('');
  const [linkedBoardId, setLinkedBoardId] = useState(column.linked_board_id || '');
  const [validationRules, setValidationRules] = useState(column.validation_rules || {});
  const [displaySettings, setDisplaySettings] = useState(column.display_settings || {});
  const [saving, setSaving] = useState(false);

  const { boards } = useDynamicBoards();

  const needsOptions = ['single_select', 'multi_select', 'status'].includes(columnType);
  const needsBoardLink = columnType === 'board_link';
  const supportsValidation = ['text', 'number', 'date'].includes(columnType);

  const handleSave = async () => {
    if (!columnName.trim()) return;
    
    setSaving(true);
    
    const updates = {
      name: columnName,
      column_type: columnType,
      is_required: columnRequired,
      options: needsOptions ? { options } : {},
      linked_board_id: needsBoardLink ? linkedBoardId || null : null,
      validation_rules: supportsValidation ? validationRules : {},
      display_settings: displaySettings,
    };
    
    const updated = await onUpdateColumn(column.id, updates);
    
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
    setLinkedBoardId(column.linked_board_id || '');
    setValidationRules(column.validation_rules || {});
    setDisplaySettings(column.display_settings || {});
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
      status: 'סטטוס',
      file: 'קובץ',
      image: 'תמונה',
      board_link: 'קישור לבורד'
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
          title="התאם עמודה מתקדמת"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            התאמת עמודה מתקדמת
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">בסיסי</TabsTrigger>
            <TabsTrigger value="options">אפשרויות</TabsTrigger>
            <TabsTrigger value="validation">תיקוף</TabsTrigger>
            <TabsTrigger value="display">תצוגה</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="column-name">שם העמודה</Label>
                <Input
                  id="column-name"
                  value={columnName}
                  onChange={(e) => setColumnName(e.target.value)}
                  placeholder="הכנס שם לעמודה"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="column-type">סוג השדה</Label>
                <Select value={columnType} onValueChange={(value: any) => setColumnType(value)}>
                  <SelectTrigger>
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
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="space-y-4">
            {needsOptions && (
              <div className="space-y-4">
                <Label>אפשרויות בחירה</Label>
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
            
            {needsBoardLink && (
              <div className="space-y-4">
                <Label>בורד מקושר</Label>
                <Select value={linkedBoardId} onValueChange={setLinkedBoardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר בורד לקישור" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.filter(b => b.id !== column.board_id).map(board => (
                      <SelectItem key={board.id} value={board.id}>
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          {board.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {!needsOptions && !needsBoardLink && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">
                    סוג השדה הנבחר אינו דורש הגדרת אפשרויות
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-4">
            {supportsValidation && (
              <div className="space-y-4">
                <Label>כללי תיקוף</Label>
                
                {columnType === 'text' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>אורך מינימום</Label>
                        <Input
                          type="number"
                          value={validationRules.minLength || ''}
                          onChange={(e) => setValidationRules({
                            ...validationRules,
                            minLength: Number(e.target.value) || undefined
                          })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>אורך מקסימום</Label>
                        <Input
                          type="number"
                          value={validationRules.maxLength || ''}
                          onChange={(e) => setValidationRules({
                            ...validationRules,
                            maxLength: Number(e.target.value) || undefined
                          })}
                          placeholder="ללא הגבלה"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>דפוס (Regex)</Label>
                      <Input
                        value={validationRules.pattern || ''}
                        onChange={(e) => setValidationRules({
                          ...validationRules,
                          pattern: e.target.value || undefined
                        })}
                        placeholder="^[a-zA-Z0-9]+$"
                      />
                    </div>
                  </>
                )}
                
                {columnType === 'number' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ערך מינימום</Label>
                      <Input
                        type="number"
                        value={validationRules.min || ''}
                        onChange={(e) => setValidationRules({
                          ...validationRules,
                          min: Number(e.target.value) || undefined
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ערך מקסימום</Label>
                      <Input
                        type="number"
                        value={validationRules.max || ''}
                        onChange={(e) => setValidationRules({
                          ...validationRules,
                          max: Number(e.target.value) || undefined
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!supportsValidation && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">
                    סוג השדה הנבחר אינו תומך בכללי תיקוף מתקדמים
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="display" className="space-y-4">
            <div className="space-y-4">
              <Label>הגדרות תצוגה</Label>
              
              <div className="space-y-2">
                <Label>רוחב עמודה</Label>
                <Select 
                  value={displaySettings.width || 'auto'} 
                  onValueChange={(value) => setDisplaySettings({
                    ...displaySettings,
                    width: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">אוטומטי</SelectItem>
                    <SelectItem value="small">קטן (100px)</SelectItem>
                    <SelectItem value="medium">בינוני (200px)</SelectItem>
                    <SelectItem value="large">גדול (300px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={displaySettings.pinned || false}
                  onChange={(e) => setDisplaySettings({
                    ...displaySettings,
                    pinned: e.target.checked
                  })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="pinned" className="text-sm font-medium">
                  נעץ עמודה
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="sortable"
                  checked={displaySettings.sortable !== false}
                  onChange={(e) => setDisplaySettings({
                    ...displaySettings,
                    sortable: e.target.checked
                  })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="sortable" className="text-sm font-medium">
                  ניתן למיון
                </Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t">
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
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedColumnEditor;
