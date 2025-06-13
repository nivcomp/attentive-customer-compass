
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Link2 } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { boardRelationshipsAPI, type BoardRelationship } from "@/api/boardRelationships";
import { useToast } from "@/hooks/use-toast";

interface RelationshipManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const RelationshipManager: React.FC<RelationshipManagerProps> = ({ isOpen, onClose }) => {
  const [relationships, setRelationships] = useState<BoardRelationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { boards } = useDynamicBoards();
  const { toast } = useToast();

  // טופס יצירת קשר חדש
  const [newRelationship, setNewRelationship] = useState({
    source_board_id: '',
    target_board_id: '',
    relationship_type: 'one_to_many' as 'one_to_many' | 'many_to_many' | 'one_to_one',
    source_field_name: '',
    target_field_name: ''
  });

  const relationshipTypes = [
    { value: 'one_to_many', label: 'אחד לרבים (One-to-Many)' },
    { value: 'many_to_many', label: 'רבים לרבים (Many-to-Many)' },
    { value: 'one_to_one', label: 'אחד לאחד (One-to-One)' }
  ];

  const fetchRelationships = async () => {
    try {
      setLoading(true);
      const data = await boardRelationshipsAPI.getAll();
      setRelationships(data);
    } catch (error) {
      console.error('Error fetching relationships:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת הקשרים",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRelationship = async () => {
    if (!newRelationship.source_board_id || !newRelationship.target_board_id || 
        !newRelationship.source_field_name || !newRelationship.target_field_name) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }

    try {
      const created = await boardRelationshipsAPI.create(newRelationship);
      setRelationships(prev => [created, ...prev]);
      setNewRelationship({
        source_board_id: '',
        target_board_id: '',
        relationship_type: 'one_to_many',
        source_field_name: '',
        target_field_name: ''
      });
      setShowCreateForm(false);
      toast({
        title: "הצלחה",
        description: "הקשר נוצר בהצלחה",
      });
    } catch (error) {
      console.error('Error creating relationship:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה ביצירת הקשר",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRelationship = async (id: string) => {
    try {
      await boardRelationshipsAPI.delete(id);
      setRelationships(prev => prev.filter(r => r.id !== id));
      toast({
        title: "הצלחה",
        description: "הקשר נמחק בהצלחה",
      });
    } catch (error) {
      console.error('Error deleting relationship:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת הקשר",
        variant: "destructive",
      });
    }
  };

  const getBoardName = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    return board?.name || 'בורד לא נמצא';
  };

  const getRelationshipTypeLabel = (type: string) => {
    const typeData = relationshipTypes.find(t => t.value === type);
    return typeData?.label || type;
  };

  useEffect(() => {
    if (isOpen) {
      fetchRelationships();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-semibold">ניהול קשרים בין בורדים</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* כפתור הוספת קשר חדש */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">קשרים קיימים</h3>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 ml-2" />
              קשר חדש
            </Button>
          </div>

          {/* טופס יצירת קשר חדש */}
          {showCreateForm && (
            <Card className="p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source_board">בורד מקור</Label>
                  <Select 
                    value={newRelationship.source_board_id} 
                    onValueChange={(value) => setNewRelationship(prev => ({ ...prev, source_board_id: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="בחר בורד מקור" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map((board) => (
                        <SelectItem key={board.id} value={board.id}>
                          {board.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target_board">בורד יעד</Label>
                  <Select 
                    value={newRelationship.target_board_id} 
                    onValueChange={(value) => setNewRelationship(prev => ({ ...prev, target_board_id: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="בחר בורד יעד" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map((board) => (
                        <SelectItem key={board.id} value={board.id}>
                          {board.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="relationship_type">סוג קשר</Label>
                  <Select 
                    value={newRelationship.relationship_type} 
                    onValueChange={(value: any) => setNewRelationship(prev => ({ ...prev, relationship_type: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="source_field">שדה בבורד מקור</Label>
                  <Input
                    value={newRelationship.source_field_name}
                    onChange={(e) => setNewRelationship(prev => ({ ...prev, source_field_name: e.target.value }))}
                    placeholder="לדוגמה: חברה"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="target_field">שדה בבורד יעד</Label>
                  <Input
                    value={newRelationship.target_field_name}
                    onChange={(e) => setNewRelationship(prev => ({ ...prev, target_field_name: e.target.value }))}
                    placeholder="לדוגמה: איש קשר"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreateRelationship} size="sm">
                  צור קשר
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)} 
                  size="sm"
                >
                  ביטול
                </Button>
              </div>
            </Card>
          )}

          {/* רשימת קשרים קיימים */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">טוען קשרים...</p>
              </div>
            ) : relationships.length === 0 ? (
              <Card className="p-8 text-center">
                <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">אין קשרים</h3>
                <p className="text-gray-600">צור את הקשר הראשון בין הבורדים שלך</p>
              </Card>
            ) : (
              relationships.map((relationship) => (
                <Card key={relationship.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-600">
                          {getBoardName(relationship.source_board_id)}
                        </Badge>
                        <span className="text-gray-500">→</span>
                        <Badge variant="outline" className="text-green-600">
                          {getBoardName(relationship.target_board_id)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{getRelationshipTypeLabel(relationship.relationship_type)}</span>
                        <br />
                        <span>
                          {relationship.source_field_name} ↔ {relationship.target_field_name}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('האם אתה בטוח שברצונך למחוק את הקשר הזה?')) {
                          handleDeleteRelationship(relationship.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelationshipManager;
