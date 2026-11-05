"use client"

import { useNotification } from "./NotificationContext"

export default function Notification() {
  const { message, type } = useNotification()

  if (!message) return null

  const colors =
    type === "success"
      ? "bg-green-100 border-green-600 text-green-800"
      : "bg-red-100 border-red-600 text-red-800"

  return (
    <div
      data-testid="notification"
      role={type === "error" ? "alert" : "status"}
      className={`max-w-2xl mx-auto mt-4 px-4 py-2 rounded border ${colors}`}
    >
      {message}
    </div>
  )
}