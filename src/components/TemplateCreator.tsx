
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, X, Database, Copy } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";
import { useBoardTemplates } from "@/hooks/useBoardTemplates";

interface TemplateCreatorProps {
  onClose: () => void;
}

const TemplateCreator: React.FC<TemplateCreatorProps> = ({ onClose }) => {
  const { boards } = useDynamicBoards();
  const { createTemplate } = useBoardTemplates();
  
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('custom');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [includeSampleData, setIncludeSampleData] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const categories = [
    { value: 'crm', label: 'CRM' },
    { value: 'sales', label: 'מכירות' },
    { value: 'support', label: 'תמיכה' },
    { value: 'marketing', label: 'שיווק' },
    { value: 'project', label: 'פרויקטים' },
    { value: 'hr', label: 'משאבי אנוש' },
    { value: 'custom', label: 'מותאם אישית' }
  ];

  const handleBoardToggle = (boardId: string) => {
    setSelectedBoards(prev => 
      prev.includes(boardId) 
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
  };

  const handleCreateTemplate = async () => {
    if (!templateName.trim() || selectedBoards.length === 0) {
      return;
    }

    setIsCreating(true);
    try {
      // Here we would collect the actual board data, columns, and relationships
      // For now, we'll create a basic structure
      const templateData = {
        boards: selectedBoards.map(boardId => {
          const board = boards.find(b => b.id === boardId);
          return {
            name: board?.name || '',
            description: board?.description || '',
            columns: [], // This would be populated with actual column data
            sample_data: includeSampleData ? [] : undefined // This would be populated with actual items
          };
        }),
        relationships: [] // This would be populated with actual relationships
      };

      await createTemplate({
        name: templateName,
        description: templateDescription,
        category: templateCategory,
        is_public: isPublic,
        template_data: templateData,
        created_by: null // This would be set to the current user ID when auth is implemented
      });

      onClose();
    } catch (error) {
      console.error('Error creating template:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            יצירת תבנית חדשה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template-name">שם התבנית</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="הכנס שם לתבנית"
              />
            </div>
            <div>
              <Label htmlFor="template-category">קטגוריה</Label>
              <Select value={templateCategory} onValueChange={setTemplateCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="template-description">תיאור התבנית</Label>
            <Textarea
              id="template-description"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="תאר את התבנית ואת השימושים שלה"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="include-data"
                checked={includeSampleData}
                onCheckedChange={setIncludeSampleData}
              />
              <Label htmlFor="include-data">כלול נתונים לדוגמה</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="is-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="is-public">תבנית פומבית</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>בחר בורדים לכלול בתבנית</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {boards.map((board) => (
              <div key={board.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Checkbox
                    id={`board-${board.id}`}
                    checked={selectedBoards.includes(board.id)}
                    onCheckedChange={() => handleBoardToggle(board.id)}
                  />
                  <div>
                    <Label htmlFor={`board-${board.id}`} className="font-medium">
                      {board.name}
                    </Label>
                    {board.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {board.description}
                      </p>
                    )}
                  </div>
                </div>
                {selectedBoards.includes(board.id) && (
                  <Badge className="bg-blue-100 text-blue-800">
                    נבחר
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {boards.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Copy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>אין בורדים זמינים ליצירת תבנית</p>
              <p className="text-sm mt-1">צור בורד ראשון כדי ליצור תבניות</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          ביטול
        </Button>
        <Button 
          onClick={handleCreateTemplate}
          disabled={!templateName.trim() || selectedBoards.length === 0 || isCreating}
        >
          <Save className="h-4 w-4 mr-2" />
          {isCreating ? 'יוצר...' : 'צור תבנית'}
        </Button>
      </div>
    </div>
  );
};

export default TemplateCreator;
