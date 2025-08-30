import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Specific skeleton components for common use cases
function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-white rounded-lg shadow-md p-6", className)} {...props}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  )
}

function TableSkeleton({ rows = 5, columns = 4, className, ...props }: { 
  rows?: number; 
  columns?: number; 
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)} {...props}>
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded flex-1"></div>
          ))}
        </div>
      </div>
      
      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className={cn(
                    "h-4 bg-gray-300 rounded animate-pulse flex-1",
                    colIndex === 0 && "w-1/4", // First column smaller
                    colIndex === columns - 1 && "w-1/6" // Last column smaller
                  )}
                  style={{
                    animationDelay: `${(rowIndex * columns + colIndex) * 50}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GallerySkeleton({ items = 6, className, ...props }: { 
  items?: number; 
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)} {...props}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EventSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-md">
          <div className="animate-pulse flex items-center gap-4">
            <div className="bg-gray-300 rounded-lg w-20 h-20 flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="w-24 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DashboardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="w-12 h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Table Skeleton */}
      <TableSkeleton rows={8} columns={6} />
    </div>
  )
}

export { 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  GallerySkeleton, 
  EventSkeleton, 
  DashboardSkeleton 
};