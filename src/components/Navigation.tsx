
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Activity, DollarSign, Settings, BarChart3, Workflow, Layers, Phone, Plus, FolderOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import BoardCreator from "./BoardCreator";

const Navigation = () => {
  const [showBoardCreator, setShowBoardCreator] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'דף הבית' },
    { to: '/contacts', icon: Phone, label: 'אנשי קשר', showNewBoard: true },
    { to: '/activities', icon: Activity, label: 'פעילויות' },
    { to: '/deals', icon: DollarSign, label: 'עסקאות', showNewBoard: true },
    { to: '/dynamic-boards', icon: BarChart3, label: 'בורדים דינמיים' },
    { to: '/board-management', icon: FolderOpen, label: 'ניהול בורדים' },
    { to: '/board-builder', icon: Layers, label: 'בונה לוחות' },
    { to: '/automations', icon: Workflow, label: 'אוטומציות' },
    { to: '/settings', icon: Settings, label: 'הגדרות' },
  ];

  const handleBoardCreated = (boardId: string) => {
    // ניווט לבורד החדש
    window.location.href = `/dynamic-boards?board=${boardId}`;
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex space-x-8 rtl:space-x-reverse">
                {navItems.map(({ to, icon: Icon, label, showNewBoard }) => (
                  <div key={to} className="flex items-center">
                    <NavLink
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
                    {showNewBoard && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBoardCreator(true)}
                        className="ml-2 h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        title={`צור בורד חדש עבור ${label}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* BoardCreator Modal */}
      {showBoardCreator && (
        <BoardCreator
          onClose={() => setShowBoardCreator(false)}
          onBoardCreated={handleBoardCreated}
        />
      )}
    </>
  );
};

export default Navigation;
