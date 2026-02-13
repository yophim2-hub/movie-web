"use client";

import { Button, Modal } from "@/components";
import { toast } from "@/components/lib/toast";
import { useState } from "react";

export function PageWithAllComponents() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Mở Modal
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.success("Đã lưu!")}
        >
          Thử toast
        </Button>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal demo"
      >
        <p className="text-[13px] text-[var(--foreground-muted)]">
          Đóng bằng Escape hoặc bấm ngoài.
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
    </>
  );
}
