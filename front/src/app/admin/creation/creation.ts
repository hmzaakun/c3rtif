import { pinata } from "@/utils/config";

export const uploadJson = async (data: any) => {
    console.log(JSON.stringify(pinata));
    const uploadToIPFS = await pinata.upload.json(data);
    console.log(uploadToIPFS);
    return uploadToIPFS.IpfsHash;
};
