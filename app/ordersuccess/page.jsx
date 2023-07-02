import Link from "next/link";
import "./ordersuc.css";

function OrderSuccess() {
  return (
    <div className="ordersuccess">
      <h1>OrderSuccess</h1>
      <Link href={"/products"}>Shop More</Link>
    </div>
  );
}

export default OrderSuccess;
