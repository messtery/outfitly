import { Bell } from "lucide-react"

export default function CustomerTopBar({ title = "Outfitly" }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b px-4 h-14 shadow-sm">
      <span className="text-lg font-bold">{title}</span>
      <button className="relative p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
        <Bell className="w-5 h-5" />
      </button>
    </header>
  )
}
