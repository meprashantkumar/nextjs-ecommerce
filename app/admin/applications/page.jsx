"use client";
import Layout from "@/app/components/dashboard/Layout";
import React, { useEffect, useState } from "react";
import "./application.css";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

function Applications() {
  const [applications, setApplications] = useState({});

  const [loading, setLoading] = useState(false);

  async function fetchApplications() {
    setLoading(true);
    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.get("/api/admin/getallapplication", {
        headers: {
          token: token,
        },
      });
      setLoading(false);
      await setApplications(data.sellers);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  const verifyHandler = async (id) => {
    setLoading(true);

    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const { data } = await axios.put(
        "/api/admin/verifyseller",
        { id },
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      if (data.message) {
        toast.success(data.message);
        fetchApplications();
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <Layout>
      <div className="applications">
        <h1>Applications</h1>
        <div className="application">
          {applications && applications.length > 0 ? (
            applications.map((i) => (
              <div className="appli" key={i._id}>
                <Link href={"/admin/application/" + i._id}>{i.name}</Link>
                <span>Aadhar no - {i.aadhar}</span>
                {i.verified ? (
                  <p>Approved</p>
                ) : (
                  <button onClick={() => verifyHandler(i._id)}>Approve</button>
                )}
              </div>
            ))
          ) : (
            <p>No Applications</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Applications;
