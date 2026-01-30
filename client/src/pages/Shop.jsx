import { useState } from 'react';
import { useWatch } from '../context/WatchContext';
import shopMainImg from '../images/shopMainImg.jpg';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { X } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const Shop = () => {
    const { i18n, t } = useTranslation();
    const { user } = useAuth();
    const { watches, watch, deleteWatch, updateWatch, createWatch, getWatch } = useWatch();
    const [creating, setCreating] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [brandToggle, setBrandToggle] = useState(false);
    const [genderToggle, setGenderToggle] = useState(false);
    const [price, setPrice] = useState([0, 100000]);
    const [page, setPage] = useState(1);
    const [update, setUpdate] = useState(null);
    const [gender, setGender] = useState('');

    const navigate = useNavigate();

    const handleCategory = (value, checked) => {
        setSelectedCategories((prev) => checked ? [...new Set([...prev, value])] : prev.filter((c) => c !== value));
    };

    const handleBrands = (value, checked) => {
        setSelectedBrands((prev) => checked ? [...new Set([...prev, value])] : prev.filter((c) => c !== value));
    };

    const handleGenders = (value, checked) => {
        setSelectedGenders((prev) => checked ? [...new Set([...prev, value])] : prev.filter((g) => g !== value));
    };

    const handleCreate = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append('gender', gender);

        createWatch(formData);

        setCreating(false);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append('gender', gender);

        updateWatch(watch._id, formData);

        setUpdate(null);
    };

    if(!user) return <div className="flex justify-center items-center h-screen">
        <Spinner className="w-10 h-10" />
    </div>;

    const categories = [...new Set(watches.map((w) => w.category))];
    const brands = [...new Set(watches.map((w) => w.brand))];
    const genders = [...new Set(watches.map((w) => w.gender))];
    const filtered = watches.filter((w) => (selectedCategories.length === 0 || selectedCategories.includes(w.category)) && (selectedBrands.length === 0 || selectedBrands.includes(w.brand)) && (selectedGenders.length === 0 || selectedGenders.includes((w.gender))) && (w.price >= price[0] && w.price <= price[1]));
    const editableFields = watch ? Object.keys(watch).filter((key) => !["_id", "__v", "createdAt", "updatedAt", "isAvailable", 'gender'].includes(key)) : [];

    const watchesPerPage = 12;

    const data = filtered;
    
    const start = (page - 1) * watchesPerPage;

    const paginated = data.slice(start, start + watchesPerPage);

    const totalPages = Math.ceil(data.length / watchesPerPage);

    return (
        <>
            <div className='relative'>
                <div className='absolute inset-0 flex items-center justify-center px-10 z-10'>
                    <div className='flex justify-center items-center w-full'>
                        <div className='hidden md:block border-t-3 w-140'></div>
                        <div>
                            <p className={`w-full md:${i18n.language === 'en' ? 'w-150' : 'w-180'} text-4xl md:text-[75px] text-white text-center`} style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>{t('shop.heroTitle')}</p>                        
                        </div>
                        <div className='hidden md:block border-t-3 w-140'></div>
                    </div>
                </div>
                <div>
                    <img src={shopMainImg} className='w-full min-h-75 object-cover' />
                </div>
            </div>

            <div className='w-full flex flex-col md:flex-row p-5 md:p-15'>
                <div className='flex flex-col gap-5 w-full md:w-200 mb-10 md:mb-0'>
                    <div className='flex flex-col'>
                        <div className='w-full md:w-60 flex flex-row justify-between items-center mb-2'>
                            <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light text-xl'>{t('shop.filters.categories')}</p>
                            <X className={`w-4 h-4 cursor-pointer ${ toggle ? 'rotate-90 transition 3s' : 'rotate-135 transition 3s' }`} onClick={() => setToggle(!toggle)} />
                        </div>

                        <div>
                            {
                                toggle && (
                                    categories.map((category, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <Checkbox id={category} onCheckedChange={(checked) => handleCategory(category, checked)} checked={selectedCategories.includes(category)} />
                                            <label htmlFor={category}>{category}</label>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <div className='w-full md:w-60 flex flex-row justify-between items-center mb-2'>
                            <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light text-xl'>{t('shop.filters.brands')}</p>
                            <X className={`w-4 h-4 cursor-pointer ${ brandToggle ? 'rotate-90 transition 3s' : 'rotate-135 transition 3s' }`} onClick={() => setBrandToggle(!brandToggle)} />
                        </div>
                        <div>
                            { 
                                brandToggle && (
                                    brands.map((brand, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <Checkbox id={brand} onCheckedChange={(checked) => handleBrands(brand, checked)} checked={selectedBrands.includes(brand)} />
                                            <label htmlFor={brand}>{brand}</label>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <div className='w-full md:w-60 flex flex-row justify-between items-center mb-2'>
                            <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light text-xl'>Genders</p>
                            <X className={`w-4 h-4 cursor-pointer ${ genderToggle ? 'rotate-90 transition 3s' : 'rotate-135 transition 3s' }`} onClick={() => setGenderToggle(!genderToggle)} />
                        </div>

                        <div>
                            {
                                genderToggle && (
                                    genders.map((gender, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <Checkbox id={gender} onCheckedChange={(checked) => handleGenders(gender, checked)} checked={selectedGenders.includes(gender)} />
                                            <label htmlFor={gender}>{gender}</label>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>

                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light text-xl mb-2'>{t('shop.filters.price')}</p>
                    <Slider min={0} max={100000} step={50} value={price} onValueChange={setPrice} className="w-full md:w-60" />
                    <p>{price[0]}$ - {price[1]}$</p>
                    
                    {
                        creating ? (
                            <>
                                <form onSubmit={handleCreate}>
                                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='font-light text-xl mb-2'>{t('shop.addWatch.title')}</p>
                                    <div className='flex flex-col gap-2 mb-5'>
                                        <input type="text" name="name" placeholder={t('shop.addWatch.fields.name')} className="border p-1 w-full md:w-62" required />
                                        <input type="text" name="category" placeholder={t('shop.addWatch.fields.category')} className="border p-1 w-full md:w-62" required />
                                        <input type="text" name="brand" placeholder={t('shop.addWatch.fields.brand')} className="border p-1 w-full md:w-62" required />
                                        <input type="number" name="price" placeholder={t('shop.addWatch.fields.price')} className="border p-1 w-full md:w-62" required />
                                        <Textarea name="description" placeholder={t('shop.addWatch.fields.description')} className="border p-1 w-full md:w-62 rounded-xs" required />
                                        <input type="file" multiple name="images" className='mb-2' required />

                                        <Select onValueChange={setGender}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Choose a gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Genders</SelectLabel>
                                                    <SelectItem value="men">men</SelectItem>
                                                    <SelectItem value="women">women</SelectItem>
                                                    <SelectItem value="unisex">unisex</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className='flex flex-col gap-2'>
                                        <button className='border p-1 w-full md:w-62'>{t('shop.addWatch.submit')}</button>
                                        <button className='border p-1 w-full md:w-62' onClick={() => setCreating(false)}>{t('shop.addWatch.cancel')}</button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            ((user.role === 'admin') || (user.role === 'moderator')) && (
                                <button onClick={() => setCreating(true)} className='border p-1 w-full md:w-62'>{t('shop.addWatch.button')}</button>
                            )
                        )
                    }
                </div>  

                <div className="flex flex-col gap-5 justify-start items-start w-full">
                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className='text-xl font-light'>{t('shop.watchesCount')} ({paginated.length} - {watches.length})</p>
                    <div className='flex flex-wrap gap-10 w-full md:w-310 items-start'>
                        {
                            paginated.length > 0 ? (
                                <>
                                    {paginated.map((item, index) => (
                                        <div key={index} className={`w-full md:w-70 flex flex-col ${((user.role === 'admin') || (user.role === 'moderator')) ? 'h-140' : 'h-120'}`}>
                                            {
                                                update === item._id ? (
                                                    <form onSubmit={handleSubmit}>
                                                        {editableFields.map((key) => (
                                                            <div key={key} className="flex flex-col gap-2 mb-2">
                                                                <label>{key[0].toUpperCase() + key.slice(1).toLowerCase()}</label>

                                                                <div>
                                                                    {key === "images" ? (
                                                                        <input type="file" name="images" multiple />
                                                                    ) : (
                                                                        key === 'description' ? (
                                                                            <Textarea name='description' className="w-70 h-10 rounded-xs" defaultValue={item[key]} />
                                                                        ) : (
                                                                            <input className="border p-1 w-70" type="text" name={key} defaultValue={item[key]} />
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <Select onValueChange={setGender}>
                                                            <SelectTrigger className="mb-3">
                                                                <SelectValue placeholder="Choose a gender" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Genders</SelectLabel>
                                                                    <SelectItem value="men">men</SelectItem>
                                                                    <SelectItem value="women">women</SelectItem>
                                                                    <SelectItem value="unisex">unisex</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>

                                                        <div className='flex flex-col gap-2'>
                                                            <button className='border p-1'>{t('shop.actions.save')}</button>
                                                            <button onClick={() => setUpdate(null)} className='border p-1'>{t('shop.addWatch.cancel')}</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <div className='flex flex-col h-full'>
                                                        <div className='flex flex-col gap-5' onClick={() => { navigate(`/watches/${item._id}`); getWatch(item._id) }}>
                                                            <div className={`${((user.role === 'admin') || (user.role === 'moderator')) ? 'h-72' : 'h-80'} w-full`}>
                                                                <img className="w-full h-full object-cover" src={item.images[0]?.url} />
                                                            </div>
                                                            <p className="font-bold line-clamp-1">{item.name}</p>
                                                            <p className='line-clamp-2 w-full md:w-70'>{item.description}</p>
                                                            <p className="font-semibold mb-3">{item.price}$</p>
                                                        </div>
                                                        {
                                                            (user.role === 'admin' || user.role === 'moderator') && (
                                                                <div className='flex flex-col gap-2 mt-auto'>
                                                                    <button onClick={() => deleteWatch(item._id)} className='border p-1'>{t('shop.actions.delete')}</button>
                                                                    <button onClick={() => { setUpdate(item._id); getWatch(item._id); }} className='border p-1'>{t('shop.actions.update')}</button>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )}
                                        </div>
                                    ))}

                                    <Pagination className="mt-10">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="cursor-pointer" />
                                            </PaginationItem>

                                            {[...Array(totalPages)].map((_, index) => (
                                                <PaginationItem key={index}>
                                                    <PaginationLink className="cursor-pointer" onClick={() => setPage(index + 1)} isActive={page === index + 1}>{index + 1}</PaginationLink>
                                                </PaginationItem>
                                            ))}

                                            {
                                                totalPages >= 4 && <PaginationEllipsis />
                                            }

                                            <PaginationItem>
                                                <PaginationNext onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="cursor-pointer" />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </>
                            ) : (
                                <p>{t('shop.noWatches')}</p>
                            )
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Shop;