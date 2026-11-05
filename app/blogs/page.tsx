import Link from "next/link"
import { getBlogs } from "../services/blogs"

export const instant = false

const Blogs = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) => {
  const { filter = "" } = await searchParams

  const blogs = await getBlogs(filter)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>

      <form action="/blogs" method="GET" className="flex gap-2 mb-6">
        <input
          type="text"
          name="filter"
          data-testid="filter-input"
          placeholder="Search blogs by title"
          defaultValue={filter}
          className="flex-1 border border-gray-300 rounded px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          data-testid="search-button"
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table data-testid="blogs-list" className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">Id</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Url</th>
              <th className="px-4 py-3">Likes</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <td className="px-4 py-3 text-gray-500">{blog.id}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {blog.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{blog.author}</td>
                <td className="px-4 py-3 max-w-xs truncate">{blog.url}</td>
                <td className="px-4 py-3">{blog.likes} likes</td>
              </tr>
            ))}
          </tbody>
        </table>

        {blogs.length === 0 && (
          <p className="p-4 text-center text-gray-500">No blogs found.</p>
        )}
      </div>
    </div>
  )
}

export default Blogs