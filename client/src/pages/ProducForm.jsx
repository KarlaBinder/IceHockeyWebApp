import React, { useState } from 'react';

function ProducForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    if (e.target.name === 'name') {
      setName(e.target.value);
    } else if (e.target.name === 'quantity') {
      setQuantity(e.target.value);
    } else if (e.target.name === 'price') {
      setPrice(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newProduct = {
      name,
      quantity,
      price,
    };
  
    fetch('http://localhost:5000/trial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => {
        console.log(response); // Log the response object
        if (response.ok) {
          setMessage('Data saved successfully');
        } else {
          setMessage('Failed to save data');
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage('Error occurred while saving data');
      });
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={name} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Quantity:
          <input type="number" name="quantity" value={quantity} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Price:
          <input type="number" name="price" value={price} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProducForm;


