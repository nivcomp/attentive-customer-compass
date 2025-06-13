
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Activity, DollarSign, Settings, BarChart3, Workflow, Layers } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'דף הבית' },
    { to: '/customers', icon: Users, label: 'לקוחות' },
    { to: '/activities', icon: Activity, label: 'פעילויות' },
    { to: '/deals', icon: DollarSign, label: 'עסקאות' },
    { to: '/board-builder', icon: Layers, label: 'בונה לוחות' },
    { to: '/dynamic-boards', icon: BarChart3, label: 'בורדים דינמיים' },
    { to: '/automations', icon: Workflow, label: 'אוטומציות' },
    { to: '/settings', icon: Settings, label: 'הגדרות' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8 rtl:space-x-reverse">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 ml-2" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
