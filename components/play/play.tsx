"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Link,
  Image,
  Button
} from "@nextui-org/react";
import "../../styles/nes.css/css/nes.css"

import { Activity } from "./activity";
import { Pet } from "./pet";
import { Leaderboad } from "./leaderboard";
import { Breed } from "./breed";
import { Account } from "./account";
import {
  useConnect,
  useNetwork,
  useAccount,
  useSwitchNetwork
} from "wagmi";
export const Play = () => {
  const [active, setActive] = useState("pet");
  const [isChain, setIsChain] = React.useState<any>(false)
  const [connectorsData, setConnectors] = React.useState<any>([])
  const [isAddress, setIsAddress] = React.useState<any>(false)
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error: errorConnect, isLoading: isLoadingConnect, pendingConnector } = useConnect()
  const { chain } = useNetwork()
  const { chains, error: errorSwitchNetwork, isLoading: loadingSwingNetwork, pendingChainId, switchNetwork } =
    useSwitchNetwork({
      onMutate(args) {

      },
      onSettled(data, error) {
      },
      onSuccess(data) {
      }
    })

  React.useEffect(() => {
    if (connectors) {
      setConnectors(connectors)
    }
    if (address) {
      setIsAddress(true)
    }
    else {
      setIsAddress(false);
    };
    if (chain?.id == process.env.CHAIN_ID) {
      setIsChain(true)
    }
    else {
      setIsChain(false)
    }
  }, [address, chain])
  return (
    isChain && isAddress && (
      <main className="container mx-auto max-w-7xl   flex-grow " >

        <div className="max-w-lg  mx-auto p-5 ">
          {active == "activity" && (
            <Activity />
          )}
          {active == "pet" && (
            <Pet />
          )}
          {active == "battle" && (
            <Leaderboad />
          )}
          {active == "account" && (
            <Account />
          )}

        </div>
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
            <Link
              onClick={() => setActive("activity")} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ">
              <Image
                radius={"none"}
                width={30}
                src="/pot/menu/Menu.svg"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">ACTIVITY</span>
            </Link>
            <Link onClick={() => setActive("pet")} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ">
              <Image
                radius={"none"}
                width={30}
                src="/pot/menu/MyPlant.svg"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">PLANT</span>
            </Link>
            <Link onClick={() => setActive("battle")} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ">

              <Image
                radius={"none"}
                width={30}
                src="/pot/menu/Ranking.svg"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"> LEADERBOARD</span>
            </Link>
            <Link onClick={() => setActive("account")} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ">
              <Image
                radius={"none"}
                width={30}
                src="/pot/menu/Account.svg"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">ACCOUNT</span>
            </Link>
          </div>

        </div>
      </main>
    ) || isChain == false && isAddress && (
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
        <button
          key={process.env.CHAIN_ID}
          onClick={() => switchNetwork?.(process.env.CHAIN_ID as unknown as number)}
          className="nes-btn w-52 mt-48"
        >
          Switch Chain
          {loadingSwingNetwork && pendingChainId === process.env.CHAIN_ID && ' (switching)'}
        </button>
        <span>{errorSwitchNetwork && errorSwitchNetwork.message}</span>
      </div>
    )
  ) || isAddress == false && (
    <div className="mt-3">
      <div className="flex flex-col items-center justify-center gap-3 pt-20 ">
        {connectorsData.map((connector: any) => (

          <button
            className="nes-btn w-48  m-2 "
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready}
            {isLoadingConnect &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </button>


        ))}
      </div>
      {errorConnect && <div>{errorConnect.message}</div>}
    </div>
  );
};
