import { useContext } from "react";
import { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:3000' + '/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/autoLogin`, {
                    method: 'POST',
                    credentials: 'include'
                });

                const data = await res.json();

                if(res.ok){
                    setUser(data);
                };
            } catch(err){
                console.log('Error', err);
            } finally {
                setLoading(false);
            }
        };

        autoLogin();
    }, []);

    const signup = async (formData) => {
        const toastId = toast.loading('signing in...');

        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            toast.success(`${data.message}`, {
                description: 'Check your email and verify your account',
                id: toastId,
                duration: 5000
            });

            navigate('/login')
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const login = async (formData) => {
        const toastId = toast.loading('logging in...');

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setUser(data);

            toast.success(`Logged in successfully`, {
                id: toastId,
                duration: 5000
            });

            navigate('/profile');
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const logout = async () => {
        const toastId = toast.loading('logging out...');

        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if(!res.ok){
                const data = await res.json();

                throw new Error(data.message);
            };

            setUser(null);

            toast.success(`Logged out successfully!`, {
                id: toastId,
                duration: 5000
            });

            navigate('/login');
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const forgotPassword = async (email) => {
        const toastId = toast.loading('Sending link...');

        try {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            toast.success(`Password reset link sent`, {
                id: toastId,
                description: 'Check your email',
                duration: 5000
            });
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const resetPassword = async (token, newPass) => {
        const toastId = toast.loading('Reseting Password...');

        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPass }),
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            toast.success(`Password Updated successfully`, {
                id: toastId,
                duration: 5000
            });

            navigate('/login')
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const googleOAUTH = () => {
        window.location.href = `${API_URL}/oauth/google`;
    };

    const githubOAUTH = () => {
        window.location.href = `${API_URL}/oauth/github`;
    };
    
    return (
        <AuthContext.Provider value={{ signup, login, logout, user, setUser, googleOAUTH, githubOAUTH, loading, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};