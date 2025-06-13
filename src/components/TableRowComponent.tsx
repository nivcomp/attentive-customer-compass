
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { DynamicBoardColumn, DynamicBoardItem } from "@/api/dynamicBoard";
import FieldRenderer from "./FieldRenderer";
import TableActions from "./TableActions";

interface TableRowComponentProps {
  item: DynamicBoardItem;
  columns: DynamicBoardColumn[];
  isEditing: boolean;
  onFieldChange: (columnName: string, value: any) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const TableRowComponent: React.FC<TableRowComponentProps> = ({
  item,
  columns,
  isEditing,
  onFieldChange,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  return (
    <TableRow>
      {columns.map(column => (
        <TableCell key={column.id}>
          <FieldRenderer
            column={column}
            value={item.data[column.name]}
            onChange={(value) => onFieldChange(column.name, value)}
            readOnly={!isEditing}
          />
        </TableCell>
      ))}
      <TableCell>
        <TableActions
          item={item}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default TableRowComponent;
