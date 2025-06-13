
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, GripVertical, Eye, EyeOff, Edit2, RotateCcw } from "lucide-react";
import { TopBarTab, useTopBarSettings } from "@/hooks/useTopBarSettings";
import * as LucideIcons from 'lucide-react';

interface TopBarCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TopBarCustomizer = ({ isOpen, onClose }: TopBarCustomizerProps) => {
  const { settings, reorderTabs, toggleTabVisibility, renameTab, resetToDefault } = useTopBarSettings();
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderTabs(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleRename = (tabId: string, newName: string) => {
    renameTab(tabId, newName);
    setEditingTab(null);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <LucideIcons.Circle className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            התאם סרגל ניווט
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              גרור לסידור מחדש, הקלק על העין להסתרה/הצגה
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetToDefault}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 ml-1" />
              איפוס
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">טאבי ניווט</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {settings.tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-move hover:bg-muted/50 ${
                    draggedIndex === index ? 'opacity-50' : ''
                  } ${!tab.visible ? 'bg-muted/30' : ''}`}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  
                  <div className="flex items-center gap-2 flex-1">
                    {getIconComponent(tab.icon)}
                    
                    {editingTab === tab.id ? (
                      <Input
                        defaultValue={tab.label}
                        className="h-8 text-sm"
                        onBlur={(e) => handleRename(tab.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(tab.id, e.currentTarget.value);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className={`font-medium ${!tab.visible ? 'text-muted-foreground' : ''}`}>
                        {tab.label}
                      </span>
                    )}

                    {tab.showNewBoard && (
                      <Badge variant="secondary" className="text-xs">
                        בורד חדש
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingTab(editingTab === tab.id ? null : tab.id)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleTabVisibility(tab.id)}
                    >
                      {tab.visible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              סגור
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopBarCustomizer;
