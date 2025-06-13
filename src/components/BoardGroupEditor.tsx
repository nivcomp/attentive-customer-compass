
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Save, X, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DynamicBoard } from "@/api/dynamicBoard";
import { useBoardGroups } from "@/hooks/useBoardGroups";
import { BoardGroup } from "@/types/boardGroups";

interface BoardGroupEditorProps {
  group: BoardGroup | null;
  boards: DynamicBoard[];
  isOpen: boolean;
  onClose: () => void;
}

const BoardGroupEditor: React.FC<BoardGroupEditorProps> = ({
  group,
  boards,
  isOpen,
  onClose
}) => {
  const { updateGroup, createGroup } = useBoardGroups();
  const [editedGroup, setEditedGroup] = useState<BoardGroup | null>(group);

  React.useEffect(() => {
    setEditedGroup(group);
  }, [group]);

  const handleSave = () => {
    if (editedGroup && editedGroup.name.trim()) {
      updateGroup(editedGroup.id, {
        name: editedGroup.name,
        boardIds: editedGroup.boardIds
      });
      onClose();
    }
  };

  const handleDuplicate = () => {
    if (editedGroup) {
      createGroup(`${editedGroup.name} - עותק`, editedGroup.boardIds);
      onClose();
    }
  };

  const handleBoardToggle = (boardId: string, checked: boolean) => {
    if (!editedGroup) return;
    
    setEditedGroup({
      ...editedGroup,
      boardIds: checked 
        ? [...editedGroup.boardIds, boardId]
        : editedGroup.boardIds.filter(id => id !== boardId)
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !editedGroup) return;

    const newBoardIds = Array.from(editedGroup.boardIds);
    const [reorderedId] = newBoardIds.splice(result.source.index, 1);
    newBoardIds.splice(result.destination.index, 0, reorderedId);

    setEditedGroup({
      ...editedGroup,
      boardIds: newBoardIds
    });
  };

  if (!editedGroup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>עריכת קבוצה: {group?.name}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDuplicate}
              >
                <Copy className="h-4 w-4 ml-2" />
                שכפל
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* שם הקבוצה */}
          <Card>
            <CardHeader>
              <CardTitle>פרטי הקבוצה</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="groupName">שם הקבוצה</Label>
                <Input
                  id="groupName"
                  value={editedGroup.name}
                  onChange={(e) => setEditedGroup({
                    ...editedGroup,
                    name: e.target.value
                  })}
                  placeholder="הכנס שם לקבוצה"
                />
              </div>
            </CardContent>
          </Card>

          {/* בחירת בורדים */}
          <Card>
            <CardHeader>
              <CardTitle>בורדים בקבוצה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>בחר בורדים</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {boards.map(board => (
                    <div key={board.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`board-${board.id}`}
                        checked={editedGroup.boardIds.includes(board.id)}
                        onCheckedChange={(checked) => 
                          handleBoardToggle(board.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`board-${board.id}`} className="flex-1">
                        {board.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* סדר הבורדים */}
              {editedGroup.boardIds.length > 0 && (
                <div>
                  <Label>סדר הבורדים (גרור לשינוי סדר)</Label>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="boards">
                      {(provided) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef}
                          className="mt-2 space-y-2"
                        >
                          {editedGroup.boardIds.map((boardId, index) => {
                            const board = boards.find(b => b.id === boardId);
                            if (!board) return null;
                            
                            return (
                              <Draggable key={boardId} draggableId={boardId} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-center gap-2 p-3 border rounded bg-white shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                    <span className="flex-1">{board.name}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleBoardToggle(boardId, false)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </CardContent>
          </Card>

          {/* כפתורי שמירה */}
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              ביטול
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!editedGroup.name.trim() || editedGroup.boardIds.length === 0}
            >
              <Save className="h-4 w-4 ml-2" />
              שמור שינויים
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardGroupEditor;
