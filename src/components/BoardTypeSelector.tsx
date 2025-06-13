
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BOARD_TYPES, BoardType, getSmartSuggestions } from "@/api/boardTypes";
import { useBoardTemplates } from "@/hooks/useBoardTemplates";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { ArrowRight, Lightbulb } from "lucide-react";

interface BoardTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onBoardCreated?: (boardId: string) => void;
}

const BoardTypeSelector: React.FC<BoardTypeSelectorProps> = ({
  isOpen,
  onClose,
  onBoardCreated
}) => {
  const [selectedType, setSelectedType] = useState<BoardType | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [step, setStep] = useState<'type' | 'template' | 'details' | 'suggestions'>('type');

  const { templates } = useBoardTemplates();
  const { createBoard } = useDynamicBoards();

  const handleTypeSelect = (type: BoardType) => {
    setSelectedType(type);
    setStep('template');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep('details');
  };

  const handleCreateBoard = async () => {
    if (!selectedType || !boardName.trim()) return;

    try {
      const template = templates.find(t => t.id === selectedTemplate);
      
      const newBoard = await createBoard({
        name: boardName,
        description: boardDescription,
        board_type: selectedType
      });

      if (newBoard && template) {
        // יצירת עמודות בהתאם לתבנית
        // כאן נוסיף לוגיקה ליצירת עמודות מהתבנית
        console.log('Creating columns from template:', template.template_data);
      }

      if (newBoard) {
        setStep('suggestions');
        if (onBoardCreated) {
          onBoardCreated(newBoard.id);
        }
      }
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleFinish = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedType(null);
    setSelectedTemplate(null);
    setBoardName('');
    setBoardDescription('');
    setStep('type');
  };

  const typeTemplates = selectedType ? 
    templates.filter(t => t.category === selectedType || t.category === 'general') : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'type' && 'בחר סוג בורד'}
            {step === 'template' && 'בחר תבנית'}
            {step === 'details' && 'פרטי הבורד'}
            {step === 'suggestions' && 'הצעות חכמות'}
          </DialogTitle>
        </DialogHeader>

        {step === 'type' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(BOARD_TYPES).map(([type, config]) => (
              <Card 
                key={type}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTypeSelect(type as BoardType)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <span>{config.label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{config.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 'template' && selectedType && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{BOARD_TYPES[selectedType].label}</Badge>
              <ArrowRight className="h-4 w-4" />
              <span className="text-sm text-gray-600">בחירת תבנית</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {typeTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-colors ${
                    selectedTemplate === template.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    {template.description && (
                      <p className="text-xs text-gray-500">{template.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(template.template_data) && 
                        template.template_data.slice(0, 3).map((col: any, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {col.name}
                          </Badge>
                        ))}
                      {Array.isArray(template.template_data) && template.template_data.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.template_data.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card 
                className={`cursor-pointer transition-colors ${
                  selectedTemplate === 'custom' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect('custom')}
              >
                <CardHeader>
                  <CardTitle className="text-sm">התחל מאפס</CardTitle>
                  <p className="text-xs text-gray-500">צור בורד ריק ובנה אותו בעצמך</p>
                </CardHeader>
              </Card>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setStep('type')}>
                חזור
              </Button>
              <Button 
                onClick={() => setStep('details')} 
                disabled={!selectedTemplate}
              >
                המשך
              </Button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{selectedType && BOARD_TYPES[selectedType].label}</Badge>
              <ArrowRight className="h-4 w-4" />
              <span className="text-sm text-gray-600">פרטי הבורד</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="board-name">שם הבורד</Label>
                <Input
                  id="board-name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="הכנס שם לבורד"
                />
              </div>
              
              <div>
                <Label htmlFor="board-description">תיאור (אופציונלי)</Label>
                <Textarea
                  id="board-description"
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                  placeholder="תיאור קצר של הבורד"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setStep('template')}>
                חזור
              </Button>
              <Button 
                onClick={handleCreateBoard}
                disabled={!boardName.trim()}
              >
                צור בורד
              </Button>
            </div>
          </div>
        )}

        {step === 'suggestions' && selectedType && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-green-600 mb-2">
                הבורד נוצר בהצלחה! 🎉
              </h3>
              <p className="text-gray-600 mb-6">הצעות לשיפור הבורד שלך:</p>
            </div>

            <div className="space-y-3">
              {getSmartSuggestions(selectedType).map((suggestion, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{suggestion}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      הוסף
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Button onClick={handleFinish}>
                סיום
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BoardTypeSelector;
