"use client"

import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/ui/utils"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-stone-900 transition-all duration-200 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:pointer-events-none disabled:opacity-60",
      className,
    )}
    {...props}
  />
))

Button.displayName = "Button"

export { Button }
