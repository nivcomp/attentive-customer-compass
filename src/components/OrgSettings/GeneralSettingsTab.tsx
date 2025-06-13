
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Palette, Settings } from "lucide-react";

interface OrgSettings {
  name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  board_creation_policy: string;
  default_board_permission: string;
  require_board_approval: boolean;
}

interface GeneralSettingsTabProps {
  orgSettings: OrgSettings;
  onSettingsChange: (updates: Partial<OrgSettings>) => void;
}

const GeneralSettingsTab = ({ orgSettings, onSettingsChange }: GeneralSettingsTabProps) => {
  return (
    <div className="space-y-8">
      {/* פרטי ארגון */}
      <Card className="shadow-sm border-0 shadow-lg">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <Building className="h-6 w-6 text-blue-600" />
            פרטי הארגון
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="orgName" className="text-base font-semibold text-gray-700">שם הארגון</Label>
              <Input
                id="orgName"
                value={orgSettings.name}
                onChange={(e) => onSettingsChange({ name: e.target.value })}
                className="h-12 text-base border-2 focus:border-blue-500"
                placeholder="הכנס את שם הארגון"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="logo" className="text-base font-semibold text-gray-700">כתובת לוגו</Label>
              <Input
                id="logo"
                placeholder="https://example.com/logo.png"
                value={orgSettings.logo_url}
                onChange={(e) => onSettingsChange({ logo_url: e.target.value })}
                className="h-12 text-base border-2 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* עיצוב וצבעים */}
      <Card className="shadow-sm border-0 shadow-lg">
        <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <Palette className="h-6 w-6 text-purple-600" />
            עיצוב וצבעים
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="primaryColor" className="text-base font-semibold text-gray-700">צבע ראשי</Label>
              <div className="flex gap-4">
                <Input
                  id="primaryColor"
                  type="color"
                  value={orgSettings.primary_color}
                  onChange={(e) => onSettingsChange({ primary_color: e.target.value })}
                  className="w-16 h-12 p-2 border-2 rounded-lg cursor-pointer"
                />
                <Input
                  value={orgSettings.primary_color}
                  onChange={(e) => onSettingsChange({ primary_color: e.target.value })}
                  className="flex-1 h-12 text-base border-2 focus:border-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="secondaryColor" className="text-base font-semibold text-gray-700">צבע משני</Label>
              <div className="flex gap-4">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={orgSettings.secondary_color}
                  onChange={(e) => onSettingsChange({ secondary_color: e.target.value })}
                  className="w-16 h-12 p-2 border-2 rounded-lg cursor-pointer"
                />
                <Input
                  value={orgSettings.secondary_color}
                  onChange={(e) => onSettingsChange({ secondary_color: e.target.value })}
                  className="flex-1 h-12 text-base border-2 focus:border-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* מדיניות בורדים */}
      <Card className="shadow-sm border-0 shadow-lg">
        <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <Settings className="h-6 w-6 text-green-600" />
            מדיניות בורדים
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700">מי יכול ליצור בורדים</Label>
              <Select
                value={orgSettings.board_creation_policy}
                onValueChange={(value) => onSettingsChange({ board_creation_policy: value })}
              >
                <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg">
                  <SelectItem value="everyone" className="text-base py-3">כל המשתמשים</SelectItem>
                  <SelectItem value="admins_only" className="text-base py-3">מנהלים בלבד</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700">הרשאת ברירת מחדל לבורדים</Label>
              <Select
                value={orgSettings.default_board_permission}
                onValueChange={(value) => onSettingsChange({ default_board_permission: value })}
              >
                <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg">
                  <SelectItem value="view" className="text-base py-3">צפייה</SelectItem>
                  <SelectItem value="edit" className="text-base py-3">עריכה</SelectItem>
                  <SelectItem value="admin" className="text-base py-3">מנהל</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
            <div className="flex-1">
              <p className="font-semibold text-base text-gray-800 mb-2">דרוש אישור ליצירת בורדים</p>
              <p className="text-sm text-gray-600">בורדים חדשים ידרשו אישור מנהל לפני הפעלתם</p>
            </div>
            <Switch
              checked={orgSettings.require_board_approval}
              onCheckedChange={(checked) => onSettingsChange({ require_board_approval: checked })}
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettingsTab;
