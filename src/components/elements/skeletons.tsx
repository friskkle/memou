const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function EditorSkeleton() {
    return (
        <div className="p-4 max-w-4xl mx-auto w-full">
            <div className={`${shimmer} mb-4 h-8 w-1/3 rounded bg-gray-100 relative overflow-hidden shadow-sm`}/>
            <div className={`${shimmer} mt-4 relative overflow-hidden rounded-lg bg-gray-100 p-2 h-96 shadow-sm`}/>
        </div>
    )
}