
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Activity,
  Clock,
  Target,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Automation {
  id: string;
  board_id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: any;
  action_type: string;
  action_config: any;
  condition_config?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AutomationManagerProps {
  boardId: string;
  boardName: string;
}

const AutomationManager: React.FC<AutomationManagerProps> = ({ boardId, boardName }) => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger_type: '',
    trigger_config: {},
    action_type: '',
    action_config: {},
    condition_config: {}
  });
  const { toast } = useToast();

  const triggerTypes = [
    { value: 'record_created', label: 'רשומה נוצרה' },
    { value: 'field_changed', label: 'שדה השתנה' },
    { value: 'date_reached', label: 'תאריך הגיע' },
    { value: 'record_updated', label: 'רשומה עודכנה' }
  ];

  const actionTypes = [
    { value: 'update_field', label: 'עדכון שדה' },
    { value: 'send_notification', label: 'שליחת התראה' },
    { value: 'create_record', label: 'יצירת רשומה' },
    { value: 'create_task', label: 'יצירת משימה' }
  ];

  useEffect(() => {
    fetchAutomations();
  }, [boardId]);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('board_automations')
        .select('*')
        .eq('board_id', boardId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת האוטומציות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAutomation = async () => {
    try {
      const { data, error } = await supabase
        .from('board_automations')
        .insert([{
          board_id: boardId,
          ...newAutomation
        }])
        .select()
        .single();

      if (error) throw error;

      setAutomations(prev => [data, ...prev]);
      setShowCreateDialog(false);
      setNewAutomation({
        name: '',
        description: '',
        trigger_type: '',
        trigger_config: {},
        action_type: '',
        action_config: {},
        condition_config: {}
      });

      toast({
        title: "הצלחה",
        description: "האוטומציה נוצרה בהצלחה",
      });
    } catch (error) {
      console.error('Error creating automation:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה ביצירת האוטומציה",
        variant: "destructive",
      });
    }
  };

  const toggleAutomation = async (automationId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('board_automations')
        .update({ is_active: !isActive })
        .eq('id', automationId);

      if (error) throw error;

      setAutomations(prev => prev.map(automation => 
        automation.id === automationId 
          ? { ...automation, is_active: !isActive }
          : automation
      ));

      toast({
        title: "הצלחה",
        description: `האוטומציה ${!isActive ? 'הופעלה' : 'הושבתה'} בהצלחה`,
      });
    } catch (error) {
      console.error('Error toggling automation:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בעדכון האוטומציה",
        variant: "destructive",
      });
    }
  };

  const deleteAutomation = async (automationId: string) => {
    try {
      const { error } = await supabase
        .from('board_automations')
        .delete()
        .eq('id', automationId);

      if (error) throw error;

      setAutomations(prev => prev.filter(automation => automation.id !== automationId));
      toast({
        title: "הצלחה",
        description: "האוטומציה נמחקה בהצלחה",
      });
    } catch (error) {
      console.error('Error deleting automation:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה במחיקת האוטומציה",
        variant: "destructive",
      });
    }
  };

  const getTriggerLabel = (triggerType: string) => {
    return triggerTypes.find(t => t.value === triggerType)?.label || triggerType;
  };

  const getActionLabel = (actionType: string) => {
    return actionTypes.find(a => a.value === actionType)?.label || actionType;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <Zap className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">אוטומציות</h3>
            <p className="text-sm text-gray-600">
              אוטמט תהליכים ב{boardName}
            </p>
          </div>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              אוטומציה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>יצירת אוטומציה חדשה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="שם האוטומציה"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
              />
              
              <Textarea
                placeholder="תיאור (אופציונלי)"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, description: e.target.value }))}
              />

              <Select 
                value={newAutomation.trigger_type} 
                onValueChange={(value) => setNewAutomation(prev => ({ ...prev, trigger_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר טריגר" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={newAutomation.action_type} 
                onValueChange={(value) => setNewAutomation(prev => ({ ...prev, action_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר פעולה" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  ביטול
                </Button>
                <Button 
                  onClick={createAutomation}
                  disabled={!newAutomation.name || !newAutomation.trigger_type || !newAutomation.action_type}
                >
                  צור אוטומציה
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {automations.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">אין אוטומציות</h3>
            <p className="text-sm text-gray-500 mb-6">
              צור אוטומציות כדי לייעל את התהליכים שלך
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              צור אוטומציה ראשונה
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {automations.map((automation) => (
            <Card key={automation.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      automation.is_active ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    
                    <div>
                      <h4 className="font-semibold">{automation.name}</h4>
                      {automation.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {automation.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {getTriggerLabel(automation.trigger_type)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Activity className="h-3 w-3 mr-1" />
                          {getActionLabel(automation.action_type)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={automation.is_active}
                      onCheckedChange={() => toggleAutomation(automation.id, automation.is_active)}
                    />
                    
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteAutomation(automation.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomationManager;
