"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Divider, Image, Button } from "@nextui-org/react";
import { nftAbi } from './abi';
import { readContracts, watchAccount, writeContract, prepareWriteContract } from '@wagmi/core'

import {
    useAccount,
} from "wagmi";

interface Props {
    petID: number;
}

export const Reward = (props: Props) => {
    const [ownPet, setOwnPet] = useState<any>(null)
    const [ownPetId, setOwnPetId] = useState<any>(null)
    const { address } = useAccount();

    const fetchMyAPI = async () => {

        const pet = props.petID
        let petId: any = null;
        if (pet) {
            petId = BigInt(pet)
            const Info: any = await readContracts({
                contracts: [
                    {
                        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                        abi: nftAbi,
                        functionName: 'getPetInfo',
                        args: [petId],
                    }
                ],
            })
            setOwnPet(Info[0].result)
            setOwnPetId(pet);
        }
    }

    useEffect(() => {
        fetchMyAPI()
    }, [])

    const onRedeem = async () => {
        const config = await prepareWriteContract({
            address: `0x${address?.slice(2)}`,
            abi: nftAbi,
            functionName: "redeem",
            args: [ownPetId]
        })
        const tx = await writeContract(config);
        if (tx) {
            console.log("tx", tx);
            fetchMyAPI()
        }
    }

    return (
        <div className="pt-2">
             <div className="flex justify-center p-4">
             <Image
            width={300}
                alt="joy gotchi"
                src="/gotchi/money.gif"
            />
             </div>

            <div className="flex flex-col pb-3">
                <p className="text-md">PET SCORE : {ownPet && ownPet[2].toString()}</p>
                <h1>RECEIVE: {ownPet && ownPet[8].toString()} {process.env.SYMBOL}</h1>
            </div>
            <div className="flex">

            <Button color="danger" className="w-full" onPress={onRedeem}>
                Burn
            </Button>
            </div>


            <br />

        </div>
    );
}