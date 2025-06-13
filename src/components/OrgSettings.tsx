
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border mb-8 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Building className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
                הגדרות ארגון
              </h1>
              <p className="text-gray-600 text-lg">ניהול הגדרות הארגון, משתמשים ואבטחה</p>
            </div>
            
            <Button 
              onClick={handleSaveSettings} 
              className="bg-blue-600 hover:bg-blue-700 lg:min-w-[200px]"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              שמור הגדרות
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50/80 px-6 lg:px-8 py-2">
              <TabsList className="w-full h-auto p-1 bg-transparent justify-start overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  <TabsTrigger 
                    value="general" 
                    className="flex items-center gap-3 px-6 py-4 text-base font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                  >
                    <Settings className="h-5 w-5" />
                    הגדרות כלליות
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center gap-3 px-6 py-4 text-base font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                  >
                    <Users className="h-5 w-5" />
                    ניהול משתמשים
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="flex items-center gap-3 px-6 py-4 text-base font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                  >
                    <Shield className="h-5 w-5" />
                    הגדרות אבטחה
                  </TabsTrigger>
                  <TabsTrigger 
                    value="audit" 
                    className="flex items-center gap-3 px-6 py-4 text-base font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                  >
                    <History className="h-5 w-5" />
                    יומן פעילות
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="p-6 lg:p-8 xl:p-12">
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
