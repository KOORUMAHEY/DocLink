"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex flex-col gap-3 p-4 sm:p-6 max-h-screen w-full sm:max-w-[420px] pointer-events-none",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative w-full rounded-xl border-1.5 p-5 sm:p-6 shadow-lg transition-all duration-300 flex items-start gap-3 overflow-hidden before:absolute before:inset-0 before:-translate-x-full group-data-[state=open]:before:translate-x-0 before:transition-transform before:duration-700",
  {
    variants: {
      variant: {
        default: "border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50/80 text-blue-900 before:bg-gradient-to-r before:from-blue-500 before:to-blue-400",
        destructive:
          "border-red-200 bg-gradient-to-r from-red-50 to-red-50/80 text-red-900 before:bg-gradient-to-r before:from-red-500 before:to-red-400",
        success:
          "border-green-200 bg-gradient-to-r from-green-50 to-green-50/80 text-green-900 before:bg-gradient-to-r before:from-green-500 before:to-green-400",
        warning:
          "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/80 text-amber-900 before:bg-gradient-to-r before:from-amber-500 before:to-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "relative z-10 inline-flex h-9 shrink-0 items-center justify-center rounded-lg border-1.5 border-current/20 bg-white px-3 text-sm font-semibold transition-all hover:bg-current/10 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-300 group-[.destructive]:text-red-700 group-[.destructive]:hover:bg-red-100",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "z-10 absolute right-3 top-3 rounded-lg p-1 text-current/60 opacity-100 transition-all hover:text-current/90 hover:bg-current/10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-5 w-5" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("relative z-10 text-sm sm:text-base font-bold leading-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("relative z-10 text-xs sm:text-sm opacity-90 leading-relaxed", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
