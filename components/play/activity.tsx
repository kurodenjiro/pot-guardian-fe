"use client"
import React, { useState, useEffect, useMemo } from 'react';

import { Table, TableHeader, TableColumn, Link, TableBody, TableRow, TableCell, User, Avatar, CardFooter, Button, Spinner, Pagination } from "@nextui-org/react";
import { readContracts } from '@wagmi/core'
import { nftAbi } from './abi';

export const Activity = () => {
    const [page, setPage] = React.useState(1);
    const [petList, setPetList] = React.useState<any>([])
    const [loadingState, setLoadingState] = React.useState<any>(true)
    const rowsPerPage = 20;
    const pages = useMemo(() => {
        return petList?.length ? Math.ceil(petList.length / rowsPerPage) : 0;
    }, [petList?.length, rowsPerPage]);


    const renderCell = React.useCallback((data: any, columnKey: any) => {
        const cellValue = data[columnKey];
        switch (columnKey) {
            case "pet":
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        {data.pet[0] + "#" + data.id || "Unknow" + "#" + data.id}
                    </div>
                );
            case "action":
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        {data.method}
                    </div>
                );

            case "time":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <p className="text-bold text-sm capitalize">{(new Date(data.time )).toDateString()}</p>
                    </div>
                );

            default:
                return cellValue;
        }
    }, [petList]);


    const getPetList = async () => {
        let response: any = await fetch(`${process.env.HOST}/api/filecoin/nft?page=${page}`)

        response = await response.json()
        console.log(response);
        const nftList: any = [];
        let NftListFilter: any = response?.data;
        for (const nft of NftListFilter) {

            const res: any = await readContracts({
                contracts: [
                    {
                        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                        abi: nftAbi,
                        functionName: 'getPetInfo',
                        args: [BigInt(nft.id)],
                    }
                ],
            })
            const pet = res[0].result;
            
            nftList.push({ pet: pet, id: nft.id, time: nft.dataTime , method:nft.method })
        }
        const sortData = nftList.sort((a: any, b: any) => b.point - a.point)
        const addDataIndex = await sortData.map((obj: any, index: any) => ({
            ...obj,
            index: index + 1,
        }));
        await setPetList(addDataIndex);
        await setLoadingState(false);
    }
    React.useEffect(() => {
        getPetList()
    }, [page])



    return (
        <>
            <div className='pb-3'>
                <Table isStriped
                    topContentPlacement="outside"
                    bottomContent={
                        pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        ) : null}
                    selectionMode="single" aria-label="Example static collection table h-44" classNames={{
                        base: "max-h-[620px] pt-3",
                        table: "min-h-[620px] pt-3",
                    }}>
                    <TableHeader>
                        <TableColumn key="pet" >Pet</TableColumn>
                        <TableColumn key="action" >Action</TableColumn>
                        <TableColumn key="time">Time</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={petList || []}
                        isLoading={loadingState}
                        loadingContent={<Spinner label="Loading..." />}
                    >
                        {(item: any) => (
                            <TableRow key={item?.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}