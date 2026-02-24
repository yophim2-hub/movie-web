"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = "",
}: Readonly<TabsProps>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  const contextValue = useMemo(
    () => ({ value, setValue }),
    [value, setValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: Readonly<TabsListProps>) {
  return (
    <div
      className={`flex gap-1 rounded-[var(--radius-button)] bg-[var(--secondary-bg-solid)] p-1 ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  className = "",
}: Readonly<TabsTriggerProps>) {
  const { value: selected, setValue } = useTabsContext();
  const isSelected = selected === value;

  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      className={`relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors focus-ring ${isSelected ? "text-white" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"} ${className}`}
      onClick={() => setValue(value)}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {isSelected && (
        <motion.span
          layoutId="tabs-indicator"
          className="absolute inset-0 rounded-md shadow-[var(--shadow-sm)]"
          style={{ background: "linear-gradient(135deg, #FF6A00, #FF3D00)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  /** Giữ nội dung đã mount (chỉ ẩn) thay vì unmount */
  forceMount?: boolean;
}

export function TabsContent({
  value,
  children,
  className = "",
  forceMount = false,
}: Readonly<TabsContentProps>) {
  const { value: selected } = useTabsContext();
  const isSelected = selected === value;

  const content = (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isSelected}
      className={className}
    >
      {children}
    </div>
  );

  if (forceMount) return content;

  return (
    <AnimatePresence mode="wait">
      {isSelected && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
          className={className}
          role="tabpanel"
          id={`panel-${value}`}
          aria-labelledby={`tab-${value}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
