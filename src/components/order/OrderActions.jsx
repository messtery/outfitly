import { Button } from "@/components/ui/button"

export default function OrderActions({ onCancel, onRepeat }) {
  return (
    <div className="flex gap-2">
      <Button variant="destructive" onClick={onCancel}>
        Batalkan Pesanan
      </Button>
      <Button variant="outline" onClick={onRepeat}>
        Repeat Order
      </Button>
    </div>
  )
}
