import { Navigate } from "react-router-dom";
import useUser from "../hooks/UseUser";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";



export const PublicRoute = ({children}: React.PropsWithChildren<{}>) => {
  // const user = useUser()
  const { user } = useSelector((state: RootState) => state.user);

  
  if (user === undefined) {
    return null;
  }
  else if (!user) {
    return <Navigate to="/ethos" />
  }
  else {
    return <>{children}</>;
  }
}

export default PublicRoute;