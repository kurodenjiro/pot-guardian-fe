"use client";

import type { CardProps } from "@nextui-org/react";
import { encodeFunctionData } from 'viem'
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Link,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  CardFooter,
  Select,
  SelectItem
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { daoAbi, nftAbi, tokenAbi } from '../../play/abi';
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
  useBalance,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction
} from "wagmi";
import { readContracts, watchAccount, writeContract, prepareWriteContract } from '@wagmi/core'
export const Create = (props: CardProps) => {
  const { chain } = useNetwork()
  const [isClient, setIsClient] = React.useState(true)
  const [isBlance, setIsBlance] = React.useState(false)
  const [isEthBlance, setEthBlance] = React.useState(false)
  const [isApprove, setIsApprove] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [dataVote, setDataVote] = React.useState("")
  

  const handleChangeTitle = (e:any) => {
    setTitle(e.target.value);
  }
  const handleChangeDescription = (e:any) => {
    setDescription(e.target.value);
  }
  const handleChangeData = (e:any) => {
    setDataVote(e.target.value);
  }
  const MAX_ALLOWANCE = BigInt('20000000000000000000000')
  const { address } = useAccount()

  const { data: allowance, refetch } = useContractRead({
    address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
    abi: tokenAbi,
    functionName: "allowance",
    args: [`0x${address ? address.slice(2) : ''}`, `0x${process.env.DAO_ADDRESS?.slice(2)}`],
  });

  const { config: configAllowance } = usePrepareContractWrite({
    address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
    abi: tokenAbi,
    functionName: "approve",
    args: [`0x${process.env.DAO_ADDRESS?.slice(2)}`, MAX_ALLOWANCE],
  });

  const { data: tokenBlanceData, isError: tokenBlanceError } = useBalance({
    address: address,
    token: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
  });

  const { data: ethBlanceData, isError: ethBlanceError } = useBalance({
    address: address
  });

  const {
    data: approveResult,
    writeAsync: approveAsync,
    error: errorAllowance,
  } = useContractWrite(configAllowance);

  const { isLoading: isLoadingApprove } = useWaitForTransaction({
    hash: approveResult?.hash,
    onSuccess(data) {
      setIsApprove(true)
      fetchMyAPI();
    }
  })

  const fetchMyAPI = async () => {
    if (allowance) {
      console.log("allowance", allowance)
      if (allowance >= 10000) {
        setIsApprove(true)
      }
    }
    if (Number(tokenBlanceData?.formatted) > 0) {
      console.log("balance", tokenBlanceData)
      setIsBlance(true)
    }
    if (Number(ethBlanceData?.formatted) > 0.001) {
      setEthBlance(true)
    }
    if (chain?.id == process.env.CHAIN_ID) {
      setIsClient(true);
    }
  }
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  React.useEffect(() => {
    const species = [
      [
        [{
          image: "https://bafkreigw3j7bn3yhkbqt2ercytjhghzn462n5pxzyig4lptuyv4zv6gn6y.ipfs.nftstorage.link/",
          name: "1",
          attackWinRate: BigInt("20"),
          nextEvolutionLevel: BigInt("1")
        },
        {
          image: "https://bafkreiaqk7mr45wnjwtb4lyv4gpy5rloma3sxq3fq2t6s43tcy3ovnki4m.ipfs.nftstorage.link/",
          name: "2",
          attackWinRate: BigInt("25"),
          nextEvolutionLevel: BigInt("2")
        },
        {
          image: "https://bafkreiav7btv3nuei6znfpttelgln5tdcz7pfllcio333og4qwnbkwltoa.ipfs.nftstorage.link/",
          name: "3",
          attackWinRate: BigInt("35"),
          nextEvolutionLevel: BigInt("3")
        }
        ],
        BigInt("10"),
        true,
        BigInt("0"),
        { skinColor: BigInt("0"), hornStyle: BigInt("0"), wingStyle: BigInt("0") }
      ],
      [
        [{
          image: "https://bafkreigw3j7bn3yhkbqt2ercytjhghzn462n5pxzyig4lptuyv4zv6gn6y.ipfs.nftstorage.link/",
          name: "1",
          attackWinRate: BigInt("20"),
          nextEvolutionLevel: BigInt("1")
        },
        {
          image: "https://bafkreiaqk7mr45wnjwtb4lyv4gpy5rloma3sxq3fq2t6s43tcy3ovnki4m.ipfs.nftstorage.link/",
          name: "2",
          attackWinRate: BigInt("25"),
          nextEvolutionLevel: BigInt("2")
        },
        {
          image: "https://bafkreiav7btv3nuei6znfpttelgln5tdcz7pfllcio333og4qwnbkwltoa.ipfs.nftstorage.link/",
          name: "3",
          attackWinRate: BigInt("35"),
          nextEvolutionLevel: BigInt("3")
        }
        ],
        BigInt("10"),
        true,
        BigInt("0"),
        { skinColor: BigInt("0"), hornStyle: BigInt("0"), wingStyle: BigInt("0") }
      ],
      [
        [{
          image: "https://bafkreigw3j7bn3yhkbqt2ercytjhghzn462n5pxzyig4lptuyv4zv6gn6y.ipfs.nftstorage.link/",
          name: "1",
          attackWinRate: BigInt("20"),
          nextEvolutionLevel: BigInt("1")
        },
        {
          image: "https://bafkreiaqk7mr45wnjwtb4lyv4gpy5rloma3sxq3fq2t6s43tcy3ovnki4m.ipfs.nftstorage.link/",
          name: "2",
          attackWinRate: BigInt("25"),
          nextEvolutionLevel: BigInt("2")
        },
        {
          image: "https://bafkreiav7btv3nuei6znfpttelgln5tdcz7pfllcio333og4qwnbkwltoa.ipfs.nftstorage.link/",
          name: "3",
          attackWinRate: BigInt("35"),
          nextEvolutionLevel: BigInt("3")
        }
        ],
        BigInt("10"),
        true,
        BigInt("0"),
        { skinColor: BigInt("0"), hornStyle: BigInt("0"), wingStyle: BigInt("0") }
      ]
    ];

    setDataVote(JSON.stringify(species, null, "\t"));
    fetchMyAPI();

  }, [allowance, tokenBlanceData])

  const { chains, error: errorSwitchNetwork, isLoading: loadingSwingNetwork, pendingChainId, switchNetwork } =
  useSwitchNetwork({
      onMutate(args) {
          console.log('Mutate', args)
      },
      onSettled(data, error) {
          console.log('Settled', { data, error })
          fetchMyAPI();
      },
      onSuccess(data) {
          console.log('sucess', { data })
          fetchMyAPI();
      }
  })
  const onCreateProposal = async (itemId: any) => {

    const species = JSON.parse(dataVote);
    const data = encodeFunctionData({
      abi: nftAbi,
      functionName: 'createSpeciesBatch',
      args: [
        species.map((s:any) => s[0]) as any,
        species.map((s:any) => s[1]) as any,
        species.map((s:any) => s[2]) as any,
        species.map((s:any) => s[3]) as any,
        species.map((s:any) => s[4]) as any,
      ]
    })
    const config = await prepareWriteContract({
        address: `0x${process.env.DAO_ADDRESS?.slice(2)}`,
        abi: daoAbi,
        functionName: "createProposal",
        args: [`${title}|${description}`, `0x${process.env.NFT_ADDRESS?.slice(2)}`, data, BigInt("10")]
    })
    const tx = await writeContract(config);
    if (tx) {
      setTitle("")
      setDescription("")
        fetchMyAPI();
    }

}

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

  const { isLoading: isLoadingFaucet } = useWaitForTransaction({
    hash: faucetResult?.hash,
    onSuccess(data) {
      setIsBlance(true)
      fetchMyAPI();
    }
  })

  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
              <Card className="max-w-xl p-2" {...props}>
                <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
                  <p className="text-large">Create Proposal</p>
                </CardHeader>
                <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-1">
                  <Input label="Title" labelPlacement="outside" placeholder="Title" value={title} onChange={handleChangeTitle} />
                  <Textarea
                    value={description}
                    label="Description"
                    onChange={handleChangeDescription}
                    placeholder="Enter your description"
                  />
                  <Select
                    label="Vote"
                    
                    defaultSelectedKeys={["pet"]}
                    placeholder="Select type"
                  >
                    {/* <SelectItem key="food" value="food">
                      Create Food
                    </SelectItem> */}
                    <SelectItem key="pet" value="pet">
                      Create Pet
                    </SelectItem>
                  </Select>
                  <Textarea
                    label="Data"
                    value={dataVote}
                    onChange={handleChangeData}
                    placeholder="Enter your Data"
                  />
                </CardBody>

                <CardFooter className="mt-4 justify-end gap-2">

                  {isClient ? (
                    (!isEthBlance) ? (
                        <Button
                          href={process.env.URL_FAUCET as string}
                          as={Link}
                          color="primary"
                          radius="full"
                          showAnchorIcon
                          variant="solid"
                        >
                          Faucet ${process.env.TOKEN as string} Testnet
                        </Button>
                    ) : (
                      (!isApprove) ? (
                          <Button type="button" onClick={approveAsync} color="primary" radius="full">
                            Approval
                          </Button>
                      ) : (
                        (!isBlance) ? (
                            <Button type="button" onClick={onFaucet} color="primary" radius="full">
                              Faucet $JGT Token
                            </Button>
                        ) : (
                            <Button color="primary" onPress={onCreateProposal} radius="full">
                              Create
                            </Button>
                        )
                      )
                    )

                  ) : (
                    <>
                      <Button
                        key={process.env.CHAIN_ID}
                        onClick={() => switchNetwork?.(process.env.CHAIN_ID as unknown as number)}
                        className="nes-btn w-52"
                      >
                        switch to {process.env.CHAIN_NAME} Testnet
                        {loadingSwingNetwork && pendingChainId === process.env.CHAIN_ID && '(switching)'}
                      </Button>
                      <div><span className="text-red-400">{errorSwitchNetwork && errorSwitchNetwork.message}</span></div>
                    </>
                  )

                  }
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
