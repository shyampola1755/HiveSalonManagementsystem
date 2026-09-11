'use client';

import * as React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { debounce, cn } from '@hive/utilities';

export interface SearchProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearchImmediate?: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSearchImmediate,
  debounceMs = 300,
  className,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentVal = isControlled ? controlledValue : internalValue;

  const debouncedOnChange = React.useMemo(
    () =>
      debounce((val: string) => {
        onChange?.(val);
      }, debounceMs),
    [onChange, debounceMs]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) {
      setInternalValue(val);
    }
    debouncedOnChange(val);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onSearchImmediate?.('');
  };

  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={currentVal}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearchImmediate?.(currentVal);
          }
        }}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
      />
      {currentVal && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
