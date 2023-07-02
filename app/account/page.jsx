"use client";
import React, { useContext, useEffect, useState } from "react";
import "./account.css";
import { Context } from "../providers";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import Link from "next/link";
import axios from "axios";

function Account() {
  const [orders, setOrders] = useState({});
  const { user, setUser } = useContext(Context);
  const logoutHandler = async () => {
    if (typeof window !== "undefined") await localStorage.setItem("token", "");
    await setUser({});
    await toast.success("Logged out Successfully");
  };

  async function fetchOrders() {
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/user/myorder", {
        headers: {
          token: token,
        },
      });
      await setOrders(data.orders);
    } catch (error) {
      console.log(error.message);
    }
  }

  console.log(orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!user._id) return redirect("/auth");
  return (
    <div>
      {user && (
        <div className="account">
          <div className="content">
            <span>
              <p>Name</p> -{user.name}
            </span>
            <span>
              <p>Email</p> -{user.email}
            </span>

            <button onClick={logoutHandler}>Logout</button>
            {user.role === "seller" && (
              <Link href={"/dashboard/seller"}>Dashboard</Link>
            )}

            <h1>Your Orders</h1>
            {orders && orders.length > 0 ? (
              orders.map((i) => (
                <Link href={"/account"} className="order" key={i._id}>
                  <span>₹ {i.subTotal}</span>
                  <span>status - {i.status}</span>
                </Link>
              ))
            ) : (
              <p>No Orders Till Now</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
