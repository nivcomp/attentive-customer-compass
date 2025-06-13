
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";
import { DynamicBoardItem, DynamicBoardColumn } from "@/api/dynamicBoard";

interface DynamicBoardCardsViewProps {
  items: DynamicBoardItem[];
  columns: DynamicBoardColumn[];
  onEditItem?: (item: DynamicBoardItem) => void;
  onDeleteItem?: (item: DynamicBoardItem) => void;
}

const DynamicBoardCardsView = ({ 
  items, 
  columns, 
  onEditItem, 
  onDeleteItem 
}: DynamicBoardCardsViewProps) => {
  const formatFieldValue = (value: any, columnType: string) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground text-sm">לא מוגדר</span>;
    }

    switch (columnType) {
      case 'date':
        try {
          return new Date(value).toLocaleDateString('he-IL');
        } catch {
          return value;
        }
      case 'number':
        return typeof value === 'number' ? value.toLocaleString('he-IL') : value;
      case 'single_select':
      case 'multi_select':
        if (Array.isArray(value)) {
          return value.map((v, index) => (
            <Badge key={index} variant="outline" className="mr-1">
              {v}
            </Badge>
          ));
        }
        return <Badge variant="outline">{value}</Badge>;
      case 'status':
        const statusColors: Record<string, string> = {
          'new': 'bg-blue-100 text-blue-800',
          'in_progress': 'bg-yellow-100 text-yellow-800',
          'completed': 'bg-green-100 text-green-800',
          'cancelled': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={statusColors[value] || 'bg-gray-100 text-gray-800'}>
            {value}
          </Badge>
        );
      default:
        return value;
    }
  };

  const getCardTitle = (item: DynamicBoardItem) => {
    // נחפש את העמודה הראשונה מסוג טקסט לכותרת
    const titleColumn = columns.find(col => col.column_type === 'text');
    if (titleColumn && item.data[titleColumn.id]) {
      return item.data[titleColumn.id];
    }
    
    // אם אין, ניקח את הערך הראשון שיש
    const firstValue = Object.values(item.data)[0];
    return firstValue || `פריט #${item.id.slice(0, 8)}`;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <div className="text-lg mb-2">אין פריטים להצגה</div>
          <div className="text-sm">הוסף פריטים חדשים כדי לראות אותם כאן</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base line-clamp-2">
                {getCardTitle(item)}
              </CardTitle>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEditItem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditItem(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                {onDeleteItem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteItem(item)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {columns.slice(0, 4).map((column) => {
              const value = item.data[column.id];
              if (!value && value !== 0) return null;
              
              return (
                <div key={column.id} className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    {column.name}
                  </div>
                  <div className="text-sm">
                    {formatFieldValue(value, column.column_type)}
                  </div>
                </div>
              );
            })}
            
            <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(item.created_at).toLocaleDateString('he-IL')}
              </div>
              {columns.length > 4 && (
                <div>+{columns.length - 4} שדות נוספים</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DynamicBoardCardsView;
