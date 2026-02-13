/**
 * Re-export toast từ react-hot-toast.
 * Toaster đã được cấu hình trong layout (ToastAndProgress) theo design Cam – Vàng, glass.
 *
 * @example
 * import { toast } from '@/components/lib/toast';
 * toast('Đã lưu');
 * toast.success('Thành công');
 * toast.error('Có lỗi');
 * toast.promise(fetchData(), { loading: 'Đang tải...', success: 'Xong!', error: 'Lỗi' });
 */
export { toast } from "react-hot-toast";
