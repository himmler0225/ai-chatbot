import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | undefined>(undefined)

function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error("useSheet must be used within SheetProvider")
  }
  return context
}

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
}

function SheetTrigger({ asChild, ...props }: SheetTriggerProps) {
  const { setOpen } = useSheet()
  
  if (asChild) {
    return React.cloneElement(props.children as React.ReactElement, {
      onClick: () => setOpen(true),
    })
  }
  
  return (
    <button {...props} onClick={() => setOpen(true)} />
  )
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right" | "top" | "bottom"
}

function SheetContent({ side = "right", className, children, ...props }: SheetContentProps) {
  const { open, setOpen } = useSheet()

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  const sideClasses = {
    left: "left-0 h-full w-3/4 sm:w-[440px]",
    right: "right-0 h-full w-3/4 sm:w-[440px]",
    top: "top-0 h-1/3 w-full",
    bottom: "bottom-0 h-1/3 w-full",
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "fixed z-50 gap-4 bg-background p-4 shadow-lg transition ease-in-out animate-in fade-in slide-in",
          sideClasses[side],
          className
        )}
        {...props}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetContent,
}
