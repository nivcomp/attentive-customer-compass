
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { DynamicBoard, DynamicBoardColumn, DynamicBoardItem } from "@/api/dynamicBoard";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";
import AdvancedColumnEditor from "./AdvancedColumnEditor";
import FieldRenderer from "./FieldRenderer";
import TestFieldsSetup from "./TestFieldsSetup";

interface DynamicBoardTableViewProps {
  items: DynamicBoardItem[];
  columns: DynamicBoardColumn[];
  loading: boolean;
  onEditItem: (item: DynamicBoardItem) => void;
  onDeleteItem: (item: DynamicBoardItem) => void;
  onAddItem: () => void;
}

const DynamicBoardTableView: React.FC<DynamicBoardTableViewProps> = ({ 
  items, 
  columns, 
  loading, 
  onEditItem, 
  onDeleteItem, 
  onAddItem 
}) => {
  const [editingItem, setEditingItem] = useState<DynamicBoardItem | null>(null);

  const handleFieldChange = (item: DynamicBoardItem, columnName: string, value: any) => {
    if (item === editingItem) {
      setEditingItem({
        ...editingItem,
        data: { ...editingItem.data, [columnName]: value }
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      onEditItem(editingItem);
      setEditingItem(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">טוען נתונים...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* הודעה כשאין עמודות */}
      {columns.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">אין עמודות בבורד הזה</p>
          <p className="text-sm text-muted-foreground">הוסף עמודות כדי להתחיל לעבוד עם הבורד</p>
        </Card>
      )}

      {/* טבלת הנתונים */}
      {columns.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableHead key={column.id} className="relative group">
                    <div className="flex items-center justify-between">
                      <span>{column.name}</span>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-24">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  {columns.map(column => (
                    <TableCell key={column.id}>
                      <FieldRenderer
                        column={column}
                        value={item.data[column.name]}
                        onChange={(value) => handleFieldChange(item, column.name, value)}
                        readOnly={editingItem?.id !== item.id}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      {editingItem?.id === item.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveEdit}
                            title="שמור"
                          >
                            <Save className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem(null)}
                            title="בטל"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                            title="ערוך"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteItem(item)}
                            title="מחק"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* הודעה כשאין נתונים */}
      {columns.length > 0 && items.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">אין רשומות בבורד הזה</p>
          <Button onClick={onAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף רשומה ראשונה
          </Button>
        </Card>
      )}
    </div>
  );
};

export default DynamicBoardTableView;
