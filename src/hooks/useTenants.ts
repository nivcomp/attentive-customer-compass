
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsAPI, Tenant, TenantUser, TenantProject } from '@/api/tenants';
import { toast } from 'sonner';

export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsAPI.getAll,
  });
};

export const useTenantBySubdomain = (subdomain: string) => {
  return useQuery({
    queryKey: ['tenant', subdomain],
    queryFn: () => tenantsAPI.getBySubdomain(subdomain),
    enabled: !!subdomain,
  });
};

export const useTenantUsers = (schemaName: string) => {
  return useQuery({
    queryKey: ['tenant-users', schemaName],
    queryFn: () => tenantsAPI.getTenantUsers(schemaName),
    enabled: !!schemaName,
  });
};

export const useTenantProjects = (schemaName: string) => {
  return useQuery({
    queryKey: ['tenant-projects', schemaName],
    queryFn: () => tenantsAPI.getTenantProjects(schemaName),
    enabled: !!schemaName,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, subdomain }: { name: string; subdomain: string }) =>
      tenantsAPI.create(name, subdomain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('טנאנט נוצר בהצלחה');
    },
    onError: (error) => {
      console.error('Error creating tenant:', error);
      toast.error('שגיאה ביצירת הטנאנט');
    },
  });
};

export const useCreateTenantUser = (schemaName: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user: { name: string; email: string }) =>
      tenantsAPI.createTenantUser(schemaName, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-users', schemaName] });
      toast.success('משתמש נוצר בהצלחה');
    },
    onError: (error) => {
      console.error('Error creating tenant user:', error);
      toast.error('שגיאה ביצירת המשתמש');
    },
  });
};

export const useCreateTenantProject = (schemaName: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: { name: string; description?: string; status: string }) =>
      tenantsAPI.createTenantProject(schemaName, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-projects', schemaName] });
      toast.success('פרויקט נוצר בהצלחה');
    },
    onError: (error) => {
      console.error('Error creating tenant project:', error);
      toast.error('שגיאה ביצירת הפרויקט');
    },
  });
};
