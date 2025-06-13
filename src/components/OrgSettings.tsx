import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  Users, 
  Shield, 
  History, 
  Save, 
  UserPlus, 
  MoreVertical, 
  Crown, 
  Eye, 
  Edit,
  Trash2,
  Calendar,
  Building,
  Globe,
  Lock,
  Mail,
  Clock,
  Palette
} from "lucide-react";
import { useOrganizations, useOrganizationMembers, useAddOrganizationMember, useUpdateMemberRole, useRemoveOrganizationMember, useUpdateOrganization } from "@/hooks/useOrganizations";
import { toast } from "sonner";

interface OrgSettingsProps {
  organizationId?: string;
}

interface AuditLogEntry {
  id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: any;
  performed_at: string;
  user_id: string;
}

const OrgSettings = ({ organizationId = "demo-org-id" }: OrgSettingsProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [isInviting, setIsInviting] = useState(false);

  const { data: organizations } = useOrganizations();
  const { data: members } = useOrganizationMembers(organizationId);
  const addMemberMutation = useAddOrganizationMember(organizationId);
  const updateRoleMutation = useUpdateMemberRole(organizationId);
  const removeMemberMutation = useRemoveOrganizationMember(organizationId);
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

  const mockAuditLog: AuditLogEntry[] = [
    {
      id: '1',
      action_type: 'user_invited',
      target_type: 'user',
      target_id: 'user-123',
      details: { email: 'user@example.com', role: 'member' },
      performed_at: new Date().toISOString(),
      user_id: 'admin-user'
    },
    {
      id: '2',
      action_type: 'board_created',
      target_type: 'board',
      target_id: 'board-456',
      details: { board_name: 'בורד פרויקט חדש' },
      performed_at: new Date(Date.now() - 86400000).toISOString(),
      user_id: 'admin-user'
    }
  ];

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

  const handleInviteUser = async () => {
    if (!newMemberEmail.trim()) {
      toast.error('אנא הכנס כתובת אימייל');
      return;
    }

    setIsInviting(true);
    try {
      // In a real app, this would create a user invitation
      // For now, we'll simulate adding the user directly
      await addMemberMutation.mutateAsync({
        userId: `temp-${Date.now()}`, // This would be the actual user ID
        role: newMemberRole
      });
      
      setNewMemberEmail('');
      setNewMemberRole('member');
      toast.success('המשתמש הוזמן בהצלחה');
    } catch (error) {
      toast.error('שגיאה בהזמנת המשתמש');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await updateRoleMutation.mutateAsync({ id: memberId, role: newRole });
    } catch (error) {
      toast.error('שגיאה בעדכון התפקיד');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMemberMutation.mutateAsync(memberId);
    } catch (error) {
      toast.error('שגיאה בהסרת החבר');
    }
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      owner: 'בעלים',
      admin: 'מנהל',
      member: 'חבר'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getActionTypeLabel = (actionType: string) => {
    const labels = {
      user_invited: 'הזמנת משתמש',
      user_removed: 'הסרת משתמש',
      role_changed: 'שינוי תפקיד',
      board_created: 'יצירת בורד',
      board_deleted: 'מחיקת בורד',
      settings_updated: 'עדכון הגדרות'
    };
    return labels[actionType as keyof typeof labels] || actionType;
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

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6">
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
                    onChange={(e) => setOrgSettings({...orgSettings, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="logo">כתובת לוגו</Label>
                  <Input
                    id="logo"
                    placeholder="https://example.com/logo.png"
                    value={orgSettings.logo_url}
                    onChange={(e) => setOrgSettings({...orgSettings, logo_url: e.target.value})}
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
                        onChange={(e) => setOrgSettings({...orgSettings, primary_color: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={orgSettings.primary_color}
                        onChange={(e) => setOrgSettings({...orgSettings, primary_color: e.target.value})}
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
                        onChange={(e) => setOrgSettings({...orgSettings, secondary_color: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={orgSettings.secondary_color}
                        onChange={(e) => setOrgSettings({...orgSettings, secondary_color: e.target.value})}
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
                    onValueChange={(value) => setOrgSettings({...orgSettings, board_creation_policy: value})}
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
                    onValueChange={(value) => setOrgSettings({...orgSettings, default_board_permission: value})}
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
                    onCheckedChange={(checked) => setOrgSettings({...orgSettings, require_board_approval: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                הזמן משתמש חדש
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="כתובת אימייל"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="flex-1"
                />
                <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">חבר</SelectItem>
                    <SelectItem value="admin">מנהל</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleInviteUser} disabled={isInviting}>
                  {isInviting ? 'מזמין...' : 'הזמן'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>חברי הארגון</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>משתמש</TableHead>
                    <TableHead>תפקיד</TableHead>
                    <TableHead>הצטרף בתאריך</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Mock data for demonstration */}
                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-medium">יוסי כהן</p>
                        <p className="text-sm text-gray-600">yossi@company.com</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Crown className="h-3 w-3" />
                        בעלים
                      </Badge>
                    </TableCell>
                    <TableCell>15/12/2023</TableCell>
                    <TableCell>
                      <Badge variant="default">פעיל</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400">-</span>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div>
                        <p className="font-medium">שרה לוי</p>
                        <p className="text-sm text-gray-600">sara@company.com</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Shield className="h-3 w-3" />
                        מנהל
                      </Badge>
                    </TableCell>
                    <TableCell>20/12/2023</TableCell>
                    <TableCell>
                      <Badge variant="default">פעיל</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRoleChange('sara-id', 'member')}>
                            שנה לחבר
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemoveMember('sara-id')}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            הסר מהארגון
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                הגבלות אימייל
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="allowedDomains">דומיינים מורשים (מופרדים בפסיקים)</Label>
                <Input
                  id="allowedDomains"
                  placeholder="company.com, partner.co.il"
                  value={orgSettings.allowed_email_domains}
                  onChange={(e) => setOrgSettings({...orgSettings, allowed_email_domains: e.target.value})}
                />
                <p className="text-sm text-gray-600 mt-1">
                  משתמשים יוכלו להצטרף רק עם כתובות אימייל מהדומיינים המורשים
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">הגבל הזמנות למנהלים</p>
                  <p className="text-sm text-gray-600">רק מנהלים יוכלו להזמין משתמשים חדשים</p>
                </div>
                <Switch
                  checked={orgSettings.restrict_invitations_to_admins}
                  onCheckedChange={(checked) => setOrgSettings({...orgSettings, restrict_invitations_to_admins: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                הגדרות התחברות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sessionTimeout">זמן פקיעת חיבור (שעות)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="1"
                  max="168"
                  value={orgSettings.session_timeout_hours}
                  onChange={(e) => setOrgSettings({...orgSettings, session_timeout_hours: parseInt(e.target.value) || 24})}
                />
                <p className="text-sm text-gray-600 mt-1">
                  משתמשים יתנתקו אוטומטית לאחר תקופה זו של חוסר פעילות
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                יומן פעילות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>פעולה</TableHead>
                    <TableHead>משתמש</TableHead>
                    <TableHead>פרטים</TableHead>
                    <TableHead>תאריך</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {getActionTypeLabel(entry.action_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">מנהל המערכת</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {entry.action_type === 'user_invited' && 
                            `הוזמן: ${entry.details.email} כ${getRoleLabel(entry.details.role)}`}
                          {entry.action_type === 'board_created' && 
                            `נוצר בורד: ${entry.details.board_name}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(entry.performed_at).toLocaleDateString('he-IL')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgSettings;
