import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function OrderActions({ mode = "tracking", onCancel, onRepeat }) {

  const navigate = useNavigate()

  const handleRepeat = () => {
    if (onRepeat) onRepeat()
    navigate("/cart")
  }


  if (mode === "tracking") {
    return (
      <div className="flex gap-2">
        <Button variant="destructive" size="sm" onClick={onCancel}>
          Batalkan Pesanan
        </Button>
      </div>
    )
  }

  if (mode === "history") {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleRepeat}>
          Repeat Order
        </Button>
      </div>
    )
  }

  return null
}
