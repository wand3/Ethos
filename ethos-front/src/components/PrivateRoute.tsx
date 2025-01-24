import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUser from '../hooks/UseUser';
import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'
import { RootState } from '../store';
import { UserInDBSchema, UserSchema } from '../schemas/user';
import { UserState } from '../slices/UserSlice';


// export const PrivateRoute = ({children}: React.PropsWithChildren<{}>) => {
//   // const user = useUser();
//   const userInfo = useSelector((state: RootState) => {state.user})
//   const user = userInfo.user
//   // const location = useLocation();

//   if (user.user === undefined) {
//     return null;
//   }
//   else if (user.user) {
//     return <>{children}</>;
//   }
//   else {

//     // const url = location.pathname + location.search + location.hash;
//     // return <Navigate to="/login" state={{next: url}} />
//     return <Outlet />

//   }
// }

// export default PrivateRoute;


const PrivateRoute: React.FC = ({children}: React.PropsWithChildren<{}>) => {
  // Define the type of the state and `userInfo`
  const { user } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  // Show unauthorized screen if no user is found in redux store
  if (!user) {
    return (
      <div className="unauthorized">
        <h1>Unauthorized :(</h1>
        <span>
          <NavLink to="/login">Login</NavLink> to gain access
        </span>
      </div>
    );

  }
  else if (user) {
    return <>{children}</>;
  }
  else {

    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/login" state={{next: url}} />
    // return <Outlet />

  }

  // Returns child route elements
  // return <Outlet />;
};

export default PrivateRoute;