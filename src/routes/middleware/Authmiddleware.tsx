import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "src/pages/Authentication/Login";

const Authmiddleware = (props: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

<<<<<<< HEAD
 const token = localStorage.getItem("admin_token");

 
 
=======
  // const token = localStorage.getItem("admin_token");
>>>>>>> c1fd6d0ced766ff479b71da643affd254f684129

  useEffect(() => {

      console.log("curent path",props.path)

      const allowPath=[,"vendors","orders"]

    const token = localStorage.getItem("admin_token");
    console.log("Checking token:", token);
    if (token) {
      setIsAuthenticated(true);
      const checkPath = props.path?.split("/");
      console.log({ checkPath });
      const decoded: any = jwtDecode(token);
      console.log(decoded);

      if (decoded.accType !== "SUPER_ADMIN") {
        if (!decoded?.role.includes(checkPath[1]) && checkPath[1] !== "profile") {
          navigate("/dashboard");
        }
      }
    } else {
      console.log("Redirecting to /login");
      navigate("/login");
    }

    // const checkPath=props.path?.split("/")

    // if(!allowPath.includes(checkPath[1])){

    //    navigate("/dashboard")
    // }




  }, [navigate]);

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Authmiddleware;
