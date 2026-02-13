"use client";

import { motion } from "framer-motion";

const tableBase = "w-full border-collapse text-left text-[13px]";
const thBase =
  "border-b border-[var(--border-strong)] bg-[var(--secondary-bg-solid)]/80 px-4 py-3 font-semibold text-[var(--foreground)]";
const tdBase =
  "border-b border-[var(--border)] px-4 py-3 text-[var(--foreground-muted)]";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
}

export function Table({
  children,
  className = "",
  ...props
}: Readonly<TableProps>) {
  const {
    onAnimationStart: _a1,
    onAnimationEnd: _a2,
    onDrag: _d1,
    onDragStart: _d2,
    onDragEnd: _d3,
    onDragOver: _d4,
    ...restProps
  } = props;
  return (
    <div className="overflow-x-auto rounded-[var(--radius-panel)] border border-[var(--border)]">
      <motion.table
        className={`${tableBase} ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        {...(restProps as React.ComponentProps<typeof motion.table>)}
      >
        {children}
      </motion.table>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
}

export function TableHeader({ children }: Readonly<TableHeaderProps>) {
  return <thead>{children}</thead>;
}

interface TableBodyProps {
  children: React.ReactNode;
}

export function TableBody({ children }: Readonly<TableBodyProps>) {
  return <tbody>{children}</tbody>;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function TableRow({
  children,
  className = "",
}: Readonly<TableRowProps>) {
  return (
    <motion.tr
      className={`transition-colors hover:bg-[var(--secondary-bg-solid)]/50 ${className}`}
      whileHover={{ backgroundColor: "var(--secondary-bg-solid)" }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.tr>
  );
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}

export function TableHead({
  children,
  className = "",
  ...props
}: Readonly<TableHeadProps>) {
  return (
    <th className={`${thBase} ${className}`} {...props}>
      {children}
    </th>
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({
  children,
  className = "",
  ...props
}: Readonly<TableCellProps>) {
  return (
    <td className={`${tdBase} ${className}`} {...props}>
      {children}
    </td>
  );
}

interface TableCaptionProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCaption({
  children,
  className = "",
}: Readonly<TableCaptionProps>) {
  return (
    <caption
      className={`px-4 py-2 text-[12px] text-[var(--foreground-subtle)] ${className}`}
    >
      {children}
    </caption>
  );
}
