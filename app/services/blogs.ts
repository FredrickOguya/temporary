import { db } from '@/db'
import { blogs, readingList } from '@/db/schema'
import { and, desc, eq, ilike, sql } from 'drizzle-orm'
import { getCurrentUser } from './session'

export const getBlogs = (filter?: string) => {
  return db
          .select()
          .from(blogs)
          .where(ilike(blogs.title, `%${filter || ""}%`))
          .orderBy(desc(blogs.likes))
}

export const addBlog = async (author: string, url: string, title: string, year: number) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Not logged in")
  }
  const result = await db
    .insert(blogs)
    .values({
      author,
      url,
      title,
      year,
      userId: user.id,
    })
    .returning()

    const blog = result[0]

    await db
      .insert(readingList)
      .values({
        userId: user.id,
        blogId: blog.id
      })

  return blog
}

export const getBlogById = async (id: number) => {
  const result = await db
                        .select()
                        .from(blogs)
                        .where(eq(blogs.id, id))
                        .limit(1)
  
  return result[0]
}

export const likeBlog = async (id: number) => {
  const result = await db
    .update(blogs)
    .set({
      likes: sql`${blogs.likes} + 1`,
    })
    .where(eq(blogs.id, id))
    .returning()

  return result[0]
}

export const addToReadingList = async (blogId: number) => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not logged in")
  }

  const blog = await getBlogById(blogId)

  if (!blog) {
    throw new Error("Blog not found")
  }

  if (blog.userId === user.id) {
    throw new Error("You cannot add your own blog")
  }

  const [existing] = await db
    .select()
    .from(readingList)
    .where(
      and(
        eq(readingList.userId, user.id),
        eq(readingList.blogId, blogId)
      )
    )
    .limit(1)

    if (existing) {
      return false
    }

    await db.insert(readingList).values({
      userId: user.id,
      blogId,
    })

    return true
}

export const isInReadingList = async (
  userId: number,
  blogId: number
) => {
  const [existing] = await db
    .select()
    .from(readingList)
    .where(
      and(
        eq(readingList.userId, userId),
        eq(readingList.blogId, blogId)
      )
    )
    .limit(1)

  return Boolean(existing)
}

export const updatedReadingListStatus = async(id: number, read: boolean) => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not logged in")
  }

  const result = await db
    .update(readingList)
    .set({ read })
    .where(
      and(
        eq(readingList.id, id),
        eq(readingList.userId, user.id)
      )
    )
    .returning()

    return result[0]
}