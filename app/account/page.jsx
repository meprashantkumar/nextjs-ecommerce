"use client";
import React, { useContext } from "react";
import "./account.css";
import { Context } from "../providers";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import Link from "next/link";

function Account() {
  const { user, setUser } = useContext(Context);
  const logoutHandler = async () => {
    if (typeof window !== "undefined") await localStorage.setItem("token", "");
    await setUser({});
    await toast.success("Logged out Successfully");
  };

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
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
