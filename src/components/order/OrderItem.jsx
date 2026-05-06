export default function OrderItem({ item }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{item.qty} {item.product.name}</span>
    </div>
  )
}
