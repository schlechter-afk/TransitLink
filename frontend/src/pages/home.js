import "../styles/homepage.css";
import React from "react";
import Navbar from "../navbars/navbarLanding";
import { useNavigate } from "react-router-dom";

import truck_owner from '../images/truck_owner.jpg';
import freight_owner from '../images/freight_owner.jpg';


const Home = (props) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <div id="banner">
        <h1>HireTruck</h1>
        {/* <h3>Placeholder text</h3> */}
      </div>
      <main id="main-container">
        <a href="bloglist.html">
          <h2 className="section-heading">Links</h2>
        </a>
        <section>
          <div className="card">
            <div className="card-image">
              <img src={freight_owner} alt="" className="square"/>
            </div>
            <div className="card-description">
              <a href="freight">
                <h3>Freight Owners</h3>
              </a>
              <p>Lorem ipsum goes here</p>
              <a href="#" className="btn-readmore">
                Sign Up
              </a>
              <a href="#" className="btn-readmore">
                Register
              </a>
            </div>
          </div>
          <div className="card">
            <div className="card-image">
              <img src={truck_owner} alt="" className="square" />
            </div>
            <div className="card-description">
              <a href="truck">
                <h3>Truck Owners</h3>
              </a>
              <p>Lorem ipsum goes here</p>
              <a href="#" className="btn-readmore">
                Sign Up
              </a>
              <a href="#" className="btn-readmore">
                Register
              </a>
            </div>
          </div>
        </section>

        <h2 className="section-heading">About Us</h2>
        <section id="section-source">
          <p>
            Zam Technologies
          </p>
          {/* <a href="#">GitHub Profile</a> */}
        </section>
      </main>
      <script src="main.js"></script>
    </div>
  );
};

export default Home;
