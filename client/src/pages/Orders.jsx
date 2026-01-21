import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext"

import { Spinner } from '@/components/ui/spinner';
import DataTable from "../components/DataTable";

import nixonUnit from '../images/orders_page_main_image.png';

import { ArrowUpDown } from "lucide-react";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import Chart from "../components/Chart";

const Orders = () => {
    const { i18n, t } = useTranslation();
    const [updating, setUpdating] = useState(null);
    const { user } = useAuth();
    const { orderHistory, orders, updateToShipped, confirmOrder } = useOrders();
    const navigate = useNavigate();

    useEffect(() => {
        const sessionId = new URLSearchParams(window.location.search).get('session_id');

        if(sessionId){
            confirmOrder(sessionId);

            window.history.replaceState({}, '', '/orders');
        };
    }, []);

    const handleSubmit = (e, orderId) => {
        e.preventDefault();

        const status = e.target.status.value;

        updateToShipped(orderId, status);
        setUpdating(null);
    };

    const columns = [
        {
            accessorKey: '_id',
            header: t('orders.table.orderId'),
            cell: ({ row }) => {
                const id = row.getValue('_id');
                return id.slice(-8);
            },
        },
        {
            accessorKey: 'status',
            header: t('orders.table.status'),
            cell: ({ row }) => {
                const status = row.getValue('status');
                return (
                    <p>{status}</p>
                );
            },
        },
        {
            accessorKey: 'paymentMethod',
            header: t('orders.table.payment'),
        },
        {
            accessorKey: 'totalPrice',
            header: ({ column }) => (
                <button className="flex justify-center items-center" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>{t('orders.table.total')} <ArrowUpDown className="ml-2 h-4 w-4" /></button>
            ),
            enableSorting: true,
            cell: ({ row }) => {
                const amount = row.getValue('totalPrice');
                return `${amount}$`;
            },
        },
        {
            accessorKey: 'shippingAddress',
            header: t('orders.table.address'),
            cell: ({ row }) => {
                const address = row.getValue('shippingAddress');
                return `${address.city}, ${address.country}`;
            },
        }
    ];

    if(!user) return <div className="flex justify-center items-center h-screen">
        <Spinner className="w-10 h-10" />
    </div>

    if(user.role === 'admin' || user.role === 'moderator'){
        columns.push(        {
            accessorKey: 'actions',
            header: t('orders.table.actions'),
            cell: ({ row }) => {
                if(user.role !== 'admin' && user.role !== 'moderator'){
                    return null;
                };

                const order = row.original;

                return (
                    updating === order._id ? (
                        <form onSubmit={(e) => handleSubmit(e, order._id)}>
                            <input type="text" name="status" placeholder={t('orders.updateStatus.placeholder')} className="w-42 mb-2 border p-1" required />
                                                                            
                            <div className="flex gap-2">
                                <button className="border p-1 w-20 rounded-[5px]">{t('orders.updateStatus.submit')}</button>
                                <button className="border p-1 w-20 rounded-[5px]" onClick={() => setUpdating(null)}>{t('orders.updateStatus.cancel')}</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => setUpdating(order._id)} className={`border p-1 ${i18n.language === 'en' ? 'w-27': 'w-auto'} rounded-[5px]`}>{t('orders.updateStatus.button')}</button>
                    )
                )
            }
        });
    };

    return (
        <>
            <div className='relative mb-10'>
                <div className='absolute top-20 md:top-60 left-10 md:left-63 right-10 z-10'>
                    <div className='flex flex-col justify-center text-white'>
                        <p className="text-[11px] md:text-[13px] font-semibold mb-2">{t('orders.hero.featured')}</p>
                        <p className="text-2xl md:text-4xl font-bold mb-5">{t('orders.hero.title')}</p>

                        <button className="w-35 md:w-45 border-2 p-1 md:p-1.5 text-sm md:text-base" onClick={() => navigate('/shop')}>{t('orders.hero.button')}</button>
                    </div>
                </div>
                <div className="w-full h-80 md:h-auto overflow-hidden">
                    <img src={nixonUnit} className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="flex justify-center items-center mb-10 px-5 overflow-x-auto">
                {
                    ((user.role === 'moderator') || (user.role === 'admin')) ? (
                        <DataTable columns={columns} data={orders} />
                    ) : (
                        <DataTable columns={columns} data={orderHistory} />
                    )
                }
            </div>
            <Footer />
        </>
    )
};

export default Orders;