
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddCustomerForm from "./AddCustomerForm";
import AddCustomerButton from "./AddCustomerButton";

interface AddCustomerDialogProps {
  trigger?: React.ReactNode;
}

const AddCustomerDialog = ({ trigger }: AddCustomerDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <AddCustomerButton onClick={() => setOpen(true)} />}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>הוסף לקוח חדש</DialogTitle>
          <DialogDescription>
            הזן את פרטי הלקוח החדש. שדות חובה מסומנים בכוכבית.
          </DialogDescription>
        </DialogHeader>
        <AddCustomerForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
