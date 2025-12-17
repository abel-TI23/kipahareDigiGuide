/**
 * Loading Skeleton Component
 * Shows placeholder UI while data is loading
 */

interface SkeletonProps {
  count?: number;
  type?: 'card' | 'list' | 'table';
}

export default function Skeleton({ count = 1, type = 'card' }: SkeletonProps) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="museum-card p-4 animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            
            {/* Category skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
            
            {/* Button skeletons */}
            <div className="flex gap-2 mt-4">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="museum-card p-4 flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Table skeleton
  return (
    <div className="museum-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {[...Array(4)].map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {[...Array(count)].map((_, i) => (
            <tr key={i} className="border-t">
              {[...Array(4)].map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
