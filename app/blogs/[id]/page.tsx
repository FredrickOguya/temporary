
import { getBlogById, isInReadingList } from "../../services/blogs"
import { getCurrentUser } from "../../services/session"
import { notFound } from "next/navigation"
import { likeBlogAction } from "@/app/actions/blogs"
import ReadingListButton from "./ReadingListButton"

export const instant = false

const Blog = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  const blog = await getBlogById(Number(id))

  if (!blog) {
    notFound()
  }

  const user = await getCurrentUser()

  const alreadyAdded = user
    ? await isInReadingList(user.id, blog.id)
    : false

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <article data-testid="blog-detail" className="mt-5 rounded-md border border-gray-100 p-8 shadow-sm">

          <h2 data-testid="blog-title" className="text-2xl font-bold text-gray-800">
            {blog.title}
          </h2>

          <p data-testid="blog-author" className="mt-3 text-lg text-gray-600">
            by {blog.author}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-gray-700">
              likes: {blog.likes}
            </span>

            <form action={likeBlogAction}>
              <input
                type="hidden"
                name="id"
                value={blog.id}
              />

              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                like
              </button>
            </form>

            {user && user.id !== blog.userId && (
              <ReadingListButton
                blogId={blog.id}
                alreadyAdded={alreadyAdded}
              />
            )}
          </div>

          <div className="mt-7">
            <a
              href={blog.url}
              target="_blank"
              rel="noreferrer"
              className="break-all text-blue-600 hover:underline"
            >
              {blog.url}
            </a>
          </div>
          
        </article>
      </div>
    </div>
  )
}

export default Blog
