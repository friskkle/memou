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
      className="flex items-center justify-center font-bold text-center px-4 py-2 rounded
        bg-[#e0e0e043] hover:bg-[#dadada9f] hover:-translate-y-0.5 hover:shadow-sm active:bg-gray-200 active:translate-0
        transition duration-100 ease-in-out"
      onClick={handleBack}
    >
      ←
    </button>
  )
}