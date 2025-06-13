
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Crown, Shield, Users, MoreVertical, Trash2 } from "lucide-react";
import { useUpdateMemberRole, useRemoveOrganizationMember } from "@/hooks/useOrganizations";
import { toast } from "sonner";

interface MembersTableProps {
  organizationId: string;
}

const MembersTable = ({ organizationId }: MembersTableProps) => {
  const updateRoleMutation = useUpdateMemberRole(organizationId);
  const removeMemberMutation = useRemoveOrganizationMember(organizationId);

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

  return (
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
  );
};

export default MembersTable;
