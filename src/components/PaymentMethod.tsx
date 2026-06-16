import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { ExternalLink } from "lucide-react"

export default function PaymentMethod() {
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
                <h2 className="text-xl font-bold">Payment</h2>
                <p className="text-sm text-muted-foreground">You will be redirected to Xendit's secure payment page</p>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground space-y-1">
                    <p>Xendit supports multiple payment methods:</p>
                    <ul className="list-disc list-inside space-y-0.5 mt-1">
                        <li>Virtual Account (BCA, BNI, BRI, Mandiri, etc.)</li>
                        <li>QRIS</li>
                        <li>Credit / Debit Card</li>
                        <li>E-Wallet (OVO, GoPay, Dana, etc.)</li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={loading}
                    onClick={checkout}
                >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {loading ? 'Processing...' : 'Pay with Xendit'}
                </Button>
            </CardFooter>
        </Card>
    )
}
