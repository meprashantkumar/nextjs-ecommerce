"use client";
import { useParams } from "next/navigation";
import "./order.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

function Orders() {
  const params = useParams();

  const [order, setOrder] = useState({});

  const [products, setProducts] = useState({});

  const [loading, setLoading] = useState(false);

  async function fetchOrder() {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get(
        "/api/order/getsingleorder?id=" + params.id,
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      await setOrder(data.order);
      await setProducts(data.order.items);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  if (products) console.log(products);

  return (
    <div className="order">
      {order && (
        <>
          <h1>OrderId - {order._id}</h1>
          <div className="products">
            <h3>Products</h3>
            {products && products.length > 0
              ? products.map((i) => (
                  <div className="items" key={i._id}>
                    <img src={i.product.image} alt="" />
                    <Link href={"/product/" + i.product.slug}>
                      {i.product.name}
                    </Link>
                    <span>₹ {i.product.price}</span>
                    <div className="qty">
                      <p>quantity - {i.quantity}</p>
                    </div>
                  </div>
                ))
              : null}
            <h3>info</h3>
            <span>method-{order.method}</span>
            <br />
            <span>amount - ₹ {order.subTotal}</span>
            <br />
            <span>Phone - {order.phone}</span>
            <br />
            <span>address - {order.address}</span>
            <br />
            <span>status - {order.status}</span>
            <br />
            <Link href={"/account"}>Go Back</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
