import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

import shopMainImg from '../images/shopMainImg.jpg';

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

const Checkout = () => {
    const { t } = useTranslation();
    const { cart } = useCart();
    const { addOrder } = useOrders();
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            paymentMethod: paymentMethod,
            shippingAddress: {
                street: e.target.street.value,
                city: e.target.city.value,
                postalCode: e.target.postalCode.value,
                country
            }
        };

        addOrder(data);
    };

    const subtotal = cart.cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    useEffect(() => {
            setCountries([
                "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
                "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
                "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
                "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
                "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
                "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland", "France",
                "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
                "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
                "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
                "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
                "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
                "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal",
                "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
                "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
                "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
                "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
                "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
                "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
                "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
                "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
            ]);
    }, []);

    return (
        <>
            {/* <div className='relative'>
                <div className='absolute top-40 left-10 right-10'>
                    <div className='flex justify-center items-center'>
                        <div className='border-t-3 w-140'></div>
                        <div className='ml-25'>
                            <p className='w-150 text-[75px] text-white' style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>Titanium Body & Quartz Heart</p>
                        </div>
                        <div className='border-t-3 w-140'></div>
                    </div>
                </div>
                <div>
                    <img src={shopMainImg} className='w-full' />
                </div>
            </div> */}
            <div className="flex justify-center items-center mb-10 mt-10 px-5">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10 md:gap-30 w-full md:w-270">
                    <div className="flex flex-col gap-3 w-full md:w-140">
                        <div className="flex flex-col gap-5 justify-start w-full md:w-165 mb-5">
                            <p className="text-5xl md:text-7xl font-black">{t('checkout.title')}</p>
                            <p className="font-semibold text-[18px]">{t('checkout.billingDetails')}</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="firstname">{t('checkout.fields.firstName')}</label>
                                <input type="text" name="firstname" id="firstname" className="border rounded-xs w-full md:w-75 p-2" required />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label htmlFor="lastname">{t('checkout.fields.lastName')}</label>
                                <input type="text" name="lastname" id="lastname" className="border rounded-xs w-full md:w-75 p-2" required />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="company">{t('checkout.fields.company')}</label>
                            <input type="text" name="company" id="company" className="border rounded-xs w-full md:w-155 p-2" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="paymentMethod">Payment Method</label>
                            <Select onValueChange={setPaymentMethod} id="paymentMethod">
                                <SelectTrigger className="w-full md:w-155">
                                    <SelectValue placeholder="Choose Payment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Payment Method</SelectLabel>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="stripe">Stripe</SelectItem>
                                        <SelectItem value="soteria">Soteria</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="street">{t('checkout.fields.street')}</label>
                                <input type="text" name="street" className="border rounded-xs w-full md:w-75 p-2" required />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label htmlFor="city">{t('checkout.fields.city')}</label>
                                <input type="text" name="city" id="city" className="border rounded-xs w-full md:w-75 p-2" required />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="postalCode">{t('checkout.fields.zipCode')}</label>
                                <input type="text" name="postalCode" id="postalCode" className="border rounded-xs w-full md:w-75 p-2" required />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="email">{t('checkout.fields.email')}</label>
                                <input type="text" name="email" id="email" className="border rounded-xs w-full md:w-75 p-2"  required />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 mb-2">
                            <label htmlFor="country">{t('checkout.fields.country')}</label>
                            <Select onValueChange={setCountry} id="country">
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Countries</SelectLabel>
                                        {
                                            countries.map((country, index) => (
                                                <SelectItem value={country} key={index}>{country}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="orderNotes">{t('checkout.fields.orderNotes')}</label>
                            <Textarea placeholder={t('checkout.fields.orderNotesPlaceholder')} className="rounded-xs w-full md:w-155 h-25" id='orderNotes' />
                        </div>
                    </div>
                    <div className="border border-black p-5 w-full md:w-100 h-fit">
                        {
                            cart.cart.map((item, index) => (
                                <div key={index}>
                                    <div className="flex w-full md:w-90 justify-between mb-5">
                                        <div className="flex gap-2">
                                            <img className="w-20 h-20 object-cover" src={item.product?.images?.[0].url} />
                                            <p className="font-semibold w-24 md:w-35">{item.product.name}</p>
                                        </div>
                                        <p>{item.product.price}$</p>
                                    </div>
                                    <hr className="mb-5" />
                                </div>
                            ))
                        }
                        <div className="flex w-full md:w-90 justify-between pt-4 pb-4">
                            <p className="font-semibold">{t('checkout.subtotal')}</p>
                            <p className="font-light" style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>{subtotal}$</p>
                        </div>
                        <hr />
                        <div className="flex w-full md:w-90 justify-between pt-4 pb-4">
                            <p className="font-semibold">{t('checkout.total')}</p>
                            <p className="text-xl font-bold">{cart.total}$</p>
                        </div>
                        <hr className="mb-5" />
                        <Button className="p-2 w-full md:w-90 rounded-xs font-medium">{t('checkout.placeOrder')}</Button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;