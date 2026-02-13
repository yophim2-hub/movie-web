"use client";

import {
  AppShell,
  Badge,
  Button,
  Card,
  Divider,
  Input,
  Modal,
  PageLayout,
  Skeleton,
  SkeletonText,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeToggle,
} from "@/components";
import Link from "next/link";
import { useState } from "react";

export default function DemoUiPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AppShell
      toolbar={
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="text-[13px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            ← Movie Web
          </Link>
          <ThemeToggle variant="both" />
        </div>
      }
    >
      <PageLayout className="pb-24">
        <header className="mb-12">
          <h2 className="text-[22px] font-semibold tracking-tight text-[var(--foreground)]">
            UI Components (Tailwind + Framer Motion)
          </h2>
          <p className="mt-2 text-[13px] text-[var(--foreground-muted)]">
            Badge, Input, Skeleton, Divider, Tabs, Modal — kết hợp sử dụng.
          </p>
        </header>

        <div className="space-y-10">
          {/* Badge */}
          <section className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="soft">Soft</Badge>
          </section>

          <Divider animateIn />

          {/* Input */}
          <section className="max-w-xs space-y-3">
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input
              label="Tên"
              placeholder="Nhập tên"
              error="Trường này bắt buộc"
            />
          </section>

          <Divider animateIn />

          {/* Tabs */}
          <section>
            <Tabs defaultValue="tab1">
              <TabsList className="mb-4">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <Card variant="outline" padding="md">
                  Nội dung tab 1 — AnimatePresence khi đổi tab.
                </Card>
              </TabsContent>
              <TabsContent value="tab2">
                <Card variant="outline" padding="md">
                  Nội dung tab 2.
                </Card>
              </TabsContent>
              <TabsContent value="tab3">
                <Card variant="outline" padding="md">
                  Nội dung tab 3.
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          <Divider animateIn />

          {/* Skeleton */}
          <section className="flex gap-4">
            <Skeleton className="h-10 w-10" rounded="full" />
            <div className="flex-1">
              <SkeletonText lines={2} />
            </div>
          </section>

          {/* Modal */}
          <section>
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Mở Modal
            </Button>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Tiêu đề Modal"
            >
              <p className="text-[13px] text-[var(--foreground-muted)]">
                Nội dung modal — overlay blur, đóng bằng Escape hoặc bấm ngoài.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Hủy
                </Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  Xong
                </Button>
              </div>
            </Modal>
          </section>
        </div>
      </PageLayout>
    </AppShell>
  );
}
