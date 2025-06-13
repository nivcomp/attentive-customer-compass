
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
    <div className="space-y-6 md:space-y-8">
      {/* הזמן משתמש חדש */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-green-50 to-emerald-50 border-b border-green-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <UserPlus className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            הזמן משתמש חדש
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8">
          <UserInviteForm organizationId={organizationId} />
        </CardContent>
      </Card>

      {/* רשימת חברים */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-blue-50 to-indigo-50 border-b border-blue-100/50">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
            <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
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
