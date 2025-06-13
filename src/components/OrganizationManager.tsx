
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, Settings } from "lucide-react";
import { useOrganizations, useCreateOrganization } from "@/hooks/useOrganizations";
import EmptyStates from "./EmptyStates";

const OrganizationManager: React.FC = () => {
  const { data: organizations, isLoading } = useOrganizations();
  const createOrganizationMutation = useCreateOrganization();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newOrganization, setNewOrganization] = useState({
    name: '',
    subdomain: ''
  });

  const handleCreateOrganization = async () => {
    if (!newOrganization.name || !newOrganization.subdomain) return;

    await createOrganizationMutation.mutateAsync({
      name: newOrganization.name,
      subdomain: newOrganization.subdomain
    });

    setNewOrganization({ name: '', subdomain: '' });
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return <EmptyStates type="loading" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול ארגונים</h1>
          <p className="text-gray-600 mt-2">
            נהל את כל הארגונים במערכת
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              ארגון חדש
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>יצירת ארגון חדש</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">שם הארגון</Label>
                <Input
                  id="name"
                  value={newOrganization.name}
                  onChange={(e) => setNewOrganization(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="לדוגמה: חברת דמו"
                />
              </div>
              <div>
                <Label htmlFor="subdomain">תת-דומיין</Label>
                <Input
                  id="subdomain"
                  value={newOrganization.subdomain}
                  onChange={(e) => setNewOrganization(prev => ({ ...prev, subdomain: e.target.value }))}
                  placeholder="לדוגמה: demo-company"
                />
              </div>
              <Button 
                onClick={handleCreateOrganization}
                disabled={!newOrganization.name || !newOrganization.subdomain || createOrganizationMutation.isPending}
                className="w-full"
              >
                {createOrganizationMutation.isPending ? 'יוצר...' : 'צור ארגון'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!organizations || organizations.length === 0 ? (
        <EmptyStates type="no-items" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((organization) => (
            <Card key={organization.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {organization.name}
                  </CardTitle>
                  <Badge variant="default">
                    פעיל
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>תת-דומיין:</strong> {organization.subdomain}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>נוצר:</strong> {new Date(organization.created_at).toLocaleDateString('he-IL')}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 ml-1" />
                      חברים
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 ml-1" />
                      הגדרות
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

export default OrganizationManager;
