"use client";
import { useEffect, useState } from "react";
import "./products.css";
import Link from "next/link";
import axios from "axios";
import Loader from "../components/Loader/Loader";

const categories = [
  "SmartPhone",
  "Laptop",
  "Groccessary",
  "T Shirts",
  "Footwear",
];

function Products() {
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState("");

  const size = 4;

  async function fetchProducts(search, category, page) {
    setLoading(true);
    {
      const { data } = await axios.get("/api/product/all");

      setLoading(false);

      setTotal(data.products.length);
    }
    try {
      const { data } = await axios.get(
        "/api/product/all?search=" +
          search +
          "&category=" +
          category +
          "&page=" +
          page +
          "&size=" +
          size
      );

      setLoading(false);

      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  const totalPage = Math.ceil(total / 4);

  console.log(totalPage);

  function increase() {
    setPage(page + 1);
  }
  function decrease() {
    setPage(page - 1);
  }

  useEffect(() => {
    fetchProducts(search, category, page);
  }, [search, category, page]);

  return (
    <div>
      <div className="products">
        <div className="top">Products</div>
        <div className="mid">
          <div className="formContainer">
            <input
              type="text"
              placeholder="Enter Product Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Search With Category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="row">
              {products && products.length > 0 ? (
                products.map((i) => <ProductCard key={i._id} product={i} />)
              ) : (
                <p>No Products yet</p>
              )}
            </div>
            {totalPage !== 1 && (
              <div className="pagination">
                {page && page > 1 ? (
                  <span onClick={decrease}>{"<<"}</span>
                ) : (
                  <p className="notactive">{"<<"}</p>
                )}
                <div className="page">{page}</div>
                {totalPage && totalPage > page ? (
                  <span onClick={increase}>{">>"}</span>
                ) : (
                  <p className="notactive">{">>"}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;

function ProductCard({ product }) {
  return (
    <div className="productdetails">
      <img src={product.image} alt="" />
      <div className="title">{product.name}</div>
      <div className="price">₹ {product.price}</div>
      <div className="category">{product.category}</div>
      <Link href={"/product/" + product.slug}>View Product</Link>
    </div>
  );
}
