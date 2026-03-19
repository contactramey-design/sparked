import * as React from 'react'
import { cn } from '@/lib/utils'

type TabsValue = string

interface TabsContextValue {
  value: TabsValue
  setValue: (v: TabsValue) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
}: {
  defaultValue: TabsValue
  value?: TabsValue
  onValueChange?: (v: TabsValue) => void
  className?: string
  children: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState<TabsValue>(defaultValue)
  const value = controlledValue ?? uncontrolled
  const setValue = (v: TabsValue) => {
    onValueChange?.(v)
    if (controlledValue === undefined) setUncontrolled(v)
  }
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-700',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  value,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: TabsValue }) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs')
  const active = ctx.value === value
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        active ? 'bg-white text-slate-900 shadow' : 'text-slate-700 hover:text-slate-900',
        className,
      )}
      aria-pressed={active}
      onClick={() => ctx.setValue(value)}
      {...props}
    />
  )
}

export function TabsContent({
  value,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: TabsValue }) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used within Tabs')
  if (ctx.value !== value) return null
  return <div className={cn('mt-4', className)} {...props} />
}

