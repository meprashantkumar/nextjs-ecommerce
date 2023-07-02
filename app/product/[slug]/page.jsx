"use client";
import { useParams } from "next/navigation";
import "./product.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
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

                <button onClick={addToCartHandler}>Add To Cart</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Product;
