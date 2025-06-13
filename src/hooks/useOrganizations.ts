
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsAPI, Organization, OrganizationUser } from '@/api/organizations';
import { toast } from 'sonner';

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationsAPI.getAll,
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: () => organizationsAPI.getById(id),
    enabled: !!id,
  });
};

export const useOrganizationBySubdomain = (subdomain: string) => {
  return useQuery({
    queryKey: ['organization', 'subdomain', subdomain],
    queryFn: () => organizationsAPI.getBySubdomain(subdomain),
    enabled: !!subdomain,
  });
};

export const useOrganizationMembers = (organizationId: string) => {
  return useQuery({
    queryKey: ['organization-members', organizationId],
    queryFn: () => organizationsAPI.getMembers(organizationId),
    enabled: !!organizationId,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, subdomain }: { name: string; subdomain: string }) =>
      organizationsAPI.create(name, subdomain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('ארגון נוצר בהצלחה');
    },
    onError: (error) => {
      console.error('Error creating organization:', error);
      toast.error('שגיאה ביצירת הארגון');
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Organization> }) =>
      organizationsAPI.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization', data.id] });
      toast.success('ארגון עודכן בהצלחה');
    },
    onError: (error) => {
      console.error('Error updating organization:', error);
      toast.error('שגיאה בעדכון הארגון');
    },
  });
};

export const useAddOrganizationMember = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role?: string }) =>
      organizationsAPI.addMember(organizationId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members', organizationId] });
      toast.success('חבר נוסף בהצלחה');
    },
    onError: (error) => {
      console.error('Error adding member:', error);
      toast.error('שגיאה בהוספת החבר');
    },
  });
};

export const useUpdateMemberRole = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      organizationsAPI.updateMemberRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members', organizationId] });
      toast.success('תפקיד עודכן בהצלחה');
    },
    onError: (error) => {
      console.error('Error updating member role:', error);
      toast.error('שגיאה בעדכון התפקיד');
    },
  });
};

export const useRemoveOrganizationMember = (organizationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => organizationsAPI.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members', organizationId] });
      toast.success('חבר הוסר בהצלחה');
    },
    onError: (error) => {
      console.error('Error removing member:', error);
      toast.error('שגיאה בהסרת החבר');
    },
  });
};
