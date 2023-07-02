"use client";
import { useEffect, useState } from "react";
import "./checkout.css";
import axios from "axios";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";

const methods = ["cod", "online"];

function Checkout() {
  const [subTotal, setSubTotal] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState("");

  const [method, setMethod] = useState("");

  const fetchSubtotal = async () => {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/product/cart/subtotal", {
        headers: {
          token: token,
        },
      });
      setLoading(false);
      setSubTotal(data.subtotal);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };

  if (items) console.log(items);

  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    console.log(items, method, phone, address, subTotal);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.post(
        "/api/order/new",
        { items, method, phone, address },
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      if (data.message) {
        await toast.success(data.message);
        await router.push("/ordersuccess");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  async function fetchProduct() {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/order/chekoutproducts", {
        headers: {
          token: token,
        },
      });
      setLoading(false);
      await setItems(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }
  useEffect(() => {
    fetchSubtotal();
    fetchProduct();
  }, []);

  console.log(items);
  return (
    <div>
      <div className="checkout">
        <h1>Checkout</h1>
        <form onSubmit={submitHandler}>
          <input
            type="phone"
            placeholder="Enter Your Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <br />
          <input
            type="address"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <br />
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Select Payment Method</option>
            {methods.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <br />
          {subTotal && <span>total-{subTotal}</span>}
          <br />
          <button>Order</button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
