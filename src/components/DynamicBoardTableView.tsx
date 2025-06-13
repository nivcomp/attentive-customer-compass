
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
  board: DynamicBoard;
  columns: DynamicBoardColumn[];
  items: DynamicBoardItem[];
}

const DynamicBoardTableView: React.FC<DynamicBoardTableViewProps> = ({ board, columns, items }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<DynamicBoardItem | null>(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [newItemData, setNewItemData] = useState<Record<string, any>>({});

  const { createColumn, updateColumn, deleteColumn } = useDynamicBoardColumns(board.id);
  const { createItem, updateItem, deleteItem } = useDynamicBoardItems(board.id);

  const handleCreateColumn = async () => {
    if (!newColumnName.trim()) return;
    
    const newColumn = await createColumn({
      board_id: board.id,
      name: newColumnName,
      column_type: 'text',
      column_order: columns.length,
      is_required: false,
      options: {},
      validation_rules: {},
      display_settings: {}
    });
    
    if (newColumn) {
      setNewColumnName('');
      setIsAddingColumn(false);
    }
  };

  const handleCreateItem = async () => {
    const itemData = { ...newItemData };
    
    // ודא שכל השדות הנדרשים מלאים
    for (const column of columns) {
      if (column.is_required && !itemData[column.name]) {
        alert(`השדה "${column.name}" הוא שדה חובה`);
        return;
      }
    }
    
    const newItem = await createItem({
      board_id: board.id,
      data: itemData,
      item_order: items.length
    });
    
    if (newItem) {
      setNewItemData({});
      setIsAddingItem(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    
    const updatedItem = await updateItem(editingItem.id, {
      data: editingItem.data
    });
    
    if (updatedItem) {
      setEditingItem(null);
    }
  };

  const handleFieldChange = (item: DynamicBoardItem, columnName: string, value: any) => {
    if (item === editingItem) {
      setEditingItem({
        ...editingItem,
        data: { ...editingItem.data, [columnName]: value }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* הגדרת שדות בדיקה */}
      {columns.length === 0 && (
        <TestFieldsSetup boardId={board.id} />
      )}

      {/* כותרת עם פעולות */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {board.name} ({items.length} רשומות)
        </h3>
        <div className="flex gap-2">
          <Dialog open={isAddingColumn} onOpenChange={setIsAddingColumn}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                הוסף עמודה
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>הוספת עמודה חדשה</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="שם העמודה"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateColumn()}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingColumn(false)}>
                    בטל
                  </Button>
                  <Button onClick={handleCreateColumn} disabled={!newColumnName.trim()}>
                    הוסף
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                הוסף רשומה
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>הוספת רשומה חדשה</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {columns.map(column => (
                  <div key={column.id} className="space-y-2">
                    <label className="text-sm font-medium">
                      {column.name}
                      {column.is_required && <span className="text-red-500"> *</span>}
                    </label>
                    <FieldRenderer
                      column={column}
                      value={newItemData[column.name]}
                      onChange={(value) => setNewItemData(prev => ({ ...prev, [column.name]: value }))}
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                    בטל
                  </Button>
                  <Button onClick={handleCreateItem}>
                    הוסף רשומה
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AdvancedColumnEditor
                          column={column}
                          onUpdateColumn={updateColumn}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50"
                          onClick={() => deleteColumn(column.id)}
                          title="מחק עמודה"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
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
                            onClick={handleUpdateItem}
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
                            onClick={() => deleteItem(item.id)}
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
          <Button onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף רשומה ראשונה
          </Button>
        </Card>
      )}
    </div>
  );
};

export default DynamicBoardTableView;
