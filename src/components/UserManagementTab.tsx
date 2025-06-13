
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  Edit2, 
  Trash2, 
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'pending' | 'inactive';
  lastLogin: string;
  joinedAt: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'יוסי כהן',
    email: 'yossi@company.com',
    role: 'admin',
    status: 'active',
    lastLogin: 'היום',
    joinedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'רחל לוי',
    email: 'rachel@company.com',
    role: 'manager',
    status: 'active',
    lastLogin: 'אתמול',
    joinedAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'דוד אברהם',
    email: 'david@company.com',
    role: 'user',
    status: 'pending',
    lastLogin: 'מעולם',
    joinedAt: '2024-03-10'
  },
];

const UserManagementTab = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'user'>('user');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'מנהל';
      case 'manager': return 'מנהל צוות';
      case 'user': return 'משתמש';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'pending': return 'ממתין לאישור';
      case 'inactive': return 'לא פעיל';
      default: return status;
    }
  };

  const handleInviteUser = () => {
    if (inviteEmail.trim()) {
      console.log('Inviting user:', { email: inviteEmail, role: inviteRole });
      setShowInviteForm(false);
      setInviteEmail('');
      setInviteRole('user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 md:pb-6 bg-gradient-to-l from-green-50 to-emerald-50 border-b border-green-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              ניהול משתמשים ({filteredUsers.length})
            </CardTitle>
            <Button
              onClick={() => setShowInviteForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UserPlus className="h-4 w-4 ml-2" />
              הזמן משתמש חדש
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Invite Form */}
          {showInviteForm && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-4">הזמן משתמש חדש</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    type="email"
                    placeholder="כתובת אימייל"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="border-2 focus:border-green-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'manager' | 'user')}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500"
                  >
                    <option value="user">משתמש</option>
                    <option value="manager">מנהל צוות</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleInviteUser} disabled={!inviteEmail.trim()}>
                  <Mail className="h-4 w-4 ml-2" />
                  שלח הזמנה
                </Button>
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  ביטול
                </Button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש משתמש..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 border-2 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
              >
                <option value="all">כל התפקידים</option>
                <option value="admin">מנהל</option>
                <option value="manager">מנהל צוות</option>
                <option value="user">משתמש</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="active">פעיל</option>
                <option value="pending">ממתין</option>
                <option value="inactive">לא פעיל</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">משתמש</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">תפקיד</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">סטטוס</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">כניסה אחרונה</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">הצטרף</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.lastLogin}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(user.joinedAt).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                לא נמצאו משתמשים
              </p>
              <p className="text-gray-500 text-sm mt-2">
                נסה לשנות את החיפוש או המסננים
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
