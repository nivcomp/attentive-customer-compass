
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Palette } from "lucide-react";

interface GeneralSettingsTabProps {
  orgSettings: {
    name: string;
    logo_url: string;
    primary_color: string;
    secondary_color: string;
    board_creation_policy: string;
    default_board_permission: string;
    require_board_approval: boolean;
  };
  onSettingsChange: (updates: Partial<typeof orgSettings>) => void;
}

const GeneralSettingsTab = ({ orgSettings, onSettingsChange }: GeneralSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            פרטי ארגון
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orgName">שם הארגון</Label>
            <Input
              id="orgName"
              value={orgSettings.name}
              onChange={(e) => onSettingsChange({ name: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="logo">כתובת לוגו</Label>
            <Input
              id="logo"
              placeholder="https://example.com/logo.png"
              value={orgSettings.logo_url}
              onChange={(e) => onSettingsChange({ logo_url: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            עיצוב וצבעים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">צבע ראשי</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={orgSettings.primary_color}
                  onChange={(e) => onSettingsChange({ primary_color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  value={orgSettings.primary_color}
                  onChange={(e) => onSettingsChange({ primary_color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondaryColor">צבע משני</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={orgSettings.secondary_color}
                  onChange={(e) => onSettingsChange({ secondary_color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  value={orgSettings.secondary_color}
                  onChange={(e) => onSettingsChange({ secondary_color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>מדיניות בורדים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>מי יכול ליצור בורדים</Label>
            <Select
              value={orgSettings.board_creation_policy}
              onValueChange={(value) => onSettingsChange({ board_creation_policy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">כל המשתמשים</SelectItem>
                <SelectItem value="admins_only">מנהלים בלבד</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>הרשאת ברירת מחדל לבורדים</Label>
            <Select
              value={orgSettings.default_board_permission}
              onValueChange={(value) => onSettingsChange({ default_board_permission: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">צפייה</SelectItem>
                <SelectItem value="edit">עריכה</SelectItem>
                <SelectItem value="admin">מנהל</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">דרוש אישור ליצירת בורדים</p>
              <p className="text-sm text-gray-600">בורדים חדשים ידרשו אישור מנהל</p>
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
