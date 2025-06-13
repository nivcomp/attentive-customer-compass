
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
    <div className="space-y-6 md:space-y-8">
      {/* פרטי ארגון */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-blue-50 to-indigo-50 border-b border-blue-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Building className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            פרטי הארגון
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <Label htmlFor="orgName" className="text-sm md:text-base font-semibold text-gray-700">
                שם הארגון
              </Label>
              <Input
                id="orgName"
                value={orgSettings.name}
                onChange={(e) => onSettingsChange({ name: e.target.value })}
                className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                placeholder="הכנס את שם הארגון"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="logo" className="text-sm md:text-base font-semibold text-gray-700">
                כתובת לוגו
              </Label>
              <Input
                id="logo"
                placeholder="https://example.com/logo.png"
                value={orgSettings.logo_url}
                onChange={(e) => onSettingsChange({ logo_url: e.target.value })}
                className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* עיצוב וצבעים */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-purple-50 to-pink-50 border-b border-purple-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Palette className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
            עיצוב וצבעים
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <Label htmlFor="primaryColor" className="text-sm md:text-base font-semibold text-gray-700">
                צבע ראשי
              </Label>
              <div className="flex gap-3">
                <Input
                  id="primaryColor"
                  type="color"
                  value={orgSettings.primary_color}
                  onChange={(e) => onSettingsChange({ primary_color: e.target.value })}
                  className="w-12 h-11 md:w-16 md:h-12 p-1 border-2 rounded-xl cursor-pointer"
                />
                <Input
                  value={orgSettings.primary_color}
                  onChange={(e) => onSettingsChange({ primary_color: e.target.value })}
                  className="flex-1 h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="secondaryColor" className="text-sm md:text-base font-semibold text-gray-700">
                צבע משני
              </Label>
              <div className="flex gap-3">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={orgSettings.secondary_color}
                  onChange={(e) => onSettingsChange({ secondary_color: e.target.value })}
                  className="w-12 h-11 md:w-16 md:h-12 p-1 border-2 rounded-xl cursor-pointer"
                />
                <Input
                  value={orgSettings.secondary_color}
                  onChange={(e) => onSettingsChange({ secondary_color: e.target.value })}
                  className="flex-1 h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* מדיניות בורדים */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-green-50 to-emerald-50 border-b border-green-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Settings className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            מדיניות בורדים
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <Label className="text-sm md:text-base font-semibold text-gray-700">
                מי יכול ליצור בורדים
              </Label>
              <Select
                value={orgSettings.board_creation_policy}
                onValueChange={(value) => onSettingsChange({ board_creation_policy: value })}
              >
                <SelectTrigger className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg rounded-xl">
                  <SelectItem value="everyone" className="text-sm md:text-base py-3 rounded-lg">
                    כל המשתמשים
                  </SelectItem>
                  <SelectItem value="admins_only" className="text-sm md:text-base py-3 rounded-lg">
                    מנהלים בלבד
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm md:text-base font-semibold text-gray-700">
                הרשאת ברירת מחדל לבורדים
              </Label>
              <Select
                value={orgSettings.default_board_permission}
                onValueChange={(value) => onSettingsChange({ default_board_permission: value })}
              >
                <SelectTrigger className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg rounded-xl">
                  <SelectItem value="view" className="text-sm md:text-base py-3 rounded-lg">
                    צפייה
                  </SelectItem>
                  <SelectItem value="edit" className="text-sm md:text-base py-3 rounded-lg">
                    עריכה
                  </SelectItem>
                  <SelectItem value="admin" className="text-sm md:text-base py-3 rounded-lg">
                    מנהל
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 bg-gradient-to-l from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base text-gray-800 mb-1 md:mb-2">
                דרוש אישור ליצירת בורדים
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                בורדים חדשים ידרשו אישור מנהל לפני הפעלתם
              </p>
            </div>
            <Switch
              checked={orgSettings.require_board_approval}
              onCheckedChange={(checked) => onSettingsChange({ require_board_approval: checked })}
              className="scale-110 md:scale-125"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettingsTab;
