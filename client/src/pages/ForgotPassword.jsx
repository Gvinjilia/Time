import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

import image from '../images/admin_img-Picsart-AiImageEnhancer.webp';

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();
    const { t } = useTranslation();

    const handleSubmit = (e) => {
        e.preventDefault();

        const email = e.target.email.value;

        forgotPassword(email);

        e.target.reset();
    };
    
    return (
        <>
            <div className='flex justify-center items-center h-screen'>
                <div className="w-125 flex flex-col gap-2">
                    <img src={image} className='h-50 w-125 object-cover mb-2' />
                    <div className='flex flex-col gap-2 mb-2'>
                        <p className='text-xl font-semibold'>Forgot password?</p>
                        <p>Enter your Email to help us identify you.</p>
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        <Input type="email" name="email" placeholder={t('login.fields.emailPlaceholder')} className="rounded-xs" required />
                        <Button className="rounded-xs w-full md:w-125 mb-2">Submit</Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;