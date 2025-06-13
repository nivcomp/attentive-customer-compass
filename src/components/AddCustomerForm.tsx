
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCustomers } from "@/hooks/useCustomers";

interface AddCustomerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddCustomerForm = ({ onSuccess, onCancel }: AddCustomerFormProps) => {
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
  
  const { createCustomer } = useCustomers();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      return; // Basic validation
    }

    setIsSubmitting(true);
    
    try {
      const result = await createCustomer({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        customer_type: formData.customer_type,
        lead_source: formData.lead_source,
        company_name: formData.company_name.trim() || null,
        notes: formData.notes.trim() || null
      });

      if (result) {
        // Success - reset form and close dialog
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          customer_type: 'private',
          lead_source: 'web',
          company_name: '',
          notes: ''
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      customer_type: 'private',
      lead_source: 'web',
      company_name: '',
      notes: ''
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">שם מלא *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="הזן שם מלא"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="email">אימייל *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone">טלפון</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="050-123-4567"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="customer_type">סוג לקוח</Label>
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
          <Label htmlFor="lead_source">מקור הליד</Label>
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
            <Label htmlFor="company_name">שם החברה</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              placeholder="הזן שם החברה"
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="notes">הערות</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="הערות נוספות על הלקוח"
            rows={3}
          />
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
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
          {isSubmitting ? 'שומר...' : 'הוסף לקוח'}
        </Button>
      </div>
    </form>
  );
};

export default AddCustomerForm;
