import * as React from "react"
import { cn } from "@/lib/utils"
const Tabs = ({ defaultValue, className, children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  
  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab })
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ className, children, activeTab, setActiveTab, ...otherProps }) => {
  // Remove activeTab and setActiveTab from props that go to DOM
  // eslint-disable-next-line no-unused-vars
  // Destructure to remove from DOM props
  // (already destructured in params)
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab })
        }
        return child
      })}
    </div>
  )
}

const TabsTrigger = ({ className, value, children, activeTab, setActiveTab, ...otherProps }) => {
  // Remove activeTab and setActiveTab from props that go to DOM
  // eslint-disable-next-line no-unused-vars
  // Destructure to remove from DOM props
  // (already destructured in params)
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        activeTab === value 
          ? "bg-background text-foreground shadow-sm" 
          : "hover:bg-muted/50",
        className
      )}
      onClick={() => setActiveTab && setActiveTab(value)}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ className, value, children, activeTab, ...otherProps }) => {
  // Remove activeTab from props that go to DOM
  // eslint-disable-next-line no-unused-vars
  // Destructure to remove from DOM props
  // (already destructured in params)
  if (activeTab !== value) return null
  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
