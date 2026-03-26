"use client"

import * as React from "react"
import {
  Badge as UUIBadge,
  type BadgeColor,
} from "@/components/base/badges/badges"
import { cn } from "@/lib/utils"

type VariantType =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"

const variantToColor: Record<VariantType, BadgeColor<"pill-color">> = {
  default: "brand",
  secondary: "gray",
  destructive: "error",
  outline: "gray",
  ghost: "gray",
  link: "brand",
}

const variantToType: Record<VariantType, "pill-color" | "color" | "modern"> = {
  default: "pill-color",
  secondary: "pill-color",
  destructive: "pill-color",
  outline: "modern",
  ghost: "modern",
  link: "pill-color",
}

interface BadgeProps {
  variant?: VariantType
  className?: string
  children?: React.ReactNode
}

function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <UUIBadge
      type={variantToType[variant]}
      color={variantToColor[variant]}
      size="sm"
      className={cn(className)}
    >
      {children}
    </UUIBadge>
  )
}

export { Badge }
export type { BadgeProps }
