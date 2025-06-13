
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  Filter,
  BarChart3,
  Target,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import DashboardStats from "@/components/DashboardStats";
import ClientsList from "@/components/ClientsList";
import SalesOpportunities from "@/components/SalesOpportunities";
import BoardBuilder from "@/components/BoardBuilder";

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                מערכת CRM מתקדמת
              </h1>
              <p className="text-lg text-muted-foreground">
                נהל את הלקוחות והמכירות שלך בצורה חכמה ויעילה
              </p>
            </div>
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    לקוחות אחרונים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "יוסי כהן", company: "טכנולוגיות מתקדמות", status: "חם", lastContact: "היום" },
                      { name: "רחל לוי", company: "חברת השקעות", status: "פושר", lastContact: "אתמול" },
                      { name: "דוד אברהם", company: "סטארט-אפ חדש", status: "קר", lastContact: "לפני 3 ימים" }
                    ].map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.company}</div>
                        </div>
                        <div className="text-left">
                          <Badge variant={
                            client.status === 'חם' ? 'default' : 
                            client.status === 'פושר' ? 'secondary' : 'outline'
                          }>
                            {client.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">{client.lastContact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600" />
                    הזדמנויות פעילות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "עסקת תוכנה", amount: "50,000 ₪", probability: "85%", stage: "משא ומתן" },
                      { title: "פרויקט אינטגרציה", amount: "120,000 ₪", probability: "60%", stage: "הצעת מחיר" },
                      { title: "חוזה שירותים", amount: "30,000 ₪", probability: "40%", stage: "בדיקת צרכים" }
                    ].map((opportunity, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{opportunity.title}</div>
                          <div className="text-sm font-bold text-emerald-600">{opportunity.amount}</div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{opportunity.stage}</span>
                          <Badge variant="outline">{opportunity.probability}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'clients':
        return <ClientsList />;
      case 'sales':
        return <SalesOpportunities />;
      case 'boards':
        return <BoardBuilder />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
