"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageConfigEditor } from "@/modules/admin-pages";

export function AdminManagementContent() {
  return (
    <Tabs defaultValue="pages" className="flex h-full min-h-0 flex-col">
      <TabsList className="mb-4 shrink-0">
        <TabsTrigger value="pages">Trang (Home, Phim lẻ...)</TabsTrigger>
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="users">Người dùng</TabsTrigger>
        <TabsTrigger value="content">Nội dung phim</TabsTrigger>
        <TabsTrigger value="settings">Cài đặt</TabsTrigger>
      </TabsList>
      <TabsContent value="pages" className="mt-0 min-h-0 flex-1 overflow-auto">
        <PageConfigEditor />
      </TabsContent>
      <TabsContent value="overview" className="mt-0 min-h-0 flex-1">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Người dùng" value="—" />
            <StatCard label="Phim" value="—" />
            <StatCard label="Lượt xem (tháng)" value="—" />
            <StatCard label="Bình luận" value="—" />
          </div>
          <p className="text-[13px] text-[var(--foreground-muted)]">
            Chọn tab Người dùng, Nội dung phim hoặc Cài đặt để quản lý. Dữ liệu mẫu sẽ được kết nối backend sau.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="users" className="mt-0 min-h-0 flex-1">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Danh sách người dùng</h3>
            <Button variant="primary" size="sm">Thêm người dùng</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email / Tên</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell className="text-right">Sửa | Xóa</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="content" className="mt-0 min-h-0 flex-1">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Phim / tập</h3>
            <Button variant="primary" size="sm">Thêm phim</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell className="text-right">Sửa | Xóa</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="mt-0 min-h-0 flex-1">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Cài đặt hệ thống</h3>
          <ul className="space-y-2 text-[13px] text-[var(--foreground-muted)]">
            <li>• Cấu hình API / nguồn phim</li>
            <li>• Phân quyền admin</li>
            <li>• Backup / khôi phục</li>
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function StatCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--secondary-bg-solid)]/50 p-4">
      <p className="text-[12px] text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
