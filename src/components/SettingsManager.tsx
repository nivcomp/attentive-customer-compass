
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, RotateCcw, Eye, Trash2, Plus } from "lucide-react";
import { useBoardSettings, PersonalView } from "@/hooks/useBoardSettings";
import { useToast } from "@/hooks/use-toast";

interface SettingsManagerProps {
  boardId: string | null;
}

const SettingsManager = ({ boardId }: SettingsManagerProps) => {
  const { settings, personalViews, saveAsPersonalView, loadPersonalView, deletePersonalView, resetSettings } = useBoardSettings(boardId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [isSaveViewDialogOpen, setIsSaveViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSavePersonalView = () => {
    if (!newViewName.trim()) {
      toast({
        title: "שגיאה",
        description: "יש להזין שם לתצוגה",
        variant: "destructive",
      });
      return;
    }

    const result = saveAsPersonalView(newViewName.trim());
    if (result) {
      toast({
        title: "הצלחה",
        description: "התצוגה האישית נשמרה בהצלחה",
      });
      setNewViewName('');
      setIsSaveViewDialogOpen(false);
    } else {
      toast({
        title: "שגיאה",
        description: "לא ניתן לשמור את התצוגה",
        variant: "destructive",
      });
    }
  };

  const handleLoadPersonalView = (view: PersonalView) => {
    loadPersonalView(view.id);
    toast({
      title: "הצלחה",
      description: `התצוגה "${view.name}" נטענה בהצלחה`,
    });
    setIsDialogOpen(false);
  };

  const handleDeletePersonalView = (view: PersonalView) => {
    deletePersonalView(view.id);
    toast({
      title: "הצלחה",
      description: `התצוגה "${view.name}" נמחקה בהצלחה`,
    });
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "הצלחה",
      description: "ההגדרות אופסו לברירת המחדל",
    });
  };

  if (!boardId || !settings) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* כפתור שמירת תצוגה אישית */}
      <Dialog open={isSaveViewDialogOpen} onOpenChange={setIsSaveViewDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 ml-2" />
            שמור כתצוגה אישית
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>שמירת תצוגה אישית</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">שם התצוגה</label>
              <Input
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="הזן שם לתצוגה..."
                className="mt-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSavePersonalView();
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsSaveViewDialogOpen(false)}>
                ביטול
              </Button>
              <Button onClick={handleSavePersonalView}>
                <Save className="h-4 w-4 ml-2" />
                שמור
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* כפתור ניהול הגדרות */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 ml-2" />
            הגדרות
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ניהול הגדרות בורד</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* הגדרות נוכחיות */}
            <div>
              <h3 className="text-lg font-semibold mb-3">הגדרות נוכחיות</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>תצוגה נבחרת:</span>
                  <Badge variant="outline">{settings.selectedView}</Badge>
                </div>
                {settings.searchQuery && (
                  <div className="flex justify-between">
                    <span>חיפוש:</span>
                    <Badge variant="outline">{settings.searchQuery}</Badge>
                  </div>
                )}
                {settings.visibleColumns && (
                  <div className="flex justify-between">
                    <span>עמודות מוצגות:</span>
                    <Badge variant="outline">{settings.visibleColumns.length}</Badge>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <Button variant="outline" onClick={handleResetSettings}>
                  <RotateCcw className="h-4 w-4 ml-2" />
                  איפוס לברירת מחדל
                </Button>
              </div>
            </div>

            <Separator />

            {/* תצוגות אישיות */}
            <div>
              <h3 className="text-lg font-semibold mb-3">תצוגות אישיות</h3>
              
              {personalViews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-sm">אין תצוגות אישיות שמורות</div>
                  <div className="text-xs mt-1">שמור את התצוגה הנוכחית כתצוגה אישית</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {personalViews.map((view) => (
                    <Card key={view.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{view.name}</div>
                          <div className="text-xs text-muted-foreground">
                            נוצר: {new Date(view.createdAt).toLocaleDateString('he-IL')}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoadPersonalView(view)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePersonalView(view)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsManager;
