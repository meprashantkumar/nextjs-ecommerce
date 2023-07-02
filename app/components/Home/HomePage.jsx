import Link from "next/link";
import "./home.css";
import { BsFacebook } from "react-icons/bs";
import {
  AiFillCaretRight,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";

function HomePage() {
  return (
    <div className="home">
      <div className="left">
        <img src="/bgbrand 2.png" alt="" />
      </div>
      <div className="right">
        <span>Welcome</span>
        <p>
          Since our opening, we have become masters of our craft. our commitment
          to quality products, exceptional services and incomperable customer
          care keep our community coming back again and again.
        </p>
        <Link className="specialLink" href={"/products"}>
          Explore Products <AiFillCaretRight />
        </Link>
        <div className="contact">
          <Link href={""}>letsnegotiates@gmail.com</Link>
          <Link href={""}>123-456-7890</Link>
        </div>

        <div className="social">
          <Link href={"/"}>
            <BsFacebook />
          </Link>
          <Link href={"/"}>
            <AiFillTwitterCircle />
          </Link>
          <Link href={"/"}>
            <AiFillInstagram />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
