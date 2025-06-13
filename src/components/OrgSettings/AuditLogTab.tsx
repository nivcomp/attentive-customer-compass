
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Calendar } from "lucide-react";

interface AuditLogEntry {
  id: string;
  action_type: string;
  details: any;
  performed_at: string;
}

const AuditLogTab = () => {
  const mockAuditLog: AuditLogEntry[] = [
    {
      id: '1',
      action_type: 'user_invited',
      details: { email: 'user@example.com', role: 'member' },
      performed_at: new Date().toISOString(),
    },
    {
      id: '2',
      action_type: 'board_created',
      details: { board_name: 'בורד פרויקט חדש' },
      performed_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

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

  const getRoleLabel = (role: string) => {
    const labels = {
      owner: 'בעלים',
      admin: 'מנהל',
      member: 'חבר'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default AuditLogTab;
