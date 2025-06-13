
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Building2, Upload, Save, Shield, Mail } from "lucide-react";

const OrganizationSettingsTab = () => {
  const [orgName, setOrgName] = useState('שם הארגון');
  const [orgLogo, setOrgLogo] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#1E40AF');
  const [allowedDomains, setAllowedDomains] = useState('company.com, partner.co.il');
  const [requireApproval, setRequireApproval] = useState(true);
  const [restrictInvitations, setRestrictInvitations] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(8);

  const handleSave = () => {
    console.log('Saving organization settings...');
    // כאן נשמור את ההגדרות
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-blue-50 to-indigo-50 border-b border-blue-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Building2 className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            הגדרות כלליות
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="orgName" className="text-sm md:text-base font-semibold text-gray-700">
                שם הארגון
              </Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="border-2 focus:border-blue-500 rounded-xl"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm md:text-base font-semibold text-gray-700">
                לוגו הארגון
              </Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  העלה לוגו
                </Button>
                {orgLogo && (
                  <Badge variant="secondary">לוגו הועלה</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="primaryColor" className="text-sm md:text-base font-semibold text-gray-700">
                צבע ראשי
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="secondaryColor" className="text-sm md:text-base font-semibold text-gray-700">
                צבע משני
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="secondaryColor"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-red-50 to-pink-50 border-b border-red-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Shield className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
            הגדרות אבטחה
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="allowedDomains" className="text-sm md:text-base font-semibold text-gray-700">
              דומיינים מורשים להרשמה
            </Label>
            <Input
              id="allowedDomains"
              value={allowedDomains}
              onChange={(e) => setAllowedDomains(e.target.value)}
              placeholder="company.com, partner.co.il"
              className="border-2 focus:border-blue-500 rounded-xl"
            />
            <p className="text-xs text-gray-500">
              הפרד בין דומיינים באמצעות פסיק. השאר ריק כדי לאפשר כל דומיין.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-l from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base text-gray-800 mb-1">
                דרוש אישור למשתמשים חדשים
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                משתמשים חדשים יצטרכו אישור מנהל לפני הגישה למערכת
              </p>
            </div>
            <Switch 
              checked={requireApproval}
              onCheckedChange={setRequireApproval}
              className="scale-110 md:scale-125"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-l from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base text-gray-800 mb-1">
                הגבל הזמנות למנהלים בלבד
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                רק מנהלים יוכלו להזמין משתמשים חדשים לארגון
              </p>
            </div>
            <Switch 
              checked={restrictInvitations}
              onCheckedChange={setRestrictInvitations}
              className="scale-110 md:scale-125"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="sessionTimeout" className="text-sm md:text-base font-semibold text-gray-700">
              זמן פסק זמן חיבור (שעות)
            </Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              min="1"
              max="24"
              className="w-32 border-2 focus:border-blue-500 rounded-xl"
            />
            <p className="text-xs text-gray-500">
              משתמשים יתנתקו אוטומטית לאחר תקופת חוסר פעילות
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Save className="h-4 w-4 ml-2" />
          שמור הגדרות
        </Button>
      </div>
    </div>
  );
};

export default OrganizationSettingsTab;
