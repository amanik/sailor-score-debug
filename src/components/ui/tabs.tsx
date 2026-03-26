"use client"

import * as React from "react"
import {
  Tabs as UUITabs,
  TabList as UUITabList,
  Tab as UUITab,
  TabPanel as UUITabPanel,
} from "@/components/application/tabs/tabs"
import { cn } from "@/lib/utils"

/* ── Tabs Root ─────────────────────────────────────────── */

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  className?: string
  children?: React.ReactNode
}

function Tabs({
  defaultValue,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
}: TabsProps) {
  return (
    <UUITabs
      defaultSelectedKey={defaultValue}
      selectedKey={value}
      onSelectionChange={
        onValueChange
          ? (key) => onValueChange(String(key))
          : undefined
      }
      orientation={orientation}
      className={cn("flex w-full flex-col", className)}
    >
      {children}
    </UUITabs>
  )
}

/* ── TabsList ──────────────────────────────────────────── */

interface TabsListProps {
  variant?: "default" | "line"
  className?: string
  children?: React.ReactNode
}

const variantToType: Record<string, "underline" | "button-gray" | "button-brand" | "button-border" | "button-minimal"> = {
  default: "button-gray",
  line: "underline",
}

function TabsList({
  variant = "default",
  className,
  children,
}: TabsListProps) {
  return (
    <UUITabList
      type={variantToType[variant] ?? "button-gray"}
      size="sm"
      className={className}
    >
      {children}
    </UUITabList>
  )
}

/* ── TabsTrigger ───────────────────────────────────────── */

interface TabsTriggerProps {
  value: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

function TabsTrigger({
  value,
  disabled,
  className,
  children,
}: TabsTriggerProps) {
  return (
    <UUITab
      id={value}
      isDisabled={disabled}
      className={className}
    >
      {children}
    </UUITab>
  )
}

/* ── TabsContent ───────────────────────────────────────── */

interface TabsContentProps {
  value: string
  className?: string
  children?: React.ReactNode
}

function TabsContent({
  value,
  className,
  children,
}: TabsContentProps) {
  return (
    <UUITabPanel id={value} className={cn("flex-1 text-sm outline-none", className)}>
      {children}
    </UUITabPanel>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
