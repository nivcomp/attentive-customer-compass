
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  User,
  DollarSign,
  Target,
  Clock,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SalesOpportunities = () => {
  const opportunities = [
    {
      id: 1,
      title: "עסקת תוכנת ניהול",
      client: "טכנולוגיות מתקדמות",
      amount: 85000,
      probability: 85,
      stage: "משא ומתן",
      nextAction: "פגישת חתימה",
      dueDate: "2024-06-20",
      assignedTo: "יוסי מכירות",
      priority: "גבוה"
    },
    {
      id: 2,
      title: "פרויקט אינטגרציה מורכב",
      client: "חברת השקעות ר.ל",
      amount: 120000,
      probability: 60,
      stage: "הצעת מחיר",
      nextAction: "מעקב טלפוני",
      dueDate: "2024-06-25",
      assignedTo: "רחל פיתוח",
      priority: "בינוני"
    },
    {
      id: 3,
      title: "חוזה שירותי תמיכה שנתי",
      client: "סטארט-אפ חדשני",
      amount: 35000,
      probability: 40,
      stage: "בדיקת צרכים",
      nextAction: "הכנת הצעה",
      dueDate: "2024-07-01",
      assignedTo: "דוד תמיכה",
      priority: "נמוך"
    },
    {
      id: 4,
      title: "מערכת CRM מותאמת אישית",
      client: "ייעוץ עסקי מקצועי",
      amount: 95000,
      probability: 75,
      stage: "הדגמה טכנית",
      nextAction: "הדגמה למנהלים",
      dueDate: "2024-06-18",
      assignedTo: "מירי מכירות",
      priority: "גבוה"
    }
  ];

  const getStageColor = (stage: string) => {
    const colors = {
      "ליד חדש": "bg-blue-100 text-blue-800 border-blue-200",
      "בדיקת צרכים": "bg-purple-100 text-purple-800 border-purple-200",
      "הצעת מחיר": "bg-orange-100 text-orange-800 border-orange-200",
      "הדגמה טכנית": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "משא ומתן": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "נסגר בהצלחה": "bg-green-100 text-green-800 border-green-200",
      "נסגר ללא הצלחה": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'גבוה': return 'bg-red-100 text-red-800 border-red-200';
      case 'בינוני': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'נמוך': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const avgProbability = opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            הזדמנויות מכירה
          </h1>
          <p className="text-muted-foreground mt-1">
            נהל ומעקב אחר כל ההזדמנויות הפעילות
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
          <Plus className="h-4 w-4" />
          הזדמנות חדשה
        </Button>
      </div>

      {/* סטטיסטיקות כלליות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ערך כולל
            </CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪ {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              מ-{opportunities.length} הזדמנויות פעילות
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סיכוי ממוצע
            </CardTitle>
            <Target className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgProbability)}%</div>
            <Progress value={avgProbability} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              צפוי להסגר השבוע
            </CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              עסקאות דורשות מעקב
            </p>
          </CardContent>
        </Card>
      </div>

      {/* רשימת הזדמנויות */}
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{opportunity.title}</h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {opportunity.client}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStageColor(opportunity.stage)}>
                        {opportunity.stage}
                      </Badge>
                      <Badge className={getPriorityColor(opportunity.priority)}>
                        {opportunity.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold">₪ {opportunity.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>{opportunity.probability}% סיכוי</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span>{new Date(opportunity.dueDate).toLocaleDateString('he-IL')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-orange-600" />
                      <span>{opportunity.assignedTo}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">פעולה הבאה:</span>
                    <span className="font-medium">{opportunity.nextAction}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>התקדמות</span>
                      <span>{opportunity.probability}%</span>
                    </div>
                    <Progress value={opportunity.probability} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>ערוך הזדמנות</DropdownMenuItem>
                      <DropdownMenuItem>עדכן שלב</DropdownMenuItem>
                      <DropdownMenuItem>הוסף פעילות</DropdownMenuItem>
                      <DropdownMenuItem>שלח הצעה</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        סגור הזדמנות
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SalesOpportunities;
