import { db } from "@/db"
import { blogs, users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request){

  const authorization = request.headers.get("authorization")
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return Response.json(
      {error: "Unauthorized"},
      { status: 401 }
    )
  }

  const token = authorization.slice(7).trim()

  if(!token) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.token, token))
    .limit(1)

  const createdBlogs = await db
    .select()
    .from(blogs)
    .where(eq(blogs.userId, user.id))

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  return Response.json({
    id: user.id,
    username: user.username,
    name: user.name,
    createdBlogs
  })
}