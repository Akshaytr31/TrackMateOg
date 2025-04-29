import React, { useState } from 'react';
import { HiOutlineX, HiOutlineMenu } from 'react-icons/hi';
import SideMenu from './SideMenu';
import '../styles/Sidebar.css'; 

function Navbar({ activeMenu }) {
  const [OpenSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className='navbar flex gap-5 border-b border-b-blue-200 py-4 px-7 sticky top-0 z-1001 bg-white'>
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
      <h2 className='text-lg font-medium text-black'>Time Tracker</h2>

      {/* Sidebar */}
      <div className={`sidebar ${OpenSideMenu ? 'open' : ''}`}>
        <SideMenu activeMenu={activeMenu} />
      </div>

      {/* Overlay */}
      {OpenSideMenu && (
        <div
          className="fixed "
          onClick={() => setOpenSideMenu(false)}
        ></div>
      )}
    </div>
  );
}

export default Navbar;

/////]]]