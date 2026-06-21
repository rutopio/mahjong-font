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
            <DrawerPrimitive.Popup
                data-slot="drawer-content"
                className={cn(
                    "group/drawer-content fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[80vh] flex-col rounded-t-xl border-t bg-popover text-sm text-popover-foreground shadow-lg transition-transform duration-300 ease-out will-change-transform data-ending-style:translate-y-full data-starting-style:translate-y-full",
                    className
                )}
                {...props}
            >
                <div className="mx-auto mt-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted" />
                {children}
            </DrawerPrimitive.Popup>
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
                "cn-font-heading font-medium text-foreground",
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
            className={cn("text-sm text-muted-foreground", className)}
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
    DrawerOverlay,
    DrawerTitle,
    DrawerTrigger,
}
