
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
    <div className="space-y-6 md:space-y-8">
      {/* הגבלות אימייל */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-blue-50 to-indigo-50 border-b border-blue-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Mail className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            הגבלות אימייל
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <div className="space-y-3">
            <Label htmlFor="allowedDomains" className="text-sm md:text-base font-semibold text-gray-700">
              דומיינים מורשים (מופרדים בפסיקים)
            </Label>
            <Input
              id="allowedDomains"
              placeholder="company.com, partner.co.il"
              value={orgSettings.allowed_email_domains}
              onChange={(e) => onSettingsChange({ allowed_email_domains: e.target.value })}
              className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
            />
            <div className="text-xs md:text-sm text-gray-600 bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-200">
              משתמשים יוכלו להצטרף רק עם כתובות אימייל מהדומיינים המורשים
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 bg-gradient-to-l from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 md:mb-2">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
                <p className="font-semibold text-sm md:text-base text-gray-800">
                  הגבל הזמנות למנהלים
                </p>
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                רק מנהלים יוכלו להזמין משתמשים חדשים לארגון
              </p>
            </div>
            <Switch
              checked={orgSettings.restrict_invitations_to_admins}
              onCheckedChange={(checked) => onSettingsChange({ restrict_invitations_to_admins: checked })}
              className="scale-110 md:scale-125"
            />
          </div>
        </CardContent>
      </Card>

      {/* הגדרות התחברות */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-emerald-50 to-green-50 border-b border-green-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Clock className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
            הגדרות התחברות
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
          <div className="space-y-3">
            <Label htmlFor="sessionTimeout" className="text-sm md:text-base font-semibold text-gray-700">
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
                className="w-24 md:w-32 h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
              />
              <span className="text-sm md:text-base font-medium text-gray-600">שעות</span>
            </div>
            <div className="text-xs md:text-sm text-gray-600 bg-green-50 p-3 md:p-4 rounded-xl border border-green-200">
              משתמשים יתנתקו אוטומטית לאחר תקופה זו של חוסר פעילות (מינימום שעה, מקסימום שבוע)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettingsTab;
