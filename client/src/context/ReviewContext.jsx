import { createContext, useContext, useEffect, useState } from "react";
import { useWatch } from "./WatchContext";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router";

export const ReviewContext = createContext();

export const useReview = () => useContext(ReviewContext);

const API_URL = 'http://localhost:3000' + '/api';

export const ReviewProvider = ({ children }) => {
    const { watch } = useWatch();
    const { user } = useAuth();
    const location = useLocation();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if(!watch || !watch._id) return;
        
        const getReviews = async () => {
            try {
                const res = await fetch(`${API_URL}/reviews/${watch._id}`, {
                    credentials: 'include'
                });

                const result = await res.json();

                if(!res.ok){
                    throw new Error(result.message);
                };

                setReviews(result);
            } catch(err){
                console.log('Error', err);
            }
        };

        getReviews();
    }, [watch?._id]);

    const getAllReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/reviews`, {
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message);
            };

            setReviews(result);
        } catch (err){
            console.log(err)
        }
    };

    useEffect(() => {
        if(user?.role === 'admin' && location.pathname === '/admin'){
            getAllReviews();
        };
    }, [location.pathname, user?.role])

    const createReview = async (formData) => {
        const toastId = toast.loading('Adding review...');

        try {
            const res = await fetch(`${API_URL}/reviews/${watch._id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            toast.success('Your review was added', {
                id: toastId,
                duration: 3000
            });

            setReviews((prev) => [...prev, data]);
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const updateReview = async (id, formData) => {
        const toastId = toast.loading('updating review...');
        
        try {
            const res = await fetch(`${API_URL}/reviews/${watch._id}/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            const reviewIndex = reviews.findIndex((review) => review._id === data._id);
            const copied = [...reviews];
            copied.splice(reviewIndex, 1, data);

            toast.success('Your review was updated successfully', {
                id: toastId,
                duration: 3000
            });

            setReviews(copied);
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const deleteReview = async (watchId, id) => {
        const toastId = toast.loading('Deleting review...');

        try {
            const res = await fetch(`${API_URL}/reviews/${watchId}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok){
                const data = await res.json();

                throw new Error(data.message);
            };

            setReviews(reviews.filter((review) => review._id !== id));
            
            toast.success('Review deleted successfully', {
                id: toastId,
                duration: 3000
            });
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    return (
        <ReviewContext.Provider value={{ createReview, updateReview, deleteReview, getAllReviews, reviews }}>
            {children}
        </ReviewContext.Provider>
    );
};