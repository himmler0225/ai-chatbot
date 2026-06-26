import type { LegalDocument } from './types'

export const termsVi: LegalDocument = {
  title: 'Điều khoản dịch vụ',
  lastUpdated: '26/06/2026',
  intro:
    'Bằng việc truy cập hoặc sử dụng ReviewMine AI, bạn đồng ý với các điều khoản dưới đây giữa bạn và {{operator}}.',
  sections: [
    {
      id: 'service',
      title: '1. Dịch vụ',
      paragraphs: [
        'ReviewMine AI là công cụ trò chuyện AI giúp tổng hợp và phân tích đánh giá sản phẩm từ nguồn công khai (YouTube, TikTok) và hỗ trợ tìm sản phẩm qua liên kết đối tác. Dịch vụ hiện được cung cấp miễn phí; chúng tôi có thể thay đổi tính năng hoặc giới hạn sử dụng mà không cần thông báo trước.',
      ],
    },
    {
      id: 'account',
      title: '2. Tài khoản',
      bullets: [
        'Bạn có thể dùng thử với giới hạn khi chưa đăng nhập.',
        'Đăng nhập qua Google hoặc email/mật khẩu để lưu lịch sử chat.',
        'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động dưới tài khoản của mình.',
        'Thông tin cung cấp phải chính xác và hợp pháp.',
      ],
    },
    {
      id: 'acceptable',
      title: '3. Sử dụng chấp nhận được',
      paragraphs: ['Bạn cam kết không:'],
      bullets: [
        'Dùng dịch vụ cho mục đích bất hợp pháp, lừa đảo, quấy rối hoặc phát tán malware.',
        'Cố gắng truy cập trái phép hệ thống, API hoặc dữ liệu người dùng khác.',
        'Gửi nội dung vi phạm bản quyền, xúc phạm hoặc trái với pháp luật Việt Nam.',
        'Lạm dụng, spam hoặc tự động hóa truy cập vượt giới hạn hợp lý.',
      ],
    },
    {
      id: 'ai-disclaimer',
      title: '4. Tuyên bố về AI',
      paragraphs: [
        'Câu trả lời do AI tạo ra có thể sai, không đầy đủ hoặc lỗi thời. ReviewMine AI không thay thế tư vấn chuyên môn, kỹ thuật, pháp lý hay tài chính.',
        'Quyết định mua hàng là trách nhiệm của bạn. Hãy kiểm tra thông tin quan trọng từ nguồn chính thức trước khi quyết định.',
      ],
    },
    {
      id: 'third-party',
      title: '5. Nội dung bên thứ ba',
      paragraphs: [
        'Review, video và dữ liệu sản phẩm thuộc về chủ sở hữu tương ứng (YouTube, TikTok, nhà bán lẻ, người dùng). Chúng tôi hiển thị hoặc tổng hợp theo giấy phép và điều khoản của từng nền tảng.',
        'Liên kết tới website bên thứ ba không đồng nghĩa chúng tôi bảo đảm nội dung hay giao dịch trên website đó.',
      ],
    },
    {
      id: 'ip',
      title: '6. Sở hữu trí tuệ',
      paragraphs: [
        'Thương hiệu, giao diện và mã nguồn ReviewMine AI thuộc quyền của {{operator}}, trừ nội dung bên thứ ba. Bạn không được sao chép, reverse-engineer hoặc khai thác thương mại dịch vụ mà không có sự cho phép bằng văn bản.',
      ],
    },
    {
      id: 'availability',
      title: '7. Tính khả dụng',
      paragraphs: [
        'Dịch vụ được cung cấp “nguyên trạng” (as is). Chúng tôi không bảo đảm hoạt động liên tục, không lỗi hoặc phù hợp mọi mục đích. Bảo trì, nâng cấp hoặc sự cố có thể gây gián đoạn tạm thời.',
      ],
    },
    {
      id: 'liability',
      title: '8. Giới hạn trách nhiệm',
      paragraphs: [
        'Trong phạm vi pháp luật Việt Nam cho phép, {{operator}} không chịu trách nhiệm về thiệt hại gián tiếp, mất lợi nhuận, mất dữ liệu hoặc quyết định mua hàng dựa trên nội dung AI. Tổng trách nhiệm (nếu có) không vượt quá số tiền bạn đã trả cho dịch vụ trong 12 tháng gần nhất — hiện tại là 0 VND vì dịch vụ miễn phí.',
      ],
    },
    {
      id: 'termination',
      title: '9. Chấm dứt',
      paragraphs: [
        'Bạn có thể ngừng sử dụng bất cứ lúc nào. Chúng tôi có thể tạm ngưng hoặc chấm dứt quyền truy cập nếu bạn vi phạm điều khoản hoặc vì lý do vận hành, bảo mật.',
      ],
    },
    {
      id: 'law',
      title: '10. Luật áp dụng',
      paragraphs: [
        'Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp ưu tiên giải quyết thương lượng; nếu không thành, thuộc thẩm quyền tòa án Việt Nam theo quy định pháp luật.',
      ],
    },
    {
      id: 'changes',
      title: '11. Thay đổi điều khoản',
      paragraphs: [
        'Chúng tôi có thể sửa điều khoản và đăng phiên bản mới tại trang này. Ngày cập nhật sẽ được ghi rõ. Việc tiếp tục sử dụng sau khi thay đổi có hiệu lực đồng nghĩa bạn chấp nhận.',
      ],
    },
    {
      id: 'contact',
      title: '12. Liên hệ',
      paragraphs: ['Câu hỏi về điều khoản: {{email}}.'],
    },
  ],
}
