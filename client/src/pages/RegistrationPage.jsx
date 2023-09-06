/*import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../styles/Register.css';

function Registration() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [registrationMessage, setRegistrationMessage] = useState('');

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
      const response = await axios.post('http://localhost:5000/registration', userData);
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

  return (
    <div className="outside">
      <div className='navbar'>
          <ul className='navbar-menu'>
            <li><Link to="/">Home</Link></li>
            </ul>
            </div>
      <div className="inside">
      <h2 className="register">Registration</h2>
      <form  onSubmit={handleSubmit}>
        <input className="submit-form"
          type="text"
          name="username"
          placeholder="Username"
          value={userData.username}
          onChange={handleChange}
        />
        <input className="submit-form"
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
        />
        <input className="submit-form"
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
        />
        <button className="register-button" type="submit">Register</button>
      </form>
      </div>
      {registrationMessage && <p>{registrationMessage}</p>}
      <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2023 Your Website. All rights reserved.</p>
          </div>
        </footer>
    </div>
  );
}

export default Registration;
*/


