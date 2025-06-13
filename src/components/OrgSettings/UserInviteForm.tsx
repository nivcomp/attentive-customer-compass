
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddOrganizationMember } from "@/hooks/useOrganizations";
import { toast } from "sonner";
import { Mail, UserCheck } from "lucide-react";

interface UserInviteFormProps {
  organizationId: string;
}

const UserInviteForm = ({ organizationId }: UserInviteFormProps) => {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [isInviting, setIsInviting] = useState(false);
  
  const addMemberMutation = useAddOrganizationMember(organizationId);

  const handleInviteUser = async () => {
    if (!newMemberEmail.trim()) {
      toast.error('אנא הכנס כתובת אימייל');
      return;
    }

    // בדיקת תקינות אימייל בסיסית
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail.trim())) {
      toast.error('אנא הכנס כתובת אימייל תקינה');
      return;
    }

    setIsInviting(true);
    try {
      await addMemberMutation.mutateAsync({
        userId: `temp-${Date.now()}`,
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inviteEmail" className="text-sm font-medium">
            כתובת אימייל
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="inviteEmail"
              type="email"
              placeholder="user@company.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">תפקיד</Label>
          <Select value={newMemberRole} onValueChange={setNewMemberRole}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  חבר
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  מנהל
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label className="text-sm font-medium opacity-0">פעולה</Label>
          <Button 
            onClick={handleInviteUser} 
            disabled={isInviting || !newMemberEmail.trim()}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
          >
            {isInviting ? 'מזמין...' : 'שלח הזמנה'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInviteForm;
