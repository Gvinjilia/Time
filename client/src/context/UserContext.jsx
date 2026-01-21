import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);

    const { setUser } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/users`, {
                    credentials: 'include'
                });

                const result = await res.json();

                if(!res.ok){
                    throw new Error(result.message);
                };

                setUsers(result);
            } catch(err){
                console.log('Error', err);
            }
        };

        getUsers();
    }, []);

    const updateUser = async (id, role) => {
        const toastId = toast.loading('Updating user role...');

        try {
            const res = await fetch(`${API_URL}/users/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role })
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            const userIndex = users.findIndex((user) => user._id === id);
            const copiedUsers = [...users];
            copiedUsers.splice(userIndex, 1, data);

            toast.success(`User role upadated successfully to ${role}`, {
                id: toastId,
                duration: 3000
            });

            setUsers(copiedUsers);
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const updateUserData = async (formData) => {
        const toastId = toast.loading('Updating Your data...');

        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'PATCH',
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

            toast.success(`Your data updated successfully`, {
                description: 'When you log out from your account, you have to log in with the data, you just updated!',
                id: toastId,
                duration: 3000
            });

            setUser(null);
            navigate('/login');
        } catch (err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const deleteUser = async (id) => {
        const toastId = toast.loading('Deleting User...');

        try {
            const res = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok){
                const result = await res.json();
                throw new Error(result.message);
            };

            toast.success('User deleted successfully', {
                id: toastId,
                duration: 3000
            });

            setUsers(users.filter((user) => user._id !== id));
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    return (
        <UserContext.Provider value={{ updateUser, deleteUser, updateUserData, users }}>
            {children}
        </UserContext.Provider>
    );
};