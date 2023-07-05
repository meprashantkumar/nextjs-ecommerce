"use client";
import Layout from "@/app/components/dashboard/Layout";
import "./sd.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import Loader from "@/app/components/Loader/Loader";

function SellerDashBoard() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});

  async function fetchProducts() {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/seller/products", {
        headers: {
          token: token,
        },
      });

      setLoading(false);

      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard-seller">
          {show && <Modal setShow={setShow} setProducts={setProducts} />}
          <div className="top">
            <h1>Your Products</h1>
            <button onClick={() => setShow(true)}>Add Product +</button>
          </div>

          <div className="row">
            {products && products.length > 0 ? (
              products.map((i) => <ProductCardSeller key={i._id} product={i} />)
            ) : (
              <p>No Products yet</p>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default SellerDashBoard;

function Modal({ setShow, setProducts }) {
  const categories = [
    "SmartPhone",
    "Laptop",
    "Groccessary",
    "T Shirts",
    "Footwear",
  ];

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState("");

  async function fetchProducts() {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/seller/products", {
        headers: {
          token: token,
        },
      });

      setLoading(false);

      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.post(
        "/api/seller/new",
        {
          name,
          description,
          slug,
          stock,
          price,
          image,
          category,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      if (data.message) {
        toast.success(data.message);

        fetchProducts();
        setCategory("");
        setName("");
        setDescription("");
        setImage("");
        setPrice("");
        setStock("");
        setSlug("");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);
  return (
    <div>
      <div className="background" onClick={() => setShow(false)}></div>
      <div className="modal">
        <div className="top">
          <h1>Add Product</h1>
          <button onClick={() => setShow(false)}>X</button>
        </div>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Image Url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Category</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button>{loading ? "Adding" : "Add +"}</button>
        </form>
      </div>
    </div>
  );
}

function ProductCardSeller({ product }) {
  return (
    <div className="productdetails">
      <img src={product.image} alt="" />
      <div className="title">{product.name}</div>
      <div className="price">₹ {product.price}</div>
      <div className="category">{product.category}</div>
      <div className="category">sold - {product.sold}</div>
      <div className="category">stock - {product.stock}</div>
      <Link href={"/product/" + product.slug}>View Product</Link>
    </div>
  );
}
