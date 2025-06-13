
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Workflow, 
  Play, 
  Eye, 
  Download,
  Briefcase,
  Users,
  FolderOpen,
  Target
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  template_data: any;
  is_public: boolean;
  created_at: string;
}

interface WorkflowTemplatesProps {
  boardId: string;
  onApplyTemplate: (template: WorkflowTemplate) => void;
}

const WorkflowTemplates: React.FC<WorkflowTemplatesProps> = ({ boardId, onApplyTemplate }) => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPreview, setShowPreview] = useState<WorkflowTemplate | null>(null);
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'הכל', icon: FolderOpen },
    { value: 'sales', label: 'מכירות', icon: Target },
    { value: 'hr', label: 'גיוס', icon: Users },
    { value: 'project', label: 'פרויקטים', icon: Briefcase },
    { value: 'general', label: 'כללי', icon: Workflow }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת התבניות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = async (template: WorkflowTemplate) => {
    try {
      onApplyTemplate(template);
      toast({
        title: "הצלחה",
        description: `התבנית "${template.name}" הוחלה בהצלחה`,
      });
    } catch (error) {
      console.error('Error applying template:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה ביישום התבנית",
        variant: "destructive",
      });
    }
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.icon || Workflow;
  };

  const getCategoryLabel = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.label || category;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Workflow className="h-6 w-6 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold">תבניות תהליכים</h3>
            <p className="text-sm text-gray-600">
              השתמש בתבניות מוכנות להקמת תהליכים
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = getCategoryIcon(template.category);
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(template.category)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
                
                {template.template_data?.steps && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">שלבים:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.template_data.steps.slice(0, 3).map((step: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {step.name}
                        </Badge>
                      ))}
                      {template.template_data.steps.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.template_data.steps.length - 3} עוד
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowPreview(template)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    תצוגה מקדימה
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => applyTemplate(template)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    החל
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Workflow className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">אין תבניות</h3>
            <p className="text-sm text-gray-500">
              לא נמצאו תבניות בקטגוריה שנבחרה
            </p>
          </div>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showPreview && getCategoryIcon(showPreview.category) && 
                React.createElement(getCategoryIcon(showPreview.category), { className: "h-5 w-5" })
              }
              {showPreview?.name}
            </DialogTitle>
          </DialogHeader>
          
          {showPreview && (
            <div className="space-y-4">
              <p className="text-gray-600">{showPreview.description}</p>
              
              {showPreview.template_data?.steps && (
                <div>
                  <h4 className="font-semibold mb-2">שלבי התהליך:</h4>
                  <div className="space-y-2">
                    {showPreview.template_data.steps.map((step: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step.name}</span>
                        {step.status && (
                          <Badge variant="outline" className="text-xs">
                            {step.status}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showPreview.template_data?.automations && (
                <div>
                  <h4 className="font-semibold mb-2">אוטומציות מוכללות:</h4>
                  <div className="space-y-2">
                    {showPreview.template_data.automations.map((automation: any, index: number) => (
                      <div key={index} className="p-3 bg-purple-50 rounded border">
                        <div className="font-medium text-sm">{automation.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          טריגר: {automation.trigger} → פעולה: {automation.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPreview(null)}>
                  סגור
                </Button>
                <Button onClick={() => {
                  applyTemplate(showPreview);
                  setShowPreview(null);
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  החל תבנית
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowTemplates;
