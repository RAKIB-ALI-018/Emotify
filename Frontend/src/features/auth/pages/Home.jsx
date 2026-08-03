import React from 'react';
import "../style/home.scss"
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <main className='home-page'>
        <div className="main-content">
          <div className="text">
            <h1>Feel the Music. <br />
              Powered by Your Mood <br /> with <span>Emotify.</span></h1>
            <p>Discover songs that understand 
              how you're feeling today.</p>
          </div>
          <div className="buttons">
            <button className='login-button click-btn' onClick={() => navigate("/login")}>Login</button>
            <button className='register-button click-btn' onClick={() => navigate("/register")}>Create Account</button>
          </div>
          <h4>Continue as Guest</h4>
        </div>


      </main>

    </div>
  );
}

export default Home;
