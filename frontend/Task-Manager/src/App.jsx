import React, { useContext } from 'react'
import './index.css';


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom"
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import PrivateRoute from './pages/routes/PrivateRoute'
import Dashboard from './pages/Admin/Dashboard'
import ManageTasks from './pages/Admin/ManageTasks'
// import CreateTask from './pages/Admin/CreateTask'
import ManageUser from './pages/Admin/ManageUser'
import UserDashboard from './pages/User/UserDashboard'
import MyTask from './pages/User/MyTask'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import UserProvider, { UserContext } from './context/userContext';

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>

            {/* admin routes */}

            <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
              <Route path="/admin/dashboard" element={<Dashboard/>}/>
              <Route path="/admin/tasks" element={<ManageTasks/>}/>
              {/* <Route path="/admin/create-task" element={<CreateTask/>}/> */}
              <Route path="/admin/users" element={<ManageUser/>}/>
            </Route>

            {/* user route */}

            <Route>
              <Route path='/user/dashboard' element={<UserDashboard/>}/>
              <Route path='/user/tasks' element={<MyTask/>}/>
              <Route path='/user/tasks-details/:id' element={<ViewTaskDetails/>}/>

            </Route>

            {/* Default route */}
            <Route path='/' element={<Root/>}/>
          </Routes>
        </Router>
      </div>
    </UserProvider>
  )
}

export default App



const Root =()=>{
  const {user,loading}=useContext(UserContext)

  if(loading)return <Outlet/>

  if(!user){
    return <Navigate to="/login"/>
  }

  return user.role==="admin"?<Navigate to="/admin/dashboard"/>:<Navigate to="/user/dashboard"/>
}







