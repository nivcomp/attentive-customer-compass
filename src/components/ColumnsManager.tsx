
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2 } from "lucide-react";
import { BoardColumn } from "@/types/board";
import FieldEditor from "./FieldEditor";
import ColumnCreationDialog from "./ColumnCreationDialog";

interface ColumnsManagerProps {
  selectedBoardId: string | null;
  columns: BoardColumn[];
  showCreateColumn: boolean;
  setShowCreateColumn: (show: boolean) => void;
  columnName: string;
  setColumnName: (name: string) => void;
  columnType: 'text' | 'number' | 'date' | 'select' | 'status';
  setColumnType: (type: 'text' | 'number' | 'date' | 'select' | 'status') => void;
  columnRequired: boolean;
  setColumnRequired: (required: boolean) => void;
  onCreateColumn: () => void;
  onUpdateColumn: (id: string, updates: Partial<BoardColumn>) => void;
  onDeleteColumn: (id: string) => void;
}

const ColumnsManager: React.FC<ColumnsManagerProps> = ({
  selectedBoardId,
  columns,
  showCreateColumn,
  setShowCreateColumn,
  columnName,
  setColumnName,
  columnType,
  setColumnType,
  columnRequired,
  setColumnRequired,
  onCreateColumn,
  onUpdateColumn,
  onDeleteColumn,
}) => {
  const getColumnTypeLabel = (type: string) => {
    const labels = {
      text: 'טקסט',
      number: 'מספר',
      date: 'תאריך',
      select: 'רשימה',
      status: 'סטטוס'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getColumnTypeColor = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      number: 'bg-green-100 text-green-800',
      date: 'bg-purple-100 text-purple-800',
      select: 'bg-orange-100 text-orange-800',
      status: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {selectedBoardId ? 'עמודות הלוח' : 'בחר לוח לעריכה'}
          </CardTitle>
          {selectedBoardId && (
            <ColumnCreationDialog
              isOpen={showCreateColumn}
              onOpenChange={setShowCreateColumn}
              columnName={columnName}
              setColumnName={setColumnName}
              columnType={columnType}
              setColumnType={setColumnType}
              columnRequired={columnRequired}
              setColumnRequired={setColumnRequired}
              onCreateColumn={onCreateColumn}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {selectedBoardId ? (
          <div className="space-y-3">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <div>
                    <div className="font-medium">{column.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getColumnTypeColor(column.column_type)}>
                        {getColumnTypeLabel(column.column_type)}
                      </Badge>
                      {column.is_required && (
                        <Badge variant="secondary">חובה</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FieldEditor
                    column={column}
                    onUpdateColumn={onUpdateColumn}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteColumn(column.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {columns.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                אין עמודות בלוח זה. הוסף עמודה חדשה כדי להתחיל.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            בחר לוח מהרשימה כדי לערוך את העמודות שלו
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColumnsManager;
