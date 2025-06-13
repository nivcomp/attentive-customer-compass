
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Layout, FolderOpen, Building2, Users } from "lucide-react";
import PageManager from "@/components/PageManager";
import BoardManager from "@/components/BoardManager";
import OrganizationSettingsTab from "@/components/OrganizationSettingsTab";
import UserManagementTab from "@/components/UserManagementTab";

const CentralSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 w-full">
      <div className="w-full px-4 py-4 md:py-6 lg:py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 mb-6 md:mb-8">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">הגדרות מערכת</h1>
            </div>
            <p className="text-sm md:text-base text-gray-600">ניהול מרכזי של דפים, בורדים והגדרות ארגון</p>
          </div>
        </div>

        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              ניהול דפים
            </TabsTrigger>
            <TabsTrigger value="boards" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              ניהול בורדים
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              הגדרות ארגון
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              ניהול משתמשים
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <PageManager />
          </TabsContent>

          <TabsContent value="boards" className="space-y-6">
            <BoardManager />
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <OrganizationSettingsTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CentralSettings;
