import Cart from "../components/Cart"
import CustomerTopBar from "../components/CustomerTopBar"
import CustomerBottomNav from "../components/CustomerBottomNav"

export default function CartPage() {
    return (
        <div className="min-h-screen pb-20 pt-14 p-6">
            <CustomerTopBar title="Cart" />
            <Cart />
            <CustomerBottomNav />
        </div>
    )
}