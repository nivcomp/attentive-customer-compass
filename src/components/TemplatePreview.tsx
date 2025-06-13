
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Users, Calendar, Database } from "lucide-react";
import { BoardTemplate } from "@/api/boardTemplates";

interface TemplatePreviewProps {
  template: BoardTemplate;
  isOpen: boolean;
  onClose: () => void;
  onUse: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  isOpen,
  onClose,
  onUse
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      crm: 'bg-blue-100 text-blue-800',
      sales: 'bg-green-100 text-green-800',
      support: 'bg-purple-100 text-purple-800',
      marketing: 'bg-orange-100 text-orange-800',
      project: 'bg-red-100 text-red-800',
      hr: 'bg-yellow-100 text-yellow-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      crm: 'CRM',
      sales: 'מכירות',
      support: 'תמיכה',
      marketing: 'שיווק',
      project: 'פרויקטים',
      hr: 'משאבי אנוש',
      custom: 'מותאם אישית'
    };
    return labels[category] || 'כללי';
  };

  const templateData = template.template_data;
  const boards = templateData?.boards || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold mb-2">
                {template.name}
              </DialogTitle>
              <DialogDescription className="text-base">
                {template.description || 'אין תיאור זמין'}
              </DialogDescription>
            </div>
            <Badge className={getCategoryColor(template.category)}>
              {getCategoryLabel(template.category)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{template.usage_count} שימושים</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>נוצר ב-{new Date(template.created_at).toLocaleDateString('he-IL')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>{boards.length} בורדים</span>
            </div>
          </div>

          <Separator />

          {/* Boards Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">בורדים כלולים</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boards.map((board: any, index: number) => (
                <Card key={index} className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{board.name}</CardTitle>
                    {board.description && (
                      <p className="text-sm text-gray-500">{board.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">עמודות: </span>
                        <span className="text-gray-600">
                          {board.columns?.length || 0} שדות
                        </span>
                      </div>
                      {board.sample_data && (
                        <div className="text-sm">
                          <span className="font-medium">נתונים לדוגמה: </span>
                          <span className="text-gray-600">
                            {board.sample_data.length} רשומות
                          </span>
                        </div>
                      )}
                      {board.columns && board.columns.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">שדות עיקריים:</p>
                          <div className="flex flex-wrap gap-1">
                            {board.columns.slice(0, 3).map((column: any, colIndex: number) => (
                              <Badge key={colIndex} variant="outline" className="text-xs">
                                {column.name}
                              </Badge>
                            ))}
                            {board.columns.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{board.columns.length - 3} נוספים
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {boards.length === 0 && (
              <Card className="p-6 text-center">
                <p className="text-gray-500">אין מידע על בורדים זמין</p>
              </Card>
            )}
          </div>

          {/* Relationships */}
          {templateData?.relationships && templateData.relationships.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">קשרים בין בורדים</h3>
                <div className="space-y-2">
                  {templateData.relationships.map((rel: any, index: number) => (
                    <div key={index} className="text-sm bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium">{rel.source_board}</span>
                      <span className="text-gray-500 mx-2">מקושר ל-</span>
                      <span className="font-medium">{rel.target_board}</span>
                      <span className="text-gray-500 text-xs block mt-1">
                        שדה: {rel.source_field} → {rel.target_field}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            סגור
          </Button>
          <Button onClick={onUse} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            השתמש בתבנית
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;
