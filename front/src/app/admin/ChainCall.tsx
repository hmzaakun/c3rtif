import { useReadContract } from 'wagmi'
import { abi } from "@/lib/abi";
import { useState, useEffect } from 'react';
import { pinata } from '@/utils/config';

export interface Program {
    studentId: string,
    programName: string,
    yearRange: string,
    programStatus: string,
    certificateIssuedDate: string,
    comments: string,
    issuer: string,
    signer: string,
}

export interface Annual {
    parentTokenId: string,
    studentId: string,
    studentName: string,
    year: string,
    courses: {
        name: string,
        grade: string,
        result: string,
        comments: string,
    }[],
    yearStartDate: string,
    yearEndDate: string,
    academicStatus: string,
    academicComments: string,
    issuer: string,
    signer: string,
}

export const useGetPrograms = () => {
    const [programs, setPrograms] = useState<any[]>([]);
    const contractAddress = process.env.NEXT_PUBLIC_ADDRESS as `0x{string}`;

    const { data } = useReadContract<any, any[], any>({
        abi,
        address: contractAddress,
        functionName: "getAllProgram",
        args: [],
    });

    useEffect(() => {
        async function getIPFSData() {
            const URIs: Program[] = [];
            for (const program of (data as any[])[1]) {
                const file = await pinata.gateways.get(program);
                if (file.data) {
                    URIs.push(file.data as unknown as Program);
                }
            }
            setPrograms(URIs);
        }
        if (data) {
            getIPFSData();
        }
    }, [data]);

    return { programs };
}

export const useGetAnnuals = () => {
    const [annuals, setAnnuals] = useState<any[]>([]);
    const contractAddress = process.env.NEXT_PUBLIC_ADDRESS as `0x{string}`;

    const { data } = useReadContract<any, any[], any>({
        abi,
        address: contractAddress,
        functionName: "getAllAnnual",
        args: [],
    });

    useEffect(() => {
        async function getIPFSData() {
            const URIs: Annual[] = [];
            for (const annual of (data as any[])[1]) {
                const file = await pinata.gateways.get(annual);
                if (file.data) {
                    URIs.push(file.data as unknown as Annual);
                }
            }
            setAnnuals(URIs);
        }
        if (data) {
            getIPFSData();
        }
    }, [data]);

    return { annuals };
}