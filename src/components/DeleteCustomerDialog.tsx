
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/api/database";
import { useState } from "react";

interface DeleteCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteCustomerDialog = ({ customer, open, onOpenChange }: DeleteCustomerDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteCustomer } = useCustomers();

  const handleDelete = async () => {
    if (!customer) return;

    setIsDeleting(true);
    try {
      await deleteCustomer(customer.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!customer) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
          <AlertDialogDescription>
            פעולה זו תמחק את הלקוח <strong>{customer.name}</strong> לצמיתות מהמערכת.
            לא ניתן לבטל פעולה זו.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>ביטול</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'מוחק...' : 'מחק לקוח'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCustomerDialog;
