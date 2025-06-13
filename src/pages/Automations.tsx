
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Workflow, 
  Zap, 
  Clock, 
  Target, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  DollarSign,
  UserPlus,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  webhookUrl?: string;
  isActive: boolean;
  description: string;
  category: string;
}

const Automations = () => {
  const { toast } = useToast();
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'עסקה נסגרה בהצלחה',
      trigger: 'deal_closed_won',
      action: 'send_webhook',
      webhookUrl: '',
      isActive: true,
      description: 'שלח webhook כאשר עסקה נסגרת בהצלחה',
      category: 'deals'
    },
    {
      id: '2',
      name: 'משימה הושלמה',
      trigger: 'task_completed',
      action: 'send_notification',
      isActive: true,
      description: 'שלח התראה כאשר משימה מושלמת',
      category: 'tasks'
    },
    {
      id: '3',
      name: 'לקוח חדש נוסף',
      trigger: 'contact_added',
      action: 'send_welcome_email',
      isActive: false,
      description: 'שלח אימייל ברכה ללקוח חדש',
      category: 'contacts'
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger: '',
    action: '',
    webhookUrl: '',
    description: '',
    category: 'general'
  });

  const [webhookSettings, setWebhookSettings] = useState({
    baseUrl: '',
    authToken: '',
    defaultHeaders: '{}'
  });

  const triggerOptions = [
    { value: 'deal_created', label: 'עסקה חדשה נוצרה', category: 'deals', icon: DollarSign },
    { value: 'deal_closed_won', label: 'עסקה נסגרת בהצלחה', category: 'deals', icon: CheckCircle2 },
    { value: 'deal_closed_lost', label: 'עסקה נסגרת בכישלון', category: 'deals', icon: Target },
    { value: 'task_completed', label: 'משימה הושלמת', category: 'tasks', icon: CheckCircle2 },
    { value: 'task_overdue', label: 'משימה באיחור', category: 'tasks', icon: Clock },
    { value: 'contact_added', label: 'איש קשר נוסף', category: 'contacts', icon: UserPlus },
    { value: 'contact_inactive', label: 'איש קשר לא פעיל', category: 'contacts', icon: Clock },
    { value: 'meeting_scheduled', label: 'פגישה נקבעה', category: 'calendar', icon: Calendar },
    { value: 'meeting_missed', label: 'פגישה הוחמצה', category: 'calendar', icon: Clock },
    { value: 'form_submitted', label: 'טופס נשלח', category: 'forms', icon: FileText },
    { value: 'email_opened', label: 'אימייל נפתח', category: 'email', icon: Mail },
    { value: 'follow_up_due', label: 'מועד מעקב הגיע', category: 'follow_up', icon: Clock }
  ];

  const actionOptions = [
    { value: 'send_webhook', label: 'שלח Webhook', icon: Zap },
    { value: 'send_email', label: 'שלח אימייל', icon: Mail },
    { value: 'send_sms', label: 'שלח SMS', icon: Phone },
    { value: 'create_task', label: 'צור משימה', icon: CheckCircle2 },
    { value: 'send_notification', label: 'שלח התראה', icon: MessageSquare },
    { value: 'update_field', label: 'עדכן שדה', icon: Edit },
    { value: 'move_stage', label: 'העבר שלב', icon: Target },
    { value: 'schedule_meeting', label: 'קבע פגישה', icon: Calendar }
  ];

  const toggleAutomation = (id: string) => {
    setAutomations(prev => 
      prev.map(auto => 
        auto.id === id ? { ...auto, isActive: !auto.isActive } : auto
      )
    );
    toast({
      title: "אוטומציה עודכנה",
      description: "סטטוס האוטומציה שונה בהצלחה"
    });
  };

  const createAutomation = () => {
    if (!newAutomation.name || !newAutomation.trigger || !newAutomation.action) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    const automation: Automation = {
      id: Date.now().toString(),
      ...newAutomation,
      isActive: true
    };

    setAutomations(prev => [...prev, automation]);
    setNewAutomation({
      name: '',
      trigger: '',
      action: '',
      webhookUrl: '',
      description: '',
      category: 'general'
    });
    setShowCreateDialog(false);
    
    toast({
      title: "אוטומציה נוצרה",
      description: "האוטומציה החדשה נוספה בהצלחה"
    });
  };

  const testWebhook = async (webhookUrl: string) => {
    if (!webhookUrl) {
      toast({
        title: "שגיאה",
        description: "לא הוגדר כתובת webhook",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: 'Test webhook from CRM automation'
        })
      });

      toast({
        title: "Webhook נשלח",
        description: "בקשת הבדיקה נשלחה. בדוק את היעד לאישור קבלה."
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "שליחת ה-webhook נכשלה",
        variant: "destructive"
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      deals: DollarSign,
      tasks: CheckCircle2,
      contacts: UserPlus,
      calendar: Calendar,
      forms: FileText,
      email: Mail,
      follow_up: Clock,
      general: Workflow
    };
    return icons[category as keyof typeof icons] || Workflow;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      deals: 'bg-green-100 text-green-800',
      tasks: 'bg-blue-100 text-blue-800',
      contacts: 'bg-purple-100 text-purple-800',
      calendar: 'bg-orange-100 text-orange-800',
      forms: 'bg-pink-100 text-pink-800',
      email: 'bg-red-100 text-red-800',
      follow_up: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 w-full">
      <div className="w-full px-4 py-4 md:py-6 lg:py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 mb-6 md:mb-8">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Workflow className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">אוטומציות CRM</h1>
                </div>
                <p className="text-sm md:text-base text-gray-600">אוטומציה חכמה לניהול יעיל של הCRM שלך</p>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    אוטומציה חדשה
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>יצירת אוטומציה חדשה</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>שם האוטומציה</Label>
                        <Input
                          value={newAutomation.name}
                          onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="הכנס שם לאוטומציה"
                        />
                      </div>
                      <div>
                        <Label>קטגוריה</Label>
                        <Select value={newAutomation.category} onValueChange={(value) => setNewAutomation(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deals">עסקאות</SelectItem>
                            <SelectItem value="tasks">משימות</SelectItem>
                            <SelectItem value="contacts">אנשי קשר</SelectItem>
                            <SelectItem value="calendar">יומן</SelectItem>
                            <SelectItem value="forms">טפסים</SelectItem>
                            <SelectItem value="email">אימייל</SelectItem>
                            <SelectItem value="follow_up">מעקב</SelectItem>
                            <SelectItem value="general">כללי</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>טריגר</Label>
                        <Select value={newAutomation.trigger} onValueChange={(value) => setNewAutomation(prev => ({ ...prev, trigger: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר טריגר" />
                          </SelectTrigger>
                          <SelectContent>
                            {triggerOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <option.icon className="h-4 w-4" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>פעולה</Label>
                        <Select value={newAutomation.action} onValueChange={(value) => setNewAutomation(prev => ({ ...prev, action: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר פעולה" />
                          </SelectTrigger>
                          <SelectContent>
                            {actionOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <option.icon className="h-4 w-4" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {newAutomation.action === 'send_webhook' && (
                      <div>
                        <Label>Webhook URL</Label>
                        <Input
                          value={newAutomation.webhookUrl}
                          onChange={(e) => setNewAutomation(prev => ({ ...prev, webhookUrl: e.target.value }))}
                          placeholder="https://example.com/webhook"
                        />
                      </div>
                    )}

                    <div>
                      <Label>תיאור</Label>
                      <Textarea
                        value={newAutomation.description}
                        onChange={(e) => setNewAutomation(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="תיאור קצר של האוטומציה"
                      />
                    </div>

                    <Button onClick={createAutomation} className="w-full">
                      צור אוטומציה
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="active">אוטומציות פעילות</TabsTrigger>
            <TabsTrigger value="templates">תבניות</TabsTrigger>
            <TabsTrigger value="settings">הגדרות Webhook</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid gap-6">
              {automations.map((automation) => {
                const CategoryIcon = getCategoryIcon(automation.category);
                return (
                  <Card key={automation.id} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 bg-gradient-to-l from-blue-50 to-indigo-50 border-b border-blue-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="h-5 w-5 text-blue-600" />
                          <div>
                            <CardTitle className="text-lg text-gray-800">{automation.name}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{automation.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(automation.category)}>
                            {automation.category}
                          </Badge>
                          <Switch
                            checked={automation.isActive}
                            onCheckedChange={() => toggleAutomation(automation.id)}
                          />
                          {automation.isActive ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Play className="h-3 w-3 mr-1" />
                              פעיל
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">
                              <Pause className="h-3 w-3 mr-1" />
                              לא פעיל
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">טריגר:</span>
                          <span className="text-sm text-gray-600">
                            {triggerOptions.find(t => t.value === automation.trigger)?.label || automation.trigger}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">פעולה:</span>
                          <span className="text-sm text-gray-600">
                            {actionOptions.find(a => a.value === automation.action)?.label || automation.action}
                          </span>
                        </div>
                        {automation.webhookUrl && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => testWebhook(automation.webhookUrl!)}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              בדוק Webhook
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'ברכה ללקוח חדש',
                  description: 'שלח אימייל ברכה אוטומטי כאשר לקוח חדש נרשם',
                  trigger: 'contact_added',
                  action: 'send_email',
                  category: 'contacts',
                  icon: UserPlus
                },
                {
                  name: 'מעקב אחר עסקה',
                  description: 'צור משימת מעקב אוטומטית כאשר עסקה נוצרת',
                  trigger: 'deal_created',
                  action: 'create_task',
                  category: 'deals',
                  icon: DollarSign
                },
                {
                  name: 'התראת משימה באיחור',
                  description: 'שלח התראה כאשר משימה מתעכבת',
                  trigger: 'task_overdue',
                  action: 'send_notification',
                  category: 'tasks',
                  icon: Clock
                },
                {
                  name: 'סיכום פגישה',
                  description: 'צור משימת מעקב אחרי כל פגישה',
                  trigger: 'meeting_scheduled',
                  action: 'create_task',
                  category: 'calendar',
                  icon: Calendar
                },
                {
                  name: 'עדכון צוות מכירות',
                  description: 'שלח webhook לערוץ סלאק כאשר עסקה נסגרת',
                  trigger: 'deal_closed_won',
                  action: 'send_webhook',
                  category: 'deals',
                  icon: Zap
                },
                {
                  name: 'לקוח לא פעיל',
                  description: 'צור משימת יצירת קשר עם לקוחות לא פעילים',
                  trigger: 'contact_inactive',
                  action: 'create_task',
                  category: 'contacts',
                  icon: Clock
                }
              ].map((template, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <template.icon className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge className={getCategoryColor(template.category)} variant="secondary">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      השתמש בתבנית
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-blue-600" />
                  הגדרות Webhook גלובליות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="baseUrl">Base URL בסיסי</Label>
                  <Input
                    id="baseUrl"
                    value={webhookSettings.baseUrl}
                    onChange={(e) => setWebhookSettings(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://your-domain.com/webhooks"
                  />
                  <p className="text-xs text-gray-500 mt-1">כתובת בסיס שתשמש עבור כל ה-webhooks</p>
                </div>

                <div>
                  <Label htmlFor="authToken">טוקן אימות</Label>
                  <Input
                    id="authToken"
                    type="password"
                    value={webhookSettings.authToken}
                    onChange={(e) => setWebhookSettings(prev => ({ ...prev, authToken: e.target.value }))}
                    placeholder="Bearer token או מפתח API"
                  />
                  <p className="text-xs text-gray-500 mt-1">טוקן שיישלח בכל בקשה</p>
                </div>

                <div>
                  <Label htmlFor="headers">Headers בריר מחדל (JSON)</Label>
                  <Textarea
                    id="headers"
                    value={webhookSettings.defaultHeaders}
                    onChange={(e) => setWebhookSettings(prev => ({ ...prev, defaultHeaders: e.target.value }))}
                    placeholder='{"Content-Type": "application/json"}'
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">Headers שיישלחו עם כל webhook</p>
                </div>

                <Button className="w-full">
                  שמור הגדרות
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle>דוגמאות Webhook</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">עסקה נסגרת בהצלחה:</h4>
                    <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`{
  "event": "deal_closed_won",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "deal_id": "123",
    "deal_name": "עסקה עם חברת ABC",
    "amount": 50000,
    "customer": {
      "id": "456",
      "name": "ישראל ישראלי",
      "email": "israel@example.com"
    }
  }
}`}
                    </pre>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">משימה הושלמה:</h4>
                    <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`{
  "event": "task_completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "task_id": "789",
    "task_name": "התקשר ללקוח",
    "assigned_to": "מנהל המכירות",
    "completed_by": "חברת הפרויקט"
  }
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Automations;
