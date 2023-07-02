"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import "./header.css";
import { RiShoppingBag3Fill, RiAccountCircleFill } from "react-icons/ri";
import { Context } from "@/app/providers";
import axios from "axios";

export const Header = () => {
  const { user } = useContext(Context);

  const [loading, setLoading] = useState(false);

  const [cartno, setCartno] = useState({});

  console.log(cartno.length);
  return (
    <div>
      <header>
        <ul>
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/products"}>Products</Link>
          </li>
        </ul>

        <div className="logo">
          <Link href={"/"}>
            <img src="/bgbrand.png" alt="" />
          </Link>
        </div>

        <div className="actions">
          <Link href={"/cart"}>
            <RiShoppingBag3Fill />
          </Link>
          <Link href={user && user._id ? "account" : "/auth"}>
            <RiAccountCircleFill />
          </Link>
        </div>
      </header>
    </div>
  );
};
