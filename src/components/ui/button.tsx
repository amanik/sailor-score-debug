"use client"

import * as React from "react"
import {
  Button as UUIButton,
  type ButtonProps as UUIButtonProps,
  type CommonProps,
} from "@/components/base/buttons/button"
import { cn } from "@/lib/utils"

type VariantType =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"

type SizeType =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"

const variantToColor: Record<VariantType, CommonProps["color"]> = {
  default: "primary",
  secondary: "secondary",
  outline: "secondary",
  ghost: "tertiary",
  destructive: "primary-destructive",
  link: "link-gray",
}

const sizeToUUI: Record<SizeType, CommonProps["size"]> = {
  default: "sm",
  xs: "xs",
  sm: "xs",
  lg: "lg",
  icon: "sm",
  "icon-xs": "xs",
  "icon-sm": "xs",
  "icon-lg": "md",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType
  size?: SizeType
  /** @deprecated base-ui render prop — pass className to a native element instead */
  render?: React.ReactElement
}

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  disabled,
  render,
  ...props
}: ButtonProps) {
  const isIconSize = size?.startsWith("icon")

  // Legacy render-prop support: clone the element with button styling
  if (render) {
    const element = render as React.ReactElement<Record<string, unknown>>
    return React.cloneElement(element, {
      ...props,
      disabled,
      className: cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition duration-100 ease-linear cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "ghost" &&
          "hover:bg-primary_hover text-tertiary hover:text-secondary",
        variant === "default" &&
          "bg-brand-solid text-white shadow-xs-skeuomorphic hover:bg-brand-solid_hover",
        variant === "secondary" &&
          "bg-primary text-secondary shadow-xs-skeuomorphic ring-1 ring-primary ring-inset hover:bg-primary_hover",
        variant === "outline" &&
          "bg-primary text-secondary shadow-xs-skeuomorphic ring-1 ring-primary ring-inset hover:bg-primary_hover",
        isIconSize && "p-2",
        className,
      ),
      children,
    } as Record<string, unknown>)
  }

  return (
    <UUIButton
      size={sizeToUUI[size] ?? "sm"}
      color={variantToColor[variant] ?? "primary"}
      isDisabled={disabled}
      className={cn(isIconSize && "!p-2", className)}
      {...(props as Omit<UUIButtonProps, "color" | "size">)}
    >
      {children}
    </UUIButton>
  )
}

export { Button }
export type { ButtonProps }
