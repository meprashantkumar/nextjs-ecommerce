"use client";
import Link from "next/link";
import "./layout.css";
import { useContext } from "react";
import { Context } from "@/app/providers";

function Layout({ children }) {
  const { user } = useContext(Context);
  return (
    <div>
      <div className="layout">
        <span>
          {user.role === "admin" ? "Admin DashBoard" : "Seller Dashboard"}
        </span>
        <Link href={"/account"}>Go Back</Link>
        {user.role === "admin" ? (
          <Link href={"/admin/dashboard"}>Home</Link>
        ) : (
          <Link href={"/seller/dashboard"}>Home</Link>
        )}
        {user.role === "admin" ? (
          <Link href={"/admin/applications"}>Applications</Link>
        ) : (
          <Link href={"/seller/status"}>Your_revenue</Link>
        )}
      </div>
      {children}
    </div>
  );
}

export default Layout;
