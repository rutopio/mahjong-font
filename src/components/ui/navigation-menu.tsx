import * as React from "react"
import { cva } from "class-variance-authority"
import { CaretDownIcon } from "@phosphor-icons/react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"

import { cn } from "@/lib/utils"

function NavigationMenu({
    className,
    children,
    viewport = true,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean
}) {
    return (
        <NavigationMenuPrimitive.Root
            data-slot="navigation-menu"
            data-viewport={viewport}
            className={cn(
                "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
                className
            )}
            {...props}
        >
            {children}
            {viewport && <NavigationMenuViewport />}
        </NavigationMenuPrimitive.Root>
    )
}

function NavigationMenuList({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
    return (
        <NavigationMenuPrimitive.List
            data-slot="navigation-menu-list"
            className={cn(
                "group flex flex-1 list-none items-center justify-center gap-1",
                className
            )}
            {...props}
        />
    )
}

function NavigationMenuItem({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
    return (
        <NavigationMenuPrimitive.Item
            data-slot="navigation-menu-item"
            className={cn("relative", className)}
            {...props}
        />
    )
}

const navigationMenuTriggerStyle = cva(
    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[popup-open]:bg-accent/50 data-[popup-open]:text-accent-foreground data-[popup-open]:hover:bg-accent data-[popup-open]:focus:bg-accent"
)

function NavigationMenuTrigger({
    className,
    children,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
    return (
        <NavigationMenuPrimitive.Trigger
            data-slot="navigation-menu-trigger"
            className={cn(navigationMenuTriggerStyle(), "group", className)}
            {...props}
        >
            {children}{" "}
            <CaretDownIcon
                className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[popup-open]:rotate-180"
                aria-hidden="true"
            />
        </NavigationMenuPrimitive.Trigger>
    )
}

function NavigationMenuContent({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
    return (
        <NavigationMenuPrimitive.Content
            data-slot="navigation-menu-content"
            className={cn(
                "top-0 left-0 w-full p-2 pr-2.5 data-[activation-direction=left]:slide-in-from-right-52 data-[activation-direction=right]:slide-in-from-left-52 data-[starting-style]:animate-in data-[starting-style]:fade-in data-[ending-style]:animate-out data-[ending-style]:fade-out md:absolute md:w-auto",
                "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none group-data-[viewport=false]/navigation-menu:data-[ending-style]:animate-out group-data-[viewport=false]/navigation-menu:data-[ending-style]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[ending-style]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[starting-style]:animate-in group-data-[viewport=false]/navigation-menu:data-[starting-style]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[starting-style]:zoom-in-95",
                className
            )}
            {...props}
        />
    )
}

function NavigationMenuViewport({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
    return (
        <NavigationMenuPrimitive.Portal>
            <NavigationMenuPrimitive.Positioner
                className="absolute top-full left-0 isolate z-50 flex justify-center"
                sideOffset={6}
            >
                <NavigationMenuPrimitive.Popup>
                    <NavigationMenuPrimitive.Viewport
                        data-slot="navigation-menu-viewport"
                        className={cn(
                            "origin-top-center relative mt-1.5 h-[var(--popup-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[ending-style]:animate-out data-[ending-style]:zoom-out-95 data-[starting-style]:animate-in data-[starting-style]:zoom-in-90 md:w-[var(--popup-width)]",
                            className
                        )}
                        {...props}
                    />
                </NavigationMenuPrimitive.Popup>
            </NavigationMenuPrimitive.Positioner>
        </NavigationMenuPrimitive.Portal>
    )
}

function NavigationMenuLink({
    className,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
    return (
        <NavigationMenuPrimitive.Link
            data-slot="navigation-menu-link"
            className={cn(
                "flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 data-[active]:bg-accent/50 data-[active]:text-accent-foreground data-[active]:hover:bg-accent data-[active]:focus:bg-accent [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
}
