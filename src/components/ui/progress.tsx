"use client"

import * as React from "react"
import {
  ProgressBarBase,
  ProgressBar as UUIProgressBar,
} from "@/components/base/progress-indicators/progress-indicators"
import { cn } from "@/lib/utils"

/* ── Progress (shadcn API compat) ─────────────────────── */

interface ProgressProps {
  value?: number
  className?: string
  children?: React.ReactNode
}

function Progress({ value = 0, className, children }: ProgressProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {children}
      <ProgressBarBase value={value} />
    </div>
  )
}

/* ── Sub-components for shadcn API compat ──────────────── */

function ProgressTrack({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-2 w-full items-center overflow-hidden rounded-md bg-quaternary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ProgressIndicator({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "h-full rounded-md bg-fg-brand-primary transition duration-75 ease-linear",
        className,
      )}
      style={style}
      {...props}
    />
  )
}

function ProgressLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function ProgressValue({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-sm text-text-tertiary tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
