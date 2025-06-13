
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 w-full">
      <div className="w-full px-4 py-4 md:py-6 lg:py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 mb-6 md:mb-8">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">הגדרות</h1>
            </div>
            <p className="text-sm md:text-base text-gray-600">ניהול הגדרות המערכת והפרופיל האישי</p>
          </div>
        </div>

        <div className="grid gap-6 md:gap-8">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-blue-50 to-indigo-50 border-b border-blue-100/50">
              <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
                <User className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                פרופיל אישי
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-sm md:text-base font-semibold text-gray-700">שם פרטי</Label>
                  <Input 
                    id="firstName" 
                    placeholder="הכנס שם פרטי"
                    className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-sm md:text-base font-semibold text-gray-700">שם משפחה</Label>
                  <Input 
                    id="lastName" 
                    placeholder="הכנס שם משפחה"
                    className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm md:text-base font-semibold text-gray-700">אימייל</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com"
                  className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm md:text-base font-semibold text-gray-700">טלפון</Label>
                <Input 
                  id="phone" 
                  placeholder="050-1234567"
                  className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 h-auto text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                שמור שינויים
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-green-50 to-emerald-50 border-b border-green-100/50">
              <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
                <Bell className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                התראות
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 bg-gradient-to-l from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div className="flex-1">
                  <p className="font-semibold text-sm md:text-base text-gray-800 mb-1 md:mb-2">התראות אימייל</p>
                  <p className="text-xs md:text-sm text-gray-600">קבל התראות על פעילויות חדשות</p>
                </div>
                <Switch className="scale-110 md:scale-125" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 bg-gradient-to-l from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div className="flex-1">
                  <p className="font-semibold text-sm md:text-base text-gray-800 mb-1 md:mb-2">התראות SMS</p>
                  <p className="text-xs md:text-sm text-gray-600">קבל התראות דחופות בSMS</p>
                </div>
                <Switch className="scale-110 md:scale-125" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 bg-gradient-to-l from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                <div className="flex-1">
                  <p className="font-semibold text-sm md:text-base text-gray-800 mb-1 md:mb-2">התראות דוחות</p>
                  <p className="text-xs md:text-sm text-gray-600">קבל דוחות שבועיים</p>
                </div>
                <Switch defaultChecked className="scale-110 md:scale-125" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-red-50 to-pink-50 border-b border-red-100/50">
              <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                אבטחה
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
              <div className="space-y-3">
                <Label htmlFor="currentPassword" className="text-sm md:text-base font-semibold text-gray-700">סיסמה נוכחית</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="newPassword" className="text-sm md:text-base font-semibold text-gray-700">סיסמה חדשה</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm md:text-base font-semibold text-gray-700">אישור סיסמה</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  className="h-11 md:h-12 text-sm md:text-base border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Button 
                variant="outline"
                className="border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 px-6 py-3 h-auto text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                שנה סיסמה
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-gray-50 to-slate-50 border-b border-gray-100/50">
              <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
                <Database className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                הגדרות מערכת
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 lg:p-8">
              <div className="text-center py-8 md:py-12">
                <Database className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-base md:text-lg font-medium">
                  הגדרות מערכת מתקדמות - בקרוב
                </p>
                <p className="text-gray-500 text-sm md:text-base mt-2">
                  תכונות נוספות יתווספו בעדכונים הבאים
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
