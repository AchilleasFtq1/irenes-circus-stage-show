import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export interface FilterOption {
  label: string;
  value: string;
}

export interface SortOption {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}

interface SearchFilterProps<T> {
  data: T[];
  onFilteredData: (filteredData: T[]) => void;
  searchFields: (keyof T)[];
  filterOptions?: {
    field: keyof T;
    options: FilterOption[];
    placeholder?: string;
  }[];
  sortOptions?: {
    field: keyof T;
    options: SortOption[];
  };
  placeholder?: string;
  className?: string;
}

function SearchFilter<T extends Record<string, unknown>>({
  data,
  onFilteredData,
  searchFields,
  filterOptions = [],
  sortOptions,
  placeholder = "Search...",
  className = "",
}: SearchFilterProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([field, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => {
          const itemValue = item[field];
          return itemValue && String(itemValue) === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, searchTerm, activeFilters, sortBy, sortDirection, searchFields]);

  // Update parent component when filtered data changes
  useEffect(() => {
    onFilteredData(filteredData);
  }, [filteredData, onFilteredData]);

  const handleFilterChange = (field: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    setSortBy('');
    setSortDirection('asc');
  };

  const hasActiveFilters = searchTerm || Object.values(activeFilters).some(v => v && v !== 'all') || sortBy;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`${showFilters ? 'bg-gray-100' : ''}`}
          >
            <Filter size={16} className="mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {Object.values(activeFilters).filter(v => v && v !== 'all').length + (searchTerm ? 1 : 0) + (sortBy ? 1 : 0)}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filter Options */}
            {filterOptions.map((filter) => (
              <div key={String(filter.field)}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.placeholder || String(filter.field)}
                </label>
                <Select
                  value={activeFilters[String(filter.field)] || 'all'}
                  onValueChange={(value) => handleFilterChange(String(filter.field), value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {/* Sort Options */}
            {sortOptions && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {sortOptions.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {sortBy && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="px-3"
                    >
                      {sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600 pt-2 border-t">
            Showing {filteredData.length} of {data.length} results
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600">
                (filtered)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
