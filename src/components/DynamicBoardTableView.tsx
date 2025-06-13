
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { DynamicBoardColumn, DynamicBoardItem } from "@/api/dynamicBoard";
import TableHeader from "./TableHeader";
import TableRowComponent from "./TableRowComponent";
import EmptyStates from "./EmptyStates";

interface DynamicBoardTableViewProps {
  items: DynamicBoardItem[];
  columns: DynamicBoardColumn[];
  loading: boolean;
  onEditItem: (item: DynamicBoardItem) => void;
  onDeleteItem: (item: DynamicBoardItem) => void;
  onAddItem: () => void;
}

const DynamicBoardTableView: React.FC<DynamicBoardTableViewProps> = ({ 
  items, 
  columns, 
  loading, 
  onEditItem, 
  onDeleteItem, 
  onAddItem 
}) => {
  const [editingItem, setEditingItem] = useState<DynamicBoardItem | null>(null);

  const handleFieldChange = (item: DynamicBoardItem, columnName: string, value: any) => {
    if (item === editingItem) {
      setEditingItem({
        ...editingItem,
        data: { ...editingItem.data, [columnName]: value }
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      onEditItem(editingItem);
      setEditingItem(null);
    }
  };

  if (loading) {
    return <EmptyStates type="loading" />;
  }

  return (
    <div className="space-y-6">
      {/* הודעה כשאין עמודות */}
      {columns.length === 0 && <EmptyStates type="no-columns" />}

      {/* טבלת הנתונים */}
      {columns.length > 0 && (
        <Card>
          <Table>
            <TableHeader columns={columns} />
            <TableBody>
              {items.map(item => (
                <TableRowComponent
                  key={item.id}
                  item={item}
                  columns={columns}
                  isEditing={editingItem?.id === item.id}
                  onFieldChange={(columnName, value) => handleFieldChange(item, columnName, value)}
                  onEdit={() => setEditingItem(item)}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingItem(null)}
                  onDelete={() => onDeleteItem(item)}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* הודעה כשאין נתונים */}
      {columns.length > 0 && items.length === 0 && (
        <EmptyStates type="no-items" onAddItem={onAddItem} />
      )}
    </div>
  );
};

export default DynamicBoardTableView;
