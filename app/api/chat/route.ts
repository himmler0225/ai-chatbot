import { AVAILABLE_TOOLS } from '@/lib/types'

// Mock Vietnamese responses for different types of queries
const mockResponses: Record<string, string[]> = {
  product: [
    'Tôi đã tìm thấy các sản phẩm phù hợp với yêu cầu của bạn. Sản phẩm này có đánh giá 4.8/5 với hơn 1000 reviews từ khách hàng hài lòng.',
    'Sản phẩm được tìm thấy có giá cạnh tranh. So với các sản phẩm tương tự trên thị trường, đây là một lựa chọn tốt với chất lượng đảm bảo.',
    'Tôi đã kiểm tra tính sẵn sàng. Sản phẩm này có sẵn trong kho và có thể được gửi cho bạn trong 2-3 ngày làm việc.',
  ],
  payment: [
    'Chúng tôi hỗ trợ nhiều phương thức thanh toán: thẻ tín dụng, ví điện tử, chuyển khoản ngân hàng và thanh toán khi nhận hàng.',
    'Thanh toán của bạn đã được xử lý thành công. Bạn sẽ nhận được hóa đơn qua email trong vòng 24 giờ.',
    'Tôi có thể giúp bạn với các khoảnh khắc thanh toán hoặc nếu gặp bất kỳ vấn đề nào với giao dịch.',
  ],
  order: [
    'Đơn hàng của bạn hiện đang được chuẩn bị gửi. Bạn sẽ nhận được thông báo cập nhật khi nó được gửi đi.',
    'Tôi đã theo dõi đơn hàng của bạn. Nó hiện ở trung tâm phân phối và dự kiến sẽ đến bạn trong 2 ngày tới.',
    'Đơn hàng đã được giao thành công. Vui lòng kiểm tra sản phẩm và cho chúng tôi biết nếu bạn hài lòng.',
  ],
  general: [
    'Tôi là trợ lý AI của SellMate, chuyên hỗ trợ về thương mại điện tử. Tôi có thể giúp bạn tìm sản phẩm, xử lý thanh toán, theo dõi đơn hàng và nhiều hơn nữa.',
    'Cảm ơn bạn đã liên hệ. Tôi sẽ cố gắng hết sức để giải quyết vấn đề của bạn một cách nhanh chóng và hiệu quả.',
    'Bạn có thể hỏi tôi bất cứ điều gì liên quan đến sản phẩm, giá cả, giao hàng, hoặc bất kỳ dịch vụ khác của chúng tôi.',
  ],
}

function categorizeQuery(message: string): string {
  const lowerMessage = message.toLowerCase()
  if (
    lowerMessage.includes('sản phẩm') ||
    lowerMessage.includes('tìm') ||
    lowerMessage.includes('search')
  ) {
    return 'product'
  }
  if (
    lowerMessage.includes('thanh toán') ||
    lowerMessage.includes('payment') ||
    lowerMessage.includes('tiền')
  ) {
    return 'payment'
  }
  if (
    lowerMessage.includes('đơn hàng') ||
    lowerMessage.includes('order') ||
    lowerMessage.includes('giao')
  ) {
    return 'order'
  }
  return 'general'
}

function getRandomResponse(category: string): string {
  const responses = mockResponses[category] || mockResponses.general
  return responses[Math.floor(Math.random() * responses.length)]
}

function getRandomTools(count: number = 2) {
  const shuffled = [...AVAILABLE_TOOLS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Invalid message' },
        { status: 400 }
      )
    }

    // Simulate API delay (1-2 seconds)
    const delay = Math.random() * 1000 + 1000
    await sleep(delay)

    // Categorize query and get response
    const category = categorizeQuery(message)
    const responseText = getRandomResponse(category)

    // Get 1-3 random tools
    const toolCount = Math.floor(Math.random() * 3) + 1
    const usedTools = getRandomTools(toolCount)

    return Response.json({
      message: responseText,
      usedTools,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
