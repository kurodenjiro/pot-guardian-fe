"use client"
import React from "react";
import { Progress } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem, Tooltip, Button } from "@nextui-org/react";
import { Card, CardBody, CardFooter, Tabs, Tab } from "@nextui-org/react";
import { button as buttonStyles } from "@nextui-org/theme";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Image } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox } from "@nextui-org/react";
import { useDebounce } from './useDebounce'
import { nftAbi, tokenAbi } from './abi';
import { Battle } from "./battle";
import { Reward } from "./reward";
import {
    usePrepareContractWrite,
    useContractWrite,
    useContractRead,
    useWaitForTransaction,
    useAccount,
    useContractEvent
} from "wagmi";
import { readContracts, watchAccount, writeContract, prepareWriteContract } from '@wagmi/core'
import CountDownTimer from "./CountDownTimer";
import Slider from "react-slick";

const MAX_ALLOWANCE = BigInt('20000000000000000000000')



export const Pet = () => {
    const [petData, setPetData] = React.useState<any>(null)
    const [isPet, setIsPet] = React.useState<any>(true)
    const [itemData, setItemData] = React.useState<any>(null)
    const [selectedPet, setSelectedPet] = React.useState<any>(null)
    const [ownPet, setOwnPet] = React.useState<any>(null)
    const [ownPetAttr, setOwnPetAttr] = React.useState<any>(null)
    const [ownPetEvol, setOwnPetEvol] = React.useState<any>(null)
    const [selectedItem, setSelectedItem] = React.useState<any>(null)
    const [isApprove, setIsApprove] = React.useState(false)
    const [petName, setPetName] = React.useState<any>(null)
    const [countDownseconds, setCountDownseconds] = React.useState(0);
    const [loadPet, setLoadPet] = React.useState<any>(false)
    const { address } = useAccount()

    const SamplePrevArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", backgroundImage: "url(/gotchi/Assets/Buy_Arrow_Left.png)", width: "35px", height: "60px", backgroundRepeat: "no-repeat", left: "50px", zIndex: "2" }}
                onClick={onClick}
            />
        );
    }
    const SampleNextArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", backgroundImage: "url(/gotchi/Assets/Buy_Arrow_Right.png)", width: "35px", height: "60px", backgroundRepeat: "no-repeat", right: "50px" }}
                onClick={onClick}
            />
        );
    }
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        beforeChange: (current: any, next: any) => {
            //  console.log(current);
        },
        afterChange: async (current: any) => {

            if (petData) {

                await loadSelectedPet(petData[current].value)
            }

        }
    };

    const loadSelectedPet = async (petId: any) => {
        await setSelectedPet(petId)
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

        const InfoAttr: any = await readContracts({
            contracts: [
                {
                    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                    abi: nftAbi,
                    functionName: 'getPetAttributes',
                    args: [petId],
                }
            ],
        })
        setOwnPetAttr(InfoAttr[0].result)
        const InfoEvol: any = await readContracts({
            contracts: [
                {
                    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                    abi: nftAbi,
                    functionName: 'getPetEvolutionInfo',
                    args: [petId],
                }
            ],
        })
        setOwnPetEvol(InfoEvol[0].result)
        const seconds = parseInt(Info[0].result[4]) * 1000;
        setCountDownseconds(seconds)
        setOwnPet(Info[0].result)
    }
    const getNftList = async () => {
        let response: any = await fetch(`${process.env.HOST}/api/filecoin/transactions?address=${address}`)
        response = await response.json()
        const nftList: any = [];
        if (response?.data) {
            for (const nft of response?.data) {
                console.log("nft_id", nft.id)
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

                nftList.push({
                    value: nft.id,
                    label: Info[0].result[0],
                    attr: InfoAttr[0].result,
                    evol: InfoEvol[0].result
                })
            }
        }

        if (nftList[0]) {
            loadSelectedPet(nftList[0].value)
        }
        setPetData(nftList)
        if (nftList.length > 0) {
            setIsPet(true)
        }
        if (nftList.length == 0) {
            setIsPet(false)
        }
        let items: any = [1, 2, 3, 4, 0];
        let itemArr: any = [];
        for (const element of items) {
            const Info: any = await readContracts({
                contracts: [
                    {
                        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
                        abi: nftAbi,
                        functionName: 'getItemInfo',
                        args: [element],
                    }
                ],
            })

            itemArr.push({
                id: element,
                name: Info[0].result[0],
                price: Info[0].result[1],
                points: Info[0].result[2],
                timeExtension: Info[0].result[3],
            })
        }

        setItemData(itemArr);
    }
    const { isOpen: isOpenPetName, onOpen: onOpenPetName, onOpenChange: onOpenChangePetName, onClose: onCloseChangePetName } = useDisclosure();
    const { isOpen: isOpenBattle, onOpen: onOpenBattle, onOpenChange: onOpenChangeBattle, onClose: onCloseChangeBattle } = useDisclosure();
    const { isOpen: isOpenBurnScore, onOpen: onOpenBurnScore, onOpenChange: onOpenChangeBurnScore, onClose: onCloseChangBurnScore } = useDisclosure();
    const debouncedPetName = useDebounce(petName, 500)
    const debouncedSelectedPet = useDebounce(selectedPet, 500)

    const { config: configPetName } = usePrepareContractWrite({
        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
        abi: nftAbi,
        functionName: "setPetName",
        args: [debouncedSelectedPet, debouncedPetName],
        onSettled: (e) => {

        },
    });

    const {
        data: petNameResult,
        writeAsync: setPetNameAsync,
        error: errorPetName,
    } = useContractWrite(configPetName);

    const { isLoading: isLoadingPetNameResult } = useWaitForTransaction({
        hash: petNameResult?.hash,
        onSuccess(data) {
            getNftList()
        },
    })

    const handleChangePetName = (event: any) => {
        setPetName(event.target.value);
    };

    const onChangePetName = () => {
        setPetNameAsync?.();
        onCloseChangePetName()
    }
    const onBuyAccessory = async (itemId: any) => {
        setSelectedItem(itemId);
        const config = await prepareWriteContract({
            address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
            abi: nftAbi,
            functionName: "buyItem",
            args: [selectedPet, itemId]
        })
        const tx = await writeContract(config);
        if (tx) {
            getNftList();
        }

    }

    const {
        config: configEvoleData,
        error: prepareErrorEvol,
        isError: isPrepareErrorEvol,
    } = usePrepareContractWrite({
        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
        abi: nftAbi,
        args: [debouncedSelectedPet],
        functionName: 'evolve',
    })
    const { data: dataEvole, error: errorEvol, isError: isErrorEvol, write: asyncEvol } = useContractWrite(configEvoleData)

    const { isLoading: isLoadingEvol, isSuccess: isSuccessEvol } = useWaitForTransaction({
        hash: dataEvole?.hash,
        onSuccess(data) {
            getNftList()
        }
    })

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
        onSuccess(data: any) {
            console.log(data)


            getNftList()
        }
    })


    useContractEvent({
        address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
        abi: nftAbi,
        eventName: 'Transfer',
        listener: (logs: any) => {
            const checkLogs = async () => {
                console.log("Transfer", logs)
                if (logs[0].args.from == "0x0000000000000000000000000000000000000000" && logs[0].args.to == address && logs[0].args.id) {
                    console.log(logs[0].args.id)
                    const res = await fetch(`${process.env.HOST}/api/filecoin/transactions`, {
                        method: "POST",
                        body: JSON.stringify({
                            address: logs[0].args.to,
                            id: parseInt(logs[0].args.id),
                            method: 'mint',
                            dataTime: Date.now()
                        })
                    })
                }
            }
            checkLogs();

        }
    })

    const { data: allowance, refetch } = useContractRead({
        address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
        abi: tokenAbi,
        functionName: "allowance",
        args: [`0x${address ? address.slice(2) : ''}`, `0x${process.env.NFT_ADDRESS?.slice(2)}`],
    });

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
    const loadData = async() => {
        await setLoadPet(true)
        await getNftList()
        await setLoadPet(false)
    }
    React.useEffect(() => {
        if (allowance) {
            if (allowance >= BigInt(20000)) {
                setIsApprove(true)
                loadData()
            }
        }

    }, [address])
    return (
        isPet && loadPet == false && (
            <>
                <div className="grid grid-cols-6 gap-3 pt-5">
                    <div className="col-start-1 col-end-3 ">
                        <div className="col-end-7 col-span-3">
                            <div className="grid grid-cols-3">
                                <div className="col-span-1 justify-self-end">
                                    <Modal
                                        isOpen={isOpenPetName}
                                        onOpenChange={onOpenChangePetName}
                                        placement="top-center"
                                    >
                                        <ModalContent>
                                            {(onCloseChangePetName) => (
                                                <>
                                                    <ModalHeader className="flex flex-col gap-1">Change Pot Name</ModalHeader>
                                                    <ModalBody>
                                                        <Input
                                                            autoFocus
                                                            label="Name"
                                                            onChange={handleChangePetName}
                                                            placeholder="Enter your Pot name"
                                                            variant="bordered"
                                                        />
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="danger" variant="flat" onPress={onCloseChangePetName}>
                                                            Close
                                                        </Button>
                                                        <Button color="primary" onPress={onChangePetName}>
                                                            Change
                                                        </Button>
                                                    </ModalFooter>
                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal>

                                    <Modal
                                        isOpen={isOpenBattle}
                                        onOpenChange={onOpenChangeBattle}
                                        placement="top-center"
                                    >
                                        <ModalContent>
                                            {(onCloseChangeBattle) => (
                                                <>
                                                    <ModalHeader className="flex flex-col gap-1">Battle</ModalHeader>
                                                    <ModalBody>
                                                        <Battle petID={selectedPet} />
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="danger" variant="flat" onPress={onCloseChangeBattle}>
                                                            Close
                                                        </Button>
                                                    </ModalFooter>
                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal>

                                    <Modal
                                        isOpen={isOpenBurnScore}
                                        onOpenChange={onOpenChangeBurnScore}
                                        placement="top-center"
                                    >
                                        <ModalContent>
                                            {(onCloseChangBurnScore) => (
                                                <>
                                                    <ModalHeader className="flex flex-col gap-1">Reward</ModalHeader>
                                                    <ModalBody>
                                                        <Reward petID={selectedPet} />
                                                    </ModalBody>

                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal>
                                    <div className="pb-1">
                                        <Button onPress={onOpenBattle} className="text-white p-1" isIconOnly color="default" variant="ghost" size="sm" aria-label="Battle">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <g>
                                                    <path fill="none" d="M0 0h24v24H0z" />
                                                    <path fill-rule="nonzero" d="M17.457 3L21 3.003l.002 3.523-5.467 5.466 2.828 2.829 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415-2.829-2.828-2.828 2.828 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.829-2.83-2.475-2.474 1.414-1.414 1.414 1.413 2.827-2.828-5.46-5.46L3 3l3.546.003 5.453 5.454L17.457 3zm-7.58 10.406L7.05 16.234l.708.707 2.827-2.828-.707-.707zm9.124-8.405h-.717l-4.87 4.869.706.707 4.881-4.879v-.697zm-14 0v.7l11.241 11.241.707-.707L5.716 5.002l-.715-.001z" />
                                                </g>
                                            </svg>
                                        </Button>
                                    </div>
                                    <div className="pb-1">
                                        <Button onPress={onOpenPetName} className="text-white" isIconOnly color="default" variant="ghost" size="sm" aria-label="Change name">
                                            <svg enable-background="new 0 0 160 80" id="Layer_1" version="1.1" viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg" ><g><rect height="7" width="7" x="97" y="6" /><rect height="7" width="6" x="91" y="6" /><rect height="7" width="7" x="84" y="6" /><rect height="7" width="7" x="77" y="6" /><rect height="7" width="7" x="70" y="6" /><rect height="7" width="6" x="64" y="6" /><rect height="7" width="7" x="57" y="6" /><rect height="7" width="7" x="50" y="6" /><rect height="7" width="6" x="44" y="6" /><rect height="6" width="7" x="37" y="13" /><rect height="7" width="7" x="97" y="19" /><rect height="7" width="6" x="91" y="19" /><rect height="7" width="7" x="84" y="19" /><rect height="7" width="7" x="77" y="19" /><rect height="7" width="7" x="37" y="19" /><rect height="7" width="7" x="37" y="26" /><rect height="6" width="7" x="37" y="33" /><rect height="6" width="7" x="70" y="33" /><rect height="6" width="6" x="64" y="33" /><rect height="6" width="7" x="57" y="33" /><rect height="6" width="7" x="50" y="33" /><rect height="7" width="7" x="37" y="39" /><rect height="7" width="7" x="37" y="46" /><rect height="7" width="7" x="104" y="6" /><rect height="6" width="6" x="111" y="13" /><rect height="7" width="6" x="111" y="19" /><rect height="7" width="6" x="64" y="19" /><rect height="7" width="7" x="57" y="19" /><rect height="7" width="7" x="50" y="19" /><rect height="7" width="7" x="70" y="19" /><rect height="7" width="6" x="111" y="26" /><rect height="6" width="6" x="111" y="33" /><rect height="7" width="6" x="111" y="39" /><rect height="7" width="6" x="111" y="46" /><rect height="7" width="6" x="111" y="53" /><rect height="7" width="7" x="84" y="46" /><rect height="7" width="7" x="77" y="46" /><rect height="7" width="7" x="70" y="46" /><rect height="7" width="6" x="64" y="46" /><rect height="7" width="7" x="57" y="46" /><rect height="7" width="7" x="50" y="46" /><rect height="7" width="7" x="37" y="53" /><rect height="6" width="7" x="97" y="60" /><rect height="6" width="6" x="91" y="60" /><rect height="6" width="7" x="104" y="60" /><rect height="6" width="7" x="84" y="60" /><rect height="6" width="7" x="77" y="60" /><rect height="6" width="7" x="70" y="60" /><rect height="6" width="6" x="64" y="60" /><rect height="6" width="7" x="57" y="60" /><rect height="6" width="7" x="50" y="60" /><rect height="6" width="6" x="44" y="60" /></g></svg>
                                        </Button>
                                    </div>
                                    <div className="pb-1">
                                        <Button onPress={onOpenBurnScore} className="text-white p-2" isIconOnly color="default" variant="ghost" size="sm" aria-label="Battle">
                                            <Image
                                                radius={"none"}
                                                width={40}
                                                src="/gotchi/Icon/skull2.png"
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-end-7 col-span-3 ">
                        <section className="message -left" >
                            <div className="nes-balloon from-left" style={{ padding: '2px' }}>
                                <p>{ownPet && ownPet[1] == 4 ? "Buy Fertilizer" : <CountDownTimer targetDate={countDownseconds} />}</p>
                            </div>
                        </section>
                    </div>

                    <div className="col-start-1 col-end-7 ">
                        <Slider  {...settings}>
                            {petData && petData.map((pet: any) => (
                                <div className="col-start-1 col-end-7 " key={pet.id}>
                                    <div className="flex justify-center ">
                                        <Image
                                            className=" object-center"
                                            src={`/pot/pet/Plant-${pet.attr && pet.attr[1]}-${pet.evol && pet.evol[1]}.svg`}
                                        />
                                    </div>

                                    <div className="flex justify-center pt-4">

                                        <p className="font-semibold  leading-none text-default-600 text-center">{pet && pet.label} #{pet && pet.value}</p>

                                    </div>
                                    <div className="flex justify-center">
                                        {ownPetEvol && ownPetEvol[1] == 0 && ownPet[3] > 1 && ownPet[1] !== 4 && (
                                            <Button color="warning" variant="solid" size="sm" onClick={asyncEvol}>
                                                Evol Now !
                                            </Button>
                                        )}
                                        {ownPetEvol && ownPetEvol[1] == 1 && ownPet[3] > 2 && ownPet[1] !== 4 && (
                                            <Button color="warning" variant="solid" size="sm" onClick={asyncEvol}>
                                                Evol Now !
                                            </Button>
                                        )}
                                    </div>
                                </div>

                            ))}

                        </Slider>
                    </div>

                    <div className="col-start-1 col-end-8 ">
                        <Card className="   ">
                            <CardBody >
                                <div className="grid grid-cols-4 gap-4  ">
                                    <div className="items-center justify-center ">
                                        <h4 className="text-small font-semibold  leading-none text-default-600 text-center">{ownPet ? ownPet[8].toString() : ''} ETH</h4>
                                        <h5 className="text-small tracking-tight text-default-400 text-center">REWARD</h5>
                                    </div>
                                    <div className="items-center justify-center ">
                                        <h4 className="text-small font-semibold leading-none text-default-600 text-center">{ownPet && ownPet[3].toString()} </h4>
                                        <h5 className="text-small tracking-tight text-default-400 text-center">LEVEL</h5>
                                    </div>
                                    <div className="items-center justify-center ">
                                        <h4 className="text-small font-semibold leading-none text-default-600 text-center">{ownPet ? ownPet[1] == 0 ? 'HAPPY' : ownPet[1] == 1 ? 'HUNGRY' : ownPet[1] == 2 ? 'STARVING' : ownPet[1] == 3 ? 'DYING' : ownPet[1] == 4 ? 'DEAD' : '' : ''}</h4>
                                        <h5 className="text-small tracking-tight text-default-400 text-center">STATUS</h5>
                                    </div>
                                    <div className="items-center justify-center  ">
                                        <h4 className="text-small font-semibold leading-none text-default-600 text-center"> 0</h4>
                                        <h5 className="text-small tracking-tight text-default-400 text-center">STAR</h5>
                                    </div>
                                </div>

                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-start-1 col-end-8 ">
                        <div className="flex w-full flex-col">
                            <Tabs fullWidth aria-label="Options">
                                {itemData && itemData.map((item: any) => (
                                    <Tab key={item.id} title={
                                        <Image
                                            width={25}
                                            radius={"none"}
                                            src={`/pot/item/${item.name.replaceAll(" ", "_")}.svg`}
                                        />}>
                                        <Card className="p-3">
                                            <CardBody>
                                                <div className="grid grid-cols-2 gap-2  ">
                                                    <div className="col-span-1 justify-self-start pb-2">USE 1 {item.name} </div>
                                                    <div className="col-span-1 justify-self-end">{item.price.toString()} {item.price} $POT</div>
                                                </div>

                                                <p className="text-center ">{item.points.toString()} PTS & {item.timeExtension.toString()}</p>
                                                <Button type="button" color="primary" onClick={() => onBuyAccessory(item.id)}>Buy </Button>
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                ))}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </>
        )
    ) || loadPet && (
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
            <div className="flex justify-center place-content-center ">
            <Image
                className="mt-48 object-center"
                src={`/pot/ui/Loading_Bar.gif`}
            />
            </div>
        </div>
    ) || isPet == false && (
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

    );
}