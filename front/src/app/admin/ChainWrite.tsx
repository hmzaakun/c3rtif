import { pinata } from "@/utils/config";
import { useWriteContract } from 'wagmi'
import { abi } from "@/lib/abi";

const ewoqAvalanche = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";

const uploadJson = async (data: any) => {
    console.log(JSON.stringify(pinata));
    const uploadToIPFS = await pinata.upload.json(data);
    console.log(uploadToIPFS);
    return uploadToIPFS.IpfsHash;
};

export const useCreateProgram = () => {
    const { writeContract, isError, error, isPending, isSuccess } = useWriteContract();

    async function createProgram(data: any) {
        const contractAddress = process.env.NEXT_PUBLIC_ADDRESS as `0x{string}`;
        const uploadedData = await uploadJson(data);

        writeContract({
            abi,
            address: contractAddress,
            functionName: "createProgramNFT",
            args: [ewoqAvalanche, uploadedData],
        });
        console.log("Program created");
    }

    return { createProgram, isError, error, isPending, isSuccess };
}

export const useCreatePerformance = () => {
    const { writeContract, isError, error, isPending, isSuccess } = useWriteContract();

    async function createPerformance(parentID: string, data: any) {
        const contractAddress = process.env.NEXT_PUBLIC_ADDRESS as `0x{string}`;
        const uploadedData = await uploadJson(data);

        writeContract({
            abi,
            address: contractAddress,
            functionName: "createAnnualNFT",
            args: [ewoqAvalanche, parentID, uploadedData],
        });
        console.log("Performance created");
    }

    return { createPerformance, isError, error, isPending, isSuccess };
}

export const useUpdateAll = () => {
    const { writeContract, isError, error, isPending, isSuccess } = useWriteContract();

    async function updateAll(tokenID: string, data: any) {
        const contractAddress = process.env.NEXT_PUBLIC_ADDRESS as `0x{string}`;
        const uploadedData = await uploadJson(data);

        writeContract({
            abi,
            address: contractAddress,
            functionName: "updateTokenURI",
            args: [tokenID, uploadedData],
        });
        console.log("All updated");
    }

    return { updateAll, isError, error, isPending, isSuccess };
}