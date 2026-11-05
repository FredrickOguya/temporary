import { db } from "@/db";
import { blogs, readingList, users } from "@/db/schema";
import { NextResponse } from "next/server";

export async function DELETE() {
  if(process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    )
  }

  await db.transaction(async (tx) => {
    await tx.delete(readingList)
    await tx.delete(blogs)
    await tx.delete(users)
  })

  return NextResponse.json({
    message: "Database reset successful"
  })
}