
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import UserInviteForm from './UserInviteForm';
import MembersTable from './MembersTable';

interface UserManagementTabProps {
  organizationId: string;
}

const UserManagementTab = ({ organizationId }: UserManagementTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            הזמן משתמש חדש
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserInviteForm organizationId={organizationId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>חברי הארגון</CardTitle>
        </CardHeader>
        <CardContent>
          <MembersTable organizationId={organizationId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
