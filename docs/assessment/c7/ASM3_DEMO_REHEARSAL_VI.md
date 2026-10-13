# Hướng dẫn luyện tập demo ASM3

**Chưa có video cá nhân hoàn chỉnh.** Tài khoản chính mới đăng ký đã có bằng chứng xác nhận email và tạo phiên Auth. Hai tài khoản kiểm thử riêng vẫn chưa xác nhận. Không nói rằng mọi email đều bị lỗi; không khẳng định lưu dữ liệu hoặc mua hàng thành công trước khi có bằng chứng thực tế.

| Thời gian | Nội dung cần thể hiện |
|---|---|
| 00:00–00:20 | Giới thiệu Thien Khuong Vu, BUS4012 ASM3 và mục đích Student Money Runway. |
| 00:20–00:35 | Mở URL Preview thật; website công khai nhưng dữ liệu cá nhân yêu cầu đăng nhập. |
| 00:35–01:05 | Đăng nhập tài khoản demo đã xác nhận; nhập thông tin ngoài đoạn quay. Chỉ mô tả đăng ký thành công khi có bằng chứng thật. |
| 01:05–01:45 | Setup: Available Funds 950, ngày thực tế, Safety Buffer 100. Essentials: Fixed 455, Flexible 180. Quay trạng thái lưu và phản hồi FastAPI thật. |
| 01:45–02:05 | Runway: tổng bảo vệ 735, số tiền có thể dùng 215. |
| 02:05–02:35 | Purchase Check: khoản mua 160. Result xem trước còn 55; chưa ghi giao dịch. |
| 02:35–03:00 | Bấm Mark as spent một lần; đợi xử lý. Chỉ sau phản hồi thật mới nói tiền khả dụng 790 và runway 55. |
| 03:00–03:25 | Refresh, xem lịch sử đã lưu, logout và kiểm tra route riêng tư. |
| 03:25–03:45 | Table Editor thật, chỉ lọc bản ghi demo được phép; che thông tin không liên quan. |
| 03:45–04:05 | Giải thích React/Vite → FastAPI → Supabase và JWT xác minh ở backend. |
| 04:05–04:30 | GitHub PRIVATE: cấu trúc source, README và .gitignore. Tổng phần này chỉ 25 giây. |
| 04:30–04:50 | Prompt Document: phân biệt prompt gốc, đoạn trích hội thoại và mô tả tái dựng; trình bày một lỗi được sửa bằng chứng thật. |
| 04:50–05:00 | Tóm tắt bảo mật và kết thúc. |

Luyện kịch bản tiếng Anh khoảng 125 từ/phút. Kịch bản có 607 từ; phải đo thời lượng video xuất thực tế, không xem ước tính là bằng chứng đạt giới hạn năm phút. Không đọc lời khẳng định thao tác thành công khi cảnh quay chưa chứng minh điều đó.

Không quay mật khẩu, token, API key, file .env đã điền hoặc dữ liệu người khác. Không dùng ảnh/video mock C2/C4 để thay cảnh quay sản phẩm live. Không sửa dữ liệu tài chính của tài khoản chính khi chưa có phạm vi cho phép rõ ràng.

Clip `evidence/raw-live-preview-anonymous.webm` là cảnh quay trình duyệt thật dài 12,64 giây, không có giọng cá nhân. Clip chỉ thể hiện giao diện đăng nhập/đăng ký trống và bảo vệ route; không chứng minh persistence hay giao dịch. Cần thu giọng cá nhân, quay các bước live còn thiếu, dựng video và kiểm tra file/link cuối cùng.

**Custom SMTP đang tạm dừng theo yêu cầu của bạn.** Không tạo App Password và không chạy công cụ cấu hình SMTP. Email mặc định đã hoạt động cho tài khoản chính thuộc tổ chức; hai tài khoản kiểm thử ngoài tổ chức có giới hạn riêng. Xem báo cáo read-only mới nhất trước khi đề xuất bất kỳ thay đổi nào.
