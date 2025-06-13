
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Upload, Image as ImageIcon, Plus, Eye, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DynamicBoardColumn } from "@/api/dynamicBoard";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useDynamicBoardItems } from "@/hooks/useDynamicBoardItems";

interface FieldRendererProps {
  column: DynamicBoardColumn;
  value: any;
  onChange: (value: any) => void;
  readOnly?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ column, value, onChange, readOnly = false }) => {
  const [showBoardLinkDialog, setShowBoardLinkDialog] = useState(false);
  const [boardLinkSearch, setBoardLinkSearch] = useState('');
  const { boards } = useDynamicBoards();
  const { items: linkedItems, createItem } = useDynamicBoardItems(column.linked_board_id || null);

  const getColumnTypeLabel = (type: string) => {
    const labels = {
      text: 'טקסט',
      number: 'מספר', 
      date: 'תאריך',
      single_select: 'בחירה יחידה',
      multi_select: 'בחירה מרובה',
      status: 'סטטוס',
      file: 'קובץ',
      image: 'תמונה',
      board_link: 'קישור לבורד'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const renderTextField = () => (
    <Input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={`הכנס ${column.name}`}
    />
  );

  const renderNumberField = () => (
    <Input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      readOnly={readOnly}
      placeholder={`הכנס ${column.name}`}
    />
  );

  const renderDateField = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={readOnly}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "dd/MM/yyyy") : `בחר ${column.name}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => onChange(date?.toISOString())}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );

  const renderSingleSelectField = () => {
    const options = column.options?.options || [];
    return (
      <Select value={value || ''} onValueChange={onChange} disabled={readOnly}>
        <SelectTrigger>
          <SelectValue placeholder={`בחר ${column.name}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: string, index: number) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const renderMultiSelectField = () => {
    const options = column.options?.options || [];
    const selectedValues = Array.isArray(value) ? value : [];

    const toggleOption = (option: string) => {
      if (readOnly) return;
      
      const newValues = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option];
      onChange(newValues);
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((val: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {val}
              {!readOnly && (
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleOption(val)}
                />
              )}
            </Badge>
          ))}
        </div>
        {!readOnly && (
          <Select onValueChange={toggleOption}>
            <SelectTrigger>
              <SelectValue placeholder={`הוסף ${column.name}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  const renderFileField = () => (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-2 p-2 border rounded">
          <span className="text-sm">{value.name || 'קובץ'}</span>
          <Button variant="ghost" size="sm" onClick={() => window.open(value.url, '_blank')}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!readOnly && (
        <Button variant="outline" className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          העלה קובץ
        </Button>
      )}
    </div>
  );

  const renderImageField = () => (
    <div className="space-y-2">
      {value && (
        <div className="border rounded p-2">
          <img 
            src={value.url} 
            alt={value.name || 'תמונה'} 
            className="max-w-full h-32 object-cover rounded"
          />
        </div>
      )}
      {!readOnly && (
        <Button variant="outline" className="w-full">
          <ImageIcon className="h-4 w-4 mr-2" />
          העלה תמונה
        </Button>
      )}
    </div>
  );

  const renderBoardLinkField = () => {
    const linkedBoard = boards.find(b => b.id === column.linked_board_id);
    const selectedItem = linkedItems.find(item => item.id === value);
    
    const filteredItems = linkedItems.filter(item => 
      !boardLinkSearch.trim() || 
      Object.values(item.data).some(val => 
        String(val).toLowerCase().includes(boardLinkSearch.toLowerCase())
      )
    );

    const handleCreateNewRecord = async () => {
      if (!column.linked_board_id || !boardLinkSearch.trim()) return;
      
      const newItem = await createItem({
        board_id: column.linked_board_id,
        data: { name: boardLinkSearch },
        item_order: linkedItems.length
      });
      
      if (newItem) {
        onChange(newItem.id);
        setShowBoardLinkDialog(false);
        setBoardLinkSearch('');
      }
    };

    return (
      <div className="space-y-2">
        {selectedItem && (
          <Card className="p-2">
            <div className="text-sm font-medium">
              {Object.values(selectedItem.data)[0] || 'רשומה ללא שם'}
            </div>
            <div className="text-xs text-muted-foreground">
              מ: {linkedBoard?.name}
            </div>
          </Card>
        )}
        
        {!readOnly && (
          <Dialog open={showBoardLinkDialog} onOpenChange={setShowBoardLinkDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {selectedItem ? 'שנה קישור' : `קשר ל${linkedBoard?.name || 'בורד'}`}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>בחר רשומה מ{linkedBoard?.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="חפש רשומות..."
                  value={boardLinkSearch}
                  onChange={(e) => setBoardLinkSearch(e.target.value)}
                />
                
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredItems.map(item => (
                    <Card 
                      key={item.id} 
                      className={cn(
                        "p-3 cursor-pointer hover:bg-accent",
                        value === item.id && "bg-accent"
                      )}
                      onClick={() => {
                        onChange(item.id);
                        setShowBoardLinkDialog(false);
                        setBoardLinkSearch('');
                      }}
                    >
                      <div className="font-medium">
                        {Object.values(item.data)[0] || 'רשומה ללא שם'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Object.entries(item.data).slice(1, 3).map(([key, val]) => 
                          `${key}: ${val}`
                        ).join(' • ')}
                      </div>
                    </Card>
                  ))}
                </div>
                
                {boardLinkSearch.trim() && filteredItems.length === 0 && (
                  <Button 
                    onClick={handleCreateNewRecord}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    צור רשומה חדשה: "{boardLinkSearch}"
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  const renderField = () => {
    switch (column.column_type) {
      case 'text':
        return renderTextField();
      case 'number':
        return renderNumberField();
      case 'date':
        return renderDateField();
      case 'single_select':
      case 'status':
        return renderSingleSelectField();
      case 'multi_select':
        return renderMultiSelectField();
      case 'file':
        return renderFileField();
      case 'image':
        return renderImageField();
      case 'board_link':
        return renderBoardLinkField();
      default:
        return renderTextField();
    }
  };

  return (
    <div className="space-y-1">
      {renderField()}
    </div>
  );
};

export default FieldRenderer;
