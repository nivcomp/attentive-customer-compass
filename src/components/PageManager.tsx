import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  GripVertical,
  Home,
  Phone,
  Activity,
  DollarSign,
  BarChart3,
  FolderOpen,
  Layers,
  Workflow,
  Settings as SettingsIcon,
  Layout
} from "lucide-react";
import { useTopBarSettings } from "@/hooks/useTopBarSettings";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import PageBoardManager from "./PageBoardManager";

interface PageItem {
  id: string;
  label: string;
  icon: string;
  to: string;
  visible: boolean;
  recordCount?: number;
  showNewBoard?: boolean;
}

const AVAILABLE_ICONS = [
  { name: 'Home', component: Home },
  { name: 'Phone', component: Phone },
  { name: 'Activity', component: Activity },
  { name: 'DollarSign', component: DollarSign },
  { name: 'BarChart3', component: BarChart3 },
  { name: 'FolderOpen', component: FolderOpen },
  { name: 'Layers', component: Layers },
  { name: 'Workflow', component: Workflow },
  { name: 'Settings', component: SettingsIcon },
];

const PageManager = () => {
  const { settings, reorderTabs, toggleTabVisibility, renameTab, resetToDefault } = useTopBarSettings();
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageLabel, setNewPageLabel] = useState('');
  const [newPageIcon, setNewPageIcon] = useState('Home');
  const [selectedPageForBoards, setSelectedPageForBoards] = useState<string | null>(null);

  const handleStartEdit = useCallback((page: PageItem) => {
    setEditingPage(page.id);
    setEditingLabel(page.label);
    setSelectedIcon(page.icon);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingPage && editingLabel.trim()) {
      renameTab(editingPage, editingLabel.trim());
      setEditingPage(null);
      setEditingLabel('');
      setSelectedIcon('');
    }
  }, [editingPage, editingLabel, renameTab]);

  const handleCancelEdit = useCallback(() => {
    setEditingPage(null);
    setEditingLabel('');
    setSelectedIcon('');
  }, []);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    reorderTabs(result.source.index, result.destination.index);
  }, [reorderTabs]);

  const getIconComponent = (iconName: string) => {
    const icon = AVAILABLE_ICONS.find(i => i.name === iconName);
    return icon ? icon.component : Home;
  };

  const handleAddNewPage = useCallback(() => {
    if (newPageLabel.trim()) {
      // כאן נוכל להוסיף לוגיקה להוספת דף חדש
      console.log('Adding new page:', { label: newPageLabel, icon: newPageIcon });
      setShowAddPage(false);
      setNewPageLabel('');
      setNewPageIcon('Home');
    }
  }, [newPageLabel, newPageIcon]);

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-blue-50 to-indigo-50 border-b border-blue-100/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Layout className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            ניהול דפים ובורדים
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddPage(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 ml-2" />
              הוסף דף חדש
            </Button>
            <Button
              onClick={() => resetToDefault()}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              איפוס לברירת מחדל
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 lg:p-8">
        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              ניהול דפים
            </TabsTrigger>
            <TabsTrigger value="boards" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              ניהול בורדים
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            {/* Add New Page Form */}
            {showAddPage && (
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">הוסף דף חדש</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">שם הדף</label>
                      <Input
                        value={newPageLabel}
                        onChange={(e) => setNewPageLabel(e.target.value)}
                        placeholder="הכנס שם דף"
                        className="border-2 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">איקון</label>
                      <div className="grid grid-cols-5 gap-2">
                        {AVAILABLE_ICONS.map((icon) => {
                          const IconComponent = icon.component;
                          return (
                            <button
                              key={icon.name}
                              onClick={() => setNewPageIcon(icon.name)}
                              className={`p-2 rounded-lg border-2 transition-colors ${
                                newPageIcon === icon.name
                                  ? 'border-blue-500 bg-blue-100'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <IconComponent className="h-4 w-4 mx-auto" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddNewPage} disabled={!newPageLabel.trim()}>
                      <Save className="h-4 w-4 ml-2" />
                      שמור דף
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddPage(false)}>
                      <X className="h-4 w-4 ml-2" />
                      ביטול
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pages List */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="pages">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {settings.tabs.map((page, index) => {
                      const IconComponent = getIconComponent(page.icon);
                      
                      return (
                        <Draggable key={page.id} draggableId={page.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                                snapshot.isDragging
                                  ? 'shadow-lg bg-blue-50 border-blue-200'
                                  : 'hover:bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <IconComponent className="h-5 w-5 text-gray-600" />
                                  
                                  {editingPage === page.id ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={editingLabel}
                                        onChange={(e) => setEditingLabel(e.target.value)}
                                        className="w-40 h-8"
                                        autoFocus
                                      />
                                      <div className="flex gap-1">
                                        <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                                          <Save className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="font-medium text-gray-900">{page.label}</div>
                                      <div className="text-sm text-gray-500">{page.to}</div>
                                    </div>
                                  )}
                                </div>
                                
                                {page.recordCount && (
                                  <Badge variant="secondary" className="text-xs">
                                    {page.recordCount}
                                  </Badge>
                                )}
                                
                                {page.showNewBoard && (
                                  <Badge variant="outline" className="text-xs">
                                    בורד חדש
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleTabVisibility(page.id)}
                                  className={page.visible ? 'text-green-600' : 'text-gray-400'}
                                >
                                  {page.visible ? 'מוצג' : 'מוסתר'}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedPageForBoards(selectedPageForBoards === page.id ? null : page.id)}
                                  className="text-blue-600"
                                >
                                  <FolderOpen className="h-4 w-4" />
                                </Button>
                                
                                {editingPage !== page.id && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleStartEdit(page)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Page Boards Management */}
            {selectedPageForBoards && (
              <Card className="mt-6 bg-gradient-to-l from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <PageBoardManager
                    pageId={selectedPageForBoards}
                    pageName={settings.tabs.find(t => t.id === selectedPageForBoards)?.label || 'דף'}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="boards" className="space-y-6">
            <Card className="p-6">
              <div className="text-center text-gray-500 py-8">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">ניהול בורדים כללי</h3>
                <p className="text-sm">כאן ניתן לנהל את כל הבורדים במערכת</p>
                <p className="text-xs mt-2">תכונה זו תפותח בהמשך</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>טיפ:</strong> גרור את הדפים כדי לשנות את הסדר בסרגל העליון. לחץ על אייקון הבורדים כדי לנהל בורדים לכל דף.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageManager;
