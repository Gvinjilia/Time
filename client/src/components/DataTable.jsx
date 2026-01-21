import { flexRender, getCoreRowModel, useReactTable, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Input } from '@/components/ui/input';

import { useState } from "react";

const DataTable = ({ columns, data }) => {
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState([]);

    const tableData = useReactTable({
        columns, 
        data,
        state: {
            globalFilter: filter,
            sorting: sort
        },
        onSortingChange: setSort,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    return (
        <>
            <div className="flex flex-col gap-3 w-full max-w-200 px-5 md:px-0">
                <div className="w-full flex flex-col md:flex-row justify-between gap-3">
                    <Input type="text" name="search" placeholder="Search Orders" className="w-full md:w-80 rounded-[5px]" value={filter} onChange={(e) => setFilter(e.target.value)} />
                    <button className="border p-1 w-full md:w-30 rounded-[5px]" onClick={() => setFilter('')}>Clear</button>
                </div>
                <div className="border w-full rounded-[5px] overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {
                                tableData.getHeaderGroups().map((headerGroup, index) => (
                                    <TableRow key={index}>
                                        {
                                            headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    { 
                                                        header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                </TableHead>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            }
                        </TableHeader>
                        <TableBody>
                            {
                                tableData.getRowModel().rows.length > 0 ? (
                                    tableData.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {
                                                row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {
                                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                                        }
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center">
                                            No Results
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center gap-2">
                    <button className="border p-1 w-30 rounded-[5px]" onClick={() => tableData.previousPage()} disabled={!tableData.getCanPreviousPage()}>Previous</button>
                    <p>{tableData.getState().pagination.pageIndex + 1} of {tableData.getPageCount()}</p>
                    <button className="border p-1 w-30 rounded-[5px]" onClick={() => tableData.nextPage()} disabled={!tableData.getCanNextPage()}>Next</button>
                </div>
            </div>
        </>
    );
};

export default DataTable;