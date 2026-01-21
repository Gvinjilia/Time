import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWatch } from "../context/WatchContext";
import { useReview } from "../context/ReviewContext";
import { useCart } from "../context/CartContext";
import { useNavigate, useParams } from "react-router";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from '@/components/ui/spinner';
import { Toggle } from '@/components/ui/toggle'
import { Heart } from "lucide-react";
import { Play } from "lucide-react";

import watchImg from '../images/watch.png';
import watchPage from '../images/watch_page.png';
import nixonUnit from '../images/nixon unit.jpg';
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const Watch = () => {
    const { i18n, t } = useTranslation();
    const { watch, watches, getWatch } = useWatch();
    const { addItemToCart } = useCart();
    const { createReview, deleteReview, updateReview, reviews } = useReview();
    const { user } = useAuth();
    const { id } = useParams();

    const navigate = useNavigate();

    const [updatingReview, setUpdatingReview] = useState(null);
    const [addReview, setAddReview] = useState(false);
    const [selected, setSelected] = useState('');
    const [page, setPage] = useState(1);
    const [reviewPage, setReviewPage] = useState(false); 
    const [rating, setRating] = useState(0);

    const handleUpdate = (e, reviewId) => {
        e.preventDefault();

        const data = {
            rating,
            comment: e.target.comment.value
        };

        updateReview(reviewId, data);

        e.target.reset();
        setRating(0);
        setUpdatingReview(false);
    };

    const handleAddReview = (e) => {
        e.preventDefault();

        const reviewData = {
            rating,
            comment: e.target.comment.value
        };

        createReview(reviewData);
    };

    useEffect(() => {
        if(watch?.images?.[0].url){
            setSelected(watch.images[0].url);
        };
    }, [watch]);

    useEffect(() => {
        if(id){
            getWatch(id);
        };
    }, [id]);

    if(!user) return <div className="flex justify-center items-center h-screen">
        <Spinner className="w-10 h-10" />
    </div>

    const watchesPerPage = 10;

    const data = watches.filter((w) => w.category === (watches.find((item) => item._id === id).category) && w._id !== id);
    
    const start = (page - 1) * watchesPerPage;

    const paginated = data.slice(start, start + watchesPerPage);

    const totalPages = Math.ceil(data.length / watchesPerPage);

    return (
        <>
            {
                watch ? (
                    <>
                        <div>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-30 p-5 md:p-10">
                                <div className="flex lg:flex-row md:flex-col sm:flex-col flex-col justify-center items-start gap-5 md:gap-10">
                                    <div className="flex flex-row md:flex-col gap-5 md:gap-10">
                                        {
                                            watch.images.map((img) => (
                                                <div key={img.url} className="border w-14 h-15 md:w-25 md:h-25 flex items-center justify-center overflow-hidden">
                                                    <img className="w-full h-full object-cover cursor-pointer" onClick={() => setSelected(img.url)} src={img.url} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="w-70 h-90 md:w-100 md:h-130 flex items-center justify-center border overflow-hidden">
                                        <img src={selected || watch.images[0].url} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5 md:gap-10 w-full md:w-100">
                                    <p style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className="text-2xl md:text-3xl font-semibold">{watch.name}</p>
                                    <p className="font-semibold">{watch.price}$</p>
                                    <p className="w-full md:w-100">{watch.description}</p>

                                    { 
                                        (user.role === 'user') && (
                                            <div className="flex gap-5 items-center justify-center">
                                                <button onClick={() => addItemToCart(watch._id)} className="bg-black text-white p-2 w-full md:w-85">{t('watch.addToCart')}</button>
                                                <Toggle className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-black data-[state=on]:*:[svg]:stroke-black">
                                                    <Heart />
                                                </Toggle>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="mb-15">
                                <div className="flex justify-center items-center gap-5 md:gap-10 mb-5">
                                    <p onClick={() => setReviewPage(false)} style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className="text-lg md:text-xl font-extralight cursor-pointer">{t('watch.tabs.about')}</p>
                                    <p onClick={() => setReviewPage(true)} style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }} className="text-lg md:text-xl font-extralight cursor-pointer">{t('watch.tabs.reviews')} ({reviews.length})</p>
                                </div>
                                <div className="flex justify-center items-center">
                                    <hr className="mb-5 w-full max-w-270" />
                                </div>

                                {
                                    reviewPage === false ? (
                                        <div className="flex justify-center items-center px-5">
                                            <Accordion type="single" className="w-full max-w-270" collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>{t('watch.accordion.unique.title')}</AccordionTrigger>
                                                    <AccordionContent>{t('watch.accordion.unique.content')}</AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-2">
                                                    <AccordionTrigger>{t('watch.accordion.daily.title')}</AccordionTrigger>
                                                    <AccordionContent>{t('watch.accordion.daily.content')}</AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-3">
                                                    <AccordionTrigger>{t('watch.accordion.versatile.title')}</AccordionTrigger>
                                                    <AccordionContent>{t('watch.accordion.versatile.content')}</AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-center items-center px-5">
                                                <div className="w-full max-w-270 flex flex-col">
                                                    <p className="text-2xl mb-5">{t('watch.reviews.title')}</p>

                                                    {
                                                        reviews.length > 0 ? (
                                                            reviews.map((review) => (
                                                                <div key={review._id} className="border p-5 mb-10">
                                                                    <div className="flex gap-5">
                                                                        <img className="w-13 h-13 rounded-full" src="https://www.scgajunior.org/wp-content/uploads/2021/03/blank-img.png" />
                                                                        <div className="min-w-0">
                                                                            {Array.from({ length: 5 }).map((_, index) => (
                                                                                <span className="pr-1" style={{ color: index < review.rating ? 'gold' : 'lightgray' }} key={index}>★</span>
                                                                            ))}
                                                                            <p className="w-full wrap-break-word">{review.comment}</p>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        (user.role === 'admin') || (user.role === 'moderator') ? (
                                                                            <button onClick={() => deleteReview(watch._id, review._id)} className="border border-black w-40 p-2 mt-5">{t('watch.reviews.deleteReview')}</button>
                                                                        ) : (
                                                                            updatingReview === review._id ? (
                                                                                <form onSubmit={(e) => handleUpdate(e, review._id)} className="flex flex-col gap-5 mt-5">
                                                                                    <div className="flex gap-3">
                                                                                        {[...Array.from({ length: 5 })].map((_, index) => {
                                                                                            const star = index + 1;

                                                                                            return (
                                                                                                <span style={{ fontSize: 20, color: star <= rating ? "gold" : "lightgray", cursor: 'pointer' }} key={index} onClick={() => setRating(rating === star ? 0 : star)}>★</span>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                    <Textarea name="comment" placeholder={t('watch.reviews.fields.comment')} className="rounded-none h-50" />

                                                                                    <div className="flex gap-2 mb-5">
                                                                                        <button className="border border-black w-40 p-2">{t('watch.reviews.submit')}</button>
                                                                                        <button type="button" className="border border-black w-40 p-2" onClick={() => setUpdatingReview(null)}>{t('watch.reviews.cancel')}</button>
                                                                                    </div>
                                                                                </form>
                                                                            ) : (
                                                                                review.userId === user._id && (
                                                                                    <button onClick={() => setUpdatingReview(review._id)} className="border border-black w-55 p-2 mt-5">{t('watch.reviews.updateReview')}</button>
                                                                                )
                                                                            )
                                                                        )
                                                                    }
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="mb-5">{t('watch.reviews.noReviews')}</p>
                                                        )
                                                    }

                                                    <>
                                                        {
                                                            addReview ? (
                                                                <form onSubmit={handleAddReview} className="flex flex-col gap-5">
                                                                    <div className="flex gap-3">
                                                                        {[...Array.from({ length: 5 })].map((_, index) => {
                                                                            const star = index + 1;

                                                                            return (
                                                                                <span style={{ fontSize: 20, color: star <= rating ? "gold" : "lightgray", cursor: 'pointer' }} key={index} onClick={() => setRating(rating === star ? 0 : star)}>★</span>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    <Textarea name="comment" placeholder="Enter Comment on this watch" className="rounded-none h-50" />

                                                                    <div className="flex flex-col md:flex-row gap-5">
                                                                        <input type="text" name="name" className="border p-2 w-full md:w-135" placeholder={t('watch.reviews.fields.name')} required />
                                                                        <input type="email" name="email" className="border p-2 w-full md:w-135" placeholder={t('watch.reviews.fields.email')} required />
                                                                    </div>
                                                                                                            
                                                                    <div className="flex gap-2">
                                                                        <button className="border border-black w-40 p-2">{t('watch.reviews.submit')}</button>
                                                                        <button type="button" className="border border-black w-40 p-2" onClick={() => setAddReview(false)}>{t('watch.reviews.cancel')}</button>
                                                                    </div>
                                                                </form>
                                                            ) : (
                                                                <button className="border border-black w-55 p-2" onClick={() => setAddReview(true)}>{t('watch.reviews.addReview')}</button>
                                                            )
                                                        }
                                                    </>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            </div>

                            <div className="w-full h-100 md:h-200 overflow-hidden relative">
                                <img src={watchImg} className="w-full md:h-full sm:h-full h-full object-cover" />

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-3 flex gap-5 p-2 justify-center items-center w-40 cursor-pointer">
                                    <div className="border-r-3 h-5">
                                        <Play color="white" fill="white" className="mr-3" width={17} height={17} />
                                    </div>
                                    <button className="text-white">{t('watch.video.play')}</button>
                                </div>
                            </div>

                            <div className="flex flex-col relative">
                                <div className="static md:absolute left-10 md:left-30 pt-10 md:pt-15 px-5 md:px-0 z-10">
                                    <p className="text-gray-500 font-bold mb-3">{t('watch.story.label')}</p>
                                    <h1 className="w-full md:w-90 text-4xl md:text-5xl font-bold mb-7">{t('watch.story.title')}</h1>

                                    <p className="w-full md:w-75 text-[14px] font-semibold mb-3">{t('watch.story.description')}</p>
                                    <hr className="mb-5" />
                                    <div>
                                        <p className="text-gray-500 font-bold mb-2">{t('watch.story.featuresTitle')}</p>

                                        <h2 className="text-[18px] font-bold">{t('watch.story.feature1.title')}</h2>
                                        <p className="text-gray-500 font-normal mb-5">{t('watch.story.feature1.description')}</p>
                                    </div>
                                    <hr className="w-10 mb-3" />
                                    <div>
                                        <h2 className="text-[18px] font-bold">{t('watch.story.feature2.title')}</h2>
                                        <p className="text-gray-500 font-normal mb-5">{t('watch.story.feature2.description')}</p>
                                    </div>
                                    <hr className="w-10 mb-3" />
                                    <div>
                                        <h2 className="text-[18px] font-bold">{t('watch.story.feature3.title')}</h2>
                                        <p className="text-gray-500 font-normal mb-5">{t('watch.story.feature3.description')}</p>
                                    </div>
                                    <hr className="mb-3" />
                                    <div className="flex flex-col gap-3 w-full md:w-90 font-bold mb-3">
                                        <p>{t('watch.story.sections.care')}</p>
                                        <p>{t('watch.story.sections.battery')}</p>
                                        <p>{t('watch.story.sections.waterResistance')}</p>
                                        <p>{t('watch.story.sections.usage')}</p>
                                    </div>
                                    <hr className="mb-3" />
                                    <p className="w-full md:w-90 text-gray-600 text-[14px] mb-10 md:mb-0">{t('watch.story.warranty')}</p>
                                </div>
                                <img src={watchPage} className="w-full h-auto md:h-330 object-cover" />
                            </div>
                            <div className="relative">
                                <div className="flex flex-col gap-5 absolute z-1 left-5 md:left-20 top-7 px-5 md:px-0">
                                    <p className="text-gray-500 font-bold">{t('watch.family.label')}</p>
                                    <p className="text-white text-3xl md:text-5xl font-bold">{t('watch.family.title')}</p>

                                    <p className="w-full md:max-w-130 text-white font-light text-sm md:text-base">{t('watch.family.description')}</p>

                                    <button className="border-3 w-40 md:w-50 p-1.5 text-white font-semibold text-[13px]">{t('watch.family.button')}</button>
                                </div>
                                <div>
                                    <img src={nixonUnit} className="w-full h-100 md:h-auto object-cover" />
                                </div>
                            </div>
                            <div className="p-5 md:p-10">
                                <p className="font-extralight text-3xl mb-3" style={{ fontFamily: 'var(--font-family, "Noto Serif Georgian", serif)' }}>{t('watch.relatedProducts')}</p>

                                {
                                    paginated.length > 0 ? (
                                        <>
                                            <div className="flex flex-wrap mb-10">
                                                {
                                                    paginated.map((watch, index) => (
                                                        <div key={index} onClick={() => { navigate(`/watches/${watch._id}`); getWatch(watch._id) }} className="flex flex-col gap-3 border w-full md:w-80 pl-5 p-3 cursor-pointer">
                                                            <div className="w-full h-80 md:h-90 flex items-center justify-center overflow-hidden">
                                                                <img className="w-full h-full object-cover" src={watch.images[0].url} />
                                                            </div>
                                                            <p className="font-bold">{watch.name}</p>
                                                            <p className='line-clamp-2 w-full md:w-70'>{watch.description}</p>
                                                            <p className="font-semibold">{watch.price}$</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious className="cursor-pointer" onClick={() => setPage((p) => Math.max(p - 1, 1))} />
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
                                                        <PaginationNext className="cursor-pointer" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        </>
                                    ) : (
                                        <p>{t('watch.noRelated')}</p>
                                    )
                                }
                            </div>
                            <Footer />
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-screen">
                        <Spinner className="w-10 h-10" />
                    </div>
                )
            }
        </>
    );
};

export default Watch;