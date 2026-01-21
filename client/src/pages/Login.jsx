import { useAuth } from "../context/AuthContext";

import loginSignup from '../images/signup-login.png';

import google from '../images/Google.png';
import github from '../images/Github.png';

import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const Login = () => {
    const { t } = useTranslation();
    const { login, googleOAUTH, githubOAUTH, forgotPassword } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        login(data);
    };

    return (
        <>
            <div className="flex justify-center items-center lg:h-full md:h-screen sm:h-screen h-screen w-full px-4">
                <div className="flex flex-col md:flex-row items-center justify-center md:h-200 gap-10 md:gap-15 w-full">
                    <div className="w-full md:w-90 flex flex-col justify-center gap-2 shrink-0">
                        <p style={{ fontFamily: 'var(--font-family2, "Major Mono Display", monospace)' }} className="text-2xl">{t('login.title')}</p>
                        <p className="font-light mb-5">{t('login.subtitle')}</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <div className="flex flex-col gap-3 mb-3">
                                <label htmlFor="email-input">{t('login.fields.email')}</label>
                                <Input className="rounded-xs" id="email-input" type="email" name="email" placeholder={t('login.fields.emailPlaceholder')} required />

                                <label htmlFor="password">{t('login.fields.password')}</label>
                                <Input className="rounded-xs mb-2" id="password" type="password" name="password" placeholder={t('login.fields.passwordPlaceholder')} required />
                            </div>

                            <Button className="rounded-xs w-full md:w-90 mb-2">{t('login.button')}</Button>
                        </form>

                        <div className="flex flex-col gap-2 w-full md:w-90">
                            <div className="border border-black flex justify-center items-center">
                                <img src={google} className="w-5 h-5" />
                                <Button className="bg-transparent text-black hover:bg-transparent" onClick={googleOAUTH}>{t('login.google')}</Button>
                            </div>
                            <div className="flex justify-center items-center bg-black">
                                <img src={github} className="w-5 h-5" />
                                <Button className="bg-black text-white" onClick={githubOAUTH}>{t('login.github')}</Button>
                            </div>
                        </div>

                        <p className="text-[13px] mt-1 hover:underline transfrom 3s cursor-pointer" onClick={() => navigate('/forgot-password')}>Forgot Password?</p>
                        <p className="flex justify-center items-center">{t('login.signup')} <span className="hover:underline transfrom 3s ml-2 cursor-pointer" onClick={() => navigate('/signup')}>{t('login.signupLink')}</span></p>
                    </div>
                    <div className="hidden md:block h-full overflow-hidden">
                        <img src={loginSignup} className="h-full w-full object-cover" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;