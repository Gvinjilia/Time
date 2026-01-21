import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useParams } from "react-router";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

import image from '../images/admin_img-Picsart-AiImageEnhancer.webp';

const ResetPassword = () => {
    const { t } = useTranslation();
    const { resetPassword } = useAuth();
    const { token } = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPass = e.target.newPass.value;

        resetPassword(token, newPass);
    };

    return (
        <>
            <div className='flex justify-center items-center h-screen'>
                <div className="w-125 flex flex-col gap-2">
                    <img src={image} className='h-50 w-125 object-cover mb-2' />
                    <div className='flex flex-col gap-2 mb-2'>
                        <p className='text-xl font-semibold'>Password Reset</p>
                        <p>4 characters minimum</p>
                        <p>At least one number</p>
                        <p>Upper & lowercase character</p>
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        <Input type="password" name="newPass" placeholder='Enter new Password' className="rounded-xs" required />
                        <Button className="rounded-xs w-full md:w-125 mb-2">Submit</Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;