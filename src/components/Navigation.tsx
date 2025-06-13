
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  FileText, 
  Settings,
  Bell
} from "lucide-react";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
    { id: 'clients', label: 'לקוחות', icon: Users },
    { id: 'sales', label: 'מכירות', icon: Target },
    { id: 'reports', label: 'דוחות', icon: FileText },
    { id: 'settings', label: 'הגדרות', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                CRM Pro
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeView === item.id ? "default" : "ghost"}
                    onClick={() => onViewChange(item.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              א
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
