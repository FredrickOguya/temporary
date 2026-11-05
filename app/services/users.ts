import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getUsers = async () => {
  const result = await db.select().from(users)
  return result
}

export const getUser = async(username: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      blogs: true,
    }
  })
  return user
}