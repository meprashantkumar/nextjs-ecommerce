"use client";
import { useContext, useEffect, useState } from "react";
import "./checkout.css";
import axios from "axios";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { Context } from "../providers";
import Script from "next/script";
import Loader from "../components/Loader/Loader";

const methods = ["cod", "online"];

function Checkout() {
  const [subTotal, setSubTotal] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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

  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      if (method === "cod") {
        const { data } = await axios.post(
          "/api/order/newcod",
          { method, phone, address },
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
      } else {
        const {
          data: { order, orderOptions },
        } = await axios.post(
          "/api/order/newonline",
          {
            method,
            phone,
            address,
          },
          {
            headers: {
              token: token,
            },
          }
        );

        const options = {
          key: "rzp_test_q3yvCeg9soHkle",
          amount: order.subTotal,
          currency: "INR",
          name: "Let's Negotiates",
          description: "India will Negotiates",
          order_id: order.id,
          handler: async function (response) {
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;

            // dispatch(
            //   paymentVerification(
            //     razorpay_payment_id,
            //     razorpay_order_id,
            //     razorpay_signature,
            //     orderOptions
            //   )
            // );

            try {
              const { data } = await axios.post(
                `/api/order/payment`,
                {
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                  orderOptions,
                },
                {
                  headers: {
                    token: token,
                  },
                }
              );

              if (data.message) {
                await toast.success(data.message);
                await router.push("/ordersuccess");
              }
            } catch (error) {
              toast.error(error.response.data.message);
            }
          },

          theme: {
            color: "#9e1163",
          },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    fetchSubtotal();
  }, []);

  const { user } = useContext(Context);
  if (!user._id) return redirect("/auth");

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {loading ? (
        <Loader />
      ) : (
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
      )}
    </div>
  );
}

export default Checkout;
