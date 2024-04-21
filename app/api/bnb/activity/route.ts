
import {
    NextResponse
} from 'next/server';
import { decodeAbiParameters ,decodeFunctionData } from 'viem'
import { nftAbi } from './abi';
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const searchParams = new URLSearchParams(url.search);
        const page = searchParams.get("page");
        const address = searchParams.get("address");
        let response: any = await fetch(`${process.env.EXPLORER_URL}/api/tx/getAssetTransferByAddress?page=${page}&type=transfer&pageSize=20&address=${address}`)
        response = await response.json()
        let nftsList: any = response?.data?.list;
        let nftRes = [];
        for (const nft of nftsList) {
            const nftDecodeId = decodeAbiParameters(
                [{ name: 'x', type: 'uint32' }],
                nft.erc721TokenId,
            )
            const InputDataDecoder = require('ethereum-input-data-decoder');
            const decoder = new InputDataDecoder(nftAbi);
            nftRes.push({
                id: nftDecodeId[0].toString(),
                address: nft.to,
                data:decoder.decodeData(nft.input),
                time:nft.blockTimeStamp
            })
        }

        return NextResponse.json({ data: nftRes, total: nftRes.length }, {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        },);




    } catch (error) {
        return NextResponse.json(
            { error },
            {
                status: 400,
                headers: {
                    'content-type': 'application/json',
                },
            },
        );
    }

}