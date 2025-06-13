
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTopBarSettings } from "@/hooks/useTopBarSettings";
import BoardCreator from "./BoardCreator";
import TopBarCustomizer from "./TopBarCustomizer";

const CustomizableNavigation = () => {
  const { visibleTabs } = useTopBarSettings();
  const [showBoardCreator, setShowBoardCreator] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

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
                {visibleTabs.map((tab) => {
                  const IconComponent = getIconComponent(tab.icon);
                  
                  return (
                    <div key={tab.id} className="flex items-center">
                      <NavLink
                        to={tab.to}
                        className={({ isActive }) =>
                          `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`
                        }
                      >
                        <IconComponent className="h-4 w-4 ml-2" />
                        <span>{tab.label}</span>
                        {tab.recordCount && (
                          <Badge variant="secondary" className="mr-2 text-xs">
                            {tab.recordCount}
                          </Badge>
                        )}
                      </NavLink>
                      {tab.showNewBoard && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowBoardCreator(true)}
                          className="ml-2 h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          title={`צור בורד חדש עבור ${tab.label}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* כפתור התאמת סרגל */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomizer(true)}
                className="text-gray-500 hover:text-gray-700"
                title="התאם סרגל ניווט"
              >
                <Settings className="h-4 w-4 ml-1" />
                התאם סרגל
              </Button>
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

      {/* TopBar Customizer Modal */}
      <TopBarCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
      />
    </>
  );
};

export default CustomizableNavigation;
