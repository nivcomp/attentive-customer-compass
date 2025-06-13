
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label htmlFor="inviteEmail" className="text-base font-semibold text-gray-700">
            כתובת אימייל
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="inviteEmail"
              type="email"
              placeholder="user@company.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="pl-12 h-12 text-base border-2 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-700">תפקיד</Label>
          <Select value={newMemberRole} onValueChange={setNewMemberRole}>
            <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 shadow-lg">
              <SelectItem value="member" className="text-base py-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4" />
                  חבר
                </div>
              </SelectItem>
              <SelectItem value="admin" className="text-base py-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4" />
                  מנהל
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-700">פעולה</Label>
          <Button 
            onClick={handleInviteUser} 
            disabled={isInviting || !newMemberEmail.trim()}
            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            {isInviting ? 'שולח הזמנה...' : 'שלח הזמנה'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInviteForm;
