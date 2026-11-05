import Link from "next/link"

export default function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="hover:text-gray-300 transition-colors">
      {children}
    </Link>
  )
}