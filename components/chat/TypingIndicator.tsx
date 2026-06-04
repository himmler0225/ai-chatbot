export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-3 bg-card rounded-lg">
      <span className="text-xs text-muted-foreground mr-1">Đang gõ...</span>
      <div className="typing-indicator">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}
