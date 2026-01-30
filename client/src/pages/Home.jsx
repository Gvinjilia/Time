import Watches from './Watches';

import mainImg from '../images/main_watch_image_home.png';
import watches from '../images/watches.png';
import Timex from '../images/Timex.png';
import Gucci from '../images/Gucci.png';
import Omega from '../images/Omega.png';
import Tissot from '../images/Tissot.png';
import Cartier from '../images/Cartier.png';
import casio from '../images/Casio.png';

import Mark from '../images/Mark.png';
import Milana from '../images/Milana.png';
import Nikolas from '../images/Nikolas.png';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { i18n, t } = useTranslation();

    console.log(i18n.language);

    return (
        <>
            <div className='mb-20 relative'>
                <div className='relative overflow-hidden'>
                    <img src={mainImg} className='w-full min-h-100 object-cover lg:object-fill' />
                    <div className='absolute inset-0 flex items-center justify-center lg:justify-start lg:pl-16 xl:pl-24'>
                        <div className='flex flex-col items-center lg:items-start text-center lg:text-left gap-7 px-6 lg:px-0 text-white'>
                            <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className={`text-4xl md:text-5xl lg:text-7xl w-full ${i18n.language === 'en' ? 'lg:w-150' : 'lg:w-200'}`}>{t('home.hero.title')}</p>
                            <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-sm md:text-base'>{t('home.hero.subtitle')}</p>
                            <button className='border p-2 w-auto min-w-30'>{t('home.hero.button')}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full flex flex-col justify-center items-center px-4'>
                <div className='flex flex-wrap mb-10 gap-8 lg:gap-15'>
                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-2xl lg:text-3xl underline'>{t('home.tabs.bestSellers')}</p>
                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-2xl lg:text-3xl font-light'>{t('home.tabs.newIn')}</p>
                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-2xl lg:text-3xl font-light'>{t('home.tabs.sale')}</p>
                </div>
                <div className='mb-15 flex flex-wrap w-full lg:w-350 justify-center items-center'>
                    <Watches />
                </div>
            </div>

            <div className='flex flex-col lg:flex-row mb-25 w-full'>
                <img src={watches} className='w-full lg:w-50% h-80 lg:h-120 object-cover' />
                <div style={{ backgroundColor: 'var(--background-color, #101010)' }} className='w-full lg:w-50% flex justify-center items-center p-12 lg:p-0'>
                    <p className={`text-white w-full ${i18n.language === 'en' ? 'max-w-70' : 'max-w-100'} font-light text-center lg:text-left px-6 lg:px-0`}>{t('home.banner.text')}</p>
                </div>
            </div>

            <div className='flex flex-col justify-center items-center mb-35 px-4'>
                <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-3xl mb-10'>{t('home.brandsTitle')}</p>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:flex justify-center items-center gap-10 lg:gap-20'>
                    <img src={Timex} className='w-32 lg:w-40 mx-auto' />
                    <img src={Gucci} className='w-32 lg:w-40 mx-auto' />
                    <img src={Omega} className='w-24 lg:w-30 mx-auto' />
                    <img src={Tissot} className='w-28 lg:w-35 mx-auto' />
                    <img src={Cartier} className='w-32 lg:w-40 mx-auto' />
                    <img src={casio} className='w-32 lg:w-40 mx-auto' />
                </div>
            </div>

            <div className='flex flex-col gap-15 justify-center items-center mb-20 px-4'>
                <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-3xl'>{t('home.testimonialsTitle')}</p>

                <div className='flex flex-col lg:flex-row gap-10 justify-center'>
                    <div className='flex flex-col gap-5 items-center lg:items-start'>
                        <img src={Mark} className='w-full lg:w-100 h-[242.73px] object-cover' />

                        <p className='font-bold'>{t('home.testimonials.mark.name')}</p>
                        <p className='w-full lg:w-110 text-center lg:text-left'>{t('home.testimonials.mark.text')}</p>
                    </div>

                    <div className='flex flex-col gap-5 items-center lg:items-start'>
                        <img src={Milana} className='w-full lg:w-100 h-[242.73px] object-cover' />

                        <p className='font-bold'>{t('home.testimonials.milana.name')}</p>
                        <p className='w-full lg:w-110 text-center lg:text-left'>{t('home.testimonials.milana.text')}</p>
                    </div>

                    <div className='flex flex-col gap-5 items-center lg:items-start'>
                        <img src={Nikolas} className='w-full lg:w-100 h-[242.73px] object-cover' />

                        <p className='font-bold'>{t('home.testimonials.nikolas.name')}</p>
                        <p className='w-full lg:w-110 text-center lg:text-left'>{t('home.testimonials.nikolas.text')}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;