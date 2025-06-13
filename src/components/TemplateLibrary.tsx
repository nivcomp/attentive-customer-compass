
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Users, Download, Eye, Trash2, Plus } from "lucide-react";
import { useBoardTemplates } from "@/hooks/useBoardTemplates";
import { BoardTemplate } from "@/api/boardTemplates";
import TemplateCreator from "./TemplateCreator";
import TemplatePreview from "./TemplatePreview";

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect?: (template: BoardTemplate) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  isOpen,
  onClose,
  onTemplateSelect
}) => {
  const { templates, loading, deleteTemplate, useTemplate } = useBoardTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreator, setShowCreator] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<BoardTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('browse');

  const categories = [
    { value: 'all', label: 'הכל' },
    { value: 'crm', label: 'CRM' },
    { value: 'sales', label: 'מכירות' },
    { value: 'support', label: 'תמיכה' },
    { value: 'marketing', label: 'שיווק' },
    { value: 'project', label: 'פרויקטים' },
    { value: 'hr', label: 'משאבי אנוש' },
    { value: 'custom', label: 'מותאם אישית' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (template: BoardTemplate) => {
    await useTemplate(template.id);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      crm: 'bg-blue-100 text-blue-800',
      sales: 'bg-green-100 text-green-800',
      support: 'bg-purple-100 text-purple-800',
      marketing: 'bg-orange-100 text-orange-800',
      project: 'bg-red-100 text-red-800',
      hr: 'bg-yellow-100 text-yellow-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">טוען תבניות...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">ספריית תבניות</DialogTitle>
            <DialogDescription>
              בחר תבנית מוכנה או צור תבנית חדשה מהבורדים הקיימים שלך
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">עיון בתבניות</TabsTrigger>
              <TabsTrigger value="create">יצירת תבנית</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="חפש תבניות..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium line-clamp-1">
                            {template.name}
                          </CardTitle>
                          {template.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {template.description}
                            </p>
                          )}
                        </div>
                        <Badge className={`text-xs shrink-0 ${getCategoryColor(template.category)}`}>
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>{template.usage_count} שימושים</span>
                          </div>
                          {template.is_public && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              פומבי
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            השתמש
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setPreviewTemplate(template)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {!template.is_public && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm(`האם למחוק את התבנית "${template.name}"?`)) {
                                  deleteTemplate(template.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <Card className="p-8 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      לא נמצאו תבניות
                    </h3>
                    <p className="text-gray-500 text-sm">
                      נסה לשנות את הפילטרים או צור תבנית חדשה
                    </p>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="create">
              <TemplateCreator onClose={() => setActiveTab('browse')} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => {
            handleUseTemplate(previewTemplate);
            setPreviewTemplate(null);
          }}
        />
      )}
    </>
  );
};

export default TemplateLibrary;
