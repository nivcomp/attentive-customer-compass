
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface BoardCreationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  boardName: string;
  setBoardName: (name: string) => void;
  boardDescription: string;
  setBoardDescription: (description: string) => void;
  onCreateBoard: () => void;
}

const BoardCreationDialog: React.FC<BoardCreationDialogProps> = ({
  isOpen,
  onOpenChange,
  boardName,
  setBoardName,
  boardDescription,
  setBoardDescription,
  onCreateBoard,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="הכנס שם ללוח"
            />
          </div>
          <div>
            <Label htmlFor="board-description">תיאור</Label>
            <Textarea
              id="board-description"
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              placeholder="תיאור אופציונלי ללוח"
            />
          </div>
          <Button onClick={onCreateBoard} className="w-full">
            צור לוח
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardCreationDialog;
