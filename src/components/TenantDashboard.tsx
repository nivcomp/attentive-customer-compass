
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Users, FolderOpen, Calendar } from "lucide-react";
import { useTenantUsers, useTenantProjects } from "@/hooks/useTenants";
import { Tenant } from "@/api/tenants";
import EmptyStates from "./EmptyStates";

interface TenantDashboardProps {
  tenant: Tenant;
}

const TenantDashboard: React.FC<TenantDashboardProps> = ({ tenant }) => {
  const { data: users, isLoading: usersLoading } = useTenantUsers(tenant.schema_name);
  const { data: projects, isLoading: projectsLoading } = useTenantProjects(tenant.schema_name);

  return (
    <div className="space-y-6">
      {/* כותרת הטנאנט */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            <p className="text-blue-100">
              {tenant.subdomain} • {tenant.schema_name}
            </p>
          </div>
        </div>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">משתמשים</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">פרויקטים</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* טבלת משתמשים */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            משתמשים
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <EmptyStates type="loading" />
          ) : !users || users.length === 0 ? (
            <EmptyStates type="no-items" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>אימייל</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(user.created_at).toLocaleDateString('he-IL')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* טבלת פרויקטים */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            פרויקטים
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <EmptyStates type="loading" />
          ) : !projects || projects.length === 0 ? (
            <EmptyStates type="no-items" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם הפרויקט</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.description || 'אין תיאור'}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status === 'active' ? 'פעיל' : 
                         project.status === 'completed' ? 'הושלם' : 
                         project.status === 'planning' ? 'בתכנון' : project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(project.created_at).toLocaleDateString('he-IL')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDashboard;
