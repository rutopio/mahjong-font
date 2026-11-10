import type { ComponentProps } from "react"
import { DrawerTitle as BaseDrawerTitle } from "@rutopio/base-component/drawer"

export {
  Drawer, DrawerPortal, DrawerOverlay, DrawerSwipeHandle, DrawerTrigger,
  DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerDescription,
} from "@rutopio/base-component/drawer"

export function DrawerTitle({ className, ...props }: ComponentProps<typeof BaseDrawerTitle>) {
  return <BaseDrawerTitle className={["font-heading", className].filter(Boolean).join(" ")} {...props} />
}
