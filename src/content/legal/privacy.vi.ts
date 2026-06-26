import type { LegalDocument } from './types'

export const privacyVi: LegalDocument = {
  title: 'Chính sách bảo mật',
  lastUpdated: '26/06/2026',
  intro:
    'Chính sách này mô tả cách {{operator}} (“chúng tôi”) thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng ReviewMine AI tại reviewmine.ai và các subdomain liên quan.',
  sections: [
    {
      id: 'controller',
      title: '1. Chủ thể xử lý dữ liệu',
      paragraphs: [
        'ReviewMine AI được vận hành bởi {{operator}} — cá nhân đăng ký và hoạt động tại Việt Nam.',
        'Mọi yêu cầu liên quan đến quyền riêng tư gửi tới: {{email}}.',
      ],
    },
    {
      id: 'collect',
      title: '2. Dữ liệu chúng tôi thu thập',
      paragraphs: ['Chúng tôi chỉ thu thập dữ liệu cần thiết để vận hành dịch vụ miễn phí:'],
      bullets: [
        'Thông tin tài khoản (khi đăng nhập): email, họ tên, ảnh đại diện từ Google hoặc thông tin bạn cung cấp khi đăng ký qua Supabase Auth.',
        'Nội dung chat: câu hỏi, câu trả lời và metadata phiên trò chuyện — chỉ lưu trên máy chủ khi bạn đã đăng nhập.',
        'Khách chưa đăng nhập: có thể dùng thử giới hạn; nội dung không được lưu trên máy chủ của chúng tôi.',
        'Cài đặt cục bộ: ngôn ngữ và giao diện sáng/tối được lưu trong localStorage trên trình duyệt của bạn.',
        'Nhật ký kỹ thuật: địa chỉ IP, loại trình duyệt, thời gian truy cập — do nhà cung cấp hosting/hạ tầng tự động ghi nhận để bảo mật và vận hành.',
      ],
    },
    {
      id: 'use',
      title: '3. Mục đích sử dụng',
      bullets: [
        'Cung cấp và cải thiện dịch vụ chat AI phân tích review sản phẩm.',
        'Lưu và đồng bộ lịch sử hội thoại cho tài khoản đã đăng nhập.',
        'Xác thực danh tính và bảo vệ tài khoản.',
        'Phản hồi yêu cầu hỗ trợ hoặc khiếu nại của bạn.',
        'Tuân thủ nghĩa vụ pháp lý khi có yêu cầu hợp lệ từ cơ quan nhà nước.',
      ],
    },
    {
      id: 'ai',
      title: '4. Xử lý bởi AI và bên thứ ba',
      paragraphs: [
        'Câu hỏi của bạn có thể được gửi tới các nhà cung cấp mô hình ngôn ngữ (ví dụ OpenAI, DeepSeek) để tạo câu trả lời. Chúng tôi không gửi mật khẩu hoặc thông tin thanh toán (dịch vụ hiện miễn phí).',
        'Dữ liệu tài khoản và lịch sử chat được lưu trữ qua Supabase. Đăng nhập Google tuân theo chính sách của Google.',
        'ReviewMine AI tổng hợp nội dung công khai từ YouTube và TikTok; chúng tôi không truy cập tài khoản mạng xã hội cá nhân của bạn.',
        'Tính năng tìm sản phẩm có thể liên kết tới cửa hàng đối tác (Tiki, FPT Shop). Khi bạn rời khỏi ReviewMine AI, chính sách của website đó sẽ áp dụng.',
      ],
    },
    {
      id: 'retention',
      title: '5. Lưu trữ và thời hạn',
      paragraphs: [
        'Lịch sử chat được lưu cho đến khi bạn xóa phiên hoặc xóa tài khoản, trừ khi pháp luật yêu cầu lưu lâu hơn.',
        'Nhật ký kỹ thuật thường được lưu trong thời gian ngắn theo cấu hình hạ tầng.',
      ],
    },
    {
      id: 'rights',
      title: '6. Quyền của bạn',
      bullets: [
        'Yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân.',
        'Xóa lịch sử chat trong ứng dụng hoặc yêu cầu xóa tài khoản qua email liên hệ.',
        'Rút lại sự đồng ý bằng cách ngừng sử dụng dịch vụ và yêu cầu xóa dữ liệu.',
        'Khiếu nại tới cơ quan có thẩm quyền tại Việt Nam nếu bạn cho rằng quyền riêng tư bị vi phạm.',
      ],
    },
    {
      id: 'security',
      title: '7. Bảo mật',
      paragraphs: [
        'Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý (HTTPS, xác thực token, phân quyền truy cập) để bảo vệ dữ liệu. Không hệ thống nào an toàn tuyệt đối; vui lòng bảo mật thông tin đăng nhập của bạn.',
      ],
    },
    {
      id: 'children',
      title: '8. Trẻ em',
      paragraphs: [
        'Dịch vụ không hướng tới người dưới 16 tuổi. Nếu phát hiện đã thu thập dữ liệu trẻ em mà không có sự đồng ý của phụ huynh, chúng tôi sẽ xóa khi được thông báo.',
      ],
    },
    {
      id: 'changes',
      title: '9. Thay đổi chính sách',
      paragraphs: [
        'Chúng tôi có thể cập nhật chính sách này. Phiên bản mới sẽ được đăng tại trang này kèm ngày cập nhật. Việc tiếp tục sử dụng dịch vụ sau khi cập nhật đồng nghĩa bạn chấp nhận thay đổi.',
      ],
    },
    {
      id: 'contact',
      title: '10. Liên hệ',
      paragraphs: ['Mọi câu hỏi về quyền riêng tư, gửi email tới {{email}}.'],
    },
  ],
}
