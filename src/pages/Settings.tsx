
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";

const Settings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">הגדרות</h1>
        <p className="text-gray-600 mt-2">ניהול הגדרות המערכת והפרופיל האישי</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              פרופיל אישי
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">שם פרטי</Label>
                <Input id="firstName" placeholder="הכנס שם פרטי" />
              </div>
              <div>
                <Label htmlFor="lastName">שם משפחה</Label>
                <Input id="lastName" placeholder="הכנס שם משפחה" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">אימייל</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div>
              <Label htmlFor="phone">טלפון</Label>
              <Input id="phone" placeholder="050-1234567" />
            </div>
            <Button>שמור שינויים</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              התראות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">התראות אימייל</p>
                <p className="text-sm text-gray-600">קבל התראות על פעילויות חדשות</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">התראות SMS</p>
                <p className="text-sm text-gray-600">קבל התראות דחופות בSMS</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">התראות דוחות</p>
                <p className="text-sm text-gray-600">קבל דוחות שבועיים</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              אבטחה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">סיסמה חדשה</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">אישור סיסמה</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button variant="outline">שנה סיסמה</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              הגדרות מערכת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-8">
              הגדרות מערכת מתקדמות - בקרוב
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
