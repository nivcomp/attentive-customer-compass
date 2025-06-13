
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Users, Settings } from "lucide-react";
import { Board } from "@/api/boards";

interface RegularBoardsListProps {
  boards: Board[];
  selectedBoardForPermissions: string | null;
  onTogglePermissions: (boardId: string) => void;
}

const RegularBoardsList = ({ 
  boards, 
  selectedBoardForPermissions, 
  onTogglePermissions 
}: RegularBoardsListProps) => {
  if (boards.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        בורדים עם מערכת הרשאות
        <Badge variant="outline" className="text-xs">
          {boards.length} בורדים
        </Badge>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Card key={board.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium">
                    {board.name}
                  </CardTitle>
                  {board.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {board.description}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={board.visibility === 'private' ? 'outline' : 
                          board.visibility === 'organization' ? 'default' : 'secondary'}
                  className="text-xs shrink-0"
                >
                  {board.visibility === 'private' ? 'פרטי' :
                   board.visibility === 'organization' ? 'ארגוני' : 'מותאם אישית'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  <p>נוצר: {new Date(board.created_at).toLocaleDateString('he-IL')}</p>
                  <p>עודכן: {new Date(board.updated_at).toLocaleDateString('he-IL')}</p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        console.log('View board:', board.id);
                      }}
                    >
                      <Eye className="h-3 w-3 ml-1" />
                      צפה
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        onTogglePermissions(
                          selectedBoardForPermissions === board.id ? '' : board.id
                        );
                      }}
                    >
                      <Users className="h-3 w-3 ml-1" />
                      הרשאות
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('Edit board settings:', board.id);
                    }}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegularBoardsList;
