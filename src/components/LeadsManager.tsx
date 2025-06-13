
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Star, ArrowRight, Trash2, Edit } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { Lead } from "@/api/leads";
import LeadConversionDialog from "./LeadConversionDialog";

const LeadsManager = () => {
  const { leads, loading, createLead, updateLead, deleteLead, isCreating } = useLeads();
  const { boards } = useDynamicBoards();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    source: 'web',
    status: 'new' as Lead['status'],
    rating: undefined as number | undefined,
    notes: ''
  });

  const handleCreateLead = () => {
    createLead(formData);
    setShowCreateDialog(false);
    setFormData({ name: '', source: 'web', status: 'new', rating: undefined, notes: '' });
  };

  const handleUpdateLead = (lead: Lead) => {
    updateLead({ id: lead.id, updates: formData });
    setEditingLead(null);
    setFormData({ name: '', source: 'web', status: 'new', rating: undefined, notes: '' });
  };

  const openEditDialog = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      source: lead.source,
      status: lead.status,
      rating: lead.rating,
      notes: lead.notes || ''
    });
  };

  const getStatusBadge = (status: Lead['status']) => {
    const statusConfig = {
      new: { label: 'חדש', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'בטיפול', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      converted: { label: 'הומר', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      rejected: { label: 'נדחה', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const renderStars = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">לא דורג</span>;
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const filteredBoards = boards.filter(board => 
    board.name.toLowerCase().includes('company') || 
    board.name.toLowerCase().includes('contact') ||
    board.name.toLowerCase().includes('חברה') || 
    board.name.toLowerCase().includes('קשר')
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ניהול לידים</h2>
          <p className="text-gray-600 mt-1">נהל את הלידים שלך והמר אותם ללקוחות</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 ml-2" />
              ליד חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>יצירת ליד חדש</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">שם</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="שם הליד"
                />
              </div>
              <div>
                <label className="text-sm font-medium">מקור</label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">אתר</SelectItem>
                    <SelectItem value="phone">טלפון</SelectItem>
                    <SelectItem value="email">מייל</SelectItem>
                    <SelectItem value="referral">הפניה</SelectItem>
                    <SelectItem value="social">רשתות חברתיות</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">דירוג (1-5)</label>
                <Select value={formData.rating?.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר דירוג" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 כוכב</SelectItem>
                    <SelectItem value="2">2 כוכבים</SelectItem>
                    <SelectItem value="3">3 כוכבים</SelectItem>
                    <SelectItem value="4">4 כוכבים</SelectItem>
                    <SelectItem value="5">5 כוכבים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">הערות</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="הערות נוספות..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateLead} disabled={!formData.name || isCreating}>
                  {isCreating ? 'יוצר...' : 'צור ליד'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  ביטול
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{leads.length}</div>
            <div className="text-sm text-gray-600">סה"כ לידים</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {leads.filter(lead => lead.status === 'new').length}
            </div>
            <div className="text-sm text-gray-600">לידים חדשים</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {leads.filter(lead => lead.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">בטיפול</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {leads.filter(lead => lead.status === 'converted').length}
            </div>
            <div className="text-sm text-gray-600">הומרו</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>רשימת לידים</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">אין לידים להצגה</p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="mt-4"
                variant="outline"
              >
                <Plus className="h-4 w-4 ml-2" />
                צור ליד ראשון
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>מקור</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>דירוג</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.source}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>{renderStars(lead.rating)}</TableCell>
                    <TableCell>
                      {new Date(lead.created_at).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(lead)}>
                            <Edit className="h-4 w-4 ml-2" />
                            עריכה
                          </DropdownMenuItem>
                          {lead.status !== 'converted' && filteredBoards.length > 0 && (
                            <DropdownMenuItem onClick={() => setConvertingLead(lead)}>
                              <ArrowRight className="h-4 w-4 ml-2" />
                              המר ללקוח
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => deleteLead(lead.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 ml-2" />
                            מחק
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingLead && (
        <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>עריכת ליד</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">שם</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">מקור</label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">אתר</SelectItem>
                    <SelectItem value="phone">טלפון</SelectItem>
                    <SelectItem value="email">מייל</SelectItem>
                    <SelectItem value="referral">הפניה</SelectItem>
                    <SelectItem value="social">רשתות חברתיות</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">סטטוס</label>
                <Select value={formData.status} onValueChange={(value: Lead['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">חדש</SelectItem>
                    <SelectItem value="in_progress">בטיפול</SelectItem>
                    <SelectItem value="converted">הומר</SelectItem>
                    <SelectItem value="rejected">נדחה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">דירוג (1-5)</label>
                <Select value={formData.rating?.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר דירוג" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 כוכב</SelectItem>
                    <SelectItem value="2">2 כוכבים</SelectItem>
                    <SelectItem value="3">3 כוכבים</SelectItem>
                    <SelectItem value="4">4 כוכבים</SelectItem>
                    <SelectItem value="5">5 כוכבים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">הערות</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleUpdateLead(editingLead)}>
                  עדכן
                </Button>
                <Button variant="outline" onClick={() => setEditingLead(null)}>
                  ביטול
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Lead Conversion Dialog */}
      {convertingLead && (
        <LeadConversionDialog
          lead={convertingLead}
          boards={filteredBoards}
          isOpen={!!convertingLead}
          onClose={() => setConvertingLead(null)}
        />
      )}
    </div>
  );
};

export default LeadsManager;
