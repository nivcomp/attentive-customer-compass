
import { Home, Users, Activity, DollarSign, UserPlus, Settings, Building2, Database, Layout, LayoutDashboard, Building, Cog } from "lucide-react";

export const navItems = [
  {
    title: "דף הבית",
    to: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Dashboard ארגוני",
    to: "/org-dashboard",
    icon: <Building className="h-4 w-4" />,
  },
  {
    title: "הגדרות ארגון",
    to: "/org-settings",
    icon: <Cog className="h-4 w-4" />,
  },
  {
    title: "אנשי קשר",
    to: "/contacts",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "פעילויות",
    to: "/activities",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    title: "עסקאות",
    to: "/deals",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "לידים",
    to: "/leads",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    title: "ניהול בורדים",
    to: "/board-management",
    icon: <Layout className="h-4 w-4" />,
  },
  {
    title: "בורדים דינמיים",
    to: "/dynamic-boards",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "ארגונים",
    to: "/organizations",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    title: "דיירים",
    to: "/tenants", 
    icon: <Database className="h-4 w-4" />,
  },
  {
    title: "הגדרות",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];
