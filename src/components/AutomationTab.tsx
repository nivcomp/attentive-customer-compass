
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Workflow, 
  Activity, 
  BarChart3,
  Play,
  Pause,
  Settings
} from "lucide-react";
import AutomationManager from './AutomationManager';
import WorkflowTemplates from './WorkflowTemplates';

interface AutomationTabProps {
  boardId: string;
  boardName: string;
}

const AutomationTab: React.FC<AutomationTabProps> = ({ boardId, boardName }) => {
  const [activeTab, setActiveTab] = useState('automations');

  const handleApplyTemplate = (template: any) => {
    console.log('Applying template:', template);
    // Here we would implement the logic to apply the template to the board
    // This would involve creating the necessary columns, statuses, and automations
  };

  const stats = [
    {
      title: 'אוטומציות פעילות',
      value: '3',
      change: '+2 השבוע',
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      title: 'ביצועים השבוע',
      value: '47',
      change: '+15%',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'זמן חסכון',
      value: '2.5h',
      change: 'יומיים',
      icon: BarChart3,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            אוטומציות
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            תבניות
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            דוחות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="space-y-4">
          <AutomationManager boardId={boardId} boardName={boardName} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <WorkflowTemplates 
            boardId={boardId} 
            onApplyTemplate={handleApplyTemplate}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                ניתוח ביצועי אוטומציות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">דוחות יתווספו בקרוב</h3>
                <p className="text-sm text-gray-500">
                  נוכל לעקוב אחר ביצועי האוטומציות ולקבל תובנות
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationTab;
