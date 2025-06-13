
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStatesProps {
  type: 'no-columns' | 'no-items' | 'loading';
  onAddItem?: () => void;
}

const EmptyStates: React.FC<EmptyStatesProps> = ({ type, onAddItem }) => {
  if (type === 'loading') {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">טוען נתונים...</p>
      </Card>
    );
  }

  if (type === 'no-columns') {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">אין עמודות בבורד הזה</p>
        <p className="text-sm text-muted-foreground">הוסף עמודות כדי להתחיל לעבוד עם הבורד</p>
      </Card>
    );
  }

  if (type === 'no-items') {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">אין רשומות בבורד הזה</p>
        <Button onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          הוסף רשומה ראשונה
        </Button>
      </Card>
    );
  }

  return null;
};

export default EmptyStates;
