import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";  
import UserContext from "./UserContex";

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [base_url, setBaseUrl] = useState<string | null >(null);
    const [token, setToken] = useState<string | null>(null);
    const [headers, setHeaders] = useState<any | null>(null);
    const [email, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL;  
        if (baseUrl) {
            setBaseUrl(baseUrl);
        } else {
            console.error("VITE_APP_BASE_URL environment variable is not set");
        }

        const storedUser = localStorage.getItem('Token');
        if (storedUser != null) {
            const jwt: any = jwtDecode(storedUser);

            const userEmail = jwt.user_email;
            const jsonToken = JSON.parse(storedUser);
            const authHeaders = { Authorization: `Bearer ${jsonToken}` };

            setToken(jsonToken);
            setHeaders(authHeaders);
            setUserEmail(userEmail);
        } else {
            navigate("/");
            return;
        }

        // For Auto Refresh and validation check
        const validateToken = () => {
            const storedUser = localStorage.getItem('Token');
            if (!storedUser) {
                navigate("/");
                return;
            }
            const jwt: any = jwtDecode(storedUser);
            try {
                if (jwt.exp !== undefined) {
                    const current_time = Date.now() / 1000;
                    if (jwt.exp < current_time) {
                        localStorage.clear();
                        navigate("/");
                    } else {
                        console.log("Yes You are Valid");
                    }
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate("/");
            }
        };

        validateToken(); 
        const interval = setInterval(validateToken, 60000); // Validate every 60 seconds

        return () => clearInterval(interval); 

    }, [navigate]);

    const contextValue = useMemo(() => ({ base_url, token, headers, email }), [base_url, token, headers, email]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;