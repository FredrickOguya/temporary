"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const generateApiToken = async () => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const token = randomUUID()

  await db.update(users)
    .set({ token })
    .where(eq(users.id, Number(session.user.id)))

    revalidatePath("/me")
}