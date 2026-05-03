import Link from "next/link"
import { Smartphone } from "lucide-react"

export function TopPromoBar() {
  return (
    <div className="bg-foreground text-background text-xs">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-1.5">
        <div className="flex items-center gap-2">
          <Smartphone className="h-3.5 w-3.5" />
          <span>Get the FreshBasket app</span>
        </div>
        <nav className="hidden items-center gap-4 md:flex">
          <Link href="/" className="hover:underline">
            Become a seller
          </Link>
          <span className="opacity-30">|</span>
          <Link href="/" className="hover:underline">
            Customer Service
          </Link>
          <span className="opacity-30">|</span>
          <Link href="/" className="hover:underline">
            FB Business
          </Link>
          <span className="opacity-30">|</span>
          <Link href="/" className="hover:underline">
            FB Daily
          </Link>
        </nav>
      </div>
    </div>
  )
}
