import { useNavigate } from "react-router";
import { useWatch } from "../context/WatchContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

import { Spinner } from '@/components/ui/spinner';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Watches = () => {
    const { watches, getWatch, createWatch } = useWatch();
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    if(!user) return <div className="flex justify-center items-center h-screen">
        <Spinner className="w-10 h-10" />
    </div>

    const watchesPerPage = 8;

    const data = watches;
    
    const start = (page - 1) * watchesPerPage;

    const paginated = data.slice(start, start + watchesPerPage);

    const totalPages = Math.ceil(data.length / watchesPerPage);

    return (
        <>
            <div className="flex flex-wrap gap-15 justify-center items-center">
                {
                    paginated.map((watch, index) => (
                        <div key={index} className="w-70 flex">
                            <div onClick={() => { navigate(`/watches/${watch._id}`); getWatch(watch._id) }}>
                                <img className="w-70 h-90 object-cover" src={watch.images[0].url} />
                                <p className="font-bold mt-5">{watch.name}</p>
                                <p className='line-clamp-2 w-70'>{watch.description}</p>
                                <p className="font-semibold">{watch.price}$</p>
                            </div>
                        </div>
                    ))
                }

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink onClick={() => setPage(index + 1)} isActive={page === index + 1}>{index + 1}</PaginationLink>
                            </PaginationItem>
                        ))}

                        {
                            totalPages >= 4 && <PaginationEllipsis />
                        }

                        <PaginationItem>
                            <PaginationNext onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === 1} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    )
};

export default Watches;