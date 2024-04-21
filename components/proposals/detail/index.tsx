"use client";
import type { CardProps } from "@nextui-org/react";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Image,
  Progress,
  Link
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { nftAbi, tokenAbi, daoAbi } from '../../../components/play/abi';
import { readContracts, watchAccount, writeContract, prepareWriteContract } from '@wagmi/core'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
  useBalance,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
  usePublicClient
} from "wagmi";
import { decodeFunctionData } from 'viem'

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const Detail = (props: any) => {
  const [proposal, setProposal] = React.useState({ description: "", total: "" , deadline:"" , dataDecoded :[[[]]]})
  const [totalSuplly, setTotalSuplly] = React.useState(0)
  const [isFollowed, setIsFollowed] = React.useState(false);
  const [id, setId] = React.useState("");
  const [amountToken, setAmountToken] = React.useState("");
  const [isClient, setIsClient] = React.useState(true)
  const [isBlance, setIsBlance] = React.useState(false)
  const [isEthBlance, setEthBlance] = React.useState(false)
  const [isApprove, setIsApprove] = React.useState(false)
  const [block, setBlock] = React.useState()
  const publicClient = usePublicClient()

  React.useEffect(() => {
    publicClient
      .getBlock() // https://viem.sh/docs/actions/public/getBlock.html
      .then((x:any) => {console.log(x.number);setBlock(x.number)})
      .catch((error:any) => console.log(error))
  }, [publicClient])

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


  const handleAmountToken = (e: any) => {
    setAmountToken(e.target.value);
  }

  const onClaim = async (itemId: any) => {
    const config = await prepareWriteContract({
      address: `0x${process.env.DAO_ADDRESS?.slice(2)}`,
      abi: daoAbi,
      functionName: "claim",
      args: [BigInt(id)]
    })
    const tx = await writeContract(config);
    if (tx) {
      fetchMyAPI();
    }

  }
  const onVote = async (itemId: any) => {
    const config = await prepareWriteContract({
      address: `0x${process.env.DAO_ADDRESS?.slice(2)}`,
      abi: daoAbi,
      functionName: "vote",
      args: [BigInt(id), BigInt(amountToken)]
    })
    const tx = await writeContract(config);
    if (tx) {
      fetchMyAPI();
    }

  }
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const fetchMyAPI = async () => {
    const url = `${pathname}?${searchParams}`
    const id = pathname.substring(pathname.lastIndexOf('/') + 1)
    setId(id);
    const proposal: any = await readContracts({
      contracts: [
        {
          address: `0x${process.env.DAO_ADDRESS?.slice(2)}`,
          abi: daoAbi,
          functionName: 'proposalOf',
          args: [BigInt(id)]
        }
      ],
    })
    const { args } = decodeFunctionData({
      abi: nftAbi,
      data: proposal[0].result.data,
    })
    proposal[0].result.dataDecoded = args
    setProposal(proposal[0].result)
    console.log("proposals", proposal)
    const totalSupply: any = await readContracts({
      contracts: [
        {
          address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
          abi: tokenAbi,
          functionName: 'totalSupply',
        }
      ],
    })
    setTotalSuplly((parseInt(totalSupply[0].result) / 1e18) * 0.01)
    console.log("totalSupply", (parseInt(totalSupply[0].result) / 1e18) * 0.01)
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
    console.log("ethbalance", ethBlanceData)
    if (Number(ethBlanceData?.formatted) > 0.001) {
      console.log("balance", tokenBlanceData)
      setEthBlance(true)
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

  React.useEffect(() => {
    fetchMyAPI();
  }, [])

  return (

    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Title</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
              {proposal && proposal.description.split("|")[0]}

            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Description</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
              {proposal && proposal.description.split("|")[1]}

            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Pet</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
            
            {proposal && proposal.dataDecoded[0][0].map((pet: any) => (
                            <Card className="py-4 m-4" >
                              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">Name : {pet.name}</p>
                                <small className="text-default-500">Attack Win Rate :{pet.attackWinRate.toString()}</small>
                                <small className="text-default-500">Next Evolution Level:{pet.nextEvolutionLevel.toString()}</small>
                              </CardHeader>
                              <CardBody className="overflow-visible py-2">
                                <Image
                                  alt="Card background"
                                  className="object-cover rounded-xl"
                                  src={pet.image}
                                  width="200px"
                                />
                              </CardBody>
                            </Card>
                          ))}
            </div>
          </div>

        </div>

        {/* Left Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-xl font-semibold"></h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">Current results</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Progress
                  label="Yes"
                  size="md"
                  value={proposal && parseInt(proposal.total) / totalSuplly}
                  maxValue={100}
                  color="success"
                  showValueLabel={true}
                  className="max-w-md"
                />
              </CardBody>
            </Card>
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">Vote</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Input label="Token Stake" onChange={(e) => handleAmountToken(e)} value={amountToken} placeholder="Enter amount" />
                <br />

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
                        <>
                        {proposal && block && parseInt(block) < parseInt(proposal.deadline) ? (
                          <Button color="primary" onPress={onVote}>
                              Vote
                          </Button>
                        ):(
                          <Button color="primary" onPress={onClaim}>
                          Claim
                        </Button>
                        )}
                        </>

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
              </CardBody>
            </Card>

          </div>
        </div>
      </div>


    </div>
  )
}