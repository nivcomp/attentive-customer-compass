
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddOrganizationMember } from "@/hooks/useOrganizations";
import { toast } from "sonner";

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
  );
};

export default UserInviteForm;
