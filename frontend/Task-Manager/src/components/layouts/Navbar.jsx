import React, { useState } from 'react';
import { HiOutlineX, HiOutlineMenu } from 'react-icons/hi'; // Import icons
import SideMenu from './SideMenu';

function Navbar({ activeMenu }) {
  const [OpenSideMenu, setOpenSideMenu] = useState(false); // Initialize state

  return (
    <div className='flex gap-5 border border-b border-blur-[2px] py-4 px-7 sticky top-0 z-30 '>
      <button
        className='block lg:hidden text-black'
        onClick={() => {
          setOpenSideMenu(!OpenSideMenu); 
        }}
      >
        {OpenSideMenu ? (
          <HiOutlineX className="text-2xl"/> 
        ) : (
          <HiOutlineMenu className="text-2xl"/> 
        )}
      </button>
      <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>

      {OpenSideMenu && (
        <div className='fixed top-[61px] -ml-4 bg-white'>
          <SideMenu activeMenu={activeMenu} /> 
        </div>
      )}
    </div>
  );
}

export default Navbar;
