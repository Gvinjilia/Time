import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

import shopMainImg from '../images/shopMainImg.jpg';
import emptyCart from '../images/emptyCart.png';
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const Cart = () => {
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const { cart, deleteItemFromCart, addItemToCart, clearCart } = useCart();

    return (
        <>
            <div className='relative'>
                <div className='absolute inset-0 flex justify-center items-center z-10 px-5'>
                    <div className='flex justify-center items-center w-full'>
                        <div className='hidden md:block border-t-3 w-140'></div>
                        <div className='md:mx-10'>
                            <p className={`w-full md:${i18n.language === 'en' ? 'w-150' : 'w-180'} text-4xl md:text-[75px] text-white text-center`} style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>{t('cart.heroTitle')}</p>
                        </div>
                        <div className='hidden md:block border-t-3 w-140'></div>
                    </div>
                </div>
                <div>
                    <img src={shopMainImg} className='w-full h-100 md:h-auto object-cover' />
                </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-10 mb-10 mt-10 px-5 md:px-0">
                {
                    cart.cart.length > 0 ? (
                        <>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full md:w-auto table-auto border mx-auto">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="p-3 text-left md:w-60">{t('cart.table.product')}</th>
                                            <th className="p-3 text-left md:w-50">{t('cart.table.price')}</th>
                                            <th className="p-3 text-left md:w-50">{t('cart.table.quantity')}</th>
                                            <th className="p-3 text-left md:w-30">{t('cart.table.subtotal')}</th>
                                            <th className="p-3 md:w-15"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.cart.map((item, index) => (
                                            <tr key={index} className="border-b md:border-none">
                                                <td className="p-3 md:w-80">
                                                    <div className="flex items-center gap-3 md:gap-5">
                                                        <img className="w-12 h-12 md:w-20 md:h-20 object-contain shrink-0" src={item.product?.images?.[0].url} />
                                                        <p className="text-xs md:text-base wrap-break-word">{item.product.name}</p>
                                                    </div>
                                                </td>   
                                                <td className="p-3 text-xs md:text-base">{item.product.price}</td>
                                                <td className="p-3">
                                                    <div className="w-16 md:w-25 flex justify-between px-1 md:px-3 items-center border">
                                                        <button onClick={() => deleteItemFromCart(item.product._id)}>-</button>
                                                        <p className="p-2 md:p-3 text-xs md:text-base">{item.quantity}</p>
                                                        <button onClick={() => addItemToCart(item.product._id)}>+</button>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-xs md:text-base">{item.quantity * item.product.price}</td>
                                                <td className="p-3 text-center">
                                                    <Trash size={18} className="cursor-pointer mx-auto" onClick={() => deleteItemFromCart(item.product._id)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col md:flex-row w-full md:w-225 justify-between gap-5">
                                <div className="flex flex-col md:flex-row gap-5 w-full md:w-auto">
                                    <Button onClick={() => navigate('/checkout')} className="p-2 w-full md:w-70 rounded-xs font-light">{t('cart.buttons.order')}</Button>
                                    <button onClick={clearCart} className="p-1 w-full md:w-70 border border-black">{t('cart.buttons.clearCart')}</button>
                                </div>
                                <p>{t('cart.totalPrice')}: {cart.total.toFixed(2)}</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-5 py-10">
                            <div className="flex flex-col justify-center items-center">
                                <img src={emptyCart} className="w-60 h-60" />
                                <p>{t('cart.empty.message')}</p>
                            </div>
                            <Button className="rounded-none p-3 w-50" onClick={() => navigate('/shop')}>{t('cart.empty.button')}</Button>
                        </div>
                    )
                }
            </div>
            <Footer />
        </>
    )
};

export default Cart;