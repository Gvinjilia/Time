import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { soteria } from 'soteria-sdk';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ cart: [], total: 0 });

    useEffect(() => {
        const getUserCart = async () => {
            try {
                const res = await fetch(`${API_URL}/cart`, {
                  credentials: "include",
                });

                const data = await res.json();

                if(res.status === 404){
                    setCart({ cart: [], total: 0 });
                    return;
                };

                if (!res.ok) {
                  throw new Error(data.message);
                }

                setCart(data);
            } catch (err) {
                console.log("Error", err);
            }
        };

        getUserCart();
    }, []);

    const addItemToCart = async (watchId) => {
        const toastId = toast.loading('Adding a watch to cart...');

        try {
            const res = await fetch(`${API_URL}/cart`, {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ watchId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            };

            toast.success(`Watch added successfully to cart`, {
                id: toastId,
                duration: 3000
            });

            setCart(data);
        } catch (err) {
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const deleteItemFromCart = async (id) => {
        const toastId = toast.loading('Deleting a watch from cart...');

        try {
            const res = await fetch(`${API_URL}/cart`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            };

            toast.success(`Watch deleted successfully from cart`, {
                id: toastId,
                duration: 3000
            });

            setCart(data);
        } catch (err) {
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const clearCart = async () => {
        const toastId = toast.loading('Clearing Cart...');

        try {
            const res = await fetch(`${API_URL}/cart/clear`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setCart(data);

            toast.success(`Cart Cleared`, {
                id: toastId,
                duration: 3000
            });
        } catch (err) {
            toast.error(`Error: ${err.message}`, {
                id: toastId
            });
        }
    };

    const goToCheckout = async (orderId) => {
        try {
            const res = await fetch(`${API_URL}/stripe/checkout`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId }),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            };

            window.location.href = data.session_url;
        } catch (err) {
            console.log("Error", err);
        }
    };

    const goToSoteriaCheckoutPage = async () => {
        try {
            const res = await fetch(`${API_URL}/soteria/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart }),
                credentials: 'include'
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            };

            if(data.url){
                window.location.href = data.url;
            };
        } catch(err){
            console.log(err)
        }
    };

    return (
        <CartContext.Provider value={{addItemToCart, deleteItemFromCart, clearCart, goToCheckout, goToSoteriaCheckoutPage, cart}}>
          {children}
        </CartContext.Provider>
    );
};