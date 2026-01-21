import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useCart } from "./CartContext";

export const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const OrderProvider = ({ children }) => {
    const { goToSoteriaCheckoutPage } = useCart();
    const [orderHistory, setOrderHistory] = useState([]);
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    const navigate = useNavigate();

    const getUserOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders/history`, {
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setOrderHistory(data);
        } catch(err){
            console.log('Error', err);
        }
    };

    const getAllUsersOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            setOrders(data);
        } catch(err){
            console.log('Error', err);
        }
    };

    useEffect(() => {
        if(!user) return;
        
        if(user?.role === 'moderator' || user?.role === 'admin'){
            getAllUsersOrders();
        } else {
            getUserOrders();
        };
    }, [user]);

    const addOrder = async (formData) => {
        const toastId = toast.loading('Adding Order...');
        
        try {
            if(formData.paymentMethod === 'cash'){
                const res = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include'
                });

                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                };

                toast.success('you have successfully added a watch', {
                    description: 'Now your order will be tracked and arrive to you as soon as possible',
                    id: toastId,
                    duration: 3000
                });

                getUserOrders();
                navigate('/orders');
            } else if(formData.paymentMethod === 'stripe') {
                const res = await fetch(`${API_URL}/stripe/checkout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include'
                });

                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                };
                
                window.location.href = data.session_url;
            } else {
                goToSoteriaCheckoutPage();
            }
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const updateToShipped = async (id, status) => {
        const toastId = toast.loading('updating user Order...');

        try {
            const res = await fetch(`${API_URL}/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message)
            };

            toast.success('User order status updated successfully', {
                id: toastId,
                duration: 3000
            });

            setOrderHistory((prev) => prev.map(order => order._id === id ? data : order));

            setOrders((prev) => prev.map(order => order._id === id ? data : order));
        } catch(err){
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const confirmOrder = async (sessionId) => {
        try {
            const res = await fetch(`${API_URL}/stripe/confirm/${sessionId}`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            if(user.role === 'moderator' || user.role === 'admin'){
                getAllUsersOrders();
            } else {
                getUserOrders();
            };

            window.history.replaceState({}, '', '/orders');
        } catch(err){
            console.log('err', err);
        }
    };

    return (
        <OrderContext.Provider value={{addOrder, updateToShipped, confirmOrder, orderHistory, orders}}>
            {children}
        </OrderContext.Provider>
    );
};