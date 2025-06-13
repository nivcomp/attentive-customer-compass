
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp } from "lucide-react";

const Deals = () => {
  const deals = [
    { id: 1, title: 'עסקת שירותי ייעוץ', value: 50000, stage: 'proposal', progress: 60, client: 'חברת ABC' },
    { id: 2, title: 'מכירת מערכת CRM', value: 120000, stage: 'negotiation', progress: 80, client: 'חברת XYZ' },
    { id: 3, title: 'פרויקט פיתוח', value: 75000, stage: 'qualified', progress: 40, client: 'סטארט-אפ חדש' },
  ];

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'proposal': return 'הצעה';
      case 'negotiation': return 'משא ומתן';
      case 'qualified': return 'מוקדם';
      default: return stage;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">עסקאות</h1>
        <p className="text-gray-600 mt-2">ניהול צינור המכירות והעסקאות</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">סך הכל עסקאות</p>
                <p className="text-2xl font-bold">₪{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">מספר עסקאות</p>
                <p className="text-2xl font-bold">{deals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">שיעור הצלחה ממוצע</p>
              <p className="text-2xl font-bold">60%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{deal.title}</h3>
                  <p className="text-gray-600">{deal.client}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-green-600">₪{deal.value.toLocaleString()}</p>
                  <Badge className={getStageColor(deal.stage)}>
                    {getStageLabel(deal.stage)}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>התקדמות</span>
                  <span>{deal.progress}%</span>
                </div>
                <Progress value={deal.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Deals;
