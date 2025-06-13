
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Link2, ArrowRight, Trash2 } from "lucide-react";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { boardRelationshipsAPI, type BoardRelationship } from "@/api/boardRelationships";
import { useToast } from "@/hooks/use-toast";

interface RelationshipBuilderProps {
  onRelationshipCreated?: (relationship: BoardRelationship) => void;
}

const SMART_SUGGESTIONS = [
  {
    sourceBoard: 'אנשי קשר',
    targetBoard: 'חברות',
    relationshipType: 'many_to_one',
    sourceField: 'חברה',
    targetField: 'איש קשר',
    description: 'קישור אנשי קשר לחברות'
  },
  {
    sourceBoard: 'עסקאות',
    targetBoard: 'לקוחות',
    relationshipType: 'many_to_one',
    sourceField: 'לקוח',
    targetField: 'עסקה',
    description: 'קישור עסקאות ללקוחות'
  },
  {
    sourceBoard: 'משימות',
    targetBoard: 'פרויקטים',
    relationshipType: 'many_to_one',
    sourceField: 'פרויקט',
    targetField: 'משימה',
    description: 'קישור משימות לפרויקטים'
  },
  {
    sourceBoard: 'הזמנות',
    targetBoard: 'מוצרים',
    relationshipType: 'many_to_many',
    sourceField: 'מוצר',
    targetField: 'הזמנה',
    description: 'קישור הזמנות למוצרים'
  }
];

const RelationshipBuilder: React.FC<RelationshipBuilderProps> = ({ onRelationshipCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSourceBoard, setSelectedSourceBoard] = useState('');
  const [selectedTargetBoard, setSelectedTargetBoard] = useState('');
  const [relationshipType, setRelationshipType] = useState<'one_to_one' | 'one_to_many' | 'many_to_many'>('one_to_many');
  const [sourceFieldName, setSourceFieldName] = useState('');
  const [targetFieldName, setTargetFieldName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const { boards } = useDynamicBoards();
  const { toast } = useToast();

  const relationshipTypes = [
    { value: 'one_to_one', label: 'אחד לאחד (One-to-One)', description: 'כל רשומה מקושרת לרשומה אחת בלבד' },
    { value: 'one_to_many', label: 'אחד לרבים (One-to-Many)', description: 'רשומה אחת יכולה להיות מקושרת לרשומות רבות' },
    { value: 'many_to_many', label: 'רבים לרבים (Many-to-Many)', description: 'רשומות יכולות להיות מקושרות לרשומות רבות' }
  ];

  const handleCreateRelationship = async () => {
    if (!selectedSourceBoard || !selectedTargetBoard || !sourceFieldName || !targetFieldName) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }

    try {
      const relationship = await boardRelationshipsAPI.create({
        source_board_id: selectedSourceBoard,
        target_board_id: selectedTargetBoard,
        relationship_type: relationshipType,
        source_field_name: sourceFieldName,
        target_field_name: targetFieldName
      });

      toast({
        title: "הצלחה",
        description: "קישור נוצר בהצלחה בין הבורדים",
      });

      onRelationshipCreated?.(relationship);
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating relationship:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה ביצירת הקישור",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedSourceBoard('');
    setSelectedTargetBoard('');
    setRelationshipType('one_to_many');
    setSourceFieldName('');
    setTargetFieldName('');
  };

  const applySuggestion = (suggestion: typeof SMART_SUGGESTIONS[0]) => {
    const sourceBoard = boards.find(b => b.name.includes(suggestion.sourceBoard));
    const targetBoard = boards.find(b => b.name.includes(suggestion.targetBoard));
    
    if (sourceBoard) setSelectedSourceBoard(sourceBoard.id);
    if (targetBoard) setSelectedTargetBoard(targetBoard.id);
    setRelationshipType(suggestion.relationshipType as any);
    setSourceFieldName(suggestion.sourceField);
    setTargetFieldName(suggestion.targetField);
    setShowSuggestions(false);
  };

  const getRelevantSuggestions = () => {
    return SMART_SUGGESTIONS.filter(suggestion => {
      return boards.some(board => 
        board.name.includes(suggestion.sourceBoard) || 
        board.name.includes(suggestion.targetBoard)
      );
    });
  };

  const getSourceBoardName = () => {
    const board = boards.find(b => b.id === selectedSourceBoard);
    return board?.name || '';
  };

  const getTargetBoardName = () => {
    const board = boards.find(b => b.id === selectedTargetBoard);
    return board?.name || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Link2 className="h-4 w-4 mr-2" />
          צור קישור בין בורדים
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            יצירת קישור דינמי בין בורדים
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Smart Suggestions */}
          {showSuggestions && getRelevantSuggestions().length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm text-blue-800">הצעות חכמות לקישורים</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getRelevantSuggestions().map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{suggestion.sourceBoard}</Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <Badge variant="outline">{suggestion.targetBoard}</Badge>
                      <span className="text-sm text-gray-600">{suggestion.description}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      השתמש בהצעה
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Manual Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Board */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 text-center">בורד מקור</h3>
              <div className="space-y-4">
                <div>
                  <Label>בחר בורד מקור</Label>
                  <Select value={selectedSourceBoard} onValueChange={setSelectedSourceBoard}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="בחר בורד" />
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
                  <Label>שם השדה בבורד המקור</Label>
                  <Input
                    value={sourceFieldName}
                    onChange={(e) => setSourceFieldName(e.target.value)}
                    placeholder="לדוגמה: לקוח, חברה, פרויקט"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    שדה זה יתווסף אוטומטית לבורד המקור
                  </p>
                </div>
              </div>
            </Card>

            {/* Target Board */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 text-center">בורד יעד</h3>
              <div className="space-y-4">
                <div>
                  <Label>בחר בורד יעד</Label>
                  <Select value={selectedTargetBoard} onValueChange={setSelectedTargetBoard}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="בחר בורד" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.filter(board => board.id !== selectedSourceBoard).map((board) => (
                        <SelectItem key={board.id} value={board.id}>
                          {board.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>שם השדה בבורד היעד</Label>
                  <Input
                    value={targetFieldName}
                    onChange={(e) => setTargetFieldName(e.target.value)}
                    placeholder="לדוגמה: איש קשר, עסקה, משימה"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    שדה זה יתווסף אוטומטית לבורד היעד (אופציונלי)
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Relationship Type */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">סוג הקישור</h3>
            <div className="space-y-3">
              {relationshipTypes.map((type) => (
                <div 
                  key={type.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    relationshipType === type.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setRelationshipType(type.value as any)}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={relationshipType === type.value}
                      onChange={() => setRelationshipType(type.value as any)}
                      className="text-blue-600"
                    />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Preview */}
          {selectedSourceBoard && selectedTargetBoard && (
            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">תצוגה מקדימה של הקישור</h3>
              <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg">
                <div className="text-center">
                  <Badge className="bg-blue-100 text-blue-800">{getSourceBoardName()}</Badge>
                  <div className="text-xs text-gray-600 mt-1">{sourceFieldName}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  <Badge variant="outline" className="text-xs">
                    {relationshipType === 'one_to_one' && '1:1'}
                    {relationshipType === 'one_to_many' && '1:N'}
                    {relationshipType === 'many_to_many' && 'N:M'}
                  </Badge>
                  <ArrowRight className="h-4 w-4" />
                </div>
                
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800">{getTargetBoardName()}</Badge>
                  <div className="text-xs text-gray-600 mt-1">{targetFieldName}</div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              ביטול
            </Button>
            <Button 
              onClick={handleCreateRelationship}
              disabled={!selectedSourceBoard || !selectedTargetBoard || !sourceFieldName}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              צור קישור
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelationshipBuilder;
