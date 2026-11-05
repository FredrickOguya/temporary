
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { db } from "@/db"
import { blogs, readingList, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateApiToken } from "../actions/apiToken"
import Link from "next/link"
import { updateReadingListStatusAction } from "../actions/blogs"

export const instant = false

const Me = async () => {
  await connection()

  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(session?.user?.id))
  })

  const readingListItems = user
  ? await db
      .select({
        id: readingList.id,
        read: readingList.read,
        blogId: readingList.blogId,
        title: blogs.title,
        author: blogs.author,
        url: blogs.url,
      })
      .from(readingList)
      .innerJoin(
        blogs,
        eq(readingList.blogId, blogs.id)
      )
      .where(eq(readingList.userId, user.id))
  : []

      const unreadItems = readingListItems.filter(
      (item) => !item.read
    )

    const readItems = readingListItems.filter(
      (item) => item.read
    )

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-gray-200 bg-white p-10 shadow-md">

        {/* Profile section */}
        <h1 className="mb-10 text-4xl font-bold text-slate-800">
          My Profile
        </h1>

        <div data-testid="user-profile" className="space-y-7 text-xl text-slate-600">
          <p data-testid="user-name">
            <span className="mr-3 font-bold text-slate-700">
              Name:
            </span>
            {session.user?.name}
          </p>

          <p data-testid="user-username">
            <span className="mr-3 font-bold text-slate-700">
              Username:
            </span>
            {session.user?.email}
          </p>
        </div>


        <hr className="my-14 border-t border-gray-300" />
        <div data-testid="reading-list-section">
          <h2 className="mb-8 text-3xl font-bold text-slate-800">
            My Reading List
          </h2>

          <section data-testid="unread-section" className="mb-12">
            <h3 className="mb-5 text-2xl font-semibold text-slate-700">
              Unread ({unreadItems.length})
            </h3>

            {unreadItems.length === 0 ? (
              <div data-testid="no-unread-blogs">
                <p data-testid="empty-reading-list" className="text-gray-500">
                  You have no unread blogs.
                </p>                
              </div>
              
            ) : (
              <div className="space-y-4">
                {unreadItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-amber-200 bg-amber-50 p-6"
                  >
                    <Link
                      href={`/blogs/${item.blogId}`}
                      className="text-xl font-semibold text-blue-700 hover:underline"
                    >
                      {item.title}
                    </Link>

                    <p className="mt-2 text-gray-600">
                      by {item.author}
                    </p>

                    <form
                      action={updateReadingListStatusAction}
                      className="mt-5"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={item.id}
                      />

                      <input
                        type="hidden"
                        name="read"
                        value="true"
                      />

                      <button
                        data-testid={`mark-read-${item.id}`}
                        type="submit"
                        className="rounded-md bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
                      >
                        Mark as read
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-5 text-2xl font-semibold text-slate-700">
              Read ({readItems.length})
            </h3>

            {readItems.length === 0 ? (
              <p className="text-gray-500">
                You have not read any blogs yet.
              </p>
            ) : (
              <div className="space-y-4">
                {readItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-green-200 bg-green-50 p-6"
                  >
                    <Link
                      href={`/blogs/${item.blogId}`}
                      className="text-xl font-semibold text-blue-700 hover:underline"
                    >
                      {item.title}
                    </Link>

                    <p className="mt-2 text-gray-600">
                      by {item.author}
                    </p>

                    <p className="mt-4 font-medium text-green-700">
                      ✓ Read
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>          
        </div>

        <hr className="my-14 border-t border-gray-300" />

        <h2 className="mb-7 text-3xl font-bold text-slate-800">
          API Token
        </h2>

        <div data-testid="api-token-section" className="mb-7 rounded-lg bg-gray-50 p-7">
          
            {user?.token ? (
              <div data-testid="token-display">
                <p className="mb-3 text-lg text-slate-600">Current token:</p>
                <p data-testid="api-token" className="break-all rounded-md bg-gray-100 p-4 text-lg text-gray-900">
                  {user.token}
                </p>
              </div>
            ) : (
              <p data-testid="no-token-message" className="mb-3 text-lg text-slate-600">
                No API token has been generated yet.
              </p>
            )}

          {user?.token && (
            <p className="break-all rounded-md bg-gray-100 p-4 text-lg text-gray-900">
              {user.token}
            </p>
          )}
        </div>

        <form action={generateApiToken}>
          <button
            type="submit"
            data-testid="generate-token-button"
            className="rounded-md bg-blue-600 px-7 py-4 text-xl font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Generate New Token
          </button>
        </form>
        <hr className="my-14 border-t border-gray-300" />
      </div>
    </main>
  )
}

export default Me
