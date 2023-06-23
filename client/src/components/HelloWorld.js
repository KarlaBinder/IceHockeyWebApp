import React from 'react'

function HelloWorld(props) {
    const greeting=" Hello World";
    const introduction="My name is Karla"
  return (
    <div>
         <div>{greeting}</div>
         <div>{introduction}</div>
         <div>This number is from props, {props.num}</div>
    </div>
  )
}

export default HelloWorld
