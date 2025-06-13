
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, MoreHorizontal } from "lucide-react";
import { DynamicBoard, DynamicBoardColumn, DynamicBoardItem } from "@/api/dynamicBoard";
import { BoardGroup } from "@/types/boardGroups";
import EmptyStates from "./EmptyStates";

interface GroupedBoardViewProps {
  group: BoardGroup;
  boards: DynamicBoard[];
  boardsData: Record<string, {
    columns: DynamicBoardColumn[];
    items: DynamicBoardItem[];
    loading: boolean;
  }>;
  onShowAllBoard: (boardId: string) => void;
}

const GroupedBoardView: React.FC<GroupedBoardViewProps> = ({
  group,
  boards,
  boardsData,
  onShowAllBoard
}) => {
  const getShortTablePreview = (columns: DynamicBoardColumn[], items: DynamicBoardItem[], limit = 5) => {
    const limitedItems = items.slice(0, limit);
    const visibleColumns = columns.slice(0, 4); // מציג מקסימום 4 עמודות

    if (limitedItems.length === 0) {
      return null;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map(column => (
              <TableHead key={column.id} className="text-xs">
                {column.name}
              </TableHead>
            ))}
            {columns.length > 4 && (
              <TableHead className="text-xs">
                <MoreHorizontal className="h-4 w-4" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {limitedItems.map(item => (
            <TableRow key={item.id}>
              {visibleColumns.map(column => (
                <TableCell key={column.id} className="text-xs py-2">
                  {String(item.data[column.name] || '')}
                </TableCell>
              ))}
              {columns.length > 4 && (
                <TableCell className="text-xs py-2">
                  <Badge variant="secondary" className="text-xs">
                    +{columns.length - 4}
                  </Badge>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      {/* כותרת הקבוצה */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h2>
        <p className="text-gray-600">
          {group.boardIds.length} בורדים בקבוצה
        </p>
      </div>

      {/* בורדים בקבוצה */}
      <div className="space-y-8">
        {group.boardIds.map(boardId => {
          const board = boards.find(b => b.id === boardId);
          const data = boardsData[boardId];
          
          if (!board) return null;

          return (
            <Card key={boardId} className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {board.name}
                    </CardTitle>
                    {board.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {board.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {data?.items?.length || 0} פריטים
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => onShowAllBoard(boardId)}
                      className="text-sm"
                    >
                      <Eye className="h-4 w-4 ml-2" />
                      הצג הכל
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {data?.loading ? (
                  <EmptyStates type="loading" />
                ) : data?.columns?.length === 0 ? (
                  <EmptyStates type="no-columns" />
                ) : data?.items?.length === 0 ? (
                  <EmptyStates type="no-items" />
                ) : (
                  <div className="space-y-4">
                    {getShortTablePreview(data.columns, data.items)}
                    
                    {data.items.length > 5 && (
                      <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                          מציג 5 מתוך {data.items.length} פריטים
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GroupedBoardView;
