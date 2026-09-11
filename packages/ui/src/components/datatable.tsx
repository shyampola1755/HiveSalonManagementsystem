'use client';

import * as React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table';
import { Pagination } from './pagination';
import { EmptyState } from './empty-state';
import { LoadingState } from './loading-state';
import { cn } from '@hive/utilities';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  // Sorting
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
  // Pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display right now.',
  emptyActionLabel,
  onEmptyAction,
  sortColumn,
  sortDirection,
  onSort,
  pagination,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingState count={5} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        primaryActionLabel={emptyActionLabel}
        onPrimaryAction={onEmptyAction}
      />
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.sortable && onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort(col.key)}
                    className="flex items-center gap-1.5 hover:text-slate-950 dark:hover:text-white transition-colors"
                  >
                    <span>{col.header}</span>
                    {sortColumn === col.key ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="h-3.5 w-3.5 text-amber-600" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5 text-amber-600" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id || index}>
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.cell(row, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  );
}
