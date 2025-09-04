import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TableSkeleton } from '@/components/ui/skeleton';

export interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  deleteConfirmation?: {
    title: string;
    description: string;
  };
}

function DataTable<T extends { _id: string }>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = "No data available",
  className = "",
  onEdit,
  onDelete,
  onView,
  deleteConfirmation = {
    title: "Are you sure?",
    description: "This action cannot be undone."
  }
}: DataTableProps<T>) {
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Default actions
  const defaultActions: Action<T>[] = [
    ...(onView ? [{
      label: 'View',
      icon: <Eye size={16} />,
      onClick: onView,
    }] : []),
    ...(onEdit ? [{
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: onEdit,
    }] : []),
    ...(onDelete ? [{
      label: 'Delete',
      icon: <Trash2 size={16} />,
      onClick: (item: T) => setDeleteItem(item),
      variant: 'destructive' as const,
    }] : []),
    ...actions,
  ];

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (deleteItem && onDelete) {
      await onDelete(deleteItem);
      setDeleteItem(null);
    }
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length + (defaultActions.length > 0 ? 1 : 0)} />;
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            📋
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Found</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.title}
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-blue-500">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {defaultActions.length > 0 && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? (
                        column.render(item[column.key], item)
                      ) : (
                        <div className="text-sm text-gray-900">
                          {String(item[column.key] || '')}
                        </div>
                      )}
                    </td>
                  ))}
                  {defaultActions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {defaultActions.map((action, actionIndex) => {
                            if (action.show && !action.show(item)) return null;
                            
                            return (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => action.onClick(item)}
                                className={action.variant === 'destructive' ? 'text-red-600' : ''}
                              >
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Results Count */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {sortedData.length} of {data.length} entries
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteConfirmation.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmation.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DataTable;
