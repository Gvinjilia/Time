import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const WatchContext = createContext();

export const useWatch = () => useContext(WatchContext);

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const WatchProvider = ({ children }) => {
    const [watches, setWatches] = useState([]);
    const [watch, setWatch] = useState(null);

    useEffect(() => {
        const getWatches = async () => {
            try {
                const res = await fetch(`${API_URL}/watches`);

                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                };

                setWatches(data);
            } catch(err){
                console.log(err);
            }
        };

        getWatches();
    }, []);

    const getWatch = async (id) => {
        try {
            const res = await fetch(`${API_URL}/watches/${id}`);

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message);
            };

            setWatch(result);
        } catch(err){
            console.log('Error', err);
        }
    };

    const createWatch = async (formData) => {
        const toastId = toast.loading('Adding a new watch...');

        try {
            const res = await fetch(`${API_URL}/watches`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            toast.success('Watch added successfully', {
                id: toastId,
                duration: 3000
            });

            setWatches((prev) => [...prev, data]);
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const updateWatch = async (id, formData) => {
        const toastId = toast.loading('Updating watch...');

        try {
            const res = await fetch(`${API_URL}/watches/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData
            });

            console.log(formData);

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            const watchIndex = watches.findIndex((watch) => watch._id === data._id);
            const copied = [...watches];
            copied.splice(watchIndex, 1, data);

            toast.success('Watch Updated', {
                id: toastId,
                duration: 3000
            });
            
            setWatches(copied);
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const deleteWatch = async (id) => {
        const toastId = toast.loading('Deleting Watch...');

        try {
            const res = await fetch(`${API_URL}/watches/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok){
                const data = await res.json();

                throw new Error(data.message);
            };

            toast.success('Watch deleted successfully', {
                id: toastId,
                duration: 3000
            });

            setWatches(watches.filter((watch) => watch._id !== id));
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    return (
        <WatchContext.Provider value={{ getWatch, createWatch, updateWatch, deleteWatch, watches, watch }}>
            {children}
        </WatchContext.Provider>
    );
};