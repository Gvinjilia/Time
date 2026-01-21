import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useAuth } from "../context/AuthContext";
import github from '../images/Github.png';
import google from '../images/Google.png';
import loginSignup from '../images/signup-login.png';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const Signup = () => {
    const { t } = useTranslation();
    const { signup, googleOAUTH, githubOAUTH } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            fullname: e.target.fullname.value,
            email: e.target.email.value,
            password: e.target.password.value
        };

        signup(data);

        e.target.reset();
    };

    return (
        <>
            <div className="flex justify-center items-center lg:h-full md:h-screen sm:h-screen h-screen w-full px-4">
                <div className="flex flex-col md:flex-row items-center justify-center md:h-200 gap-10 md:gap-15 w-full">
                    <div className="w-full md:w-90 flex flex-col justify-center gap-2 shrink-0">
                        <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className="text-2xl">{t('signup.title')}</p>
                        <p className="font-light mb-5">{t('signup.subtitle')}</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <div className="flex flex-col gap-3 mb-3">
                                <label htmlFor="fullname">{t('signup.fields.fullname')}</label>
                                <Input className="rounded-xs" id="fullname" type="text" name="fullname" placeholder={t('signup.fields.fullnamePlaceholder')} required />

                                <label htmlFor="email-input">{t('signup.fields.email')}</label>
                                <Input className="rounded-xs" id="email-input" type="email" name="email" placeholder={t('signup.fields.emailPlaceholder')} required />

                                <label htmlFor="password">{t('signup.fields.password')}</label>
                                <Input className="rounded-xs mb-2" id="password" type="password" name="password" placeholder={t('signup.fields.passwordPlaceholder')} required />
                            </div>

                            <Button className="rounded-xs w-full md:w-90 mb-2">{t('signup.button')}</Button>
                        </form>

                        <div className="flex flex-col gap-2 w-full md:w-90">
                            <div className="border border-black flex justify-center items-center">
                                <img src={google} className="w-5 h-5" />
                                <Button className="bg-transparent text-black hover:bg-transparent" onClick={googleOAUTH}>{t('signup.google')}</Button>
                            </div>
                            <div className="flex justify-center items-center bg-black">
                                <img src={github} className="w-5 h-5" />
                                <Button className="bg-black text-white" onClick={githubOAUTH}>{t('signup.github')}</Button>
                            </div>
                        </div>

                        <p className="flex justify-center items-center mt-2">{t('signup.login')} <span className="hover:underline transfrom 3s ml-2 cursor-pointer" onClick={() => navigate('/login')}>{t('signup.loginLink')}</span></p>
                    </div>
                    <div className="hidden md:block h-full overflow-hidden">
                        <img src={loginSignup} className="h-full w-full object-cover" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;