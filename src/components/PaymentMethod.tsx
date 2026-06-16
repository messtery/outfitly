import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { ExternalLink } from "lucide-react"

const paymentMethods = [
    {
        code: "cash",
        name: "Cash",
        description: "Pay at Alfamart / Indomaret",
    },
    {
        code: "qris",
        name: "QRIS",
        description: "Scan QR with any e-wallet",
    },
    {
        code: "transfer",
        name: "Transfer",
        description: "Bank virtual account (BCA, BNI, BRI, Mandiri, etc.)",
    },
]

export default function PaymentMethod() {
    const [selected, setSelected] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const checkout = async () => {
        setLoading(true)
        try {
            const res = await fetch('http://localhost:3000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.token}`,
                },
                body: JSON.stringify({ paymentMethod: selected }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            window.open(data.data.invoiceUrl, '_blank')
            navigate(`/ordertracking/${data.data.id}`)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <h2 className="text-xl font-bold">Payment Method</h2>
                <p className="text-sm text-muted-foreground">Select how you'd like to pay</p>
            </CardHeader>
            <CardContent>
                <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
                    {paymentMethods.map((m) => (
                        <label
                            key={m.code}
                            htmlFor={m.code}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selected === m.code
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/50"
                            }`}
                        >
                            <RadioGroupItem value={m.code} id={m.code} />
                            <div>
                                <Label htmlFor={m.code} className="cursor-pointer font-medium">{m.name}</Label>
                                <p className="text-xs text-muted-foreground">{m.description}</p>
                            </div>
                        </label>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={!selected || loading}
                    onClick={checkout}
                >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {loading ? 'Processing...' : 'Pay with Xendit'}
                </Button>
            </CardFooter>
        </Card>
    )
}
