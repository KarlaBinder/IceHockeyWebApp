import React from 'react'

function sayHi(name){
    alert('Hi '+ name);
}

function Greeting() {
  return (
    <div>
      <button onClick={() => sayHi('Karla')}> Say Hi</button>
    </div>
  )
}

export default Greeting
