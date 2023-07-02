"use client";
import { useContext, useState } from "react";
import "./auth.css";
import axios from "axios";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { Context } from "../providers";

function Auth() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const { user, setUser } = useContext(Context);

  const toggleHandler = () => {
    setShow(!show);
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      if (data.message) {
        setLoading(false);
        await setUser(data.user);
        await toast.success(data.message);
        if (typeof window !== "undefined") {
          await localStorage.setItem("token", data.token);
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };
  const registerHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });
      if (data.message) {
        setLoading(false);
        await toast.success(data.message);

        await router.push("/verify");
        if (typeof window !== "undefined") {
          await localStorage.setItem("email", email);
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  if (user._id) return redirect("/");
  return (
    <div className="authContainer">
      <div className={show ? "authform2" : "authform"}>
        <div className="left">
          <h1>Hello</h1>
          <button onClick={toggleHandler}>
            {!show ? "Don't have an account" : "Have an account"}
          </button>
        </div>

        <div className="right">
          <div className="login">
            <h1>{show ? "Register" : "Login"}</h1>
            <form onSubmit={loginHandler}>
              {show && (
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {show ? (
                <button onClick={registerHandler}>
                  {loading ? "Please Wait" : "Register"}
                </button>
              ) : (
                <button onClick={loginHandler}>
                  {loading ? "Please Wait" : "Login"}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
