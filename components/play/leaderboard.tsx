"use client"
import React, { useState, useEffect, useMemo } from 'react';

import { Table, TableHeader, TableColumn, Link, Image ,TableBody, TableRow, TableCell, User, Avatar, CardFooter, Button, Spinner, Pagination } from "@nextui-org/react";
import { readContracts } from '@wagmi/core'
import { nftAbi } from './abi';

export const Leaderboad = () => {
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
            case "index":
                return (
                    <div className="relative flex justify-start items-center gap-2">
                       # {data.index}
                    </div>
                );
            case "pet":
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <User
                            avatarProps={{ radius: "lg", className: "p-1", src: `/pot/pet/Plant-${data.petInfoAttr && data.petInfoAttr[1]}-${data.petInfoEvol && data.petInfoEvol[1]}.svg` }}
                            description={'lv:' + data.pet && data.pet[3]}
                            name={data.pet[0] + "#" + data.id || "Unknow" + "#" + data.id}
                        />
                    </div>
                );
            case "score":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <p className="text-bold text-sm capitalize">{Intl.NumberFormat('en-US', {
                            notation: "compact",
                            maximumFractionDigits: 1
                        }).format(data.pet[2])}</p>
                        <p className="text-bold text-sm capitalize text-default-400">Pts.</p>
                    </div>
                );

            default:
                return cellValue;
        }
    }, [petList]);


    const getPetList = async () => {
        let response: any = await fetch(`${process.env.HOST}/api/filecoin/nft?page=${page}`)
        response = await response.json()
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
            let pet = res[0].result;
            const InfoAttr: any = await readContracts({
                contracts: [
                    {
                        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                        abi: nftAbi,
                        functionName: 'getPetAttributes',
                        args: [BigInt(nft.id)],
                    }
                ],
            })
            let petInfoAttr = InfoAttr[0].result
            const InfoEvol: any = await readContracts({
                contracts: [
                    {
                        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                        abi: nftAbi,
                        functionName: 'getPetEvolutionInfo',
                        args: [BigInt(nft.id)],
                    }
                ],
            })
            let petInfoEvol = InfoEvol[0].result
            nftList.push({ pet: pet, petInfoAttr: petInfoAttr, petInfoEvol: petInfoEvol, id: nft.id, point: parseInt(pet[2]) || 0 })
        }
        const sortData = nftList.sort((a: any, b: any) => b.point - a.point)
        const addDataIndex = await sortData.map((obj: any, index: any) => ({
            ...obj,
            index: index + 1,
        }));
        await setPetList(addDataIndex);
        await setLoadingState(false);
    }
    const loadData = async() => {
        await getPetList()
    }
    React.useEffect(() => {
        loadData()
    }, [page])




    return (
        <>
        {!loadingState ? (
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
                    <TableColumn key="index" >Top</TableColumn>
                    <TableColumn key="pet" >Info</TableColumn>
                    <TableColumn key="score">Score</TableColumn>
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
        ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
            <div className="flex justify-center place-content-center ">
            <Image
                className="mt-48 object-center"
                src={`/pot/ui/Loading_Bar.gif`}
            />
            </div>
        </div>
        )}

        </>
    )
}