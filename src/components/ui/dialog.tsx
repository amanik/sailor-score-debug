"use client"

import * as React from "react"
import {
  DialogTrigger as UUIDialogTrigger,
  ModalOverlay,
  Modal,
  Dialog as UUIDialog,
} from "@/components/application/modals/modal"
import { Button as AriaButton } from "react-aria-components"
import { X as XIcon } from "@untitledui/icons"
import { cn } from "@/lib/utils"

/* ── Dialog Root ───────────────────────────────────────── */

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <UUIDialogTrigger
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </UUIDialogTrigger>
  )
}

/* ── DialogTrigger ─────────────────────────────────────── */

interface DialogTriggerProps {
  render?: React.ReactElement
  children?: React.ReactNode
  className?: string
}

function DialogTrigger({ render, children, className }: DialogTriggerProps) {
  // AriaDialogTrigger expects its first child to be a pressable Button element.
  // Wrap children in an unstyled react-aria Button so clicks propagate correctly.
  const inner = render
    ? React.isValidElement(render)
      ? (render.props as { children?: React.ReactNode }).children ?? children
      : children
    : children
  return (
    <AriaButton className={cn("cursor-pointer appearance-none bg-transparent border-none p-0", className)}>
      {inner}
    </AriaButton>
  )
}

/* ── DialogContent ─────────────────────────────────────── */

interface DialogContentProps {
  showCloseButton?: boolean
  className?: string
  children?: React.ReactNode
}

function DialogContent({
  showCloseButton = true,
  className,
  children,
}: DialogContentProps) {
  return (
    <ModalOverlay>
      <Modal className={cn("sm:max-w-sm", className)}>
        <UUIDialog>
          <div
            className={cn(
              "relative w-full rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10",
              className,
            )}
          >
            <div className="flex flex-col gap-4">{children}</div>
            {showCloseButton && (
              <button
                type="button"
                className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-lg text-fg-quaternary transition hover:bg-primary_hover hover:text-fg-quaternary_hover"
                onClick={(e) => {
                  // Walk up to find the dialog trigger and close
                  const popup = (e.target as HTMLElement).closest(
                    "[role=dialog]",
                  )
                  if (popup) {
                    const closeBtn = popup.querySelector<HTMLButtonElement>(
                      "[data-close]",
                    )
                    closeBtn?.click()
                  }
                }}
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

/* ── DialogHeader / Title / Description / Footer ──────── */

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-base leading-none font-semibold text-text-primary",
        className,
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-text-tertiary", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t border-border-secondary bg-bg-secondary p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
