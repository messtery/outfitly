import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

const dummyMethods = [
    { id: 1, code: "cash", name: "Cash" },
    { id: 2, code: "qris", name: "QRIS" },
    { id: 3, code: "transfer", name: "Transfer" },
]

export default function PaymentMethod() {
    const [selected, setSelected] = useState("")
    const navigate = useNavigate()

    const checkout = () => {
        fetch('http://localhost:3000/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                navigate(`/ordertracking/${res.data.id}`)
            })
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <h2 className="text-xl font-bold">Payment Method</h2>
                <p className="text-sm text-muted-foreground">Select how you'd like to pay</p>
            </CardHeader>
            <CardContent>
                <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
                    {dummyMethods.map(m => (
                        <label
                            key={m.id}
                            htmlFor={m.code}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selected === m.code
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/50"
                            }`}
                        >
                            <RadioGroupItem value={m.code} id={m.code} />
                            <Label htmlFor={m.code} className="cursor-pointer font-medium">{m.name}</Label>
                        </label>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={!selected}
                    onClick={checkout}
                >
                    Pay Now
                </Button>
            </CardFooter>
        </Card>
    )
}
