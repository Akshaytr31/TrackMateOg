import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths"; 

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = localStorage.getItem("token");
            if (!accessToken) {
                setLoading(false);
                return;
            }
    
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };
    
        fetchUser();
    }, []); // ✅ Run only once on mount

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);
        setLoading(false);
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, clearUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
