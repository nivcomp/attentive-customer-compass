
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DynamicBoard } from "@/api/dynamicBoard";
import { useBoardGroups } from "@/hooks/useBoardGroups";
import { BoardGroup } from "@/types/boardGroups";

interface BoardGroupManagerProps {
  boards: DynamicBoard[];
  isOpen: boolean;
  onClose: () => void;
}

const BoardGroupManager: React.FC<BoardGroupManagerProps> = ({
  boards,
  isOpen,
  onClose
}) => {
  const { settings, createGroup, updateGroup, deleteGroup } = useBoardGroups();
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedBoardIds, setSelectedBoardIds] = useState<string[]>([]);
  const [editingGroup, setEditingGroup] = useState<BoardGroup | null>(null);

  const handleCreateGroup = () => {
    if (newGroupName.trim() && selectedBoardIds.length > 0) {
      createGroup(newGroupName.trim(), selectedBoardIds);
      setNewGroupName('');
      setSelectedBoardIds([]);
    }
  };

  const handleUpdateGroup = () => {
    if (editingGroup && editingGroup.name.trim()) {
      updateGroup(editingGroup.id, {
        name: editingGroup.name,
        boardIds: editingGroup.boardIds
      });
      setEditingGroup(null);
    }
  };

  const handleBoardSelection = (boardId: string, checked: boolean) => {
    if (editingGroup) {
      setEditingGroup({
        ...editingGroup,
        boardIds: checked 
          ? [...editingGroup.boardIds, boardId]
          : editingGroup.boardIds.filter(id => id !== boardId)
      });
    } else {
      setSelectedBoardIds(prev => 
        checked 
          ? [...prev, boardId]
          : prev.filter(id => id !== boardId)
      );
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !editingGroup) return;

    const newBoardIds = Array.from(editingGroup.boardIds);
    const [reorderedId] = newBoardIds.splice(result.source.index, 1);
    newBoardIds.splice(result.destination.index, 0, reorderedId);

    setEditingGroup({
      ...editingGroup,
      boardIds: newBoardIds
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ניהול קבוצות בורדים</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* יצירת קבוצה חדשה */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                קבוצה חדשה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="groupName">שם הקבוצה</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="הכנס שם לקבוצה"
                />
              </div>

              <div>
                <Label>בחר בורדים לקבוצה</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {boards.map(board => (
                    <div key={board.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`board-${board.id}`}
                        checked={selectedBoardIds.includes(board.id)}
                        onCheckedChange={(checked) => 
                          handleBoardSelection(board.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`board-${board.id}`} className="flex-1">
                        {board.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || selectedBoardIds.length === 0}
                className="w-full"
              >
                צור קבוצה
              </Button>
            </CardContent>
          </Card>

          {/* קבוצות קיימות */}
          <Card>
            <CardHeader>
              <CardTitle>קבוצות קיימות</CardTitle>
            </CardHeader>
            <CardContent>
              {settings.groups.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  אין קבוצות קיימות
                </p>
              ) : (
                <div className="space-y-4">
                  {settings.groups.map(group => (
                    <div key={group.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{group.name}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingGroup(group)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteGroup(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {group.boardIds.length} בורדים: {' '}
                        {group.boardIds.map(boardId => {
                          const board = boards.find(b => b.id === boardId);
                          return board?.name;
                        }).filter(Boolean).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* עריכת קבוצה */}
          {editingGroup && (
            <Card>
              <CardHeader>
                <CardTitle>עריכת קבוצה: {editingGroup.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="editGroupName">שם הקבוצה</Label>
                  <Input
                    id="editGroupName"
                    value={editingGroup.name}
                    onChange={(e) => setEditingGroup({
                      ...editingGroup,
                      name: e.target.value
                    })}
                  />
                </div>

                <div>
                  <Label>בורדים בקבוצה</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {boards.map(board => (
                      <div key={board.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-board-${board.id}`}
                          checked={editingGroup.boardIds.includes(board.id)}
                          onCheckedChange={(checked) => 
                            handleBoardSelection(board.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`edit-board-${board.id}`} className="flex-1">
                          {board.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {editingGroup.boardIds.length > 0 && (
                  <div>
                    <Label>סדר הבורדים (גרור לשינוי סדר)</Label>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="boards">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {editingGroup.boardIds.map((boardId, index) => {
                              const board = boards.find(b => b.id === boardId);
                              if (!board) return null;
                              
                              return (
                                <Draggable key={boardId} draggableId={boardId} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center gap-2 p-2 border rounded mb-2 bg-white"
                                    >
                                      <GripVertical className="h-4 w-4 text-gray-400" />
                                      <span>{board.name}</span>
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

                <div className="flex gap-2">
                  <Button onClick={handleUpdateGroup} className="flex-1">
                    שמור שינויים
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingGroup(null)}
                    className="flex-1"
                  >
                    ביטול
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardGroupManager;
