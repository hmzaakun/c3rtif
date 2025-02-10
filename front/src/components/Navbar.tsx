
import Link from 'next/link'
import { BadgeIcon as Certificate } from "lucide-react"
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center border-b w-full">
            <div className="w-full flex items-center justify-between">
                <Link href="/" className="flex items-center justify-center gap-2 font-bold text-xl">
                    <Certificate className="h-6 w-6" />
                    <span>C3rtif</span>
                </Link>
                <nav className="flex gap-4 sm:gap-6 items-center">
                    <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
                        Explorer
                    </Link>
                    <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4">
                        Admin
                    </Link>
                    <ConnectButton />
                </nav>
            </div>
        </header>
    )
}

export default Navbar