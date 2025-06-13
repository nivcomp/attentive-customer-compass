
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link2, ExternalLink, Plus, AlertTriangle } from "lucide-react";
import { useBoardRelationships } from "@/hooks/useBoardRelationships";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";

interface LinkedRecordsDisplayProps {
  boardId: string;
  itemId: string;
  itemData: Record<string, any>;
}

const LinkedRecordsDisplay: React.FC<LinkedRecordsDisplayProps> = ({
  boardId,
  itemId,
  itemData
}) => {
  const [linkedRecords, setLinkedRecords] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const { relationships, fetchItemRelationships } = useBoardRelationships(boardId);
  const { boards } = useDynamicBoards();

  // מציאת כל הקישורים הרלוונטיים לפריט זה
  const relevantRelationships = relationships.filter(rel => 
    rel.source_board_id === boardId || rel.target_board_id === boardId
  );

  const fetchLinkedData = async () => {
    try {
      const linkedData = [];
      
      for (const relationship of relevantRelationships) {
        const isSource = relationship.source_board_id === boardId;
        const linkedBoardId = isSource ? relationship.target_board_id : relationship.source_board_id;
        const linkedBoard = boards.find(b => b.id === linkedBoardId);
        
        if (linkedBoard) {
          // כאן נקבל את הנתונים המקושרים מבסיס הנתונים
          // לצורך הדוגמה, אני אשתמש בנתונים מדומים
          linkedData.push({
            boardName: linkedBoard.name,
            boardId: linkedBoardId,
            relationshipType: relationship.relationship_type,
            records: [
              { id: '1', name: 'רשומה מקושרת 1' },
              { id: '2', name: 'רשומה מקושרת 2' }
            ]
          });
        }
      }
      
      setLinkedRecords(linkedData);
    } catch (error) {
      console.error('Error fetching linked data:', error);
    }
  };

  useEffect(() => {
    if (isOpen && relevantRelationships.length > 0) {
      fetchLinkedData();
    }
  }, [isOpen, relevantRelationships]);

  if (relevantRelationships.length === 0) {
    return null;
  }

  const getTotalLinkedRecords = () => {
    return linkedRecords.reduce((total, linked) => total + linked.records.length, 0);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Link2 className="h-4 w-4" />
        <span>רשומות מקושרות</span>
        {linkedRecords.length > 0 && (
          <Badge variant="secondary" className="ml-1">
            {getTotalLinkedRecords()}
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              רשומות מקושרות
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {linkedRecords.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="text-gray-500">
                  <Link2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>טוען רשומות מקושרות...</p>
                </div>
              </Card>
            ) : (
              linkedRecords.map((linkedData, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{linkedData.boardName}</Badge>
                        <span className="text-sm text-gray-600">
                          ({linkedData.records.length} רשומות)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // כאן נוכל לנווט לבורד המקושר
                          console.log('Navigate to board:', linkedData.boardId);
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {linkedData.records.map((record: any) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="font-medium">{record.name}</span>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3"
                      onClick={() => {
                        // כאן נוכל להוסיף קישור חדש
                        console.log('Add new link');
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      הוסף קישור חדש
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}

            {/* Validation Warnings */}
            {linkedRecords.some(data => data.records.length === 0) && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      יש קישורים שלא מכילים רשומות
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkedRecordsDisplay;
