
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Plus, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DynamicBoardItem, DynamicBoardColumn } from "@/api/dynamicBoard";

interface DynamicBoardTableViewProps {
  items: DynamicBoardItem[];
  columns: DynamicBoardColumn[];
  loading?: boolean;
  onEditItem?: (item: DynamicBoardItem) => void;
  onDeleteItem?: (item: DynamicBoardItem) => void;
  onAddItem?: () => void;
}

const DynamicBoardTableView = ({
  items,
  columns,
  loading = false,
  onEditItem,
  onDeleteItem,
  onAddItem
}: DynamicBoardTableViewProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const toggleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const formatFieldValue = (value: any, columnType: string) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground text-sm">—</span>;
    }

    switch (columnType) {
      case 'date':
        try {
          return (
            <span className="text-sm">
              {new Date(value).toLocaleDateString('he-IL')}
            </span>
          );
        } catch {
          return value;
        }
      case 'number':
        return (
          <span className="text-sm font-mono">
            {typeof value === 'number' ? value.toLocaleString('he-IL') : value}
          </span>
        );
      case 'single_select':
      case 'multi_select':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((v, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {v}
                </Badge>
              ))}
            </div>
          );
        }
        return <Badge variant="secondary" className="text-xs">{value}</Badge>;
      case 'status':
        const statusColors: Record<string, string> = {
          'new': 'bg-blue-50 text-blue-700 border-blue-200',
          'in_progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
          'completed': 'bg-green-50 text-green-700 border-green-200',
          'cancelled': 'bg-red-50 text-red-700 border-red-200'
        };
        return (
          <Badge 
            variant="outline" 
            className={`text-xs ${statusColors[value] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
          >
            {value}
          </Badge>
        );
      default:
        return <span className="text-sm">{value}</span>;
    }
  };

  const LoadingRow = () => (
    <TableRow className="animate-pulse">
      <TableCell className="w-12">
        <Skeleton className="h-4 w-4 rounded" />
      </TableCell>
      {columns.map((column) => (
        <TableCell key={column.id}>
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </TableCell>
      ))}
      <TableCell className="w-20">
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b">
              <TableHead className="w-12 p-4">
                <Skeleton className="h-4 w-4 rounded" />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.id} className="p-4">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
              <TableHead className="w-20 p-4">
                <Skeleton className="h-4 w-12" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <LoadingRow key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-12 text-center">
          <div className="text-muted-foreground mb-4">
            <div className="text-lg mb-2">אין נתונים להצגה</div>
            <div className="text-sm">הוסף פריטים חדשים כדי לראות אותם בטבלה</div>
          </div>
          {onAddItem && (
            <Button onClick={onAddItem} className="mt-4">
              <Plus className="h-4 w-4 ml-2" />
              הוסף פריט ראשון
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      {selectedItems.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
          <div className="text-sm text-blue-700">
            {selectedItems.size} פריטים נבחרו
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              עריכה קבוצתית
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              מחיקה
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b hover:bg-gray-50/70 transition-colors">
              <TableHead className="w-12 p-4">
                <Checkbox
                  checked={selectedItems.size === items.length && items.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="בחר הכל"
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead 
                  key={column.id} 
                  className="p-4 font-medium text-gray-700"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(column.id)}
                    className="h-auto p-0 hover:bg-transparent hover:text-gray-900 transition-colors"
                  >
                    <span className="text-sm">{column.name}</span>
                    <ArrowUpDown className="h-3 w-3 mr-2 opacity-50" />
                  </Button>
                </TableHead>
              ))}
              <TableHead className="w-20 p-4 text-center">
                <span className="text-sm text-gray-500">פעולות</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow 
                key={item.id}
                className="border-b hover:bg-gray-50/50 transition-colors group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="p-4">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                    aria-label={`בחר פריט ${item.id}`}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id} className="p-4 max-w-[200px]">
                    <div className="truncate">
                      {formatFieldValue(item.data[column.id], column.column_type)}
                    </div>
                  </TableCell>
                ))}
                <TableCell className="p-4">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEditItem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditItem(item)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="ערוך"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {onDeleteItem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteItem(item)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="מחק"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add New Item */}
      {onAddItem && (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
          <Button
            variant="ghost"
            onClick={onAddItem}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4 ml-2" />
            הוסף שורה חדשה
          </Button>
        </div>
      )}
    </div>
  );
};

export default DynamicBoardTableView;
