
"use client"

import { useSession, signOut } from "next-auth/react"
import NavLink from "./NavLink"

export default function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="flex min-h-[72px] items-center bg-slate-800 px-7 py-3 text-white shadow-md">

      {/* Home link on the left */}
      <NavLink href="/">
        <span className="text-3xl font-bold">
          home
        </span>
      </NavLink>

      {/* Navigation links on the right */}
      <div className="ml-auto flex items-center gap-7">

        <NavLink href="/blogs">
          blogs
        </NavLink>

        <NavLink href="/users">
          users
        </NavLink>

        {session ? (
          <>
            <NavLink href="/blogs/new">
              create new
            </NavLink>

            <NavLink href="/me">
              me
            </NavLink>

            <button
              onClick={() => signOut()}
              className="rounded-md bg-red-600 px-5 py-2 text-lg font-semibold text-white transition-colors hover:bg-red-700"
            >
              logout
            </button>
          </>
        ) : (
          <>
            <NavLink href="/login">
              login
            </NavLink>

            <NavLink href="/register">
              register
            </NavLink>
          </>
        )}

      </div>
    </nav>
  )
}
