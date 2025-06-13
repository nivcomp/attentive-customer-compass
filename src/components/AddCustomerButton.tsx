
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddCustomerButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

const AddCustomerButton = ({ onClick, children }: AddCustomerButtonProps) => {
  return (
    <Button onClick={onClick}>
      <Plus className="h-4 w-4 ml-2" />
      {children || 'הוסף לקוח'}
    </Button>
  );
};

export default AddCustomerButton;
