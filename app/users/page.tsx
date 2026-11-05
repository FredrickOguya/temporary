
import Link from "next/link"
import { Suspense } from "react"
import { getUsers } from "../services/users"

async function UsersList() {
  const users = await getUsers()

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.username}`}>
            {user.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function Users() {
  return (
    <div>
      <h2>Users</h2>

      <Suspense fallback={<p>Loading users...</p>}>
        <UsersList />
      </Suspense>
    </div>
  )
}
