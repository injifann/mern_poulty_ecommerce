import React from 'react'
import {Link} from 'react-router'

export default function Navbar({isLoggedIn}) {
    
  return (
    <div>
      <ul>
        <li><Link>Home</Link></li>
        <li><Link>Cart</Link></li>
        <li><Link>Products</Link></li>
        <li><Link>category</Link></li>
        
            {isLoggedIn? 
            <li> 
                <Link to ="/profile">profile</Link>
                <Link to ="/">logout</Link>
            </li>:
            <li>
                <Link to ="/register">sing up</Link>
                <Link to ="/login">Login </Link>
            </li>
          }
      </ul>
    </div>
  )
}
