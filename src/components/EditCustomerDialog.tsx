
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/api/database";

interface EditCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditCustomerDialog = ({ customer, open, onOpenChange }: EditCustomerDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    customer_type: 'private' as 'private' | 'business',
    lead_source: 'web' as 'web' | 'phone' | 'referral',
    company_name: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateCustomer } = useCustomers();

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        customer_type: (customer.customer_type as 'private' | 'business') || 'private',
        lead_source: (customer.lead_source as 'web' | 'phone' | 'referral') || 'web',
        company_name: customer.company_name || '',
        notes: customer.notes || ''
      });
    }
  }, [customer]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer || !formData.name.trim() || !formData.email.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await updateCustomer(customer.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        customer_type: formData.customer_type,
        lead_source: formData.lead_source,
        company_name: formData.company_name.trim() || null,
        notes: formData.notes.trim() || null
      });

      if (result) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        customer_type: (customer.customer_type as 'private' | 'business') || 'private',
        lead_source: (customer.lead_source as 'web' | 'phone' | 'referral') || 'web',
        company_name: customer.company_name || '',
        notes: customer.notes || ''
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>עריכת לקוח</DialogTitle>
          <DialogDescription>
            ערוך את פרטי הלקוח. שדות חובה מסומנים בכוכבית.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">שם מלא *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="הזן שם מלא"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-email">אימייל *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">טלפון</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="050-123-4567"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-customer_type">סוג לקוח</Label>
              <Select 
                value={formData.customer_type} 
                onValueChange={(value) => handleInputChange('customer_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג לקוח" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">פרטי</SelectItem>
                  <SelectItem value="business">עסקי</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-lead_source">מקור הליד</Label>
              <Select 
                value={formData.lead_source} 
                onValueChange={(value) => handleInputChange('lead_source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר מקור הליד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">אתר</SelectItem>
                  <SelectItem value="phone">טלפון</SelectItem>
                  <SelectItem value="referral">הפניה</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.customer_type === 'business' && (
              <div className="grid gap-2">
                <Label htmlFor="edit-company_name">שם החברה</Label>
                <Input
                  id="edit-company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="הזן שם החברה"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-notes">הערות</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="הערות נוספות על הלקוח"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
            >
              {isSubmitting ? 'שומר...' : 'שמור שינויים'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
