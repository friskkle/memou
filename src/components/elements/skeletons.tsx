const shimmer = 'shimmer animate-shimmer';

export function EditorSkeleton() {
  return (
    <div className="p-4 max-w-4xl mx-auto w-full animate-pulse">
      <div className={`${shimmer} relative mb-4 h-8 w-1/3 rounded bg-gradient-to-r from-gray-300 to-gray-100 overflow-hidden shadow-sm`} />
      <div className={`${shimmer} relative mt-4 h-20 rounded-lg bg-gradient-to-r from-gray-300 to-gray-100 overflow-hidden shadow-sm`} />
      <div className={`${shimmer} relative mt-4 h-96 rounded-lg bg-gradient-to-r from-gray-300 to-gray-100 overflow-hidden shadow-sm`} />
    </div>
  );
}

export function ListSkeleton() {
    return (
        <div className="p-4 max-w-4xl mx-auto w-full">
            <div className="flex justify-between">
                <div className={`${shimmer} mb-4 h-8 w-1/3 rounded bg-gradient-to-r from-gray-300 to-gray-100 relative overflow-hidden shadow-sm`}/>
                <div className={`${shimmer} mb-4 h-8 w-1/5 rounded bg-gradient-to-r from-gray-300 to-gray-100 relative overflow-hidden shadow-sm`}/>
            </div>
            <div className={`${shimmer} mt-4 relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-300 to-gray-100 p-2 h-48 shadow-sm`}/>
        </div>
    )
}