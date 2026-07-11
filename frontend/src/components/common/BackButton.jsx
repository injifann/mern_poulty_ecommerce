import { useNavigate } from "react-router";
import React from 'react'
import { FaArrowLeft } from "react-icons/fa";
export default function BackButton({to,text= "back"}) {
    const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-8">
    <button onClick={()=>navigate(to)}className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
>
     <FaArrowLeft />
      {text}
    </button>
     </div>
  )
}
