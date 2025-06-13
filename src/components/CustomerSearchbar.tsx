
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomerSearchbarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export interface SearchFilters {
  customerTypes: string[];
  leadSources: string[];
}

const CustomerSearchbar = ({ onSearch, totalCount, filteredCount }: CustomerSearchbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    customerTypes: [],
    leadSources: []
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value, filters);
  };

  const handleFilterChange = (type: keyof SearchFilters, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters[type] = [...newFilters[type], value];
    } else {
      newFilters[type] = newFilters[type].filter(item => item !== value);
    }
    setFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { customerTypes: [], leadSources: [] };
    setFilters(clearedFilters);
    onSearch(searchQuery, clearedFilters);
  };

  const activeFiltersCount = filters.customerTypes.length + filters.leadSources.length;

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חפש לקוחות לפי שם, אימייל, טלפון או חברה..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange('')}
            className="absolute right-1 top-1 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            פילטרים
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">פילטרים</h4>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  נקה הכל
                </Button>
              )}
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">סוג לקוח</h5>
              <div className="space-y-2">
                {[
                  { value: 'private', label: 'פרטי' },
                  { value: 'business', label: 'עסקי' }
                ].map((type) => (
                  <div key={type.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox
                      id={`customer-type-${type.value}`}
                      checked={filters.customerTypes.includes(type.value)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('customerTypes', type.value, checked as boolean)
                      }
                    />
                    <label htmlFor={`customer-type-${type.value}`} className="text-sm">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">מקור הליד</h5>
              <div className="space-y-2">
                {[
                  { value: 'web', label: 'אתר' },
                  { value: 'phone', label: 'טלפון' },
                  { value: 'referral', label: 'הפניה' }
                ].map((source) => (
                  <div key={source.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox
                      id={`lead-source-${source.value}`}
                      checked={filters.leadSources.includes(source.value)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('leadSources', source.value, checked as boolean)
                      }
                    />
                    <label htmlFor={`lead-source-${source.value}`} className="text-sm">
                      {source.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="text-sm text-muted-foreground">
        {filteredCount !== totalCount ? (
          <>מציג {filteredCount} מתוך {totalCount} לקוחות</>
        ) : (
          <>{totalCount} לקוחות</>
        )}
      </div>
    </div>
  );
};

export default CustomerSearchbar;
