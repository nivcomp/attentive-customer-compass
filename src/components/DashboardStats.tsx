
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calendar,
  Phone
} from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "סך לקוחות",
      value: "247",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "הזדמנויות פעילות",
      value: "18",
      change: "+23%",
      changeType: "positive",
      icon: Target,
      color: "text-emerald-600"
    },
    {
      title: "הכנסות חודשיות",
      value: "₪ 145,600",
      change: "+8%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "שיחות השבוע",
      value: "34",
      change: "-5%",
      changeType: "negative",
      icon: Phone,
      color: "text-purple-600"
    },
    {
      title: "פגישות מתוכננות",
      value: "12",
      change: "ללא שינוי",
      changeType: "neutral",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "קצב המרה",
      value: "68%",
      change: "+15%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-cyan-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className={`text-xs flex items-center gap-1 ${
                stat.changeType === 'positive' ? 'text-green-600' :
                stat.changeType === 'negative' ? 'text-red-600' :
                'text-muted-foreground'
              }`}>
                {stat.changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                {stat.change}
                {stat.changeType !== 'neutral' && <span className="text-muted-foreground">מהחודש הקודם</span>}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
