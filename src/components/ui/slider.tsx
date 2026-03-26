"use client"

import * as React from "react"
import { Slider as UUISlider } from "@/components/base/slider/slider"
import { cn } from "@/lib/utils"

interface SliderProps {
  className?: string
  defaultValue?: number[]
  value?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step,
  onValueChange,
}: SliderProps) {
  return (
    <div className={cn("w-full", className)}>
      <UUISlider
        defaultValue={defaultValue?.[0] ?? value?.[0] ?? min}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={onValueChange ? (val) => onValueChange([val as number]) : undefined}
      />
    </div>
  )
}

export { Slider }
