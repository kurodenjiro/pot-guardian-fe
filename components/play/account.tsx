"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Divider, Image, Button, Tabs, Tab } from "@nextui-org/react";

import {
    useAccount,
    useBalance,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useContractRead,
    useContractEvent
} from "wagmi";
import { nftAbi, tokenAbi } from './abi';

export const Account = () => {
    const MAX_ALLOWANCE = BigInt('20000000000000000000000')
    const { address } = useAccount();
    const [isApprove, setIsApprove] = React.useState(false)
    const [isBlance, setIsBlance] = React.useState(false)
    const [isEthBlance, setEthBlance] = React.useState(false)
    const { data: allowance, refetch } = useContractRead({
        address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
        abi: tokenAbi,
        functionName: "allowance",
        args: [`0x${address ? address.slice(2) : ''}`, `0x${process.env.NFT_ADDRESS?.slice(2)}`],
    });
    const { data: tokenBlanceData, isError: tokenBlanceError } = useBalance({
        address: address,
        token: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
    });

    const { data: ethBlanceData, isError: ethBlanceError } = useBalance({
        address: address
    });
    useEffect(() => {
        if (allowance) {
            if (allowance >= BigInt(20000)) {
                setIsApprove(true)
            }
        }
    }, [])

    // Mint
    const {
        config,
        error: prepareErrorMint,
        isError: isPrepareErrorMint,
    } = usePrepareContractWrite({
        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
        abi: nftAbi,
        functionName: 'mint',
    })
    const { data: dataMint, error: errorMint, isError: isErrorMint, write: mint } = useContractWrite(config)

    const { isLoading: isLoadingMint, isSuccess: isSuccessMint } = useWaitForTransaction({
        hash: dataMint?.hash,
        onSuccess(data) {
        }
    })
    const { config: configAllowance } = usePrepareContractWrite({
        address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
        abi: tokenAbi,
        functionName: "approve",
        args: [`0x${process.env.NFT_ADDRESS?.slice(2)}`, MAX_ALLOWANCE],
    });

    const {
        data: approveResult,
        writeAsync: approveAsync,
        error: errorAllowance,
    } = useContractWrite(configAllowance);

    const { isLoading: isLoadingApprove } = useWaitForTransaction({
        hash: approveResult?.hash,
        onSuccess(data) {
            setIsApprove(true);
        }
    })
    // track event mint
    useContractEvent({
        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
        abi: nftAbi,
        eventName: 'Transfer',
        listener: (logs : any) => {
            const checkLogs = async () => {
                console.log("Transfer", logs)
                if (logs[0].args.from == "0x0000000000000000000000000000000000000000" && logs[0].args.to == address && logs[0].args.id) {
                    console.log(logs[0].args.id)
                    const res = await fetch(`${process.env.HOST}/api/filecoin/transactions`, {
                        method:"POST",
                        body:JSON.stringify({
                          address: logs[0].args.to,
                          id:parseInt(logs[0].args.id),
                          method:'mint',
                          dataTime:Date.now()
                        })
                      })
                }
            }
            checkLogs();
  
        }
    })
    // Faucet
    const { config: configFaucet } = usePrepareContractWrite({
        address: `0x${process.env.FAUCET_ADDRESS?.slice(2)}`,
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_token",
                        "type": "address"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    }
                ],
                "name": "getJoy",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "token",
                "outputs": [
                    {
                        "internalType": "contract IERC20",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ],
        functionName: "getJoy",
        args: [`0x${address?.slice(2)}`],
    });

    const {
        data: faucetResult,
        writeAsync: setFaucetAsync,
        error: errorFaucet,
    } = useContractWrite(configFaucet);

    const onFaucet = () => {
        setFaucetAsync?.();
    };
    const fetchMyAPI = async () => {
        if (allowance) {
            console.log("allowance", allowance)
            if (allowance >= 10000) {
                setIsApprove(true)
            }
        }
        if (Number(tokenBlanceData?.formatted) > 0) {
            setIsBlance(true)
        }
        if (Number(ethBlanceData?.formatted) > 0.001) {
            setEthBlance(true)
        }
    }
    const { isLoading: isLoadingFaucet } = useWaitForTransaction({
        hash: faucetResult?.hash,
        onSuccess(data) {
            setIsBlance(true)
            fetchMyAPI();
        }
    })

    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options" fullWidth defaultSelectedKey="account">
                <Tab key="faucet" title="Faucet">
                {(!isApprove) ? (
                        <div className="pb-5" style={{ paddingTop: "130%" }} >
                            <button type="button" onClick={approveAsync} className="nes-btn bg-white w-full" >
                                Approval
                            </button>
                        </div>
                    ) : (
                        
                        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
                        <div className="pb-5" >
                            <button type="button" onClick={onFaucet} className="nes-btn bg-white w-full" >
                                Faucet $POT
                            </button>
                        </div>
                    </div>
                        
                    )
                }
                </Tab>
                <Tab key="mint" title="MINT">
                    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
                        <div className="flex justify-center ">
                            <Image
                                className=" object-center"
                                src={`/pot/ui/Plant_Animated3.gif`}
                            />
                        </div>
                        {(!isApprove) ? (
                            <button
                                className="nes-btn w-52"
                                onClick={approveAsync}
                            >
                                Approval
                            </button>

                        ) : (
                            <button
                                className="nes-btn w-52"
                                disabled={!mint} onClick={mint}
                            >
                                Mint Pet
                            </button>
                        )}
                    </div>

                </Tab>
                <Tab key="account" title="ACCOUNT">
                    <Card >
                        <CardBody className="px-3 py-0 text-small text-default-400">
                            <div className="grid grid-cols-6 gap-3 p-4">
                                <div className="col-start-1 col-end-4 font-semibold text-black bottom-0">Wallet Address</div>
                                <div className="col-end-8 col-span-3 font-semibold text-slate-900"></div>
                                <div className="col-start-1 col-end-7 text-slate-900">{address}</div>
                            </div>
                        </CardBody>
                    </Card>
                    <div className="grid grid-cols-2 gap-1 pt-3  pb-3">
                        <Card className="pt-3">
                            <CardBody className="px-3 py-0 text-small text-default-400">
                                <p className="font-semibold text-black">INVITE CODE</p>
                                <p className="font-semibold text-green-500">COMMING SOON</p>
                            </CardBody>
                        </Card>

                        <Card className="pt-3">
                            <CardBody className="px-3 py-0 text-small text-default-400">
                                <p className="font-semibold text-black">REFERRALS</p>
                                <p className="font-semibold text-green-500">COMMING SOON</p>
                            </CardBody>
                        </Card>
                    </div>

                    <Card >
                        <CardBody className="px-3 py-0 text-small text-default-400">
                            <div className="grid grid-cols-6 gap-3 p-4">
                                <div className="col-start-1 col-end-4 font-semibold text-black bottom-0">BALANCE</div>
                                <div className="col-end-8 col-span-3 font-semibold text-slate-900"></div>
                                <div className="col-start-1 col-end-7 text-slate-900">{Number(ethBlanceData?.formatted).toFixed(3)} ETH</div>
                                <div className="col-start-1 col-end-7 text-slate-900">{Number(tokenBlanceData?.formatted)} $POT</div>
                            </div>
                        </CardBody>
                    </Card>

                </Tab>
            </Tabs>
        </div>
    );
}