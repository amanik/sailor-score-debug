"use client"

import * as React from "react"
import {
  DialogTrigger as UUIDialogTrigger,
  ModalOverlay,
  Modal,
  Dialog as UUIDialog,
} from "@/components/application/modals/modal"
import { Button } from "@/components/ui/button"
import { X as XIcon } from "@untitledui/icons"
import { cn } from "@/lib/utils"

/* ── Sheet Root ────────────────────────────────────────── */

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <UUIDialogTrigger isOpen={open} onOpenChange={onOpenChange}>
      {children}
    </UUIDialogTrigger>
  )
}

/* ── SheetTrigger ──────────────────────────────────────── */

function SheetTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span className={cn("cursor-pointer", className)} {...props}>
      {children}
    </span>
  )
}

/* ── SheetContent ──────────────────────────────────────── */

interface SheetContentProps {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  className?: string
  children?: React.ReactNode
}

function SheetContent({
  side = "right",
  showCloseButton = true,
  className,
  children,
}: SheetContentProps) {
  const sideStyles: Record<string, string> = {
    bottom: "inset-x-0 bottom-0 rounded-t-2xl border-t border-border-secondary",
    top: "inset-x-0 top-0 rounded-b-2xl border-b border-border-secondary",
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-border-secondary",
    right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-border-secondary",
  }

  return (
    <ModalOverlay>
      <Modal className="!items-end !justify-center !p-0 sm:!items-end">
        <UUIDialog>
          <div
            data-side={side}
            className={cn(
              "relative flex w-full flex-col gap-4 bg-bg-primary text-sm text-text-primary shadow-xl",
              sideStyles[side],
              className,
            )}
          >
            {children}
            {showCloseButton && (
              <button
                type="button"
                className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-lg text-fg-quaternary transition hover:bg-primary_hover hover:text-fg-quaternary_hover"
                data-close
              >
                <XIcon className="size-5" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>
        </UUIDialog>
      </Modal>
    </ModalOverlay>
  )
}

/* ── Sub-components ────────────────────────────────────── */

function SheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="sheet-title"
      className={cn(
        "text-base font-semibold text-text-primary",
        className,
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sheet-description"
      className={cn("text-sm text-text-tertiary", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
