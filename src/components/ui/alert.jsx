import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 sm:p-5 [&>svg~*]:pl-9 sm:[&>svg~*]:pl-10 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 sm:[&>svg]:left-5 [&>svg]:top-5 sm:[&>svg]:top-5 [&>svg]:text-foreground [&>svg]:h-5 [&>svg]:w-5 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-blue-50 border-blue-200 text-blue-900 [&>svg]:text-blue-600",
        destructive:
          "bg-red-50 border-red-200 text-red-900 [&>svg]:text-red-600",
        success:
          "bg-green-50 border-green-200 text-green-900 [&>svg]:text-green-600",
        warning:
          "bg-amber-50 border-amber-200 text-amber-900 [&>svg]:text-amber-600",
        info:
          "bg-cyan-50 border-cyan-200 text-cyan-900 [&>svg]:text-cyan-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-2 sm:mb-2.5 font-semibold leading-tight tracking-tight text-sm sm:text-base", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs sm:text-sm leading-relaxed opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
