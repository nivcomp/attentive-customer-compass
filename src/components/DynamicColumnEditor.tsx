
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { DynamicBoardColumn } from "@/api/dynamicBoard";
import ColumnBasicSettings from "./ColumnBasicSettings";
import ColumnOptionsEditor from "./ColumnOptionsEditor";
import ColumnEditorActions from "./ColumnEditorActions";

interface DynamicColumnEditorProps {
  column: DynamicBoardColumn;
  onUpdateColumn: (id: string, updates: Partial<DynamicBoardColumn>) => Promise<DynamicBoardColumn | null>;
}

const DynamicColumnEditor: React.FC<DynamicColumnEditorProps> = ({ column, onUpdateColumn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [columnType, setColumnType] = useState<DynamicBoardColumn['column_type']>(column.column_type);
  const [columnRequired, setColumnRequired] = useState(column.is_required);
  const [options, setOptions] = useState<string[]>(column.options?.options || []);
  const [newOption, setNewOption] = useState('');
  const [saving, setSaving] = useState(false);

  const needsOptions = columnType === 'single_select' || columnType === 'multi_select' || columnType === 'status';

  const handleSave = async () => {
    if (!columnName.trim()) return;
    
    setSaving(true);
    const optionsData = needsOptions ? { options } : {};
    
    const updated = await onUpdateColumn(column.id, {
      name: columnName,
      column_type: columnType,
      is_required: columnRequired,
      options: optionsData,
    });
    
    if (updated) {
      setIsOpen(false);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setColumnName(column.name);
    setColumnType(column.column_type);
    setColumnRequired(column.is_required);
    setOptions(column.options?.options || []);
    setNewOption('');
    setIsOpen(false);
  };

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-50"
          title="התאם עמודה"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>התאמת עמודה</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <ColumnBasicSettings
            columnName={columnName}
            columnType={columnType}
            columnRequired={columnRequired}
            onColumnNameChange={setColumnName}
            onColumnTypeChange={setColumnType}
            onColumnRequiredChange={setColumnRequired}
          />
          
          {needsOptions && (
            <ColumnOptionsEditor
              options={options}
              newOption={newOption}
              onOptionsChange={setOptions}
              onNewOptionChange={setNewOption}
              onAddOption={addOption}
            />
          )}
          
          <ColumnEditorActions
            saving={saving}
            columnName={columnName}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicColumnEditor;
