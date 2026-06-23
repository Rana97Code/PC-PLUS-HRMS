
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserContext from "./UserContex";

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [base_url, setBaseUrl] = useState<string | null>(null);
    const [image_url, setImageUrl] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [headers, setHeaders] = useState<any | null>(null);
    const [email, setUserEmail] = useState<string | null>(null);

    const publicRoutes = ["/", "/login", "/register"];

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL;
        const imageUrl = import.meta.env.VITE_APP_API_IMAGE_URL;

        if (baseUrl) {
            setBaseUrl(baseUrl);
        } else {
            console.error("VITE_APP_BASE_URL environment variable is not set");
        }
        if (imageUrl) {
            setImageUrl(imageUrl);
        } else {
            console.error("VITE_APP_API_IMAGE_URL environment variable is not set");
        }

        const validateToken = () => {
            const storedUser = localStorage.getItem("Token");

            if (!storedUser) {
                setToken(null);
                setHeaders(null);
                setUserEmail(null);

                if (!publicRoutes.includes(location.pathname)) {
                    navigate("/login");
                }

                return;
            }

            try {
                const jsonToken = JSON.parse(storedUser);
                const jwt: any = jwtDecode(jsonToken);

                if (jwt.exp !== undefined) {
                    const current_time = Date.now() / 1000;

                    if (jwt.exp < current_time) {
                        localStorage.clear();
                        setToken(null);
                        setHeaders(null);
                        setUserEmail(null);

                        if (!publicRoutes.includes(location.pathname)) {
                            navigate("/login");
                        }

                        return;
                    }
                }

                setToken(jsonToken);
                setHeaders({ Authorization: `Bearer ${jsonToken}` });
                setUserEmail(jwt.user_email);
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.clear();

                if (!publicRoutes.includes(location.pathname)) {
                    navigate("/login");
                }
            }
        };

        validateToken();

        const interval = setInterval(validateToken, 60000);

        return () => clearInterval(interval);
    }, [navigate, location.pathname]);

    const contextValue = useMemo(
        () => ({ base_url, image_url, token, headers, email }),
        [base_url, image_url, token, headers, email]
    );

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;