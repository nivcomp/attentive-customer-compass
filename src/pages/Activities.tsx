
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Clock } from "lucide-react";

const Activities = () => {
  const activities = [
    { id: 1, title: 'שיחה עם לקוח', type: 'call', status: 'completed', date: '2024-06-13', time: '10:00' },
    { id: 2, title: 'פגישת מכירות', type: 'meeting', status: 'scheduled', date: '2024-06-14', time: '14:30' },
    { id: 3, title: 'מעקב אחר הצעה', type: 'followup', status: 'pending', date: '2024-06-15', time: '09:00' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">פעילויות</h1>
        <p className="text-gray-600 mt-2">מעקב אחר כל הפעילויות והמשימות</p>
      </div>

      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{activity.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {activity.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status === 'completed' && 'הושלם'}
                  {activity.status === 'scheduled' && 'מתוזמן'}
                  {activity.status === 'pending' && 'ממתין'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Activities;
