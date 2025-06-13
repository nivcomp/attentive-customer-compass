
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  Filter,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const clients = [
    {
      id: 1,
      name: "יוסי כהן",
      company: "טכנולוגיות מתקדמות בע\"מ",
      email: "yossi@advanced-tech.co.il",
      phone: "050-1234567",
      address: "תל אביב",
      status: "חם",
      lastContact: "היום",
      value: "₪ 50,000"
    },
    {
      id: 2,
      name: "רחל לוי",
      company: "חברת השקעות ר.ל",
      email: "rachel@investments.co.il",
      phone: "052-9876543",
      address: "חיפה",
      status: "פושר",
      lastContact: "אתמול",
      value: "₪ 75,000"
    },
    {
      id: 3,
      name: "דוד אברהם",
      company: "סטארט-אפ חדשני",
      email: "david@startup.co.il",
      phone: "054-5555555",
      address: "ירושלים",
      status: "קר",
      lastContact: "לפני 3 ימים",
      value: "₪ 25,000"
    },
    {
      id: 4,
      name: "מירי שמידט",
      company: "ייעוץ עסקי מקצועי",
      email: "miri@consulting.co.il",
      phone: "053-7777777",
      address: "רמת גן",
      status: "חם",
      lastContact: "לפני שעתיים",
      value: "₪ 90,000"
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'חם': return 'bg-green-100 text-green-800 border-green-200';
      case 'פושר': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'קר': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            ניהול לקוחות
          </h1>
          <p className="text-muted-foreground mt-1">
            נהל את כל הלקוחות שלך במקום אחד
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            סינון
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
            <Plus className="h-4 w-4" />
            לקוח חדש
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לקוחות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-white"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <p className="text-muted-foreground">{client.company}</p>
                      </div>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {client.address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">ערך לקוח</div>
                      <div className="font-semibold text-emerald-600">{client.value}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">קשר אחרון</div>
                      <div className="font-medium">{client.lastContact}</div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          הצג פרטים
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          ערוך
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />
                          התקשר
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          שלח מייל
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsList;
