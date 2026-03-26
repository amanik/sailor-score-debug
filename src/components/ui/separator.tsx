"use client"

import { cn } from "@/lib/utils"

interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

function Separator({
  orientation = "horizontal",
  className,
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border-secondary",
        orientation === "horizontal" && "h-px w-full",
        orientation === "vertical" && "w-px self-stretch",
        className,
      )}
    />
  )
}

export { Separator }
