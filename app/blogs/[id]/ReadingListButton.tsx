"use client"

import { useState, useTransition } from "react"
import { addToReadingListAction } from "@/app/actions/blogs"
import { useNotification } from "@/app/components/NotificationContext"

const ReadingListButton = ({
  blogId,
  alreadyAdded,
}: {
  blogId: number
  alreadyAdded: boolean
}) => {
  const [added, setAdded] = useState(alreadyAdded)
  const [isPending, startTransition] = useTransition()

  const { showNotification } = useNotification()

  const handleAdd = () => {
    startTransition(async () => {
      try {
        const result = await addToReadingListAction(blogId)

        setAdded(true)

        if (result) {
          showNotification(
            "Blog added to your reading list!",
            "success"
          )
        }
      } catch {
        showNotification(
          "Failed to add blog to reading list.",
          "error"
        )
      }
    })
  }

  return (
    <button
      data-testid="add-to-reading-list-button"
      type="button"
      onClick={handleAdd}
      disabled={added || isPending}
      className={`rounded px-4 py-2 text-sm text-white ${
        added || isPending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {isPending
        ? "Adding..."
        : added
          ? "Added to reading list"
          : "Add to reading list"}
    </button>
  )
}

export default ReadingListButton