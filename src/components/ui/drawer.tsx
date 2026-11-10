import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import type * as React from "react"

import { cn } from "@/lib/utils"

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
    return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
    return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
    return (
        <DrawerPrimitive.Backdrop
            data-slot="drawer-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/10 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
                className
            )}
            {...props}
        />
    )
}

function DrawerContent({
    className,
    children,
    ...props
}: DrawerPrimitive.Popup.Props) {
    return (
        <DrawerPrimitive.Portal>
            <DrawerOverlay />
            <DrawerPrimitive.Viewport
                data-slot="drawer-viewport"
                className="pointer-events-none fixed inset-0 z-50"
            >
                <DrawerPrimitive.Popup
                    data-slot="drawer-content"
                    className={cn(
                        "group/drawer-content pointer-events-auto fixed inset-x-4 bottom-4 z-50 flex h-auto max-h-[calc(100dvh-6rem)] flex-col rounded-xl border bg-popover text-base text-popover-foreground shadow-lg transition-transform duration-300 ease-out will-change-transform data-ending-style:translate-y-[calc(100%+1rem)] data-starting-style:translate-y-[calc(100%+1rem)]",
                        className
                    )}
                    {...props}
                >
                    <div className="mx-auto mt-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted" />
                    <DrawerPrimitive.Content className="flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain">
                        {children}
                    </DrawerPrimitive.Content>
                </DrawerPrimitive.Popup>
            </DrawerPrimitive.Viewport>
        </DrawerPrimitive.Portal>
    )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-header"
            className={cn("flex flex-col gap-1.5 p-4 text-center", className)}
            {...props}
        />
    )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-footer"
            className={cn("mt-auto flex flex-col gap-2 p-4", className)}
            {...props}
        />
    )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
    return (
        <DrawerPrimitive.Title
            data-slot="drawer-title"
            className={cn(
                "text-balance font-heading text-lg font-medium text-foreground",
                className
            )}
            {...props}
        />
    )
}

function DrawerDescription({
    className,
    ...props
}: DrawerPrimitive.Description.Props) {
    return (
        <DrawerPrimitive.Description
            data-slot="drawer-description"
            className={cn("text-pretty text-base text-muted-foreground", className)}
            {...props}
        />
    )
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
}
