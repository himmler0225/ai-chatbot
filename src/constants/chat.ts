export const APP_NAME = 'ReviewMine AI'
export const APP_TAGLINE_VI = 'Tóm gọn đánh giá sản phẩm từ YouTube và TikTok'
export const APP_TAGLINE_EN = 'Summarize product reviews from YouTube and TikTok'

export const TOOL_LABELS: Record<string, { vi: string; en: string; icon: string }> = {
  youtube_search: { vi: 'Đang tìm kiếm trên YouTube...', en: 'Searching YouTube...', icon: '🔍' },
  youtube_get_comments_batch: {
    vi: 'Đang lấy bình luận nhiều video YouTube...',
    en: 'Fetching YouTube comments (batch)...',
    icon: '💬',
  },
  youtube_get_comments: {
    vi: 'Đang lấy bình luận YouTube...',
    en: 'Fetching YouTube comments...',
    icon: '💬',
  },
  youtube_get_transcript: {
    vi: 'Đang lấy transcript YouTube...',
    en: 'Fetching YouTube transcript...',
    icon: '📝',
  },
  youtube_get_transcript_batch: {
    vi: 'Đang lấy transcript nhiều video...',
    en: 'Fetching YouTube transcripts...',
    icon: '📝',
  },
  tiktok_transcript: {
    vi: 'Đang lấy transcript TikTok...',
    en: 'Fetching TikTok transcript...',
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
  youtube_get_shorts: { vi: 'Đang lấy YouTube Shorts...', en: 'Loading Shorts...', icon: '⚡' },
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
  tiktok_search: { vi: 'Đang tìm kiếm trên TikTok...', en: 'Searching TikTok...', icon: '🎵' },
  tiktok_comments: {
    vi: 'Đang lấy bình luận TikTok...',
    en: 'Fetching TikTok comments...',
    icon: '💬',
  },
  tiktok_video_info: {
    vi: 'Đang xem thông tin video TikTok...',
    en: 'Loading TikTok video...',
    icon: '🎵',
  },
  tiktok_profile: { vi: 'Đang xem profile TikTok...', en: 'Loading TikTok profile...', icon: '👤' },
  extract_id_from_url: { vi: 'Đang xử lý URL...', en: 'Processing URL...', icon: '🔗' },
  search_product_summary: { vi: 'Đang tìm tổng quan review...', en: 'Searching review summary...', icon: '📋' },
  search_aspect_evidence: { vi: 'Đang tìm chi tiết review...', en: 'Searching review details...', icon: '🔎' },
  get_raw_reviews: { vi: 'Đang lấy review gốc...', en: 'Fetching raw reviews...', icon: '📝' },
}
