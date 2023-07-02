"use client";
import { useParams } from "next/navigation";
import "./product.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/app/components/Loader/Loader";
import { Context } from "@/app/providers";
import Link from "next/link";

function Product() {
  const params = useParams();

  const [product, setProduct] = useState({});

  const [loading, setLoading] = useState(false);

  async function fetchProduct() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/product/productwithslug?slug=" + params.slug
      );
      setLoading(false);
      await setProduct(data.product);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  const addToCartHandler = async () => {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.post(
        "/api/product/cart/addtocart",
        { product: product._id },
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.message) {
        setLoading(false);
        toast.success(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.warn(error.response.data.message);
    }
  };

  const { user } = useContext(Context);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="productInfo">
          {product && (
            <>
              <div className="left">
                <img src={product.image} alt="" />
              </div>
              <div className="right">
                <div className="name">{product.name}</div>
                <div className="description">{product.description}</div>
                <div className="price">₹ {product.price}</div>

                {user && user._id ? (
                  <button onClick={addToCartHandler}>Add To Cart</button>
                ) : (
                  <Link href={"/auth"}>Please Login to shop</Link>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Product;
