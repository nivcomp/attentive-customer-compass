
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TenantManager from "@/components/TenantManager";
import TenantDashboard from "@/components/TenantDashboard";
import { useTenants } from "@/hooks/useTenants";
import { Tenant } from "@/api/tenants";

const Tenants: React.FC = () => {
  const { data: tenants } = useTenants();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  if (selectedTenant) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTenant(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            חזור לרשימת הטנאנטים
          </Button>
        </div>
        <TenantDashboard tenant={selectedTenant} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="manager" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manager">ניהול טנאנטים</TabsTrigger>
          <TabsTrigger value="selector">בחירת טנאנט</TabsTrigger>
        </TabsList>

        <TabsContent value="manager">
          <TenantManager />
        </TabsContent>

        <TabsContent value="selector">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">בחר טנאנט לצפייה</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tenants?.map((tenant) => (
                <div 
                  key={tenant.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedTenant(tenant)}
                >
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <p className="text-sm text-gray-600">{tenant.subdomain}</p>
                </div>
              )) || (
                <p className="text-gray-600">אין טנאנטים זמינים</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tenants;
