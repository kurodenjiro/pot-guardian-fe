"use client";

import type { CardProps } from "@nextui-org/react";

import React, { useState, useEffect, useCallback } from 'react';
import { nftAbi, tokenAbi } from '../../components/play/abi';
import { Select, SelectItem, Tooltip, Button } from "@nextui-org/react";

import {
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";


export const Admin = (props: CardProps) => {
  const [messages, setMessages] = useState<any>(null)
  const [hash, setHash] = useState<any>(null)

  const { config: configEnableTrading } = usePrepareContractWrite({
    address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
    abi: tokenAbi,
    functionName: "enableTrading"
  });

  const {
    data: enableTradingResult,
    writeAsync: setEnableTradingAsync,
    error: errorEnableTrading,
  } = useContractWrite(configEnableTrading);

  //create pot 0
  const { config: configAddPot } = usePrepareContractWrite({
    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
    abi: nftAbi,
    functionName: "createSpecies",
    args: [
      [{
        image: "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeig5r74eag7jrgycbka3dd4zask5ccmansx7vnybp67aavqcexcdsu/Plant%201-1.svg",
        name: "Seed",
        attackWinRate: BigInt("20"),
        nextEvolutionLevel: BigInt("1")
      },
      {
        image: "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeigms4ihs3wahtbhsdehg5qossr3qdhb5fd6bdpq52pfhsh7bq5tfy/Plant%201-2.svg",
        name: "Growth",
        attackWinRate: BigInt("25"),
        nextEvolutionLevel: BigInt("2")
      },
      {
        image: "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeiegiqsnqg74zxyd7rhxmrt3kgwojae3e32uxx3ntvs7odd5dvn534/Plant%201-3.svg",
        name: "Tall",
        attackWinRate: BigInt("35"),
        nextEvolutionLevel: BigInt("3")
      },
      {
        image: "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeigtxat6mbezu4taj4iwefgjhjjox3wtpbveiovwniud7cv7kokl7y/Plant%201-4.svg",
        name: "Strong",
        attackWinRate: BigInt("35"),
        nextEvolutionLevel: BigInt("4")
      },
      {
        image: "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeigsglzxuks4gomlohyhjskslev53cpa4nohllmgskjlon34mwxfg4/Plant%201-5.svg",
        name: "Big",
        attackWinRate: BigInt("35"),
        nextEvolutionLevel: BigInt("5")
      }],
      BigInt("10"),
      false,
      BigInt("0"),
      { skinColor: BigInt("0"), hornStyle: BigInt("0"), wingStyle: BigInt("0") }]
  });
  const {
    data: addPotResult,
    writeAsync: createPot,
    error: errorAddPot,
  } = useContractWrite(configAddPot);


  //Water
  const { config: configAddWater } = usePrepareContractWrite({
    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
    abi: nftAbi,
    functionName: "createItem",
    args: ["Water", BigInt("2000"), BigInt("2000"), BigInt("99999"), BigInt("50000000000000"), BigInt("28800"), BigInt("0"), false],
  });

  const {
    data: addItemWater,
    writeAsync: creatItemMoonStone,
    error: errorAddMoonStone,
  } = useContractWrite(configAddWater);

  //Sunlight
  const { config: configAddItemSunlight } = usePrepareContractWrite({
    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
    abi: nftAbi,
    functionName: "createItem",
    args: ["Sunlight", BigInt("2000"), BigInt("2000"), BigInt("99999"), BigInt("50000000000000"), BigInt("28800"), BigInt("0"), false],
  });

  const {
    data: addItemSunlightResult,
    writeAsync: creatItemSunlight,
    error: errorAddSunlightItem,
  } = useContractWrite(configAddItemSunlight);

  //Water
  const { config: configAddItemWater } = usePrepareContractWrite({
    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
    abi: nftAbi,
    functionName: "createItem",
    args: ["Water", BigInt("2000"), BigInt("2000"), BigInt("99999"), BigInt("20000000000000"), BigInt("28800"), BigInt("0"), false],
  });

  const {
    data: addItemWaterResult,
    writeAsync: creatItemWater,
    error: errorAddWaterItem,
  } = useContractWrite(configAddItemWater);


  //MiracleDrop 
  const { config: configAddItemMiracleDrop } = usePrepareContractWrite({
    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
    abi: nftAbi,
    functionName: "createItem",
    args: ["Miracle Drop", BigInt("2000"), BigInt("2000"), BigInt("99999"), BigInt("0"), BigInt("0"), BigInt("3"), false],
  });

  const {
    data: addItemMiracleDropResult,
    writeAsync: creatItemMiracleDrop,
    error: errorAddMiracleDropItem,
  } = useContractWrite(configAddItemMiracleDrop);


  //Fertilizer
  const { config: configAddItemFertilizer } = usePrepareContractWrite({
    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
    abi: nftAbi,
    functionName: "createItem",
    args: ["Fertilizer", BigInt("2000"), BigInt("2000"), BigInt("99999"), BigInt("0"), BigInt("0"), BigInt("0"), true],
  });

  const {
    data: addItemFertilizerResult,
    writeAsync: creatItemFertilizer,
    error: errorAddFertilizerItem,
  } = useContractWrite(configAddItemFertilizer);


  //Clover
  const { config: configAddItemClover } = usePrepareContractWrite({
    address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
    abi: nftAbi,
    functionName: "createItem",
    args: ["Clover", BigInt("2000"), BigInt("2000"), BigInt("99999"), BigInt("0"), BigInt("0"), BigInt("3"), false],
  });

  const {
    data: addItemCloverResult,
    writeAsync: creatItemClover,
    error: errorAddCloverItem,
  } = useContractWrite(configAddItemClover);


  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          <div className="flex flex-col gap-2">
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
              <div>
                <Button color="primary" className="w-full" onPress={setEnableTradingAsync}>
                  set Enable Trading
                </Button>
              </div>
              <div>
                <Button color="primary" className="w-full" onPress={createPot}>
                  Create Pot
                </Button>
              </div>
              <div>
                <Button color="primary" className="w-full" onPress={creatItemWater}>
                  Item Water
                </Button>
              </div>
              <div>
                <Button color="primary" className="w-full" onPress={creatItemSunlight}>
                  Item Sunlight
                </Button>

              </div>
              <div>
                <Button color="primary" className="w-full" onPress={creatItemMiracleDrop}>
                  Item Mircale Drops
                </Button>

              </div>
              <div>
                <Button color="primary" className="w-full" onPress={creatItemFertilizer}>
                  Item Fertilizer
                </Button>
              </div>
              <div>
                <Button color="primary" className="w-full" onPress={creatItemClover}>
                  Item Clover
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

