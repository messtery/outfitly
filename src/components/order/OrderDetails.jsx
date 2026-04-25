import { Card } from "@/components/ui/card"

export default function OrderDetails({ items }) {
  return (
    <Card className="p-4 space-y-2">
      <h4 className="font-semibold">Detail Pesanan</h4>
      <ul className="text-sm list-disc list-inside">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.name} x {item.qty}
          </li>
        ))}
      </ul>
    </Card>
  )
}
