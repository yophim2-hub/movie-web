import {
  AppShell,
  Badge,
  Button,
  Card,
  Divider,
  ImageWebP,
  Input,
  PageLayout,
  Skeleton,
  SkeletonText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeToggle,
} from "@/components";
import Link from "next/link";
import { PageWithAllComponents } from "./page-with-all-components";

export default function HomePage() {
  return (
    <AppShell
      toolbar={
        <div className="flex w-full items-center justify-between">
          <span
            className="text-[13px] font-medium text-foreground-muted"
            style={{ letterSpacing: "-0.01em" }}
          >
            Movie Web
          </span>
          <ThemeToggle variant="both" />
        </div>
      }
    >
      <PageLayout className="pb-24">
        {/* macOS typography */}
        <header className="mb-16 sm:mb-20">
          <h1
            className="text-[28px] font-semibold tracking-tight text-foreground sm:text-[32px]"
            style={{
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Movie Web
          </h1>
          <p
            className="mt-3 max-w-xl text-[13px] leading-[1.5] text-foreground-muted"
            style={{ letterSpacing: "-0.01em" }}
          >
            Design system kiểu macOS: ít màu, nhiều khoảng trắng, blur + layer,
            animation chậm & mượt.
          </p>
        </header>

        {/* Panel glass */}
        <section className="space-y-4">
          <Card variant="glass" padding="lg">
            <h2 className="text-[15px] font-semibold text-foreground">
              Glass panel
            </h2>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-foreground-muted">
              Backdrop blur + saturate, viền nhẹ, giống panel macOS.
            </p>
          </Card>

          <Card variant="elevated" padding="lg">
            <h2 className="text-[15px] font-semibold text-foreground">
              Elevated panel
            </h2>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-foreground-muted">
              Shadow mềm, hover nhẹ — transition chậm.
            </p>
          </Card>
        </section>

        {/* Ảnh — ImageWebP */}
        <section className="mt-10">
          <Card variant="outline" padding="none">
            <div
              className="relative aspect-video overflow-hidden"
              style={{ borderRadius: "var(--radius-panel)" }}
            >
              <ImageWebP
                src="/next.svg"
                alt="Next.js"
                fill
                className="object-contain p-8 dark:invert"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
            <div className="p-5">
              <p className="text-[13px] text-foreground-subtle">
                Ảnh qua ImageWebP → phục vụ WebP.
              </p>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section className="mt-10 flex flex-wrap gap-3">
          <Button variant="primary" size="md">
            Primary
          </Button>
          <Button variant="secondary" size="md">
            Secondary
          </Button>
          <Button variant="ghost" size="md">
            Ghost
          </Button>
        </section>

        {/* Badge */}
        <section className="mt-10 flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="soft">Soft</Badge>
        </section>

        <Divider className="mt-10" />

        {/* Input */}
        <section className="mt-10 max-w-xs">
          <Input label="Email" type="email" placeholder="you@example.com" />
        </section>

        <Divider className="mt-10" />

        {/* Table */}
        <section className="mt-10">
          <h2 className="mb-3 text-[15px] font-semibold text-foreground">
            Bảng phim
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phim</TableHead>
                <TableHead>Năm</TableHead>
                <TableHead>Thể loại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Inception</TableCell>
                <TableCell>2010</TableCell>
                <TableCell>Sci-Fi</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>The Dark Knight</TableCell>
                <TableCell>2008</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Interstellar</TableCell>
                <TableCell>2014</TableCell>
                <TableCell>Sci-Fi</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        <Divider className="mt-10" />

        {/* Tabs */}
        <section className="mt-10">
          <Tabs defaultValue="phim">
            <TabsList className="mb-3">
              <TabsTrigger value="phim">Phim</TabsTrigger>
              <TabsTrigger value="tv">TV</TabsTrigger>
            </TabsList>
            <TabsContent value="phim">
              <Card variant="outline" padding="md">
                Nội dung tab Phim.
              </Card>
            </TabsContent>
            <TabsContent value="tv">
              <Card variant="outline" padding="md">
                Nội dung tab TV.
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Skeleton */}
        <section className="mt-10 flex gap-4">
          <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
          <SkeletonText className="flex-1" lines={2} />
        </section>

        {/* Modal — dùng client component để có state */}
        <section className="mt-10">
          <PageWithAllComponents />
        </section>

        <footer
          className="mt-16 pt-8 text-[12px] text-foreground-subtle"
          style={{ letterSpacing: "0.01em" }}
        >
          Typography + spacing — focus chính của UI system.{" "}
          <Link
            href="/demo-ui"
            className="text-[var(--accent)] hover:underline"
          >
            Xem tất cả UI components
          </Link>
        </footer>
      </PageLayout>
    </AppShell>
  );
}
