import contactUsImg from '../images/ContactUs main Img.png';

import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import Footer from '../components/Footer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();
    const [toggleAlert, setToggleAlert] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameValue = e.target.name.value;

        setName(nameValue);

        setToggleAlert(true);

        e.target.reset();
    };

    return (
        <>
            <img src={contactUsImg} className='w-full h-auto object-cover object-top' />

            <div className='flex flex-col justify-center items-center mt-10 mb-15 px-5'>
                <div className='mb-10 flex flex-col justify-center items-center text-center'>
                    <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className='text-3xl md:text-4xl mb-2'>{t('contact.title')}</p>
                    <p className='max-w-150'>{t('contact.subtitle')}</p>
                </div>
                <div className='w-full max-w-180'>
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-col md:flex-row gap-3 mb-5'>
                            <Input placeholder={t('contact.fields.name')} name="name" className="rounded-xs w-full md:w-88 p-3" required />
                            <Input placeholder={t('contact.fields.email')} name="email" className="rounded-xs w-full md:w-88 p-3" required />
                        </div>
                        <Textarea placeholder={t('contact.fields.message')} name='message' className="rounded-xs h-25 mb-5" required />
                        <Button className='font-light w-full md:w-180 rounded-xs'>{t('contact.button')}</Button>
                    </form>
                    <AlertDialog open={toggleAlert} onOpenChange={setToggleAlert}>
                        <AlertDialogTrigger asChild></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t('contact.success.title')}</AlertDialogTitle>
                                <AlertDialogDescription>{name?.split(' ').filter((e) => e !== '').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')}, {t('contact.success.description')}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setToggleAlert(false)}>{t('contact.success.close')}</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Contact;