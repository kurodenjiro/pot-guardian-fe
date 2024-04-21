"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardFooter, Image, Button, Select, SelectItem } from "@nextui-org/react";
import { nftAbi, tokenAbi } from './abi';

import {
    useAccount,
    useContractEvent
} from "wagmi";
import { useDebounce } from './useDebounce';
import { readContracts, watchAccount, writeContract, prepareWriteContract } from '@wagmi/core'
import { decodeAbiParameters } from 'viem'


export const Breed = () => {
    const [isAddress, setIsAddress] = React.useState<any>(false)
    const [petData, setPetData] = React.useState<any>(null)
    const [petDataA, setPetDataA] = React.useState<any>(null)
    const [petDataB, setPetDataB] = React.useState<any>(null)
    const [petImagePetA, setImagePetA] = React.useState<any>(null)
    const [petImagePetB, setImagePetB] = React.useState<any>(null)
    const [petImagePetC, setImagePetC] = React.useState<any>(null)
    const [petAttrPetC, setAttrPetC] = React.useState<any>(null)
    const [selectedPetA, setSelectedPetA] = React.useState<any>(null)
    const [selectedPetB, setSelectedPetB] = React.useState<any>(null)
    const [loadingState, setLoadingState] = React.useState<any>(false)
    const { address, connector, isConnected } = useAccount()
    const [isApprove, setIsApprove] = React.useState(false)
    const [isPet, setIsPet] = React.useState<any>(false)
    useContractEvent({
        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
        abi: nftAbi,
        eventName: 'Transfer',
        listener: (logs) => {
            const checkLogs = async () => {
                console.log("Transfer", logs)
                if (logs[0].args.from == "0x0000000000000000000000000000000000000000" && logs[0].args.to == address && logs[0].args.id) {
                    const InfoIPFS: any = await readContracts({
                        contracts: [
                            {
                                address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                                abi: nftAbi,
                                functionName: 'getPetImage',
                                args: [logs[0].args.id],
                            }
                        ],
                    })
                    const InfoAttr: any = await readContracts({
                        contracts: [
                            {
                                address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                                abi: nftAbi,
                                functionName: 'getPetAttributes',
                                args: [logs[0].args.id],
                            }
                        ],
                    })
                    console.log("InfoAttr", InfoAttr[0].result)
                    setImagePetC(InfoIPFS[0].result)
                    setAttrPetC(InfoAttr[0].result)
                }
            }
            checkLogs();
            // this will run every time a new Transfer event is fired
            // the parameters of that function are the parameters of the
            // event
        }
    })
    const handleChangeSelectPetA = async (event: any) => {
        console.log("event.target.value", event.target.value)
        if (event.target.value) {
            const InfoIPFS: any = await readContracts({
                contracts: [
                    {
                        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                        abi: nftAbi,
                        functionName: 'getPetImage',
                        args: [event.target.value],
                    }
                ],
            })
            setImagePetA(InfoIPFS[0].result)
            console.log("Info", InfoIPFS)
            setSelectedPetA(event.target.value);

        }

    };
    const handleChangeSelectPetB = async (event: any) => {
        if (event.target.value) {
            const InfoIPFS: any = await readContracts({
                contracts: [
                    {
                        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                        abi: nftAbi,
                        functionName: 'getPetImage',
                        args: [event.target.value],
                    }
                ],
            })
            setImagePetB(InfoIPFS[0].result)
            setSelectedPetB(event.target.value);
        }

    };
    const onBreed = async () => {
        const config = await prepareWriteContract({
            address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
            abi: nftAbi,
            functionName: "breed",
            args: [selectedPetA, selectedPetB]
        })
        const tx = await writeContract(config);
        if (tx) {
            console.log("tx", tx);
            // let response : any= await fetch(`${process.env.EXPLORER_URL}/api/v2/transactions/${tx.hash}/logs`)
            // response = await response.json()
            // console.log("logs",response);
            //getNftList();
        }

    }
    const getNftList = async () => {
        let response: any = await fetch(`${process.env.HOST}/api/bnb/nft?page=1&address=${address}`)
        response = await response.json()
        const petArr: any = [];
        const petArrA: any = [];
        const petArrB: any = [];
        console.log("petcheck", response)
        if (response.data) {
            for (const nft of response.data) {
                const Info: any = await readContracts({
                    contracts: [
                        {
                            address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                            abi: nftAbi,
                            functionName: 'getPetInfo',
                            args: [BigInt(nft.id)],
                        }
                    ],
                })
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

                petArr.push({
                    value: BigInt(nft.id),
                    label: Info[0].result[0],
                    sex: InfoAttr[0].result[4],
                    status: Info[0].result[1],
                    evol: InfoEvol[0].result[1]
                })
                if (InfoAttr[0].result[4] == 0 && Info[0].result[1] !== 4 && InfoEvol[0].result[1] == 2) {
                    petArrA.push({
                        value: nft.id,
                        label: Info[0].result[0],
                        sex: InfoAttr[0].result[4],
                        status: Info[0].result[1],
                        evol: InfoEvol[0].result[1]
                    })
                }
                if (InfoAttr[0].result[4] == 1 && Info[0].result[1] !== 4 && InfoEvol[0].result[1] == 2) {
                    petArrB.push({
                        value: nft.id,
                        label: Info[0].result[0],
                        sex: InfoAttr[0].result[4],
                        status: Info[0].result[1],
                        evol: InfoEvol[0].result[1]
                    })
                }

            }
            if (petArrA.length > 0) {
                setSelectedPetA(petArrA[0].value)
                const InfoIPFS: any = await readContracts({
                    contracts: [
                        {
                            address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                            abi: nftAbi,
                            functionName: 'getPetImage',
                            args: [petArrA[0].value],
                        }
                    ],
                })
                setImagePetA(InfoIPFS[0].result)
            }
            if (petArrB.length > 0) {
                setSelectedPetB(petArrB[0].value)
                const InfoIPFS: any = await readContracts({
                    contracts: [
                        {
                            address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                            abi: nftAbi,
                            functionName: 'getPetImage',
                            args: [petArrB[0].value],
                        }
                    ],
                })
                setImagePetB(InfoIPFS[0].result)

            }
            if (petArr.length > 0) {
                setIsPet(true)
            }
            setPetData(petArr)
            setPetDataA(petArrA)
            setPetDataB(petArrB)
            setLoadingState(true)
        }




    }

    React.useEffect(() => {
        if (address) {
            setIsAddress(true)
        }
        else {
            setIsAddress(false);
        };

        getNftList()


    }, [address])
    return (
        <>
            <div className='pt-10'>
                {isAddress && isPet == true && loadingState == true && (
                    <div className="grid grid-cols-6 ">
                        <div className="col-start-1 col-span-6 text-white text-lg">Please Choose Male Pet and Female Pet</div>

                        <div className="col-start-1 col-span-6 text-white text-lg">
                            <Card
                                style={{ backgroundImage: "url(/Assets/Breedmenu_Big.png)" }}

                                radius="lg"
                                className="border-none bg-no-repeat bg-center bg-contain bg-transparent "
                            >
                                <div className="flex justify-center">
                                    <Image
                                        className="border-none bg-no-repeat bg-cover bg-transparent p-10"
                                        height={350}
                                        src={petImagePetC}
                                        width={350}
                                    />
                                    <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-14 w-[calc(70%_-_8px)] shadow-small ml-1 z-10">

                                        <Button className="text-tiny text-black bg-black/20 text-black" variant="flat" color="primary" radius="lg" size="sm">
                                            {petAttrPetC && petAttrPetC[1] == 0 ? "Black" : petAttrPetC && petAttrPetC[1] == 1 ? "Green" : "???"}
                                        </Button>
                                        <Button className="text-tiny text-white bg-black/20 text-black " variant="flat" color="secondary" radius="lg" size="sm">
                                            {petAttrPetC && petAttrPetC[2] == 0 ? "Juvenile" : petAttrPetC && petAttrPetC[2] == 1 ? "Wyrm" : "???"}
                                        </Button>
                                        <Button className="text-tiny text-white bg-black/20 text-black" variant="flat" color="success" radius="lg" size="sm">
                                            {petAttrPetC && petAttrPetC[3] == 0 ? "Normal" : petAttrPetC && petAttrPetC[3] == 1 ? ":Bone" : "???"}
                                        </Button>
                                        <Button className="text-tiny text-white bg-black/20 text-black" variant="flat" color="danger" radius="lg" size="sm">
                                            {petAttrPetC && petAttrPetC[4] == 0 ? "male" : petAttrPetC && petAttrPetC[4] == 1 ? "female" : "???"}
                                        </Button>
                                    </CardFooter>
                                </div>


                            </Card>
                        </div>
                        <div className="col-start-1 col-end-4 text-white">
                            <Card
                                style={{ backgroundImage: "url(/Assets/Breedmenu_small_1.png)" }}
                                isFooterBlurred
                                radius="lg"
                                className="border-none bg-no-repeat bg-center bg-contain bg-transparent"
                            >
                                <Image
                                    height={350}
                                    src={petImagePetA}
                                    width={350}
                                    className="border-none p-10"
                                />
                                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                    <p className="text-tiny text-black">Male</p>
                                    <Select
                                        fullWidth={false}
                                        variant="underlined"
                                        size="sm"
                                        selectedKeys={[selectedPetA]}
                                        onChange={handleChangeSelectPetA}
                                        labelPlacement="outside"
                                    >
                                        {petDataA && petDataA.map((pet: any) => (
                                            <SelectItem key={pet.value} value={pet.value} >
                                                {pet.label + '#' + pet.value}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </CardFooter>
                            </Card>




                        </div>
                        <div className="col-end-7 col-span-3 text-white">

                            <Card
                                style={{ backgroundImage: "url(/Assets/Breedmenu_small_2.png)" }}
                                isFooterBlurred
                                radius="lg"
                                className="border-none bg-no-repeat bg-center bg-contain bg-transparent"
                            >
                                <Image
                                    className="border-none  p-10"
                                    height={350}
                                    src={petImagePetB}
                                    width={350}
                                />
                                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                    <p className="text-tiny text-black">Female</p>
                                    <Select
                                        fullWidth={false}
                                        variant="underlined"
                                        size="sm"
                                        selectedKeys={[selectedPetB]}
                                        onChange={handleChangeSelectPetB}
                                        labelPlacement="outside"
                                    >
                                        {petDataB && petDataB.map((pet: any) => (
                                            <SelectItem key={pet.value} value={pet.value} >
                                                {pet.label + '#' + pet.value}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </CardFooter>
                            </Card>


                        </div>
                        <div className="col-start-1 col-end-7 text-white pt-5"><button type="button" style={{ backgroundImage: "url(/Assets/Breed_Button.png)" }} className="bg-no-repeat bg-center w-full h-16" onClick={onBreed}> </button></div>
                    </div>

                )}
                {isAddress && isPet == false && loadingState == false && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
                        <h1 className="mt-48 text-danger">Loading</h1>
                    </div>
                )}
                {isAddress && isPet == false && loadingState == true && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
                        <h1 className="mt-48 text-danger">You do not have a Pet Evol 3 Pet and are still alive to breed</h1>
                    </div>
                )}
            </div>
        </>
    );
}