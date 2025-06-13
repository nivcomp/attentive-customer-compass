
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, FolderOpen } from "lucide-react";
import { useTenants, useCreateTenant } from "@/hooks/useTenants";
import EmptyStates from "./EmptyStates";

const TenantManager: React.FC = () => {
  const { data: tenants, isLoading } = useTenants();
  const createTenantMutation = useCreateTenant();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    subdomain: ''
  });

  const handleCreateTenant = async () => {
    if (!newTenant.name || !newTenant.subdomain) return;

    await createTenantMutation.mutateAsync({
      name: newTenant.name,
      subdomain: newTenant.subdomain
    });

    setNewTenant({ name: '', subdomain: '' });
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return <EmptyStates type="loading" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול טנאנטים</h1>
          <p className="text-gray-600 mt-2">
            נהל את כל הטנאנטים במערכת
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              טנאנט חדש
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>יצירת טנאנט חדש</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">שם הטנאנט</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="לדוגמה: חברת דמו"
                />
              </div>
              <div>
                <Label htmlFor="subdomain">תת-דומיין</Label>
                <Input
                  id="subdomain"
                  value={newTenant.subdomain}
                  onChange={(e) => setNewTenant(prev => ({ ...prev, subdomain: e.target.value }))}
                  placeholder="לדוגמה: demo-company"
                />
              </div>
              <Button 
                onClick={handleCreateTenant}
                disabled={!newTenant.name || !newTenant.subdomain || createTenantMutation.isPending}
                className="w-full"
              >
                {createTenantMutation.isPending ? 'יוצר...' : 'צור טנאנט'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!tenants || tenants.length === 0 ? (
        <EmptyStates type="no-items" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {tenant.name}
                  </CardTitle>
                  <Badge variant={tenant.is_active ? "default" : "secondary"}>
                    {tenant.is_active ? "פעיל" : "לא פעיל"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>תת-דומיין:</strong> {tenant.subdomain}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>סכמה:</strong> {tenant.schema_name}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 ml-1" />
                      משתמשים
                    </Button>
                    <Button size="sm" variant="outline">
                      <FolderOpen className="h-4 w-4 ml-1" />
                      פרויקטים
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantManager;
