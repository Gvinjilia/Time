import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import Layout from "../components/Layout";

import { Button } from '@/components/ui/button';

import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import { useTranslation } from "react-i18next";
import { useOrders } from "../context/OrderContext";
import { useWatch } from "../context/WatchContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import a_m_u from '../images/explain_A_m_u_meaning.png';

import userRoles from '../images/Screenshot 2026-01-15 173059-Picsart-AiImageEnhancer.png';
import admin from '../images/admin_img.webp';
import moderator from '../images/moderator.webp';
import Chart from "../components/Chart";

const Admin = () => {
    const { i18n, t } = useTranslation();
    const { user } = useAuth();
    const { watches, watch, updateWatch, deleteWatch, createWatch } = useWatch();
    const { orders, updateToShipped } = useOrders();
    const { reviews, deleteReview } = useReview();
    const [updating, setUpdating] = useState(null);
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const [creating, setCreating] = useState(false);
    const { users, updateUser, deleteUser } = useUsers();
    const [images, setImages] = useState([]);
    const [section, setSection] = useState('watches');
    const [gender, setGender] = useState('');

    const navigate = useNavigate();

    const editableFields = watch ? Object.keys(watch).filter((key) => !["_id", "__v", "createdAt", "updatedAt", "isAvailable"].includes(key)) : ["name", "images", "brand", "category", "description", "price"];;

    const handleImages = (e) => {
        const toastId = toast.loading('Previewing Image...');

        const files = Array.from(e.target.files);

        if(files.length > 4){
            e.target.value = '';
            toast.error(`You can only add 4 images per watch`, {
                id: toastId
            });
            return;
        } else {
            toast.success(`Image(s) added`, {
                id: toastId,
                duration: 3000
            });
        }

        const imgs = files.map((file) => URL.createObjectURL(file));

        setImages(imgs);
    };

    const deleteImg = (file) => {
        const filtered = images.filter((img) => img !== file);

        setImages(filtered);
    };

    const handleCreate = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append('gender', gender);

        createWatch(formData);

        images.forEach(url => URL.revokeObjectURL(url));

        setCreating(false);
        setImages([]);
    };

    const handleSubmit = (e, orderId) => {
        e.preventDefault();

        const status = e.target.status.value;

        updateToShipped(orderId, status);
        setUpdatingOrder(null);
    };

    const handleUpdate = async (watchId, e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        updateWatch(watchId, formData);

        setUpdating(null);
    };

    return (
        <>
            <div className='relative mb-10'>
                <img src={userRoles} className='w-full h-64 md:h-100 object-cover object-top' />
                <div className='absolute inset-0 bg-black opacity-40'></div>

                <div className='absolute flex justify-center items-center inset-0 z-10 px-5'>
                    <p className='text-white text-3xl md:text-[66px] text-center' style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }}>{t('admin.hero.title')}</p>
                </div>
            </div>
            <Layout activeSection={section} setSection={setSection}>
                <div className="p-6 flex-1 w-full">
                    {section === 'users' && (
                        <div className="w-full">
                            <div className="overflow-x-auto">
                                <Table className="w-full min-w-200">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('admin.tables.columns.user')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.fullname')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.email')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.verified')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.manageRole')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.deleteUser')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            users.length > 0 ? (
                                                users.map((u) => (
                                                    user?._id !== u._id && (
                                                        <TableRow key={u._id}>
                                                            <TableCell className="flex gap-3 items-center">{u.avatar ? <img className="w-7 h-7 rounded-full" src={u.avatar} /> : <img className="w-7 h-7 rounded-full" src='https://www.scgajunior.org/wp-content/uploads/2021/03/blank-img.png' />} <span className="text-[13px]">{ u.fullname.split(' ').length > 1 ? u.fullname.split(' ')[0] : u.fullname.split(' ')[0] }</span></TableCell>
                                                            <TableCell><p>{u.fullname}</p></TableCell>  
                                                            <TableCell><p>{u.email}</p></TableCell>
                                                            <TableCell className="w-fit h-5 p-2 text-xs rounded-full">{u.isVerified === true ? (t('admin.tables.status.verified')) : (t('admin.tables.status.notVerified'))}</TableCell>                                     
                                                            <TableCell className="flex gap-1">
                                                                {u.role}
                                                                <Button className="rounded-full w-5 h-5 p-0 bg-transparent text-black border border-black font-light text-[12px] hover:bg-gray-100" onClick={() => updateUser(u._id, 'admin')}>A</Button>
                                                                <Button className="rounded-full w-5 h-5 p-0 bg-transparent text-black border border-black font-light text-[12px] hover:bg-gray-100" onClick={() => updateUser(u._id, 'moderator')}>M</Button>
                                                                <Button className="rounded-full w-5 h-5 p-0 bg-transparent text-black border border-black font-light text-[12px] hover:bg-gray-100" onClick={() => updateUser(u._id, 'user')}>U</Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button className="h-7 rounded-xs font-light text-[13px]" onClick={() => deleteUser(u._id)}>{t('usersPage.deleteButton')}</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center">No Users Yet</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                    {
                        section === 'reviews' && (
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('admin.tables.columns.userId')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.watchId')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.reviewId')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.comment')}</TableHead>
                                            <TableHead className="text-right">{t('admin.tables.columns.deleteComment')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            reviews.length > 0 ? (
                                                reviews.map((review) => (
                                                    <TableRow key={review?._id}>
                                                        {console.log(review)}
                                                        <TableCell>{review?.userId?.slice(-10)}</TableCell>
                                                        <TableCell onClick={() => navigate(`/watches/${review.productId}`)}>{review.productId.slice(-10)}</TableCell>
                                                        <TableCell>{review._id.slice(-10)}</TableCell>
                                                        <TableCell className="max-w-20 truncate text-[13px]">{review.comment}</TableCell>
                                                        <TableCell className="text-right"><Button className="h-7 rounded-xs font-light text-[13px]" onClick={() => deleteReview(review.productId, review?._id)}>{t('admin.tables.columns.deleteComment')}</Button></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center">No Reviews Yet</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    }
                    {
                        section === 'orders' && (
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('admin.tables.columns.orderId')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.userId')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.status')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.paymentMethod')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.address')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.totalPrice')}</TableHead>
                                            <TableHead>{t('admin.tables.columns.updateStatus')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            orders.length > 0 ? (
                                                orders.map((order) => (
                                                    <TableRow key={order._id}>
                                                        <TableCell>{order._id.slice(-10)}</TableCell>
                                                        <TableCell>{order.userId.slice(-10)}</TableCell>
                                                        <TableCell>{order.status}</TableCell>
                                                        <TableCell>{order.paymentMethod}</TableCell>
                                                        <TableCell>{order.shippingAddress.city}, {order.shippingAddress.street}</TableCell>
                                                        <TableCell>{order.totalPrice.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            {
                                                                updatingOrder === order._id ? (
                                                                    <form onSubmit={(e) => handleSubmit(e, order._id)}>
                                                                        <input type="text" name="status" placeholder={t('orders.updateStatus.placeholder')} className="w-42 mb-2 border p-1" required />
                                                                                                                        
                                                                        <div className="flex gap-2">
                                                                            <button className="border p-1 w-20 rounded-[5px]">{t('orders.updateStatus.submit')}</button>
                                                                            <button className="border p-1 w-20 rounded-[5px]" onClick={() => setUpdatingOrder(null)}>{t('orders.updateStatus.cancel')}</button>
                                                                        </div>
                                                                    </form>
                                                                ) : (
                                                                    <button onClick={() => setUpdatingOrder(order._id)} className={`border p-1 ${i18n.language === 'en' ? 'w-27': 'w-auto'} rounded-[5px]`}>{t('orders.updateStatus.button')}</button>
                                                                )
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center">No Orders Yet</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    }
                    {
                        section === 'watches' && (
                            <div>
                                <Dialog open={creating === true} onOpenChange={(o) => { if(!o) images.forEach(url => URL.revokeObjectURL(url)); setImages([]); setCreating(false) }}>
                                    <Button onClick={() => setCreating(true)} variant="outline" className="rounded-xs mb-4">{t('admin.modals.addWatch.trigger')}</Button>
                                    <DialogContent className="max-w-87.5">
                                        <DialogHeader>
                                            <DialogTitle>{t('admin.modals.addWatch.title')}</DialogTitle>
                                            <DialogDescription>{t('admin.modals.addWatch.description')}</DialogDescription>
                                        </DialogHeader>
                                        <form className="flex flex-col gap-2" onSubmit={handleCreate}>
                                            <div className='flex flex-wrap gap-3 w-full'>
                                                <Input type="text" name="name" placeholder={t('shop.addWatch.fields.name')} className="border p-1 w-full md:w-56 rounded-xs" required />
                                                <Input type="text" name="category" placeholder={t('shop.addWatch.fields.category')} className="border p-1 w-full md:w-56 rounded-xs" required />
                                                <Input type="text" name="brand" placeholder={t('shop.addWatch.fields.brand')} className="border p-1 w-full md:w-56 rounded-xs" required />
                                                <Input type="number" name="price" placeholder={t('shop.addWatch.fields.price')} className="border p-1 w-full md:w-56 rounded-xs" required />
                                                <Textarea name="description" placeholder={t('shop.addWatch.fields.description')} className="border p-1 w-full h-35 rounded-xs" required />
                                                <Input type="file" multiple name="images" className='mb-2 rounded-xs' onChange={handleImages} required />
                                                <Select onValueChange={setGender}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose a gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Genders</SelectLabel>
                                                            <SelectItem value="men">men</SelectItem>
                                                            <SelectItem value="women">women</SelectItem>
                                                            <SelectItem value="unisex">unisex</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex gap-2">
                                                {
                                                    images.map((img, key) => (
                                                        <img key={key} src={img} className="w-15 h-15 object-cover" onClick={() => deleteImg(img)} />
                                                    ))
                                                }
                                            </div>
                                            <DialogFooter className="flex flex-col gap-2 sm:flex-col">
                                                <Button type="submit" variant="default" className="w-full rounded-xs font-light">{t('shop.addWatch.submit')}</Button>
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary" className="w-full rounded-xs">{t('shop.addWatch.cancel')}</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Table>
                                    <TableHeader>
                                        <TableHead>{t('admin.tables.columns.watch')}</TableHead>
                                        <TableHead>{t('admin.tables.columns.name')}</TableHead>
                                        <TableHead>{t('admin.tables.columns.brand')}</TableHead>
                                        <TableHead>{t('admin.tables.columns.category')}</TableHead>
                                        <TableHead>{t('admin.tables.columns.description')}</TableHead>
                                        <TableHead>{t('admin.tables.columns.price')}</TableHead>
                                        <TableHead>{t('admin.tables.columns.updateWatch')}</TableHead>
                                        <TableHead>{t('admin.tables.columns.deleteWatch')}</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            watches.length > 0 ? (
                                                watches.map((w) => (
                                                    <TableRow key={w._id}>
                                                        <TableCell><img src={w.images[0].url} className="w-15 h-15 object-cover" /></TableCell>
                                                        <TableCell>{w.name}</TableCell>
                                                        <TableCell>{w.brand}</TableCell>
                                                        <TableCell>{w.category}</TableCell>
                                                        <TableCell className="max-w-30 truncate text-[13px]">{w.description}</TableCell>
                                                        <TableCell>{w.price}</TableCell>
                                                        <TableCell>
                                                            <Dialog open={updating === w._id} onOpenChange={(o) => { if(!o) setUpdating(null) }}>
                                                                <Button onClick={() => setUpdating(w._id)} variant="outline" className="rounded-xs">{t('admin.modals.updateWatch.trigger')}</Button>
                                                                <DialogContent className="w-350">
                                                                    <DialogHeader>
                                                                        <DialogTitle>{t('admin.modals.updateWatch.title')}</DialogTitle>
                                                                        <DialogDescription>{t('admin.modals.updateWatch.description')}</DialogDescription>
                                                                    </DialogHeader>
                                                                    <form className="flex flex-col gap-2" onSubmit={(e) => handleUpdate(w._id, e)}>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="flex flex-wrap gap-3 w-full">
                                                                                {
                                                                                    editableFields.map((key) => (
                                                                                        <div key={key} className={`flex flex-col gap-2 mb-2 ${key === 'price' || key === 'description' ? 'w-full' : 'w-auto'}`}>
                                                                                            <Label>{key[0].toUpperCase() + key.slice(1).toLowerCase()}</Label>

                                                                                            <div>
                                                                                                {key === "images" ? (
                                                                                                    <Input type="file" name="images" className='w-56 rounded-xs' multiple />
                                                                                                ) : (
                                                                                                    key === 'description' ? (
                                                                                                        <Textarea name='description' className="w-full h-25 rounded-xs" defaultValue={w[key]} />
                                                                                                    ) : (
                                                                                                        <Input className={`border p-1 ${key === 'price' ? 'w-full' : 'w-56'} rounded-xs`} type="text" name={key} defaultValue={w[key]} />
                                                                                                    )
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                }

                                                                                <Select onValueChange={setGender}>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Choose a gender" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        <SelectGroup>
                                                                                            <SelectLabel>Genders</SelectLabel>
                                                                                            <SelectItem value="men">men</SelectItem>
                                                                                            <SelectItem value="women">women</SelectItem>
                                                                                            <SelectItem value="unisex">unisex</SelectItem>
                                                                                        </SelectGroup>
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
                                                                            <Button type="submit" variant="default" className="w-full rounded-xs font-light">{t('admin.modals.updateWatch.save')}</Button>
                                                                            <DialogClose asChild>
                                                                                <Button type="button" variant="secondary" className="w-full rounded-xs">{t('admin.modals.updateWatch.close')}</Button>
                                                                            </DialogClose>
                                                                        </DialogFooter>
                                                                    </form>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button className="rounded-xs font-light text-[13px]" onClick={() => deleteWatch(w._id)}>{t('admin.tables.columns.deleteWatch')}</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center">No Watches Yet</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    }
                    {
                        section === 'profile' && (
                            <div className='w-full md:w-full'>
                                <div className="flex gap-3 items-center h-full mb-5">
                                    <div>
                                        <img src={user.avatar ? user.avatar : 'https://www.scgajunior.org/wp-content/uploads/2021/03/blank-img.png'} className="w-12 h-12 rounded-full" />
                                    </div>
                                    <div>
                                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light text-[16px]'>{user.fullname?.split(' ').filter((e) => e !== '').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
                                        <p>{t('profile.location')}</p>
                                    </div>
                                </div>
                                <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className='font-extralight text-2xl mb-5'>{t('profile.permissions.title')}</p>
                                <p className='font-light mb-5'>{t('profile.permissions.description')}</p>

                                <div className='flex flex-col md:flex-row gap-5 justify-start mb-5'>
                                    <img src={admin} className='w-full md:w-40 object-cover' />
                                    <img src={moderator} className='w-full md:w-100 h-55 object-cover' />
                                </div>

                                <div className='flex flex-col gap-5 mb-10'>
                                    <div className='w-full md:w-145 flex flex-col md:flex-row justify-between items-center gap-2'>
                                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.permissions.userRoles')}</p>
                                        <Button className="rounded-xs font-light w-full md:w-30" onClick={() => navigate('/users')}>{t('profile.permissions.buttons.users')}</Button>
                                    </div>

                                    <div className='w-full md:w-145 flex flex-col md:flex-row justify-between items-center gap-2'>
                                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.permissions.ordersManagement')}</p>
                                        <Button className="rounded-xs font-light w-full md:w-30" onClick={() => navigate('/orders')}>{t('profile.permissions.buttons.orders')}</Button>
                                    </div>

                                    <div className='w-full md:w-145 flex flex-col md:flex-row justify-between items-center gap-2'>
                                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.permissions.watchesManagement')}</p>
                                        <Button className="rounded-xs font-light w-full md:w-30" onClick={() => navigate('/shop')}>{t('profile.permissions.buttons.shop')}</Button>
                                    </div>
                                </div>

                                <div className='flex flex-col md:flex-row gap-5 justify-start items-center'>
                                    <img src={a_m_u} className='w-full md:w-70' />
                                    <div className='flex flex-col gap-3 text-[10px] font-light' style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>
                                        <p>{t('profile.permissions.rolesExplanation.admin')}</p>
                                        <p>{t('profile.permissions.rolesExplanation.moderator')}</p>
                                        <p>{t('profile.permissions.rolesExplanation.user')}</p>
                                    </div>
                                </div>
                            </div> 
                        )
                    }
                    {
                        section === 'collection overview' && (
                            <div>
                                <Chart orders={orders} watches={watches} />

                                <div className="flex flex-col lg:flex-col gap-10 mt-10 px-4 lg:px-0 lg:ml-10">
                                    <div className="w-full lg:w-270">
                                        <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className="mb-3">{t('admin.charts.revenue.title')}</p>
                                        <p className="font-extralight">{t('admin.charts.revenue.description')}</p>
                                    
                                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className="text-[12px] mt-2">{t('admin.charts.revenue.subtext')}</p>
                                    </div>
                                    <div className="w-full lg:w-270">
                                        <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }}  className="mb-3">{t('admin.charts.prices.title')}</p>
                                        <p className="font-extralight">{t('admin.charts.prices.description')}</p>
                                    
                                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className="text-[12px] mt-2">{t('admin.charts.prices.subtext')}</p>
                                    </div>
                                    <div className="w-full lg:w-270">
                                        <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className="mb-3">{t('admin.charts.sales.title')}</p>
                                        <p className="font-extralight">{t('admin.charts.sales.description')}</p>

                                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className="text-[12px] mt-2">{t('admin.charts.sales.subtext')}</p>
                                    </div>
                                </div> 
                            </div>
                        )
                    }
                </div>
            </Layout>
        </>
    );
};

export default Admin;