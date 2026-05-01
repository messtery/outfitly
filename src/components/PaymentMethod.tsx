import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const dummyMethods = [
    { id: 1, code: "gopay", name: "GoPay" },
    { id: 2, code: "ovo", name: "OVO" },
    { id: 3, code: "bank_transfer", name: "Bank Transfer" },
]

export default function PaymentMethod() {
    const [selected, setSelected] = useState("")

    return (
        <div className="space-y-4 flex-col ">
            <h2 className="text-lg font-semibold text-center">Pilih Metode Pembayaran</h2>
            <RadioGroup value={selected} onValueChange={setSelected} className="flex flex-row justify-center">
                {dummyMethods.map(m => (
                    <div key={m.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={m.code} id={m.code} />
                        <Label htmlFor={m.code}>{m.name}</Label>
                    </div>
                ))}
            </RadioGroup>
            <div className="flex justify-center">
                <Button>Pay Now</Button>
            </div>
        </div>
    )
}