import Image from "next/image"
import Link from "next/link"

export function HeroBanner({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  image,
}: {
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  image: string
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-4">
      <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-r from-accent/15 to-primary/10">
        <div className="flex items-center justify-between gap-4 px-6 py-6 sm:px-10 sm:py-8">
          <div className="max-w-md">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
            <h2 className="mt-1 text-2xl leading-tight font-extrabold text-foreground text-balance sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{description}</p>
            <Link
              href={ctaHref}
              className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
            >
              {ctaLabel}
            </Link>
          </div>
          <div className="relative hidden h-32 w-48 shrink-0 sm:block md:h-40 md:w-72">
            <Image src={image} alt="" fill sizes="(max-width: 768px) 0vw, 288px" className="object-contain" priority />
          </div>
        </div>
      </div>
    </div>
  )
}
