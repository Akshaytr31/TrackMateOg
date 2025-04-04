import React from 'react'
import { Outlet } from 'react-router-dom'

function PrivateRoute({PrivateRoute}) {
  return <Outlet/>
}

export default PrivateRoute
