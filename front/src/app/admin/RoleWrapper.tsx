import { LockKeyhole, HomeIcon, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { useReadContract, useAccount } from "wagmi"

const allowListAddress = '0x0200000000000000000000000000000000000000';

const allowListABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "readAllowList",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];


export default function ErrorPage({ children }: { children: React.ReactNode }) {
    const { address } = useAccount();
    const { data, isError, isLoading } = useReadContract({
        address: allowListAddress,
        abi: allowListABI,
        functionName: 'readAllowList',
        args: [address],
    });
    console.log(data, isError, isLoading);


    if (!address) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8 text-center">
                    {/* Icon Container */}
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-red-500/20 blur-xl" />
                        <div className="relative bg-white dark:bg-slate-900 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-lg">
                            <ShieldAlert className="h-12 w-12 text-red-500" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Access Denied</h1>
                        <p className="text-muted-foreground text-lg">
                            You need to be connected and have the appropriate permissions to access this page.
                        </p>
                    </div>

                    {/* Authentication Status */}
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center gap-2 text-muted-foreground">
                        <LockKeyhole className="h-5 w-5" />
                        <span>Please connect your wallet or verify your permissions</span>
                    </div>

                    {/* Action Button */}
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <HomeIcon className="h-5 w-5" />
                            Return to Home
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

