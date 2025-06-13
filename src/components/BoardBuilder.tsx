
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Settings, Trash2, Edit, GripVertical } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { useBoardColumns } from "@/hooks/useBoardColumns";
import { BoardColumn } from "@/types/board";
import FieldEditor from "./FieldEditor";

const BoardBuilder = () => {
  const { boards, loading: boardsLoading, createBoard } = useBoards();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const { columns, createColumn, updateColumn, deleteColumn } = useBoardColumns(selectedBoardId);
  
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState<'text' | 'number' | 'date' | 'select' | 'status'>('text');
  const [columnRequired, setColumnRequired] = useState(false);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    
    const board = await createBoard(newBoardName, newBoardDescription);
    if (board) {
      setNewBoardName('');
      setNewBoardDescription('');
      setShowCreateBoard(false);
      setSelectedBoardId(board.id);
    }
  };

  const handleCreateColumn = async () => {
    if (!columnName.trim() || !selectedBoardId) return;
    
    const column = await createColumn({
      board_id: selectedBoardId,
      name: columnName,
      column_type: columnType,
      column_order: columns.length,
      is_required: columnRequired,
    });
    
    if (column) {
      setColumnName('');
      setColumnType('text');
      setColumnRequired(false);
      setShowCreateColumn(false);
    }
  };

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

  if (boardsLoading) {
    return <div className="flex justify-center p-8">טוען...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">בונה לוחות מותאמים אישית</h2>
        <Dialog open={showCreateBoard} onOpenChange={setShowCreateBoard}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              לוח חדש
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>יצירת לוח חדש</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="board-name">שם הלוח</Label>
                <Input
                  id="board-name"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="הכנס שם ללוח"
                />
              </div>
              <div>
                <Label htmlFor="board-description">תיאור</Label>
                <Textarea
                  id="board-description"
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="תיאור אופציונלי ללוח"
                />
              </div>
              <Button onClick={handleCreateBoard} className="w-full">
                צור לוח
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>הלוחות שלי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedBoardId === board.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedBoardId(board.id)}
                >
                  <div className="font-medium">{board.name}</div>
                  {board.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {board.description}
                    </div>
                  )}
                </div>
              ))}
              {boards.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  אין לוחות זמינים
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {selectedBoardId ? 'עמודות הלוח' : 'בחר לוח לעריכה'}
              </CardTitle>
              {selectedBoardId && (
                <Dialog open={showCreateColumn} onOpenChange={setShowCreateColumn}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      עמודה חדשה
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>הוספת עמודה חדשה</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="column-name">שם העמודה</Label>
                        <Input
                          id="column-name"
                          value={columnName}
                          onChange={(e) => setColumnName(e.target.value)}
                          placeholder="הכנס שם לעמודה"
                        />
                      </div>
                      <div>
                        <Label htmlFor="column-type">סוג העמודה</Label>
                        <Select value={columnType} onValueChange={(value: any) => setColumnType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">טקסט</SelectItem>
                            <SelectItem value="number">מספר</SelectItem>
                            <SelectItem value="date">תאריך</SelectItem>
                            <SelectItem value="select">רשימה</SelectItem>
                            <SelectItem value="status">סטטוס</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          id="required"
                          checked={columnRequired}
                          onChange={(e) => setColumnRequired(e.target.checked)}
                        />
                        <Label htmlFor="required">שדה חובה</Label>
                      </div>
                      <Button onClick={handleCreateColumn} className="w-full">
                        הוסף עמודה
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
                        onUpdateColumn={updateColumn}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteColumn(column.id)}
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
      </div>
    </div>
  );
};

export default BoardBuilder;
