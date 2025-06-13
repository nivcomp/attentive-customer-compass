
import React from 'react';
import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";
import { DynamicBoardColumn } from "@/api/dynamicBoard";

interface TableHeaderProps {
  columns: DynamicBoardColumn[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
    <ShadcnTableHeader>
      <TableRow>
        {columns.map(column => (
          <TableHead key={column.id} className="relative group">
            <div className="flex items-center justify-between">
              <span>{column.name}</span>
            </div>
          </TableHead>
        ))}
        <TableHead className="w-24">פעולות</TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
};

export default TableHeader;
