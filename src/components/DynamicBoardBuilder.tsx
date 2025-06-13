
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Layout, FileText } from "lucide-react";
import DynamicBoardsList from './DynamicBoardsList';
import BoardTypeSelector from './BoardTypeSelector';
import TemplateLibrary from './TemplateLibrary';

const DynamicBoardBuilder = () => {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">בורדים דינמיים</h1>
          <p className="text-gray-600 mt-1">צור וערוך בורדים מותאמים לצרכים שלך</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowTemplateLibrary(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            ספריית תבניות
          </Button>
          <Button onClick={() => setShowTypeSelector(true)}>
            <Plus className="h-4 w-4 mr-2" />
            בורד חדש
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">בורדים פעילים</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 השבוע
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">רשומות</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +180 השבוע
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">תבניות בשימוש</CardTitle>
            <Badge className="bg-green-100 text-green-800">
              פעיל
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              מתוך 15 זמינות
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Boards List */}
      <DynamicBoardsList />

      {/* Modals */}
      <BoardTypeSelector 
        isOpen={showTypeSelector}
        onClose={() => setShowTypeSelector(false)}
      />
      
      <TemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
      />
    </div>
  );
};

export default DynamicBoardBuilder;
