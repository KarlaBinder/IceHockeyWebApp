/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router
import { Link } from "react-router-dom";
import axios from 'axios';
import '../styles/Login.css';

function Login() {
    const navigate = useNavigate(); // Get the navigate function

  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });

  const [loginMessage, setLoginMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:5000/login', userData);
  
        if (response.status === 200 && response.data.message === 'Login successful') {
          // Login successful
        const { token, userId } = response.data; // Extract the JWT token from the response

        // Store the token in local storage or cookies for future use
        localStorage.setItem('authToken', token); // Example: Storing in local storage
        localStorage.setItem('userId', userId); // Store the user ID
        console.log(userId);
        console.log('Login successful');
          setLoginMessage('Login successful', response.data.message);
          // Redirect to the team selection page upon successful login
          navigate('/team-selection');
        } else {
          setLoginMessage('Login failed. Check your credentials.');
        }
      } catch (error) {
        console.error('Login failed:', error.response.data.message);
      }
    };

    return (
        <div className="box"> 
        <div className='navbar'>
          <ul className='navbar-menu'>
            <li><Link to="/">Home</Link></li>
            </ul>
            </div>
        <div className="box-elements">
          <h2 className="login-text">Login</h2>
          <form onSubmit={handleSubmit}>
            <input className="input"
              type="text"
              name="username"
              placeholder="Username"
              value={userData.username}
              onChange={handleChange}
            />
            <input className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
            />
            <button className="login-button" type="submit">Login</button>
          </form>
          {loginMessage && <p>{loginMessage}</p>}
          {/* Display the registration message with a link *//*}
          <p className="paragraph">
            Don't have an account?<br /> Register <span onClick={() => navigate('/registration')}> here</span>.
          </p>
          </div>
          <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2023 Your Website. All rights reserved.</p>
          </div>
        </footer>
        </div>
      );
    }
    
    export default Login;
*/

