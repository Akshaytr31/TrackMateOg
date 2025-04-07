import React, { useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'

function ActiveUserList() {
    const [activeUsers,setActiveUsers]=useState([])

    useEffect(()=>{
        const fetchActiveUsers=async()=>{
            try{
                const response=await axiosInstance.get('/api/active-users')
                setActiveUsers(response.data)
            }catch(error){
                console.error('Error fetching active users:',error)
            }
        }
        fetchActiveUsers()
    })
  return (
    <div>
      <h3>Active Users</h3>
      <ul>
        {activeUsers.map(user=>(
            <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ActiveUserList



/////]]