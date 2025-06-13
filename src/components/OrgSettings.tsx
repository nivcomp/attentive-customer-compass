
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-8 w-8" />
            הגדרות ארגון
          </h1>
          <p className="text-gray-600 mt-1">ניהול הגדרות הארגון, משתמשים ואבטחה</p>
        </div>
        
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          שמור הגדרות
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            כללי
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            משתמשים
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            אבטחה
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            יומן פעילות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettingsTab 
            orgSettings={orgSettings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTab organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettingsTab 
            orgSettings={orgSettings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgSettings;
