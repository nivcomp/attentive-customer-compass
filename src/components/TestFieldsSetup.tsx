
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TestTube, Check } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";
import { useToast } from "@/hooks/use-toast";

interface TestFieldsSetupProps {
  boardId: string;
}

const TestFieldsSetup: React.FC<TestFieldsSetupProps> = ({ boardId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdFields, setCreatedFields] = useState<string[]>([]);
  const { toast } = useToast();
  const { createColumn } = useDynamicBoardColumns(boardId);

  const testFields = [
    {
      name: 'שדה טקסט',
      type: 'text' as const,
      description: 'שדה טקסט פשוט עם תיקוף'
    },
    {
      name: 'שדה מספר',
      type: 'number' as const,
      description: 'שדה מספרי עם הגבלות'
    },
    {
      name: 'תאריך',
      type: 'date' as const,
      description: 'בוחר תאריך'
    },
    {
      name: 'בחירה יחידה',
      type: 'single_select' as const,
      description: 'בחירה מתוך רשימה',
      options: ['אפשרות 1', 'אפשרות 2', 'אפשרות 3']
    },
    {
      name: 'בחירה מרובה',
      type: 'multi_select' as const,
      description: 'בחירה מרובה מתוך רשימה',
      options: ['תווית 1', 'תווית 2', 'תווית 3', 'תווית 4']
    },
    {
      name: 'סטטוס',
      type: 'status' as const,
      description: 'שדה סטטוס',
      options: ['חדש', 'בטיפול', 'הושלם', 'בוטל']
    },
    {
      name: 'קובץ',
      type: 'file' as const,
      description: 'העלאת קבצים'
    },
    {
      name: 'תמונה',
      type: 'image' as const,
      description: 'העלאת תמונות'
    }
  ];

  const handleCreateTestFields = async () => {
    setIsCreating(true);
    const newCreatedFields: string[] = [];

    try {
      for (let i = 0; i < testFields.length; i++) {
        const field = testFields[i];
        
        const columnData = {
          board_id: boardId,
          name: field.name,
          column_type: field.type,
          column_order: i + 1,
          is_required: false,
          options: field.options ? { options: field.options } : {},
          validation_rules: field.type === 'text' ? { 
            minLength: 2, 
            maxLength: 100 
          } : field.type === 'number' ? { 
            min: 0, 
            max: 1000 
          } : {},
          display_settings: {
            width: 'medium',
            sortable: true,
            pinned: false
          }
        };

        const newColumn = await createColumn(columnData);
        if (newColumn) {
          newCreatedFields.push(field.name);
          setCreatedFields([...newCreatedFields]);
        }
      }

      toast({
        title: "הצלחה!",
        description: `נוצרו ${newCreatedFields.length} שדות בדיקה`,
      });
    } catch (error) {
      console.error('Error creating test fields:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה ביצירת שדות הבדיקה",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          יצירת שדות בדיקה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          ליצור שדה אחד מכל סוג לבדיקת הפונקציונליות המתקדמת?
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {testFields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              {createdFields.includes(field.name) ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium">{field.name}</div>
                <Badge variant="outline" className="text-xs">
                  {field.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleCreateTestFields}
          disabled={isCreating || createdFields.length > 0}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              יוצר שדות בדיקה...
            </>
          ) : createdFields.length > 0 ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              נוצרו {createdFields.length} שדות בדיקה
            </>
          ) : (
            <>
              <TestTube className="h-4 w-4 mr-2" />
              צור שדות בדיקה
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestFieldsSetup;
