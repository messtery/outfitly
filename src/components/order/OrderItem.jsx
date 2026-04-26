export default function OrderItem({ item }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{item.name} x {item.qty}</span>
    </div>
  )
}
