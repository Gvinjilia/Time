import { useState } from 'react';
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../context/UserContext';

import timeWatches from '../images/Time about page watches.png';
import watch from '../images/Time aboutUs page watch.jpg';
import admin from '../images/admin_img.webp';
import moderator from '../images/moderator.webp';

import a_m_u from '../images/explain_A_m_u_meaning.png';

import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Settings, User, Shield } from "lucide-react";
import { useNavigate } from 'react-router';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { updateUserData } = useUsers();

    const [updating, setUpdating] = useState(false);
    const [toggleProfile, setToggleProfile] = useState(true);
    const [togglePermissionsSection, setTogglePermissionsSection] = useState(false);
    const [toggleSettingsSection, setToggleSettingsSection] = useState(false);

    const editableFields = user ? Object.keys(user).filter((key) => !["_id", "__v", "createdAt", "updatedAt", "isAvailable", "role", "isVerified", "password", "oauthProvider", 'oauthId', 'avatar', 'verificationCode', 'resetPassExpires', 'resetPassToken'].includes(key)) : [];

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            fullname: e.target.fullname.value,
            email: e.target.email.value,
            oldPassword: e.target.oldPassword.value,
            newPassword: e.target.newPassword.value
        };

        updateUserData(data);
        setUpdating(false);

        e.target.reset();
    };

    return (
        <>
            <div className='flex flex-col justify-center items-center'>
                <div className='mb-20 p-5 md:p-10 w-full md:w-285'>
                    <h1 className='text-2xl mb-5'>{t('profile.title')}</h1>
                    <div className='flex flex-col md:flex-row gap-5'>
                        <div className='w-full md:w-55 border-b md:border-b-0 md:border-r border-black flex flex-wrap md:flex-col gap-5 md:gap-3 pb-5 md:pb-0'>
                            <div className='flex gap-2 items-center cursor-pointer' onClick={() => { setToggleProfile(true); setToggleSettingsSection(false); setTogglePermissionsSection(false); }}>
                                <User className='w-5 h-5' />
                                <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.menu.personalDetails')}</p>
                            </div>
                            <div className='flex gap-2 items-center cursor-pointer' onClick={() => { setToggleSettingsSection(true); setToggleProfile(false); setTogglePermissionsSection(false); }}>
                                <Settings className='w-5 h-5' />
                                <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.menu.settings')}</p>
                            </div>
                            {
                                ((user?.role === 'admin') || (user?.role === 'moderator')) && (
                                    <div className='flex gap-2 items-center cursor-pointer' onClick={() => { setToggleSettingsSection(false); setToggleProfile(false); setTogglePermissionsSection(true); }}>
                                        <Shield className='w-5 h-5' />
                                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.menu.permissions')}</p>
                                    </div>
                                )
                            }
                        </div>

                        <div className='md:ml-5'>
                            {
                                toggleProfile && (
                                    <>
                                        <div className={`${!updating ? 'flex flex-col md:flex-row w-full md:w-200 justify-between mb-5' : 'flex flex-col gap-5'}`}>
                                            {
                                                user.oauthProvider ? (
                                                    <div className='flex gap-3 mb-5 md:mb-0'>
                                                        <img width={50} height={50} style={{ borderRadius: '50%' }} src={user?.avatar} />
                                                        <div>
                                                            <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light text-xl'>{user.fullname?.split(' ').filter((e) => e !== '').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
                                                            <p>{t('profile.location')}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='flex gap-3 mb-5 md:mb-0'>
                                                        <img className='w-13 h-13 rounded-full' src="https://www.scgajunior.org/wp-content/uploads/2021/03/blank-img.png" />
                                                        <div>
                                                            <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light text-xl'>{user.fullname?.split(' ').filter((e) => e !== '').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>
                                                            <p>{t('profile.location')}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            <form onSubmit={handleSubmit}>
                                                {
                                                    updating && editableFields.map((key) => (
                                                        <div className='flex flex-col gap-2' key={key}>
                                                            <label htmlFor={key}>{key[0].toUpperCase() + key.slice(1).toLowerCase()}</label>
                                                            <Input type='text' className="mb-5 rounded-[5px]" name={key} defaultValue={user[key]} />
                                                        </div>
                                                    ))
                                                }

                                                {
                                                    updating && (
                                                        <div className='flex flex-col gap-2'>
                                                            <label htmlFor='pass'>{t('profile.fields.password')}</label>
                                                            <div className='flex flex-col md:flex-row gap-3'>
                                                                <Input id="pass" type='password' name='oldPassword' className="w-full md:w-100 rounded-xs" placeholder={t('profile.fields.oldPassword')}/>
                                                                <Input type='password' name='newPassword' className="w-full md:w-100 rounded-xs" placeholder={t('profile.fields.newPassword')} />
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                {
                                                    updating ? (
                                                        <div className='flex flex-col gap-2 mt-5'>
                                                            <Button className='rounded-xs flex justify-center items-center'>{t('profile.saveChanges')}</Button>
                                                            <Button type="button" className="rounded-xs bg-transparent border border-black text-black hover:bg-transparent" onClick={() => setUpdating(false)}>{t('profile.cancel')}</Button>
                                                        </div>
                                                    ) : (
                                                        <Button className="rounded-xs font-light w-full md:w-auto" onClick={() => setUpdating(true)}>{t('profile.updateButton')}</Button>
                                                    )
                                                }
                                            </form>
                                        </div>

                                        {
                                            !updating && (
                                                <>
                                                    <p>{t('profile.fields.email')}: {user?.email}</p>
                                                    <p>{t('profile.fields.role')}: {user?.role}</p>

                                                    <div className='w-full md:w-200 mt-7'>
                                                        <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className='font-extralight text-xl mb-3'>{t('profile.menu.personalDetails')}</p>
                                                        <p className='font-light'>{t('profile.personalDetailsText')}</p>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </>
                                )
                            }
                            <div>
                                {
                                    toggleSettingsSection && (
                                        <div className='w-full md:w-200'>
                                            <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className='font-extralight text-2xl mb-5'>{t('profile.settings.title')}</p>
                                            <p className='font-light mb-5'>{t('profile.settings.description')}</p>

                                            <div className='flex flex-col md:flex-row gap-5 justify-end mb-5'>
                                                <img src={watch} className='w-full md:w-80 object-cover' />
                                                <img src={timeWatches} className='w-full md:w-130 h-55 object-cover' />
                                            </div>

                                            <Button className="rounded-xs font-light w-full md:w-200" onClick={() => { setToggleProfile(true); setToggleSettingsSection(false); }}>{t('profile.settings.button')}</Button>
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                {
                                    togglePermissionsSection && (
                                        <div className='w-full md:w-200'>
                                            <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className='font-extralight text-2xl mb-5'>{t('profile.permissions.title')}</p>
                                            <p className='font-light mb-5'>{t('profile.permissions.description')}</p>

                                            <div className='flex flex-col md:flex-row gap-5 justify-end mb-5'>
                                                <img src={admin} className='w-full md:w-110 md:h-55 object-cover' />
                                                <img src={moderator} className='w-full md:w-100 h-55 object-cover' />
                                            </div>

                                            <div className='flex flex-col gap-5 mb-10'>
                                                <div className='w-full md:w-200 flex flex-col md:flex-row justify-between items-center gap-2'>
                                                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.permissions.userRoles')}</p>
                                                    <Button className="rounded-xs font-light w-full md:w-30" onClick={() => navigate('/users')}>{t('profile.permissions.buttons.users')}</Button>
                                                </div>

                                                <div className='w-full md:w-200 flex flex-col md:flex-row justify-between items-center gap-2'>
                                                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.permissions.ordersManagement')}</p>
                                                    <Button className="rounded-xs font-light w-full md:w-30" onClick={() => navigate('/orders')}>{t('profile.permissions.buttons.orders')}</Button>
                                                </div>

                                                <div className='w-full md:w-200 flex flex-col md:flex-row justify-between items-center gap-2'>
                                                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light'>{t('profile.permissions.watchesManagement')}</p>
                                                    <Button className="rounded-xs font-light w-full md:w-30" onClick={() => navigate('/shop')}>{t('profile.permissions.buttons.shop')}</Button>
                                                </div>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-5 w-full md:w-200 justify-between items-center'>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
};

export default Profile;