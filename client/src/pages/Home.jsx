import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileUsername, setProfileUsername] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/getUsername?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setProfileUsername(data.username);
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
      });
  }, []);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate("/team-selection");
    } else {
      const loginDropdown = document.querySelector(".dropdown-content");
      if (loginDropdown) {
        loginDropdown.style.display = "block";
      }
    }
  };

  const [userLoginData, setUserLoginData] = useState({
    username: "",
    password: "",
  });

  const [loginMessage, setLoginMessage] = useState("");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setUserLoginData({
      ...userLoginData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        userLoginData
      );
  
      if (response.status === 200 && response.data.token) {
        const { token, userId } = response.data;
  
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
  
        setIsAuthenticated(true);
        setLoginMessage("Login successful");
        navigate("/");
      } else {
        setLoginMessage("Login failed. Check your credentials.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setLoginMessage("User not found.");
        } else if (error.response.status === 401) {
          setLoginMessage("Incorrect password.");
        } else {
          console.error("Login failed:", error);
          setLoginMessage("Login failed. An error occurred.");
        }
      } else {
        console.error("Login failed:", error);
        setLoginMessage("Login failed. An error occurred.");
      }
    }
  };
  

  const [userRegisterData, setRegisterUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [registrationMessage, setRegistrationMessage] = useState("");

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterUserData({
      ...userRegisterData,
      [name]: value,
    });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/registration",
        userRegisterData
      );

      if (
        response.status === 201 &&
        response.data.message === "User registered successfully"
      ) {
        setRegistrationMessage("Registration successful");
      } else if (
        response.status === 200 &&
        response.data.message === "User already exists"
      ) {
        setRegistrationMessage("Username or email already exists");
      } else {
        console.log("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Registration failed:", error.response.data.message);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="home-container">
      <div className="navbar">
        <ul className="navbar-menu">
          {isAuthenticated ? (
            <>
              <li>
                <div className="dropdown">
                  <button className="profile-dropbtn">{`${profileUsername}`}</button>
                  <div className="profile-dropdown-content">
                    <Link to="/profile">View Profile</Link>
                    <button className="logout" onClick={handleLogoutClick}>
                      Logout
                    </button>
                  </div>
                </div>
              </li>
            </>
          ) : (

            <>
              <li>
                <div className="h-dropdown">
                  <button className="dropbtnLog">Login</button>
                  <div className="h-dropdown-content">
                    <form onSubmit={handleLoginSubmit}>
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={userLoginData.username}
                        onChange={handleLoginChange}
                      />
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={userLoginData.password}
                        onChange={handleLoginChange}
                      />
                      <button type="submit" className="login-button">
                        Login
                      </button>
                    </form>
                    {loginMessage && <p className="message">{loginMessage}</p>}
                  </div>
                </div>
              </li>
              <li>
                <div className="h-dropdown">
                  <button className="dropbtnReg">Register</button>
                  <div className="h-dropdown-content">
                    <form onSubmit={handleRegistrationSubmit}>
                      <label htmlFor="newUsername">Username</label>
                      <input
                        type="text"
                        id="newUsername"
                        name="username"
                        placeholder="Choose a username"
                        value={userRegisterData.username}
                        onChange={handleRegisterChange}
                      />
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={userRegisterData.email}
                        onChange={handleRegisterChange}
                      />
                      <label htmlFor="newPassword">Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="password"
                        placeholder="Choose a password"
                        value={userRegisterData.password}
                        onChange={handleRegisterChange}
                      />
                      <button type="submit" className="register-button">
                        Register
                      </button>
                    </form>
                    {registrationMessage && <p className="message">{registrationMessage}</p>}
                  </div>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="text-container">
        <h1>Ice Hockey Strategy</h1>
        <p>
          Unleash the power of your strategic mastery
          <br />
          with the lineup selection app!
        </p>
        {isAuthenticated ? (
          <a href="/team-selection" onClick={handleButtonClick}>
            <Button className="button-container" variant="primary">
              Get Started
            </Button>
          </a>
        ) : (
          <a href="/#" onClick={handleButtonClick}>
            <Button className="button-container" variant="primary">
              Get Started
            </Button>
          </a>
        )}

        <p className="bottom-text">
          "A good hockey player plays where the puck is.
          <br />A great hockey player plays where the puck is going to be."{" "}
          <br />
          Wayne Greatzky
        </p>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2023 FERIT All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
