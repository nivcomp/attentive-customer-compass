
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Building2, Layers } from "lucide-react";

interface BoardManagerStatsProps {
  totalBoards: number;
  regularBoardsCount: number;
  dynamicBoardsCount: number;
  customBoardsCount: number;
}

const BoardManagerStats = React.memo<BoardManagerStatsProps>(({ 
  totalBoards, 
  regularBoardsCount, 
  dynamicBoardsCount, 
  customBoardsCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">סה"כ בורדים</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBoards}</div>
          <p className="text-xs text-muted-foreground">
            כל הבורדים במערכת
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">בורדים רגילים</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{regularBoardsCount}</div>
          <p className="text-xs text-muted-foreground">
            בורדים סטנדרטיים
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">בורדים דינמיים</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dynamicBoardsCount}</div>
          <p className="text-xs text-muted-foreground">
            בורדים מתקדמים
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">בורדים מותאמים</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customBoardsCount}</div>
          <p className="text-xs text-muted-foreground">
            בורדים מקומיים
          </p>
        </CardContent>
      </Card>
    </div>
  );
});

BoardManagerStats.displayName = 'BoardManagerStats';

export default BoardManagerStats;
