
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Palette } from "lucide-react";

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
    <div className="space-y-6">
      {/* פרטי ארגון */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5 text-blue-600" />
            פרטי ארגון
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName" className="text-sm font-medium">שם הארגון</Label>
              <Input
                id="orgName"
                value={orgSettings.name}
                onChange={(e) => onSettingsChange({ name: e.target.value })}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo" className="text-sm font-medium">כתובת לוגו</Label>
              <Input
                id="logo"
                placeholder="https://example.com/logo.png"
                value={orgSettings.logo_url}
                onChange={(e) => onSettingsChange({ logo_url: e.target.value })}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* עיצוב וצבעים */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-purple-600" />
            עיצוב וצבעים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="text-sm font-medium">צבע ראשי</Label>
              <div className="flex gap-3">
                <Input
                  id="primaryColor"
                  type="color"
                  value={orgSettings.primary_color}
                  onChange={(e) => onSettingsChange({ primary_color: e.target.value })}
                  className="w-12 h-10 p-1 border-2"
                />
                <Input
                  value={orgSettings.primary_color}
                  onChange={(e) => onSettingsChange({ primary_color: e.target.value })}
                  className="flex-1 h-10"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryColor" className="text-sm font-medium">צבע משני</Label>
              <div className="flex gap-3">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={orgSettings.secondary_color}
                  onChange={(e) => onSettingsChange({ secondary_color: e.target.value })}
                  className="w-12 h-10 p-1 border-2"
                />
                <Input
                  value={orgSettings.secondary_color}
                  onChange={(e) => onSettingsChange({ secondary_color: e.target.value })}
                  className="flex-1 h-10"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* מדיניות בורדים */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">מדיניות בורדים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">מי יכול ליצור בורדים</Label>
              <Select
                value={orgSettings.board_creation_policy}
                onValueChange={(value) => onSettingsChange({ board_creation_policy: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">כל המשתמשים</SelectItem>
                  <SelectItem value="admins_only">מנהלים בלבד</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">הרשאת ברירת מחדל לבורדים</Label>
              <Select
                value={orgSettings.default_board_permission}
                onValueChange={(value) => onSettingsChange({ default_board_permission: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">צפייה</SelectItem>
                  <SelectItem value="edit">עריכה</SelectItem>
                  <SelectItem value="admin">מנהל</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-sm">דרוש אישור ליצירת בורדים</p>
              <p className="text-xs text-gray-600 mt-1">בורדים חדשים ידרשו אישור מנהל</p>
            </div>
            <Switch
              checked={orgSettings.require_board_approval}
              onCheckedChange={(checked) => onSettingsChange({ require_board_approval: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettingsTab;
