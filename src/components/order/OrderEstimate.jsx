import { Card } from "@/components/ui/card"

export default function OrderEstimate({ minutes }) {
  return (
    <Card className="p-4">
      <h4 className="font-semibold">Estimasi Waktu</h4>
      <p className="text-sm text-muted-foreground">
        Pesanan diperkirakan selesai dalam {minutes} menit
      </p>
    </Card>
  )
}
