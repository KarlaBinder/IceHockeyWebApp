import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileUsername, setProfileUsername] = useState(''); // Define profileUsername state

  // Fetch the user's login status from the server
  useEffect(() => {
    fetch('http://localhost:5000/login-status')
      .then(response => response.json())
      .then(data => {
        setIsAuthenticated(data.isAuthenticated); 
      });
  }, []);

  // Send a GET request to your server to get the username
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:5000/getUsername?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
        setProfileUsername(data.username); // Set the profileUsername state
      })
      .catch(error => {
        console.error('Error fetching username:', error);
      });
  }, []); // Empty dependency array to run this effect only once


  const handleButtonClick = () => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to team selection.");
      navigate('/team-selection');
    } else {
      console.log("User is not authenticated, showing login dropdown.");
      const loginDropdown = document.querySelector(".dropdown-content");
      if (loginDropdown) {
        loginDropdown.style.display = "block";
      }
    }
  };
  
  
  

  const [userLoginData, setUserLoginData] = useState({
    username: '',
    password: '',
  });

  const [loginMessage, setLoginMessage] = useState('');

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
      const response = await axios.post('http://localhost:5000/login', userLoginData);

      if (response.status === 200 && response.data.message === 'Login successful') {
        // Login successful
      const { token, userId } = response.data; // Extract the JWT token from the response

      // Store the token in local storage or cookies for future use
      localStorage.setItem('authToken', token); // Example: Storing in local storage
      console.log('Token stored in local storage:', token);
      localStorage.setItem('userId', userId); // Store the user ID

      // Update isAuthenticated to true
       setIsAuthenticated(true);
      console.log(userId);
      console.log('Login successful');
        setLoginMessage('Login successful', response.data.message);
        // Redirect to the team selection page upon successful login
        navigate('/');
      } else {
        setLoginMessage('Login failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
    }
  };

  const [userRegisterData, setRegisterUserData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [registrationMessage, setRegistrationMessage] = useState('');

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
      const response = await axios.post('http://localhost:5000/registration', userRegisterData);
      console.log('Response data:', response.data.message);
  
      if (response.status === 201 && response.data.message === 'User registered successfully') {
        // Registration successful
        console.log('Registration successful');
        setRegistrationMessage('Registration successful');
        // Redirect to a success page or login page
      } else if (response.status === 200 && response.data.message === 'User already exists') {
        // User already exists
        console.log('User already exists');
        setRegistrationMessage('Username or email already exists');
      } else {
        console.log('Unexpected response:', response.data);
      }
    } catch (error) {
        console.log('Registration failed');
      console.error('Registration failed:', error.response.data.message);
    }
  };
  
  

  const handleLogoutClick = () => {
    // Clear the JWT token from local storage
    localStorage.removeItem('token');
  
    // Update the isAuthenticated state or perform any other necessary actions
    setIsAuthenticated(false);
  
    // Optionally, navigate the user to a different page (e.g., home page)
    navigate('/');
  };
    

  return (
    <div className="home-container">
        <div className='navbar'>
        <ul className='navbar-menu'>
          {isAuthenticated ? (
            // Display user-specific content or logout link
            <>
              <li>
              <div className="dropdown">
              <button className="profile-dropbtn">{`${profileUsername}`}</button>
                  <div className="profile-dropdown-content">
                  <Link to="/profile">View Profile</Link>
                  <button className='logout' onClick={handleLogoutClick}>Logout</button>
                </div>
              </div>
              </li>
       </>
       ) : (
      // Display login and register dropdowns
        <>
           <li>
                <div className="dropdown">
                  <button className="dropbtnLog">Login</button>
                  <div className="dropdown-content">
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
{loginMessage && <p>{loginMessage}</p>}
                </div>
              </div>
           </li>
          <li>
          <div className="dropdown">
                  <button className="dropbtnReg">Register</button>
                  <div className="dropdown-content">
                    <form onSubmit={handleRegistrationSubmit}>
  <label htmlFor="newUsername" >Username</label>
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

             </div>
             {registrationMessage && <p>{registrationMessage}</p>}
           </div>
         </li>
       </>
     )}
    </ul>
      </div>
        <div className="text-container">
          <h1>Ice Hockey Strategy</h1>
          <p>Unleash the power of your strategic mastery<br />with the lineup selection app!</p>
          {isAuthenticated ? (
  // Display the content for authenticated users
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
            "A good hockey player plays where the puck is.<br />A great hockey player plays where the puck is going to be." <br />Wayne Greatzky
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


