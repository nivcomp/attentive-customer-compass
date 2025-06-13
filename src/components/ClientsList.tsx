
import CustomersDisplay from './CustomersDisplay';

const ClientsList = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          ניהול לקוחות
        </h1>
        <p className="text-lg text-muted-foreground">
          צפה ונהל את כל הלקוחות שלך במקום אחד
        </p>
      </div>
      
      <CustomersDisplay />
    </div>
  );
};

export default ClientsList;
