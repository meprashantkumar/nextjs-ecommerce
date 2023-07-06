"use client";
import Layout from "@/app/components/dashboard/Layout";
import "./status.css";
import axios from "axios";
import { useEffect, useState } from "react";

function Revenue() {
  const [stats, setStats] = useState({});
  async function fetchStats() {
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/seller/earnings", {
        headers: {
          token: token,
        },
      });

      setStats(data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  console.log(stats);
  return (
    <Layout>
      {stats && (
        <div className="status">
          <h1>Your Revenue</h1>
          <span>Total Products Worth - {stats.totalearnings}</span>
          <span>Total Products sold - {stats.totalProductsold}</span>
          <span>Total Revenue - {stats.earnings}</span>
        </div>
      )}
    </Layout>
  );
}

export default Revenue;
