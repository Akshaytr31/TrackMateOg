import React from 'react'
import UI_IMG from "/src/assets/images/ChatGPT Image Apr 8, 2025, 03_16_27 PM.png"

function AuthLayout({children}) {
    return (
        <div className="flex">
          <div className="w-screen h-screen md:w-[55vw] px-12 pt-8 pb-12">
            <h2 className="text-3xl font-medium text-black">Time Tracker</h2>
            {children}
          </div>
      
          <div className="hidden md:flex w-[45vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
            <img src={UI_IMG} className="w-64 lg:w-[90%] rounded" />
          </div>
        </div>
      );
  
}

export default AuthLayout


////