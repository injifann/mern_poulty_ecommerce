import axios from '../api/axios'
import {  createContext ,useContext,useEffect,useState } from "react";
import { useNavigate } from "react-router";

const UserContext = createContext();
const api = import.meta.env.VITE_API_URL;


export const AuthProvider = ({children})=>
{
    const [user,setUser] = useState(null);
    const [error,setError] = useState("");
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchUser = async () =>
        {
          const token = localStorage.getItem("token");
        try 
        {
            setError("");
            if(!token)
            {
                setUser(null);
                setIsLoading(false);
                return;
            }
            if(token)
            {
                const res = await axios.get(`${api}/api/user/me`);
                localStorage.setItem("token",res.data.token);
                setUser(res.data.user);
            }

        }
        catch(error)
        {
          setError(error.response?.data?.message || " Error fetching user data");
          localStorage.removeItem("token");
          setUser(null);
        }
        finally
        {
          setIsLoading(false);
        }

    };fetchUser()},[]);

    const login = async ({email,password}) =>
    {
       try
        {
          setError("");
          setIsLoading(true)
          const res = await axios.post(`${api}/api/user/login`,{email,password}) ;
          localStorage.setItem("token",res.data.token);
          setUser(res.data.user);
          navigate("/")
       }
       catch(error)
       {
         setError(error.response?.data?.message || "Failed to Login");
       }
       finally 
       {
        setIsLoading(false)
       }
    }

    const register = async ({userName,email,password}) =>
    {
        
        try 
        { 
          setError("")
          setIsLoading(true);
          const res = await axios.post(`${api}/api/user/register`,{userName,email,password});
          localStorage.setItem("token",res.data.token);
          setUser(res.data.user)
          navigate("/");
        }
        catch(error)
        {
            setError(error.response?.data?.message || "Failed to register")

        }
        finally
        {
            setIsLoading(false);

        }
    }
 const logout = () =>
 {
   localStorage.removeItem("token");
   setError("");
   setUser(null);
   navigate("/");
 }

 const googleAuth = async (credentialResponse) =>
 {
    try
    {
      setIsLoading(true);
      setError("");
      const res = await axios.post(`${api}/api/user/googleauth`,{token:credentialResponse.credential});
      localStorage.setItem("token",res.data.token);
      setUser(res.data.user);
      navigate("/");

    }
    catch(error)
    {
      setError(error.response?.data?.message || "google authentication failed");
    }
    finally
    {
       setIsLoading(false);
    }
 }

 return (
    <UserContext.Provider value={{user,isLoading,error,login,register,logout,googleAuth}}>
     {children}
    </UserContext.Provider>
 )
}

export const useAuth = () =>useContext(UserContext)
