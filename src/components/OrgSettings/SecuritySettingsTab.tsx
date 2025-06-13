
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, Clock, Shield } from "lucide-react";

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
      {/* הגבלות אימייל */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-blue-600" />
            הגבלות אימייל
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="allowedDomains" className="text-sm font-medium">
              דומיינים מורשים (מופרדים בפסיקים)
            </Label>
            <Input
              id="allowedDomains"
              placeholder="company.com, partner.co.il"
              value={orgSettings.allowed_email_domains}
              onChange={(e) => onSettingsChange({ allowed_email_domains: e.target.value })}
              className="h-10"
            />
            <p className="text-xs text-gray-600">
              משתמשים יוכלו להצטרף רק עם כתובות אימייל מהדומיינים המורשים
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-amber-600" />
                <p className="font-medium text-sm">הגבל הזמנות למנהלים</p>
              </div>
              <p className="text-xs text-gray-600">רק מנהלים יוכלו להזמין משתמשים חדשים</p>
            </div>
            <Switch
              checked={orgSettings.restrict_invitations_to_admins}
              onCheckedChange={(checked) => onSettingsChange({ restrict_invitations_to_admins: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* הגדרות התחברות */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-emerald-600" />
            הגדרות התחברות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout" className="text-sm font-medium">
              זמן פקיעת חיבור (שעות)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="sessionTimeout"
                type="number"
                min="1"
                max="168"
                value={orgSettings.session_timeout_hours}
                onChange={(e) => onSettingsChange({ session_timeout_hours: parseInt(e.target.value) || 24 })}
                className="w-24 h-10"
              />
              <span className="text-sm text-gray-600">שעות</span>
            </div>
            <p className="text-xs text-gray-600">
              משתמשים יתנתקו אוטומטית לאחר תקופה זו של חוסר פעילות (מינימום שעה, מקסימום שבוע)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettingsTab;
