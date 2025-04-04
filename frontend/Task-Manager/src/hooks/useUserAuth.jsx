// import { useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/userContext";

// function useUserAuth() {
//     const { user, loading, clearUser } = useContext(UserContext); // Fix: Use `clearUser` instead of `clear`
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (loading) return;
//         if (user) return;

//         if (!user) {
//             clearUser(); // Correct function call
//             navigate("/login");
//         }
//     }, [user, loading, clearUser, navigate]);
// }

// export default useUserAuth;




import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

function useUserAuth() {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        // Allow users to access the dashboard even if they are not logged in
        // Remove this check if you want users to access the dashboard without login
        if (!user) {
            // Optionally, you can redirect unauthenticated users to a different page, or leave it empty
            // navigate("/login");
        }
    }, [user, loading, navigate]);
}

export default useUserAuth;
