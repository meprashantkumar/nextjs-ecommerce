"use client";
import { useContext, useState } from "react";
import "./style.css";
import axios from "axios";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { Context } from "../providers";

function Auth() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [pan, setPan] = useState("");
  const [gst, setGst] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [name, setName] = useState("");

  const { user } = useContext(Context);

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token =
        (await typeof window) !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const { data } = await axios.post(
        "/api/seller/becomeseller",
        {
          name,
          phone,
          aadhar,
          pan,
          gst,
          accountNo,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (data.message) {
        setLoading(false);
        await toast.success(data.message);
        setAadhar("");
        setPan("");
        setPhone("");
        setName("");
        setGst("");
        setAccountNo("");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  if (!user._id) return redirect("/");
  return (
    <div className="sellerContainer">
      <div className={"authform"}>
        <div className="left">
          <h1>Become seller in one click</h1>
        </div>

        <div className="right">
          <div className="login">
            <h1>Fill Details Given Below</h1>
            <form onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Enter Name of Shop"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="Phone"
                placeholder="Enter Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Pan Number"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Enter Aadhar Number"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Gst Number"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Your Account Number"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                required
              />
              <button>{loading ? "Please Wait" : "Submit"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
