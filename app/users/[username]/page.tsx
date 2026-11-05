import Link from "next/link"
import { getUser } from "../../services/users"
import { notFound } from "next/navigation"

const User = async ({
  params,
}: {
  params: Promise<{ username: string }>
}) => {
  const { username } = await params
  const user = await getUser(username)

  if (!user) {
    notFound()
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>Added blogs</h3>

      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default User
export const instant = false