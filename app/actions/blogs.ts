"use server"

import { redirect } from "next/navigation"
import { addBlog, addToReadingList, likeBlog, updatedReadingListStatus } from "../services/blogs"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export type BlogFormState = {
  errors: {
    author?: string
    url?: string
    title?: string
  }
  values?: {
    author: string
    url: string
    title: string
    year: string
  }
  success?: boolean
}

export const createBlog = async (
  prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> => {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const author = formData.get("author") as string
  const url = formData.get("url") as string
  const title = formData.get("title") as string
  const year = formData.get("year") as string

  const errors: BlogFormState["errors"] = {}

  if (!author || author.length < 5) {
    errors.author = "Author must be at least 5 characters long"
  }
  if (!url || url.length < 5) {
    errors.url = "URL must be at least 5 characters long"
  }
  if (!title || title.length < 5) {
    errors.title = "Title must be at least 5 characters long"
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { author, url, title, year }, success: false }
  }

  await addBlog(author, url, title, Number(year))

  revalidatePath("/blogs")
  return { errors: {}, success: true }
}

export const likeBlogAction = async (formData: FormData) => {
  const id = Number(formData.get("id"))
  await likeBlog(id)
  revalidatePath(`/blogs/${id}`)
  revalidatePath("/blogs")
}

export const addToReadingListAction = async (blogId: number) => {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const added = await addToReadingList(blogId)

  revalidatePath(`/blogs/${blogId}`)
  revalidatePath("/me")
  return added
}

export const updateReadingListStatusAction = async (
  formData: FormData
) => {
  const session = await auth()

  if (!session) redirect("/login")

    const id = Number(formData.get("id"))
    const read = formData.get("read") === "true"

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid reading list ID")
    }

    await updatedReadingListStatus(id, read)

    revalidatePath("/me")
}