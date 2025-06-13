
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
    <div className="space-y-8">
      {/* הגבלות אימייל */}
      <Card className="shadow-sm border-0 shadow-lg">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <Mail className="h-6 w-6 text-blue-600" />
            הגבלות אימייל
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="space-y-3">
            <Label htmlFor="allowedDomains" className="text-base font-semibold text-gray-700">
              דומיינים מורשים (מופרדים בפסיקים)
            </Label>
            <Input
              id="allowedDomains"
              placeholder="company.com, partner.co.il"
              value={orgSettings.allowed_email_domains}
              onChange={(e) => onSettingsChange({ allowed_email_domains: e.target.value })}
              className="h-12 text-base border-2 focus:border-blue-500"
            />
            <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
              משתמשים יוכלו להצטרף רק עם כתובות אימייל מהדומיינים המורשים
            </p>
          </div>

          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-amber-600" />
                <p className="font-semibold text-base text-gray-800">הגבל הזמנות למנהלים</p>
              </div>
              <p className="text-sm text-gray-600">רק מנהלים יוכלו להזמין משתמשים חדשים לארגון</p>
            </div>
            <Switch
              checked={orgSettings.restrict_invitations_to_admins}
              onCheckedChange={(checked) => onSettingsChange({ restrict_invitations_to_admins: checked })}
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>

      {/* הגדרות התחברות */}
      <Card className="shadow-sm border-0 shadow-lg">
        <CardHeader className="pb-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <Clock className="h-6 w-6 text-emerald-600" />
            הגדרות התחברות
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="sessionTimeout" className="text-base font-semibold text-gray-700">
              זמן פקיעת חיבור (שעות)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="sessionTimeout"
                type="number"
                min="1"
                max="168"
                value={orgSettings.session_timeout_hours}
                onChange={(e) => onSettingsChange({ session_timeout_hours: parseInt(e.target.value) || 24 })}
                className="w-32 h-12 text-base border-2 focus:border-blue-500"
              />
              <span className="text-base font-medium text-gray-600">שעות</span>
            </div>
            <p className="text-sm text-gray-600 bg-green-50 p-4 rounded-lg border border-green-200">
              משתמשים יתנתקו אוטומטית לאחר תקופה זו של חוסר פעילות (מינימום שעה, מקסימום שבוע)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettingsTab;
