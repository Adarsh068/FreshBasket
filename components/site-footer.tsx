import Link from "next/link"
//import { Facebook, Instagram, Leaf, Twitter } from "lucide-react"

const Leaf = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)
const Facebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const Twitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.7 5.5 4.3 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)
const Instagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)
const Youtube = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
)
const links = {
  "Useful Links": ["About Us", "In News", "Green FreshBasket", "Privacy Policy", "Terms and Conditions", "Careers"],
  "Customer Service": ["FAQs", "Contact Us", "Bulk Orders", "Delivery Areas", "Return Policy", "Site Map"],
  "Make Money With Us": ["Become Affiliate", "Become Seller", "Advertise with Us", "Press"],
  "Find Us On": ["Facebook", "Twitter", "Instagram", "YouTube"],
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="mb-3 text-sm font-bold text-foreground">{heading}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="/" className="text-xs text-muted-foreground hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                   <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <span className="text-xs text-muted-foreground">© 2026 FreshBasket. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
              <Facebook />
            </Link>
            <Link href="/" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
              <Twitter />
            </Link>
            <Link href="/" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
              <Instagram />
            </Link>
            <Link href="/" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
              <Youtube />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
