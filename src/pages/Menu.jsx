import MenuList from "../components/MenuList";
import CustomerTopBar from "../components/CustomerTopBar";
import CustomerBottomNav from "../components/CustomerBottomNav";
import AIChatFAB from "../components/AIChatFAB";

export default function Menu() {
  return (
    <div className="min-h-screen pb-20 pt-14">
      <CustomerTopBar title="Menu"/>
      <MenuList />
      <CustomerBottomNav />
      <AIChatFAB />
    </div>
  );
}