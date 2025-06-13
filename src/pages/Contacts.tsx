
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Mail, User } from "lucide-react";

const Contacts = () => {
  // נתונים לדוגמה
  const contacts = [
    { id: 1, name: 'יוסי כהן', email: 'yossi@example.com', phone: '050-1234567', company: 'חברת ABC' },
    { id: 2, name: 'דנה לוי', email: 'dana@example.com', phone: '052-7654321', company: 'חברת XYZ' },
    { id: 3, name: 'משה ישראלי', email: 'moshe@example.com', phone: '054-9876543', company: 'סטארט-אפ חדש' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">אנשי קשר</h1>
          <p className="text-gray-600 mt-2">ניהול רשימת אנשי הקשר שלך</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          הוסף איש קשר
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            רשימת אנשי קשר
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם</TableHead>
                <TableHead className="text-right">אימייל</TableHead>
                <TableHead className="text-right">טלפון</TableHead>
                <TableHead className="text-right">חברה</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {contact.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {contact.phone}
                    </div>
                  </TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">עריכה</Button>
                      <Button variant="outline" size="sm">צפיה</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
