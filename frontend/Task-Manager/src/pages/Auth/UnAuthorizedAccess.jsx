import React from 'react'
import {Link} from 'react-router-dom'

function UnAuthorizedAccess() {
  return (
    <div className='flex justify-center items-center h-dvh bg-blue-100'>
      <div className='card flex flex-col items-center gap-2.5 max-w-[500px] text-center'>
        <h1 className='text-[30px] text-red-500'>Access Denied!</h1> 
        <p>you donot have access to admin dashboard.If you want to acces admin dashboard you want to sign up with admin key.</p>
        <Link to="/signup" className='text-blue-400 hover:scale-101'>
          Go to Signup 
        </Link>
      </div>
    </div>
  )
}

export default UnAuthorizedAccess

//
