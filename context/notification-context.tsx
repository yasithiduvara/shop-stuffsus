"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Toast, ToastProvider, ToastViewport, ToastAction } from "@/components/ui/toast"
import { X } from "lucide-react"

export type Notification = {
  id: string
  title: string
  message: string
  timestamp: number
  read: boolean
  type: "info" | "success" | "warning" | "error"
  productId: string
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showToast, setShowToast] = useState(false)
  const [currentToast, setCurrentToast] = useState<Notification | null>(null)

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications")
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  // Show toast for the most recent notification
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]
      if (!latestNotification.read) {
        setCurrentToast(latestNotification)
        setShowToast(true)

        // Auto-hide toast after 5 seconds
        const timer = setTimeout(() => {
          setShowToast(false)
        }, 5000)

        return () => clearTimeout(timer)
      }
    }
  }, [notifications])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const closeToast = () => {
    setShowToast(false)
    if (currentToast) {
      markAsRead(currentToast.id)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}

      {/* Toast Notification */}
      <ToastProvider>
        {showToast && currentToast && (
          <div className="fixed bottom-4 right-4 z-50">
            <Toast
              className={`${currentToast.type === "success" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{currentToast.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{currentToast.message}</div>
                </div>
                <ToastAction altText="Close" onClick={closeToast} className="p-1">
                  <X className="h-4 w-4" />
                </ToastAction>
              </div>
            </Toast>
          </div>
        )}
        <ToastViewport />
      </ToastProvider>
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
