"use client";
import { useState } from "react";
import "./verify.css";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function Verify() {
  const router = useRouter();
  const verifyHandler = async (e) => {
    e.preventDefault();

    let email;

    if (typeof window !== "undefined") {
      email = await localStorage.getItem("email");
    }

    try {
      const { data } = await axios.post("/api/user/verify", { email, otp });

      if (data.message) {
        await toast.success(data.message);
        await router.push("/auth");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const [otp, setOtp] = useState("");
  return (
    <div className="authContainer">
      <div className={"authform"}>
        <div className="right">
          <div className="login">
            <h1>Verify</h1>
            <form onSubmit={verifyHandler}>
              <input
                type="number"
                placeholder="Enter Otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button>verify</button>
            </form>
            <Link href={"/auth"}>Go to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;
