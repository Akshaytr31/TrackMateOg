// import React from 'react'
// import { Outlet } from 'react-router-dom'

// function PrivateRoute({PrivateRoute}) {
//   return <Outlet/>
// }

// export default PrivateRoute



import React from 'react'
import {Navigate, Outlet} from 'react-router-dom'


function PrivateRoute({allowedRoles}) {

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user){
    return <Navigate to="/login" replace/>
  }

  if(!allowedRoles.includes(user.role)){
    return <Navigate to="/UnAuthorizedAccess" replace/>
  }

  return <Outlet/>
}

export default PrivateRoute


///