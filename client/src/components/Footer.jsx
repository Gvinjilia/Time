import { Link } from 'react-router';
import footerImg from '../images/footer_watches_image.jpg';
import logo from '../images/white logo.png';
import send from '../images/send (2).png';
import twitter from '../images/twitter (5).png';
import instagram from '../images/instagram (10).png';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <>
            <div style={{ backgroundColor: 'var(--background-color, #101010)' }}>
                <div className='flex flex-col md:flex-row justify-center items-center gap-10 md:gap-60 mb-25 px-6 md:px-0'>
                    <div className='md:ml-60 text-white text-center md:text-left pt-10 md:pt-0'>
                        <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-3xl md:text-4xl mb-5'>{t('footer.newsletter.title')}</p>
                        <p className='w-full md:w-100 mb-10 font-light'>{t('footer.newsletter.description')}</p>

                        <form className='bg-white p-0.5 w-full md:w-120 flex justify-between rounded-[1px]'>
                            <input type="email" name="email" placeholder={t('footer.newsletter.emailPlaceholder')} required className='placeholder:text-gray-400 outline-none pl-2 text-black w-full'/>
                            <button className='bg-black text-white w-30 p-2 shrink-0'>{t('footer.newsletter.subscribe')}</button>
                        </form>
                    </div>
                    <div className='hidden md:block'>
                        <img src={footerImg} className='w-200' />
                    </div>
                </div>
                <div className='flex mb-15 px-6'>
                    <div className='flex flex-col md:flex-row justify-center w-full gap-10 md:gap-70 text-white items-center md:items-start text-center md:text-left'>
                        <div>
                            <img src={logo} className='w-30 mx-auto md:mx-0' />
                            <p className='text-white font-light'>{t('footer.address')}</p>
                        </div>
                        <div>
                            <ul className='flex flex-wrap justify-center font-light gap-5 md:gap-10'>
                                <li><Link to='/'>{t('footer.links.home')}</Link></li>
                                <li><Link to='/profile'>{t('footer.links.profile')}</Link></li>
                                <li><Link to='/watches'>{t('footer.links.watches')}</Link></li>
                                <li><Link to='/orders'>{t('footer.links.orders')}</Link></li>
                            </ul>
                        </div>
                        <div className='flex flex-col gap-5 items-center md:items-start'>
                            <p className='text-white'>+1 123 345 67</p>

                            <div className='flex gap-5 w-5 h-5'>
                                <img src={send} />
                                <img src={twitter} />
                                <img src={instagram} />
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='opacity-20' />
                <div className='flex justify-center text-white font-light p-5'>
                    <div className='flex flex-col md:flex-row justify-between items-center w-full md:w-307 gap-4'>
                        <p className='text-center'>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
                        <p>{t('footer.privacyPolicy')}</p>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Footer;