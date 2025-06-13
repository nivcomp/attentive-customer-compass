
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Users, 
  Shield, 
  History, 
  Save, 
  Building
} from "lucide-react";
import { useOrganizations, useUpdateOrganization } from "@/hooks/useOrganizations";
import { toast } from "sonner";
import GeneralSettingsTab from './OrgSettings/GeneralSettingsTab';
import UserManagementTab from './OrgSettings/UserManagementTab';
import SecuritySettingsTab from './OrgSettings/SecuritySettingsTab';
import AuditLogTab from './OrgSettings/AuditLogTab';

interface OrgSettingsProps {
  organizationId?: string;
}

const OrgSettings = ({ organizationId = "demo-org-id" }: OrgSettingsProps) => {
  const [activeTab, setActiveTab] = useState('general');

  const { data: organizations } = useOrganizations();
  const updateOrgMutation = useUpdateOrganization();

  // Get current organization or use mock data for demonstration
  const currentOrg = organizations?.[0] || {
    id: organizationId,
    name: 'חברת הדמו',
    subdomain: 'demo-company',
    logo_url: null,
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
    board_creation_policy: 'everyone',
    default_board_permission: 'view',
    require_board_approval: false,
    allowed_email_domains: ['company.com'],
    restrict_invitations_to_admins: false,
    session_timeout_hours: 24,
    settings: {},
    created_at: new Date().toISOString()
  };

  const [orgSettings, setOrgSettings] = useState({
    name: currentOrg.name,
    logo_url: currentOrg.logo_url || '',
    primary_color: currentOrg.primary_color || '#3B82F6',
    secondary_color: currentOrg.secondary_color || '#1E40AF',
    board_creation_policy: currentOrg.board_creation_policy || 'everyone',
    default_board_permission: currentOrg.default_board_permission || 'view',
    require_board_approval: currentOrg.require_board_approval || false,
    allowed_email_domains: currentOrg.allowed_email_domains?.join(', ') || '',
    restrict_invitations_to_admins: currentOrg.restrict_invitations_to_admins || false,
    session_timeout_hours: currentOrg.session_timeout_hours || 24
  });

  const handleSettingsChange = (updates: Partial<typeof orgSettings>) => {
    setOrgSettings(prev => ({ ...prev, ...updates }));
  };

  const handleSaveSettings = async () => {
    try {
      const updates = {
        name: orgSettings.name,
        logo_url: orgSettings.logo_url,
        primary_color: orgSettings.primary_color,
        secondary_color: orgSettings.secondary_color,
        board_creation_policy: orgSettings.board_creation_policy,
        default_board_permission: orgSettings.default_board_permission,
        require_board_approval: orgSettings.require_board_approval,
        allowed_email_domains: orgSettings.allowed_email_domains.split(',').map(d => d.trim()).filter(Boolean),
        restrict_invitations_to_admins: orgSettings.restrict_invitations_to_admins,
        session_timeout_hours: orgSettings.session_timeout_hours
      };

      await updateOrgMutation.mutateAsync({ id: organizationId, updates });
      toast.success('הגדרות נשמרו בהצלחה');
    } catch (error) {
      toast.error('שגיאה בשמירת ההגדרות');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-4 md:py-6 lg:py-8 max-w-7xl">
        {/* Header - מותאם לנייד */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 mb-6 md:mb-8">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Building className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                    הגדרות ארגון
                  </h1>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  ניהול הגדרות הארגון, משתמשים ואבטחה
                </p>
              </div>
              
              <Button 
                onClick={handleSaveSettings} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 h-auto text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                שמור הגדרות
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Tabs - מותאם לנייד */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation - שורה אחת עם גלילה אופקית בנייד */}
            <div className="border-b border-gray-200 bg-gray-50/80">
              <div className="px-4 md:px-6 lg:px-8 py-3">
                <TabsList className="w-full h-auto p-0 bg-transparent justify-start">
                  <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                    <TabsTrigger 
                      value="general" 
                      className="flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg border border-transparent data-[state=active]:border-blue-200 hover:bg-white/70 transition-all duration-200"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">הגדרות כלליות</span>
                      <span className="sm:hidden">כללי</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="users" 
                      className="flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg border border-transparent data-[state=active]:border-blue-200 hover:bg-white/70 transition-all duration-200"
                    >
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">ניהול משתמשים</span>
                      <span className="sm:hidden">משתמשים</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg border border-transparent data-[state=active]:border-blue-200 hover:bg-white/70 transition-all duration-200"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">הגדרות אבטחה</span>
                      <span className="sm:hidden">אבטחה</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="audit" 
                      className="flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg border border-transparent data-[state=active]:border-blue-200 hover:bg-white/70 transition-all duration-200"
                    >
                      <History className="h-4 w-4" />
                      <span className="hidden sm:inline">יומן פעילות</span>
                      <span className="sm:hidden">יומן</span>
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>
            </div>

            {/* Tab Content - ריווח מותאם */}
            <div className="p-4 md:p-6 lg:p-8">
              <TabsContent value="general" className="mt-0">
                <GeneralSettingsTab 
                  orgSettings={orgSettings}
                  onSettingsChange={handleSettingsChange}
                />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <UserManagementTab organizationId={organizationId} />
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <SecuritySettingsTab 
                  orgSettings={orgSettings}
                  onSettingsChange={handleSettingsChange}
                />
              </TabsContent>

              <TabsContent value="audit" className="mt-0">
                <AuditLogTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OrgSettings;
