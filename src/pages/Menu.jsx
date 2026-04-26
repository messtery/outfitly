import MenuList from "../components/MenuList";
import CustomerTopBar from "../components/CustomerTopBar";
import CustomerBottomNav from "../components/CustomerBottomNav";

export default function Menu() {
  return (
    <div className="min-h-screen pb-20 pt-14 bg-gray-50">
      <CustomerTopBar title="Menu" />
      <MenuList />
      <CustomerBottomNav />
    </div>
  );
}