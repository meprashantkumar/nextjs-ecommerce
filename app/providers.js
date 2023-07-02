"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader/Loader";

export const Context = createContext({ user: {} });

export function Providers({ children }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchUser() {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/user/me", {
        headers: {
          token: token,
        },
      });
      setLoading(false);
      setUser(data.user);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {children}

          <ToastContainer position="top-left" />
        </>
      )}
    </Context.Provider>
  );
}
