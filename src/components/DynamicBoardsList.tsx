
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { BOARD_TYPES, BoardType } from "@/api/boardTypes";
import BoardTypeSelector from "./BoardTypeSelector";
import EmptyBoardsState from "./EmptyBoardsState";

const DynamicBoardsList = () => {
  const { boards, loading, deleteBoard } = useDynamicBoards();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | BoardType>('all');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         board.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || board.board_type === filterType;
    return matchesSearch && matchesType;
  });

  const getBoardTypeInfo = (boardType: string) => {
    return BOARD_TYPES[boardType as BoardType] || { label: boardType, icon: '📋' };
  };

  const handleDeleteBoard = async (boardId: string, boardName: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את הבורד "${boardName}"?`)) {
      await deleteBoard(boardId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <>
        <EmptyBoardsState onCreateBoard={() => setShowTypeSelector(true)} />
        <BoardTypeSelector 
          isOpen={showTypeSelector}
          onClose={() => setShowTypeSelector(false)}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">הבורדים שלי</h2>
        <Button onClick={() => setShowTypeSelector(true)}>
          <Plus className="h-4 w-4 mr-2" />
          בורד חדש
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="חפש בורדים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסוגים</SelectItem>
            {Object.entries(BOARD_TYPES).map(([type, config]) => (
              <SelectItem key={type} value={type}>
                {config.icon} {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoards.map((board) => {
          const typeInfo = getBoardTypeInfo(board.board_type);
          return (
            <Card key={board.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{board.name}</CardTitle>
                    {board.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {board.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        צפה
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        ערוך
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteBoard(board.id, board.name)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        מחק
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge className="bg-gray-100 text-gray-800">
                    <span className="mr-1">{typeInfo.icon}</span>
                    {typeInfo.label}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(board.created_at || '').toLocaleDateString('he-IL')}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBoards.length === 0 && boards.length > 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>לא נמצאו בורדים המתאימים לחיפוש</p>
          </div>
        </div>
      )}

      <BoardTypeSelector 
        isOpen={showTypeSelector}
        onClose={() => setShowTypeSelector(false)}
      />
    </div>
  );
};

export default DynamicBoardsList;
