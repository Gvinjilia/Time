import aboutUsImg from '../images/Time aboutUs page main image.jpg';
import watch from '../images/Time aboutUs page watch.jpg';
import timeWatches from '../images/Time about page watches.png';
import watches from '../images/Time aboutUs page watch2.jpg';

import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <div className='relative'>
                <img src={aboutUsImg} className='w-full h-100 md:h-150 object-cover object-top' />
                <div className='absolute inset-0 bg-black opacity-40'></div>

                <div className='absolute flex justify-center items-center inset-0 z-10'>
                    <p className='text-white text-4xl md:text-[66px] text-center' style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>{t('about.heroTitle')}</p>
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-10 md:gap-15 mt-10 items-center justify-center'>
                <div className='w-full md:w-145 flex flex-col gap-5 px-5 md:px-0'>
                    <p className='w-full md:w-20 text-4xl md:text-5xl'>{t('about.section1.title')}</p>
                    <p className='text-[13.5px] font-semibold'>{t('about.section1.paragraph1')}</p>

                    <p className='text-[13.5px] font-light'>{t('about.section1.paragraph2')}</p>
                </div>
                <div className='w-full md:w-auto'>
                    <img src={watch} className='w-full md:w-210 object-cover' />
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-10 md:gap-20 items-center justify-start mb-10 mt-10 md:mt-0'>
                <img src={timeWatches} className='w-full md:w-[740.50px] h-auto md:h-[384.66px] object-cover' />

                <div className='px-5 md:px-0'>
                    <p className='font-light text-3xl md:text-4xl mb-5'>{t('about.section2.title')}</p>
                    <p className='w-full md:w-170 font-light' style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>{t('about.section2.description')}</p>
                </div>
            </div>

            <div className='relative mb-15 flex flex-col md:flex-row items-center justify-start'>
                <div className='relative w-full'>
                    <img src={watches} className='w-full h-80 md:h-120 object-cover object-top' />
                    <div className='absolute inset-0 bg-black opacity-40'></div>
                </div>

                <div className='static md:absolute bg-white h-auto md:h-120 w-full md:w-80 top-0 md:left-170 flex flex-col justify-center items-center border gap-7 py-10 md:py-0'>
                    <div className='flex flex-col justify-center items-center gap-3 px-5'>
                        <p className='text-2xl font-light text-center'>{t('about.section3.title')}</p>
                        <p className='w-full md:w-70 font-light text-center' style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>{t('about.section3.description')}</p>
                    </div>
                
                    <Button className="rounded-xs p-3 w-50 font-light" onClick={() => navigate('/shop')}>{t('about.section3.button')}</Button>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default About;