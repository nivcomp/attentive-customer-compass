
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Building, Users } from "lucide-react";
import { Lead } from "@/api/leads";
import { DynamicBoard } from "@/api/dynamicBoard";
import { useLeads } from "@/hooks/useLeads";
import { useDynamicBoardColumns } from "@/hooks/useDynamicBoardColumns";

interface LeadConversionDialogProps {
  lead: Lead;
  boards: DynamicBoard[];
  isOpen: boolean;
  onClose: () => void;
}

const LeadConversionDialog: React.FC<LeadConversionDialogProps> = ({
  lead,
  boards,
  isOpen,
  onClose
}) => {
  const { convertLead, isConverting } = useLeads();
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [conversionData, setConversionData] = useState<Record<string, any>>({});
  
  const { columns } = useDynamicBoardColumns(selectedBoardId || null);

  const handleConvert = () => {
    if (!selectedBoardId) return;

    // Map lead data to the conversion data
    const leadData = {
      name: lead.name,
      source: lead.source,
      rating: lead.rating,
      notes: lead.notes,
      ...conversionData
    };

    convertLead({
      leadId: lead.id,
      targetBoardId: selectedBoardId,
      leadData
    });

    onClose();
  };

  const selectedBoard = boards.find(board => board.id === selectedBoardId);

  const getBoardIcon = (boardName: string) => {
    if (boardName.toLowerCase().includes('company') || boardName.toLowerCase().includes('חברה')) {
      return <Building className="h-4 w-4" />;
    }
    return <Users className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            המרת ליד ללקוח
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">פרטי הליד</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">שם:</span>
                <span className="font-medium mr-2">{lead.name}</span>
              </div>
              <div>
                <span className="text-gray-600">מקור:</span>
                <span className="font-medium mr-2">{lead.source}</span>
              </div>
              {lead.rating && (
                <div>
                  <span className="text-gray-600">דירוג:</span>
                  <span className="font-medium mr-2">{lead.rating}/5</span>
                </div>
              )}
              {lead.notes && (
                <div className="col-span-2">
                  <span className="text-gray-600">הערות:</span>
                  <p className="text-sm mt-1">{lead.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Target Board Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">בחר בורד יעד</label>
            <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
              <SelectTrigger>
                <SelectValue placeholder="בחר בורד להמרה" />
              </SelectTrigger>
              <SelectContent>
                {boards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    <div className="flex items-center gap-2">
                      {getBoardIcon(board.name)}
                      <span>{board.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBoard && (
              <p className="text-xs text-gray-500 mt-1">
                הליד יומר לרשומה חדשה בבורד "{selectedBoard.name}"
              </p>
            )}
          </div>

          {/* Additional Fields */}
          {selectedBoardId && columns.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-3 block">מלא פרטים נוספים</label>
              <div className="space-y-4">
                {columns.slice(0, 4).map((column) => {
                  // Skip fields that we already have from the lead
                  if (['name', 'source', 'rating', 'notes'].includes(column.name.toLowerCase())) {
                    return null;
                  }

                  return (
                    <div key={column.id}>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {column.name}
                        {column.is_required && <span className="text-red-500 mr-1">*</span>}
                      </label>
                      {column.column_type === 'text' && (
                        <Input
                          value={conversionData[column.name] || ''}
                          onChange={(e) => setConversionData({
                            ...conversionData,
                            [column.name]: e.target.value
                          })}
                          placeholder={`הזן ${column.name}`}
                        />
                      )}
                      {column.column_type === 'number' && (
                        <Input
                          type="number"
                          value={conversionData[column.name] || ''}
                          onChange={(e) => setConversionData({
                            ...conversionData,
                            [column.name]: parseFloat(e.target.value) || ''
                          })}
                          placeholder={`הזן ${column.name}`}
                        />
                      )}
                      {column.column_type === 'single_select' && column.options?.options && (
                        <Select
                          value={conversionData[column.name] || ''}
                          onValueChange={(value) => setConversionData({
                            ...conversionData,
                            [column.name]: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`בחר ${column.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {column.options.options.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleConvert}
              disabled={!selectedBoardId || isConverting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isConverting ? 'ממיר...' : 'המר ללקוח'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              ביטול
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadConversionDialog;
