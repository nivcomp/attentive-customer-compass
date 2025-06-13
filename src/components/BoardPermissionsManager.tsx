
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Settings, Trash2, Shield } from "lucide-react";
import { useBoardPermissions, useAddBoardPermission, useUpdateBoardPermission, useRemoveBoardPermission } from "@/hooks/useBoardPermissions";

interface BoardPermissionsManagerProps {
  boardId: string;
}

const BoardPermissionsManager = ({ boardId }: BoardPermissionsManagerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newPermissionType, setNewPermissionType] = useState<'view' | 'edit' | 'admin'>('view');

  const { data: permissions = [], isLoading } = useBoardPermissions(boardId);
  const addPermissionMutation = useAddBoardPermission(boardId);
  const updatePermissionMutation = useUpdateBoardPermission(boardId);
  const removePermissionMutation = useRemoveBoardPermission(boardId);

  const handleAddPermission = async () => {
    if (!newUserEmail.trim()) return;
    
    try {
      // בפועל נצטרך לחפש את המשתמש לפי email ולקבל את ה-user_id
      // לעת עתה נשתמש בזה כ-placeholder
      await addPermissionMutation.mutateAsync({
        userId: newUserEmail, // זה יהיה user_id במציאות
        permissionType: newPermissionType
      });
      
      setNewUserEmail('');
      setShowAddDialog(false);
    } catch (error) {
      console.error('Failed to add permission:', error);
    }
  };

  const getPermissionLabel = (type: string) => {
    const labels = {
      view: 'צפייה',
      edit: 'עריכה',
      admin: 'מנהל'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPermissionBadgeVariant = (type: string) => {
    switch (type) {
      case 'admin': return 'destructive';
      case 'edit': return 'default';
      case 'view': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            הרשאות בורד
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            הרשאות בורד
          </CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 ml-2" />
                הוסף הרשאה
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>הוספת הרשאה חדשה</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    אימייל המשתמש
                  </label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    סוג הרשאה
                  </label>
                  <Select value={newPermissionType} onValueChange={(value: 'view' | 'edit' | 'admin') => setNewPermissionType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">צפייה</SelectItem>
                      <SelectItem value="edit">עריכה</SelectItem>
                      <SelectItem value="admin">מנהל</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleAddPermission} 
                  disabled={addPermissionMutation.isPending}
                  className="w-full"
                >
                  {addPermissionMutation.isPending ? 'מוסיף...' : 'הוסף הרשאה'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {permissions.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">אין הרשאות מוגדרות</p>
          </div>
        ) : (
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{permission.user_id}</p>
                    <p className="text-xs text-gray-500">
                      נוצר: {new Date(permission.granted_at).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getPermissionBadgeVariant(permission.permission_type)}
                    className="text-xs"
                  >
                    {getPermissionLabel(permission.permission_type)}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // כאן נוכל להוסיף דיאלוג עריכה
                        console.log('Edit permission:', permission.id);
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('האם אתה בטוח שברצונך להסיר הרשאה זו?')) {
                          removePermissionMutation.mutate(permission.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BoardPermissionsManager;
