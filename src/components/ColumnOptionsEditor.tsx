
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface ColumnOptionsEditorProps {
  options: string[];
  newOption: string;
  onOptionsChange: (options: string[]) => void;
  onNewOptionChange: (value: string) => void;
  onAddOption: () => void;
}

const ColumnOptionsEditor: React.FC<ColumnOptionsEditorProps> = ({
  options,
  newOption,
  onOptionsChange,
  onNewOptionChange,
  onAddOption
}) => {
  const removeOption = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  return (
    <div className="space-y-2">
      <Label>אפשרויות</Label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeOption(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={newOption}
            onChange={(e) => onNewOptionChange(e.target.value)}
            placeholder="אפשרות חדשה"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && onAddOption()}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onAddOption}
            disabled={!newOption.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ColumnOptionsEditor;
