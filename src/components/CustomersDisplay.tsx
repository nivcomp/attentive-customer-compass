
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/hooks/useCustomers";
import { Users, Mail, Phone, Plus, RefreshCw } from "lucide-react";

const CustomersDisplay = () => {
  const { customers, loading, error, refetch } = useCustomers();

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

  return (
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
            <Button size="sm">
              <Plus className="h-4 w-4 ml-2" />
              הוסף לקוח
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">אין לקוחות במערכת</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 ml-2" />
              הוסף את הלקוח הראשון
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div 
                key={customer.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-lg">{customer.name}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {customer.created_at 
                      ? new Date(customer.created_at).toLocaleDateString('he-IL')
                      : 'חדש'
                    }
                  </Badge>
                  <Button variant="ghost" size="sm">
                    צפייה
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomersDisplay;
