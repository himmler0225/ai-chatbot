export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  usedTools?: Tool[]
}

export interface Tool {
  name: string
  description: string
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export const AVAILABLE_TOOLS: Tool[] = [
  {
    name: 'product_search',
    description: 'Tìm kiếm sản phẩm trên các nền tảng e-commerce',
  },
  {
    name: 'price_comparison',
    description: 'So sánh giá từ nhiều nguồn khác nhau',
  },
  {
    name: 'payment_processor',
    description: 'Xử lý các giao dịch thanh toán',
  },
  {
    name: 'order_tracking',
    description: 'Theo dõi trạng thái đơn hàng',
  },
  {
    name: 'inventory_check',
    description: 'Kiểm tra tính sẵn sàng của sản phẩm',
  },
  {
    name: 'customer_support',
    description: 'Hỗ trợ khách hàng và giải quyết vấn đề',
  },
  {
    name: 'recommendation_engine',
    description: 'Đề xuất sản phẩm dựa trên sở thích người dùng',
  },
]
