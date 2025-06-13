
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
    <div className="space-y-8">
      {/* הזמן משתמש חדש */}
      <Card className="shadow-sm border-0 shadow-lg">
        <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <UserPlus className="h-6 w-6 text-green-600" />
            הזמן משתמש חדש
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <UserInviteForm organizationId={organizationId} />
        </CardContent>
      </Card>

      {/* רשימת חברים */}
      <Card className="shadow-sm border-0 shadow-lg">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <Users className="h-6 w-6 text-blue-600" />
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
