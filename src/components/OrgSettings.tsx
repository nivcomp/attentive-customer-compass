
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header - מותאם למובייל */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Building className="h-6 w-6 sm:h-8 sm:w-8" />
                הגדרות ארגון
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">ניהול הגדרות הארגון, משתמשים ואבטחה</p>
            </div>
            
            <Button 
              onClick={handleSaveSettings} 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              שמור הגדרות
            </Button>
          </div>
        </div>

        {/* Settings Tabs - מותאם למובייל */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* רשימת טאבים - גלילה אופקית במובייל */}
            <div className="border-b border-gray-200 bg-gray-50 px-2 sm:px-6">
              <TabsList className="w-full h-auto p-1 bg-transparent justify-start overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  <TabsTrigger 
                    value="general" 
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">כללי</span>
                    <span className="sm:hidden">כללי</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">משתמשים</span>
                    <span className="sm:hidden">משתמשים</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">אבטחה</span>
                    <span className="sm:hidden">אבטחה</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="audit" 
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">יומן פעילות</span>
                    <span className="sm:hidden">יומן</span>
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            {/* תוכן הטאבים */}
            <div className="p-4 sm:p-6 lg:p-8">
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
