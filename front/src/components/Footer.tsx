import { BadgeIcon as Certificate } from "lucide-react"

const Footer = () => {
    return (
        <footer className="w-full py-6 border-t">
            <div className="w-full px-4 md:px-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <Certificate className="h-6 w-6" />
                        <span className="font-bold">C3rtif</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© 2024 C3rtif. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer