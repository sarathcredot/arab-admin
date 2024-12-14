import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Login from "src/pages/Authentication/Login";

const Authmiddleware = (props: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

 const token = localStorage.getItem("admin_token");
 

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    console.log("Checking token:", token);
    if (token) {
      setIsAuthenticated(true);
    } else {
      console.log("Redirecting to /login");
      navigate("/login");
    }
  }, [navigate]);

  

    return <React.Fragment>{props.children}</React.Fragment>
 
};

export default Authmiddleware;
