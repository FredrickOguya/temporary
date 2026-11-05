"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { BlogFormState, createBlog } from "../../actions/blogs"
import { useNotification } from "../../components/NotificationContext"

const initialState: BlogFormState = {
  errors: {},
  values: {
    author: "",
    url: "",
    title: "",
    year: "",
  },
}

const inputClass =
  "block w-full mt-1 border border-gray-300 rounded px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"

const inputErrorClass =
  "block w-full mt-1 border border-red-500 rounded px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500"

const NewBlog = () => {
  const { showNotification } = useNotification()
  const router = useRouter()

  const [state, formAction, pending] = useActionState(
    async (prev: BlogFormState, formData: FormData): Promise<BlogFormState> => {
      const result = await createBlog(prev, formData)

      if (result.success) {
        showNotification("blog created", "success")
        router.push("/blogs")
        return initialState
      }

      return result
    },
    initialState,
  )

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create a new Blog</h2>

      <form
        action={formAction}
        className="space-y-4 border rounded-lg p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium">
            Author
            <input
              name="author"
              type="text"
              required
              defaultValue={state.values?.author}
              className={state.errors.author ? inputErrorClass : inputClass}
            />
          </label>
          {state.errors.author && (
            <p className="text-red-600 text-sm mt-1">{state.errors.author}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            URL
            <input
              name="url"
              type="text"
              required
              defaultValue={state.values?.url}
              className={state.errors.url ? inputErrorClass : inputClass}
            />
          </label>
          {state.errors.url && (
            <p className="text-red-600 text-sm mt-1">{state.errors.url}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Title
            <input
              name="title"
              type="text"
              required
              defaultValue={state.values?.title}
              className={state.errors.title ? inputErrorClass : inputClass}
            />
          </label>
          {state.errors.title && (
            <p className="text-red-600 text-sm mt-1">{state.errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Year
            <input
              name="year"
              type="number"
              defaultValue={state.values?.year}
              className={inputClass}
            />
          </label>
        </div>

        <button
          data-testid="create-blog-button"
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded"
        >
          {pending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  )
}

export default NewBlog