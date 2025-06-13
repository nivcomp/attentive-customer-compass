
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, Plus, Trash2, TestTube, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
}

const WebhookSettings = () => {
  const { toast } = useToast();
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/...',
      events: ['deal_closed_won', 'task_completed'],
      isActive: true
    },
    {
      id: '2',
      name: 'Zapier Integration',
      url: 'https://hooks.zapier.com/hooks/catch/...',
      events: ['contact_added', 'deal_created'],
      isActive: false
    }
  ]);

  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: ''
  });

  const availableEvents = [
    { id: 'deal_created', name: 'עסקה נוצרה' },
    { id: 'deal_closed_won', name: 'עסקה נסגרת בהצלחה' },
    { id: 'deal_closed_lost', name: 'עסקה נסגרת בכישלון' },
    { id: 'task_completed', name: 'משימה הושלמת' },
    { id: 'task_overdue', name: 'משימה באיחור' },
    { id: 'contact_added', name: 'איש קשר נוסף' },
    { id: 'meeting_scheduled', name: 'פגישה נקבעה' },
    { id: 'form_submitted', name: 'טופס נשלח' }
  ];

  const testWebhook = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          event: 'webhook_test',
          message: 'This is a test webhook from your CRM system'
        })
      });

      toast({
        title: "Webhook נשלח",
        description: "בקשת הבדיקה נשלחה בהצלחה"
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "שליחת ה-webhook נכשלה",
        variant: "destructive"
      });
    }
  };

  const addEndpoint = () => {
    if (!newEndpoint.name || !newEndpoint.url) {
      toast({
        title: "שגיאה",
        description: "יש למלא שם וכתובת URL",
        variant: "destructive"
      });
      return;
    }

    const endpoint: WebhookEndpoint = {
      id: Date.now().toString(),
      ...newEndpoint,
      isActive: true
    };

    setEndpoints(prev => [...prev, endpoint]);
    setNewEndpoint({ name: '', url: '', events: [], secret: '' });
    
    toast({
      title: "Webhook נוסף",
      description: "נקודת הקצה החדשה נוספה בהצלחה"
    });
  };

  const toggleEndpoint = (id: string) => {
    setEndpoints(prev =>
      prev.map(endpoint =>
        endpoint.id === id
          ? { ...endpoint, isActive: !endpoint.isActive }
          : endpoint
      )
    );
  };

  const deleteEndpoint = (id: string) => {
    setEndpoints(prev => prev.filter(endpoint => endpoint.id !== id));
    toast({
      title: "Webhook נמחק",
      description: "נקודת הקצה נמחקה בהצלחה"
    });
  };

  return (
    <div className="space-y-6">
      {/* הוספת endpoint חדש */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-l from-purple-50 to-pink-50 border-b border-purple-100/50">
          <CardTitle className="flex items-center gap-3 text-lg text-gray-800">
            <Plus className="h-5 w-5 text-purple-600" />
            הוסף Webhook חדש
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="webhook-name">שם ה-Webhook</Label>
              <Input
                id="webhook-name"
                value={newEndpoint.name}
                onChange={(e) => setNewEndpoint(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Slack, Zapier, Custom API..."
              />
            </div>
            <div>
              <Label htmlFor="webhook-url">כתובת URL</Label>
              <Input
                id="webhook-url"
                value={newEndpoint.url}
                onChange={(e) => setNewEndpoint(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://hooks.example.com/webhook"
              />
            </div>
          </div>

          <div>
            <Label>אירועים (בחר אירועים שיפעילו את ה-webhook)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {availableEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id={event.id}
                    checked={newEndpoint.events.includes(event.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewEndpoint(prev => ({
                          ...prev,
                          events: [...prev.events, event.id]
                        }));
                      } else {
                        setNewEndpoint(prev => ({
                          ...prev,
                          events: prev.events.filter(e => e !== event.id)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <Label htmlFor={event.id} className="text-sm">{event.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="webhook-secret">סוד/טוקן (אופציונלי)</Label>
            <Input
              id="webhook-secret"
              type="password"
              value={newEndpoint.secret}
              onChange={(e) => setNewEndpoint(prev => ({ ...prev, secret: e.target.value }))}
              placeholder="Bearer token או webhook secret"
            />
          </div>

          <Button onClick={addEndpoint} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            הוסף Webhook
          </Button>
        </CardContent>
      </Card>

      {/* רשימת endpoints קיימים */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-l from-blue-50 to-indigo-50 border-b border-blue-100/50">
          <CardTitle className="flex items-center gap-3 text-lg text-gray-800">
            <Zap className="h-5 w-5 text-blue-600" />
            Webhooks פעילים
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {endpoints.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>אין webhooks מוגדרים עדיין</p>
            </div>
          ) : (
            <div className="divide-y">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">{endpoint.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{endpoint.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={endpoint.isActive}
                        onCheckedChange={() => toggleEndpoint(endpoint.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testWebhook(endpoint.url)}
                      >
                        <TestTube className="h-3 w-3 mr-1" />
                        בדוק
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEndpoint(endpoint.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {endpoint.events.map((eventId) => {
                      const eventName = availableEvents.find(e => e.id === eventId)?.name || eventId;
                      return (
                        <Badge key={eventId} variant="secondary" className="text-xs">
                          {eventName}
                        </Badge>
                      );
                    })}
                  </div>

                  {!endpoint.isActive && (
                    <div className="mt-3 flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Webhook זה כרגע לא פעיל</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* מידע נוסף */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">איך להשתמש ב-Webhooks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Zapier</h4>
            <p className="text-sm text-blue-800">
              צור Zap חדש ← בחר "Webhooks by Zapier" ← בחר "Catch Hook" ← העתק את ה-URL לכאן
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Slack</h4>
            <p className="text-sm text-green-800">
              ב-Slack: הגדרות ← Apps ← Incoming Webhooks ← הוסף ל-Workspace ← בחר ערוץ ← העתק URL
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Make (Integromat)</h4>
            <p className="text-sm text-purple-800">
              צור תרחיש חדש ← הוסף Webhook ← העתק את כתובת ה-webhook ← הדבק כאן
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookSettings;
