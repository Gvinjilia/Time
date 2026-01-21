import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Globe } from "lucide-react";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

import { Menu, X } from "lucide-react";

import logo from '../images/Logo.png';
import { useTranslation } from "react-i18next";

const languages = {
    en: {
        nativeName: 'English',
        label: 'nav.languages.en'
    },
    ka: {
        nativeName: 'Georgian',
        label: 'nav.languages.ka'
    },
    ru: {
        nativeName: 'Russian',
        label: 'nav.languages.ru'
    }
};

const Nav = () => {
    const { i18n, t } = useTranslation();
    const { user, logout } = useAuth();
    const [toggle, setToggle] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    console.log("Users page rendering with language:", i18n.language);

    return (
        <>
            <header className="relative z-50">
                <nav className="flex justify-center items-center">
                    <ul className="flex items-center justify-between w-full max-w-270 gap-4 md:gap-10 p-2">
                        {
                            user ? (
                                <>
                                    <div className="md:hidden z-100" onClick={() => setIsOpen(!isOpen)}>
                                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                                    </div>
                                    <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-12 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 gap-4 md:gap-10 z-50 border-b md:border-none`}>
                                        <li><Link to='/' onClick={() => setIsOpen(false)}>{t('nav.home')}</Link></li>
                                        <li><Link to='/profile' onClick={() => setIsOpen(false)}>{t('nav.profile')}</Link></li>
                                        <li><Link to='/shop' onClick={() => setIsOpen(false)}>{t('nav.watches')}</Link></li>
                                        <li><Link to='/orders' onClick={() => setIsOpen(false)}>{t('nav.orders')}</Link></li>
                                        <li className="md:hidden"><Link to='/about' onClick={() => setIsOpen(false)}>{t('nav.aboutUs')}</Link></li>
                                        <li className="md:hidden"><Link to='/contact' onClick={() => setIsOpen(false)}>{t('nav.contactUs')}</Link></li>
                                        {
                                            ((user.role === 'admin') || (user.role === 'moderator')) && (
                                                <li className="md:hidden"><Link to='/users' onClick={() => setIsOpen(false)}>{t('nav.users')}</Link></li>
                                            )
                                        }
                                        <div className="hidden md:block">
                                            <NavigationMenu>
                                                <NavigationMenuList>
                                                    <NavigationMenuItem>
                                                        <NavigationMenuTrigger className="bg-transparent! font-normal! text-[15px]! h-5.25 p-0!">{t('nav.pages')}</NavigationMenuTrigger>
                                                        <NavigationMenuContent>
                                                            <ul className="w-auto min-w-25">
                                                                <li><Link to='/about'><NavigationMenuLink>{t('nav.aboutUs')}</NavigationMenuLink></Link></li>
                                                                <li><Link to='/contact'><NavigationMenuLink>{t('nav.contactUs')}</NavigationMenuLink></Link></li>
                                                                {
                                                                    ((user.role === 'admin') || (user.role === 'moderator')) && (
                                                                        <li><Link to='/users'><NavigationMenuLink>{t('nav.users')}</NavigationMenuLink></Link></li>
                                                                    )
                                                                }
                                                            </ul>
                                                        </NavigationMenuContent>
                                                    </NavigationMenuItem>
                                                </NavigationMenuList>
                                            </NavigationMenu>
                                        </div>
                                        <li className="md:hidden" onClick={() => { logout(); setIsOpen(false); }}><Link to='/login'>{t('nav.logout')}</Link></li>
                                    </div>
                                    <div className="shrink-0">
                                        <img src={logo} className="h-10 md:h-12" />
                                    </div>
                                    <div className="flex justify-end w-15 md:w-78.75 gap-10">
                                        <div className="flex justify-center items-center gap-5">
                                            <div onClick={() => setToggle(!toggle)} className="flex flex-col relative">
                                                <div className="flex gap-2 justify-center items-center">
                                                    <Globe className="w-4 h-4" />
                                                    <p className="text-[14px]">{i18n.language.toUpperCase() === 'KA' ? 'GE': i18n.language.toUpperCase()}</p>
                                                </div>

                                                {
                                                    toggle && (
                                                        <div className="absolute z-10 bg-white p-3 w-auto min-w-25 rounded-xs top-6 right-0">
                                                            <div className="flex flex-col gap-1 items-start">
                                                                {Object.keys(languages).map((language, index) => (
                                                                    <button key={index} onClick={() => i18n.changeLanguage(language)}>{t(languages[language].label)}</button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            {
                                                user.role === 'user' && (
                                                    <li><Link to='/cart'>{t('nav.cart')}</Link></li>
                                                )
                                            }
                                            <li className="hidden md:block" onClick={logout}><Link to='/login'>{t('nav.logout')}</Link></li>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div onClick={() => setToggle(!toggle)} className="flex flex-col relative">
                                        <div className="flex gap-2 justify-center items-center">
                                            <Globe className="w-4 h-4" />
                                            <p className="text-[14px]">{i18n.language.toUpperCase() === 'KA' ? 'GE': i18n.language.toUpperCase()}</p>
                                        </div>

                                        {
                                            toggle && (
                                                <div className="absolute z-10 bg-white p-3 w-auto min-w-25 rounded-xs top-6 right-0">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        {Object.keys(languages).map((language, index) => (
                                                            <button key={index} onClick={() => i18n.changeLanguage(language)}>{t(languages[language].label)}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div>
                                        <img src={logo} className="h-10 md:h-12" />
                                    </div>
                                    <div className="flex gap-6 md:gap-10">
                                        <li><Link to='/signup'>{t('nav.signup')}</Link></li>
                                        <li><Link to='/login'>{t('nav.login')}</Link></li>
                                    </div>
                                </>
                            )
                        }
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default Nav;