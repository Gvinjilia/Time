import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";

import userRoles from '../images/Screenshot 2026-01-15 173059-Picsart-AiImageEnhancer.png';
import usersMainImg from '../images/users_page_main_img.webp';

import { Button } from "@/components/ui/button";
import Chart from "../components/Chart";

const Users = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { users, updateUser, deleteUser } = useUsers();

    if(!user) return <div className="flex justify-center items-center h-screen">
        <Spinner className="w-10 h-10" />
    </div>

    return (
        <>
            <div className='relative mb-10'>
                <img src={userRoles} className='w-full h-64 md:h-135 object-cover object-top' />
                <div className='absolute inset-0 bg-black opacity-40'></div>

                <div className='absolute flex justify-center items-center inset-0 z-10 px-5'>
                    <p className='text-white text-3xl md:text-[66px] text-center' style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>{t('usersPage.heroTitle')}</p>
                </div>
            </div>
            
            <div className="flex justify-center w-full mb-10 px-5">
                <div className="flex flex-col justify-center gap-7 w-full max-w-266.25">
                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-xl font-extralight'>{t('usersPage.title')}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full">
                        {users.map((u) => (
                            <div key={u._id} className="flex flex-col justify-center border p-5">
                                <div className="flex gap-5 items-center">
                                    {
                                        u.avatar ? (
                                            <img src={u.avatar} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover" />
                                        ) : (
                                            <img src="https://www.scgajunior.org/wp-content/uploads/2021/03/blank-img.png" className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
                                        )
                                    }
                                    <div className="overflow-hidden">
                                        <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className="text-[11px] md:text-[13px] font-light truncate">{u.fullname}</p>
                                        <p className="font-light text-sm md:text-base mb-1 truncate">{u.email}</p>
                                        <p className="font-light text-sm md:text-base mb-1 italic">{u.role}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {
                                        ((user._id !== u._id) && (u.role !== 'admin')) && (
                                            <div className="flex flex-col sm:flex-row w-full justify-between gap-4">
                                                <div className="flex gap-2">
                                                    <Button className="rounded-full w-8 h-8 bg-transparent text-black border border-black font-light text-[13px] hover:bg-gray-100" onClick={() => updateUser(u._id, 'admin')}>A</Button>
                                                    <Button className="rounded-full w-8 h-8 bg-transparent text-black border border-black font-light text-[13px] hover:bg-gray-100" onClick={() => updateUser(u._id, 'moderator')}>M</Button>
                                                    <Button className="rounded-full w-8 h-8 bg-transparent text-black border border-black font-light text-[13px] hover:bg-gray-100" onClick={() => updateUser(u._id, 'user')}>U</Button>
                                                </div>
                                                {
                                                    user.role === 'admin' && (
                                                        <Button className={`rounded-xs w-full sm:w-28 h-8 font-light ${i18n.language === 'en' ? 'text-[13px]' : 'text-[10px]'}`} onClick={() => deleteUser(u._id)}>{t('usersPage.deleteButton')}</Button>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Users;