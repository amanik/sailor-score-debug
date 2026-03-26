# Design System -- Sailor

## Product Context
- **What this is:** Financial therapy app for solopreneurs -- weekly swipe-to-categorize expense review
- **Who it's for:** Service-based solopreneurs ($80K-$1M revenue), Gina Knox's 18K business owner community
- **Space/industry:** Personal finance / fintech / financial coaching
- **Project type:** Mobile-first web app (prototype for founder testing)

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian + Coaching Warmth
- **Decoration level:** Intentional -- frosted glass nav, subtle card elevation, spring physics on swipe
- **Mood:** Data-dense but never cold. The dark canvas keeps focus on numbers; warmth comes from copy, motion, and the swipe interaction itself.
- **Current phase:** Grayscale-only during founder testing. Color to be layered once IA and flows are validated.

## Typography
- **Display/Hero:** Geist -- clean, modern, not overused
- **Body:** Geist -- same family for consistency
- **UI/Labels:** Geist (same as body)
- **Data/Tables:** Geist Mono -- tabular-nums for financial precision
- **Code:** Geist Mono
- **Loading:** next/font (Geist + Geist Mono built-in)
- **Scale:** Uses Untitled UI token scale: xs(12px) sm(14px) md(16px) lg(18px) xl(20px) display-xs(24px) display-sm(30px) display-md(36px)

## Color
- **Approach:** Grayscale-first (testing phase)
- **Palette:** Black, white, grays only via Untitled UI CSS variables
- **Semantic exceptions:** green (positive money flow), red (negative money flow) -- universal financial convention
- **Dark mode:** Primary mode. Light mode deferred.
- **Future:** Warm accent color (terracotta/coral range) to be evaluated post-IA validation

## Spacing
- **Base unit:** 4px (Tailwind default)
- **Density:** Comfortable
- **Touch targets:** 44px minimum (WCAG 2.1 AA)

## Layout
- **Approach:** Mobile-first single column
- **Max content width:** max-w-lg (32rem / 512px)
- **Border radius:** Hierarchical -- sm(4px) for small elements, xl(12px) for cards, 2xl(16px) for sheets, full for pills

## Motion
- **Approach:** Intentional
- **Primary:** Spring physics on swipe cards (stiffness: 300, damping: 30)
- **Secondary:** ease-out on sheet entry, ease-in on exit
- **Principle:** The swipe IS the motion language. Everything else stays quiet.
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-250ms) medium(250-400ms)

## Core Interaction Pattern
**Swipe = top-level sort. Bottom sheet = detail classification.**
This applies to all categorization flows: business review, personal review, cashflow recategorization, unsure micro-audit.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-26 | Grayscale-only during testing | Focus on IA and interaction design; color later |
| 2026-03-26 | Geist + Geist Mono only | Already loaded via next/font, clean and modern |
| 2026-03-26 | Dashboard expenses = bucket view | Matches Coach Annie's language (High ROI / No ROI / Unsure) |
| 2026-03-26 | Swipe-then-sheet universal pattern | Consistent interaction for all categorization flows |
