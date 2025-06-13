
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
import UserInviteForm from './UserInviteForm';
import MembersTable from './MembersTable';

interface UserManagementTabProps {
  organizationId: string;
}

const UserManagementTab = ({ organizationId }: UserManagementTabProps) => {
  return (
    <div className="space-y-6">
      {/* הזמן משתמש חדש */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-green-600" />
            הזמן משתמש חדש
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserInviteForm organizationId={organizationId} />
        </CardContent>
      </Card>

      {/* רשימת חברים */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-600" />
            חברי הארגון
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <MembersTable organizationId={organizationId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
