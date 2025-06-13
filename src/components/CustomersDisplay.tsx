
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/hooks/useCustomers";
import { Users, Mail, Phone, RefreshCw, Building2, User, Edit, Trash2, Eye } from "lucide-react";
import AddCustomerDialog from "./AddCustomerDialog";
import EditCustomerDialog from "./EditCustomerDialog";
import ViewCustomerDialog from "./ViewCustomerDialog";
import DeleteCustomerDialog from "./DeleteCustomerDialog";
import CustomerSearchbar, { SearchFilters } from "./CustomerSearchbar";
import { Customer } from "@/api/database";

const CustomersDisplay = () => {
  const { customers, loading, error, refetch } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    customerTypes: [],
    leadSources: []
  });

  // Filter customers based on search query and filters
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.toLowerCase().includes(query)) ||
        (customer.company_name && customer.company_name.toLowerCase().includes(query))
      );
    }

    // Apply customer type filters
    if (searchFilters.customerTypes.length > 0) {
      filtered = filtered.filter(customer =>
        searchFilters.customerTypes.includes(customer.customer_type || 'private')
      );
    }

    // Apply lead source filters
    if (searchFilters.leadSources.length > 0) {
      filtered = filtered.filter(customer =>
        searchFilters.leadSources.includes(customer.lead_source || 'web')
      );
    }

    return filtered;
  }, [customers, searchQuery, searchFilters]);

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            לקוחות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 rtl:space-x-reverse">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            לקוחות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              נסה שוב
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCustomerTypeIcon = (type: string | null) => {
    return type === 'business' ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getCustomerTypeLabel = (type: string | null) => {
    return type === 'business' ? 'עסקי' : 'פרטי';
  };

  const getLeadSourceColor = (source: string | null) => {
    switch (source) {
      case 'web': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'referral': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadSourceLabel = (source: string | null) => {
    switch (source) {
      case 'web': return 'אתר';
      case 'phone': return 'טלפון';
      case 'referral': return 'הפניה';
      default: return 'לא ידוע';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              לקוחות ({customers.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={refetch} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <AddCustomerDialog />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomerSearchbar 
            onSearch={handleSearch}
            totalCount={customers.length}
            filteredCount={filteredCustomers.length}
          />

          {customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">אין לקוחות במערכת</p>
              <div className="mt-4">
                <AddCustomerDialog 
                  trigger={
                    <Button>
                      הוסף את הלקוח הראשון
                    </Button>
                  }
                />
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">לא נמצאו לקוחות תואמים לחיפוש</p>
              <p className="text-sm text-muted-foreground">נסה לשנות את תנאי החיפוש או הפילטרים</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div 
                  key={customer.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-lg">
                        {highlightText(customer.name, searchQuery)}
                      </div>
                      {customer.company_name && customer.customer_type === 'business' && (
                        <div className="text-sm text-muted-foreground mb-1">
                          {highlightText(customer.company_name, searchQuery)}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {highlightText(customer.email, searchQuery)}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {highlightText(customer.phone, searchQuery)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getCustomerTypeIcon(customer.customer_type)}
                      <span className="text-sm">{getCustomerTypeLabel(customer.customer_type)}</span>
                    </div>
                    <Badge variant="outline" className={getLeadSourceColor(customer.lead_source)}>
                      {getLeadSourceLabel(customer.lead_source)}
                    </Badge>
                    <Badge variant="outline">
                      {customer.created_at 
                        ? new Date(customer.created_at).toLocaleDateString('he-IL')
                        : 'חדש'
                      }
                    </Badge>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setViewingCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingCustomer(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeletingCustomer(customer)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditCustomerDialog
        customer={editingCustomer}
        open={!!editingCustomer}
        onOpenChange={(open) => !open && setEditingCustomer(null)}
      />

      <ViewCustomerDialog
        customer={viewingCustomer}
        open={!!viewingCustomer}
        onOpenChange={(open) => !open && setViewingCustomer(null)}
      />

      <DeleteCustomerDialog
        customer={deletingCustomer}
        open={!!deletingCustomer}
        onOpenChange={(open) => !open && setDeletingCustomer(null)}
      />
    </>
  );
};

export default CustomersDisplay;
