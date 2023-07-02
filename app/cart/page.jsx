"use client";
import axios from "axios";
import "./cart.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

function Cart() {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState("");

  const [loading, setLoading] = useState(false);

  const removeHandler = async (id) => {
    try {
      setLoading(true);
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.delete("/api/product/cart/remove?id=" + id, {
        headers: {
          token: token,
        },
      });

      if (data.message) {
        setLoading(false);
        toast.success(data.message);
        fetchCart();
        fetchSubtotal();
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  async function fetchCart() {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/product/cart/yourcart", {
        headers: {
          token: token,
        },
      });
      setLoading(false);
      await setCart(data.carts);
      await fetchSubtotal();
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  const decrementHandler = async (id) => {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.put(
        "/api/product/cart/decrement",
        { id },
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      if (data.message) {
        fetchCart();
        fetchSubtotal();
      }
    } catch (error) {
      setLoading(false);
      toast.warn(error.response.data.message);
    }
  };

  const incrementHandler = async (id) => {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.put(
        "/api/product/cart/increment",
        { id },
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      if (data.message) {
        fetchCart();
        fetchSubtotal();
      }
    } catch (error) {
      setLoading(false);
      toast.warn(error.response.data.message);
    }
  };

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

  useEffect(() => {
    fetchCart();
    fetchSubtotal();
  }, []);
  return (
    <div>
      <div className="cart">
        <h1>Cart</h1>
        {cart && cart.length > 0 ? (
          cart.map((i) => (
            <div className="items" key={i._id}>
              <img src={i.product.image} alt="" />
              <Link href={"/product/" + i.product.slug}>{i.product.name}</Link>
              <span>₹ {i.product.price}</span>
              <div className="qty">
                <button onClick={() => decrementHandler(i._id)}>-</button>
                <p>{i.quantity}</p>
                <button onClick={() => incrementHandler(i._id)}>+</button>
              </div>
              <button onClick={() => removeHandler(i._id)}>X</button>
            </div>
          ))
        ) : (
          <p>No Items In Cart</p>
        )}

        <div className="checkout">
          <h1>CheckOut</h1>
          SubTotal - {subTotal && <span> ₹ {subTotal}</span>}
          <br />
          {subTotal === 0 ? null : <Link href={"/checkout"}>CheckOut</Link>}
        </div>
      </div>
    </div>
  );
}

export default Cart;
