export const APP_NAME = 'KiraAI'
export const APP_TAGLINE_VI = 'Trợ lý review phim — tổng hợp ý kiến người xem'
export const APP_TAGLINE_EN = 'Movie review assistant — aggregates viewer insights'

export const TOOL_LABELS: Record<string, { vi: string; en: string; icon: string }> = {
  youtube_search: { vi: 'Đang tìm nội dung liên quan...', en: 'Searching related content...', icon: '🔍' },
  youtube_get_comments_batch: {
    vi: 'Đang thu thập bình luận...',
    en: 'Collecting comments...',
    icon: '💬',
  },
  youtube_get_comments: {
    vi: 'Đang thu thập bình luận...',
    en: 'Collecting comments...',
    icon: '💬',
  },
  youtube_get_transcript: {
    vi: 'Đang đọc nội dung video...',
    en: 'Reading video content...',
    icon: '📝',
  },
  youtube_get_transcript_batch: {
    vi: 'Đang đọc nội dung nhiều video...',
    en: 'Reading video content...',
    icon: '📝',
  },
  tiktok_transcript: {
    vi: 'Đang đọc nội dung video...',
    en: 'Reading video content...',
    icon: '📝',
  },
  youtube_get_detail: {
    vi: 'Đang xem chi tiết video...',
    en: 'Loading video details...',
    icon: '▶️',
  },
  youtube_get_channel_info: {
    vi: 'Đang xem thông tin kênh...',
    en: 'Loading channel info...',
    icon: '📺',
  },
  youtube_get_channel_videos: {
    vi: 'Đang lấy video của kênh...',
    en: 'Fetching channel videos...',
    icon: '📺',
  },
  youtube_get_by_topic: {
    vi: 'Đang lấy video theo chủ đề...',
    en: 'Browsing by topic...',
    icon: '🏷️',
  },
  youtube_get_shorts: { vi: 'Đang lấy video ngắn...', en: 'Loading short videos...', icon: '⚡' },
  youtube_get_live: { vi: 'Đang tìm video đang live...', en: 'Finding live videos...', icon: '🔴' },
  youtube_get_by_region: {
    vi: 'Đang tìm video theo khu vực...',
    en: 'Searching by region...',
    icon: '🌏',
  },
  youtube_get_channel_playlists: {
    vi: 'Đang lấy playlist của kênh...',
    en: 'Loading playlists...',
    icon: '📋',
  },
  youtube_get_playlist_videos: {
    vi: 'Đang lấy video từ playlist...',
    en: 'Loading playlist videos...',
    icon: '📋',
  },
  tiktok_search: { vi: 'Đang tìm nội dung liên quan...', en: 'Searching related content...', icon: '🎵' },
  tiktok_comments: {
    vi: 'Đang thu thập bình luận...',
    en: 'Collecting comments...',
    icon: '💬',
  },
  tiktok_video_info: {
    vi: 'Đang xem thông tin video...',
    en: 'Loading video details...',
    icon: '🎵',
  },
  tiktok_profile: { vi: 'Đang xem hồ sơ người đăng...', en: 'Loading creator profile...', icon: '👤' },
  extract_id_from_url: { vi: 'Đang xử lý URL...', en: 'Processing URL...', icon: '🔗' },
  search_product_summary: { vi: 'Đang tìm tổng quan review...', en: 'Searching review summary...', icon: '📋' },
  search_aspect_evidence: { vi: 'Đang tìm chi tiết review...', en: 'Searching review details...', icon: '🔎' },
  get_raw_reviews: { vi: 'Đang lấy review gốc...', en: 'Fetching raw reviews...', icon: '📝' },
}
