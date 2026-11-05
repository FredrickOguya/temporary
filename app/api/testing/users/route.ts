
import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    )
  }

  try {
    const body: unknown = await request.json()

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { username, name, password } =
      body as Record<string, unknown>

    if (
      typeof username !== "string" ||
      typeof name !== "string" ||
      typeof password !== "string" ||
      username.trim().length < 4 ||
      name.trim().length === 0 ||
      password.length < 4
    ) {
      return NextResponse.json(
        { error: "Invalid username, name, or password" },
        { status: 400 }
      )
    }

    const cleanUsername = username.trim()
    const cleanName = name.trim()

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, cleanUsername))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [newUser] = await db
      .insert(users)
      .values({
        username: cleanUsername,
        name: cleanName,
        passwordHash,
      })
      .returning({
        id: users.id,
        username: users.username,
        name: users.name,
      })

    return NextResponse.json(newUser, { status: 201 })

  } catch {
    return NextResponse.json(
      { error: "Could not create user" },
      { status: 400 }
    )
  }
}
