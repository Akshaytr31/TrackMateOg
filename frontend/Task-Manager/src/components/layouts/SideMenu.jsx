import React, { useContext, useEffect, useState } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const [sideMenuData, setSideMenuData] = useState([]);

    const navigate = useNavigate();
    const isAdmin = user?.role === "admin";

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout();
            return;
        }
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    useEffect(() => {
        console.log("User data:", user); 
        if (user) {
            setSideMenuData(isAdmin ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
        }
    }, [user, isAdmin]);

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
            {/* Profile Section */}
            <div className="flex flex-col items-center justify-center mb-7 pt-5">
                <div className="relative">
                    <img 
                        src={user?.profileImageUrl || "https://via.placeholder.com/80"} 
                        alt="Profile" 
                        className="w-20 h-20 bg-slate-400 rounded-full" 
                    />
                </div>
                {isAdmin && (
                    <div className="text-[10px] font-medium text-white bg-blue-500 px-3 rounded mt-1">
                        Admin
                    </div>
                )}
                <h5 className="text-gray-950 font-medium leading-6 mt-3">
                    {user?.name || "Guest User"}
                </h5>
                <p className="text-[12px] text-gray-500">{user?.email || "No email available"}</p>
            </div>

            {/* Menu Items */}
            {sideMenuData.map((item, index) => (
                <button 
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 cursor-pointer 
                        ${activeMenu === item.label ? "text-blue-500 bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-[3px]" : ""}
                    `}
                    onClick={() => handleClick(item.path)}
                >
                    <item.icon className="text-xl" />
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default SideMenu;






//]]
