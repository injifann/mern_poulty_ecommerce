import React from "react";
import { useAuth } from "../../context/AuthContext";
import AdminNavbar from "./AdminNavbar";
import UserNavbar from './UserNavbar'

export default function Navbar() {
  const {user} = useAuth();
  

  if(user?.role==='admin')
  {
    return <AdminNavbar/>
  }
  else
  {
    return <UserNavbar/>
  }
  
}
