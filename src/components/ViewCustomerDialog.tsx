
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Customer } from "@/api/database";
import { Mail, Phone, Building2, User, Calendar, FileText, Globe } from "lucide-react";

interface ViewCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewCustomerDialog = ({ customer, open, onOpenChange }: ViewCustomerDialogProps) => {
  if (!customer) return null;

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא זמין';
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="text-xl font-bold">{customer.name}</div>
              {customer.company_name && customer.customer_type === 'business' && (
                <div className="text-sm text-muted-foreground">{customer.company_name}</div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* פרטי קשר */}
          <div>
            <h3 className="text-lg font-semibold mb-3">פרטי קשר</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* פרטים כלליים */}
          <div>
            <h3 className="text-lg font-semibold mb-3">פרטים כלליים</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">סוג לקוח</div>
                <div className="flex items-center gap-2">
                  {getCustomerTypeIcon(customer.customer_type)}
                  <span>{getCustomerTypeLabel(customer.customer_type)}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">מקור הליד</div>
                <Badge variant="outline" className={getLeadSourceColor(customer.lead_source)}>
                  {getLeadSourceLabel(customer.lead_source)}
                </Badge>
              </div>
              {customer.company_name && (
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">שם החברה</div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.company_name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* תאריכים */}
          <div>
            <h3 className="text-lg font-semibold mb-3">מידע זמנים</h3>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">נוצר בתאריך</div>
                <div>{formatDate(customer.created_at)}</div>
              </div>
            </div>
          </div>

          {/* הערות */}
          {customer.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  הערות
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomerDialog;
