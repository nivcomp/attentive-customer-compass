
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, Clock } from "lucide-react";

interface SecuritySettings {
  allowed_email_domains: string;
  restrict_invitations_to_admins: boolean;
  session_timeout_hours: number;
}

interface SecuritySettingsTabProps {
  orgSettings: SecuritySettings;
  onSettingsChange: (updates: Partial<SecuritySettings>) => void;
}

const SecuritySettingsTab = ({ orgSettings, onSettingsChange }: SecuritySettingsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            הגבלות אימייל
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="allowedDomains">דומיינים מורשים (מופרדים בפסיקים)</Label>
            <Input
              id="allowedDomains"
              placeholder="company.com, partner.co.il"
              value={orgSettings.allowed_email_domains}
              onChange={(e) => onSettingsChange({ allowed_email_domains: e.target.value })}
            />
            <p className="text-sm text-gray-600 mt-1">
              משתמשים יוכלו להצטרף רק עם כתובות אימייל מהדומיינים המורשים
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">הגבל הזמנות למנהלים</p>
              <p className="text-sm text-gray-600">רק מנהלים יוכלו להזמין משתמשים חדשים</p>
            </div>
            <Switch
              checked={orgSettings.restrict_invitations_to_admins}
              onCheckedChange={(checked) => onSettingsChange({ restrict_invitations_to_admins: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            הגדרות התחברות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sessionTimeout">זמן פקיעת חיבור (שעות)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              min="1"
              max="168"
              value={orgSettings.session_timeout_hours}
              onChange={(e) => onSettingsChange({ session_timeout_hours: parseInt(e.target.value) || 24 })}
            />
            <p className="text-sm text-gray-600 mt-1">
              משתמשים יתנתקו אוטומטית לאחר תקופה זו של חוסר פעילות
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettingsTab;
