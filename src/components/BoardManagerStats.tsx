
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, Settings, Eye, Plus } from "lucide-react";

interface BoardManagerStatsProps {
  totalBoards: number;
  regularBoardsCount: number;
  dynamicBoardsCount: number;
  customBoardsCount: number;
}

const BoardManagerStats = ({ 
  totalBoards, 
  regularBoardsCount, 
  dynamicBoardsCount, 
  customBoardsCount 
}: BoardManagerStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">סה"כ בורדים</p>
              <p className="text-xl font-bold">{totalBoards}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">בורדים רגילים</p>
              <p className="text-xl font-bold">{regularBoardsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">בורדים דינמיים</p>
              <p className="text-xl font-bold">{dynamicBoardsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">בורדים מותאמים</p>
              <p className="text-xl font-bold">{customBoardsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardManagerStats;
