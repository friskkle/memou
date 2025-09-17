'use client'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    // Go up one step in the route
    if (typeof window !== 'undefined') {
      const segments = window.location.pathname.split('/')
      if (segments.length > 2) {
        const upOne = segments.slice(0, -1).join('/') || '/'
        router.push(upOne)
      } else {
        router.push('/')
      }
    }
  }

  return (
    <button
      type="button"
      className="flex items-center justify-center px-4 py-2 rounded bg-[#e0e0e043] hover:bg-[#dadada9f] focus:bg-gray-300 text-gray-800 font-bold text-center"
      onClick={handleBack}
    >
      ←
    </button>
  )
}