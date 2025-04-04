// import React, { useState } from 'react'
// import axiosInstance from '../../utils/axiosInstance'
// import { API_PATHS } from '../../utils/apiPaths'

// function SelectUsers({SelectUsers,setSlectedUsers}){
//     const [allUsers,setAllUsers]=useState([])
//     const [isModalOpen,setIsModalOpen]=useState(false)
//     const [tempSelectedUsers,setTempSelectodUsers]=useState([])

//     const getAllUsers=async ()=>{
//         try{
//             const response=await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS)
//             if(response.data?.length>0){
//                 setAllUsers(response.data)
//             }
//         }catch(error){
//             console.error("Error fetching users",error)
//         }
//     }

//     const toggleUserSelection=(userId)=>{
//         setTempSelectodUsers((prev)=>
//             prev.includes(userId)
//                 ? prev.filter((id)=>id!==userId)
//                 : [...prev,userId]
//         )
//     }
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default SelectUsers


// ////]]]]]]


import React from 'react'

function SelectUsers() {
  return (
    <div>
      
    </div>
  )
}

export default SelectUsers
