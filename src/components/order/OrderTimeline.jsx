import { Progress } from "@/components/ui/progress"

const steps = ["received", "processing", "ready", "completed"]

export default function OrderTimeline({ currentStatus }) {
  
  const currentIndex = steps.indexOf(currentStatus)
  const progressValue = ((currentIndex + 1) / steps.length) * 100

  return (
    <div className="space-y-3">
      <Progress value={progressValue} className="w-full" />
      <div className="flex justify-between text-sm">
        <span>Pesanan Diterima</span>
        <span>Sedang Diproses</span>
        <span>Siap Diambil</span>
        <span>Selesai</span>
      </div>
    </div>
  )
}
