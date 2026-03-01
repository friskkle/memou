import { EditorSkeleton } from "@/src/components/elements/skeletons";


export default function Loading() {
    return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 mt-2 relative">
        <EditorSkeleton />
    </div>)
}