"use client"

import { createContext, useCallback, useContext, useRef, useState } from "react"

type NotificationType = "success" | "error"

type NotificationContextType = {
  message: string
  type: NotificationType
  showNotification: (message: string, type?: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextType>({
  message: "",
  type: "success",
  showNotification: () => {},
})

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [message, setMessage] = useState("")
  const [type, setType] = useState<NotificationType>("success")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showNotification = useCallback(
    (msg: string, notifType: NotificationType = "success") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setMessage(msg)
      setType(notifType)
      timeoutRef.current = setTimeout(() => setMessage(""), 5000)
    },
    [],
  )

  return (
    <NotificationContext value={{ message, type, showNotification }}>
      {children}
    </NotificationContext>
  )
}

export const useNotification = () => useContext(NotificationContext)