'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { Markdown } from 'tiptap-markdown'
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Flex, Tooltip } from 'antd'
import { useAdminColors, type AdminColors } from '@/constants/admin-theme'
import { CHAT_SHELL } from '@/constants/chat-shell-theme'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}

function ToolbarBtn({
  active,
  title,
  onClick,
  children,
  c,
}: {
  active?: boolean
  title: string
  onClick: () => void
  children: React.ReactNode
  c: AdminColors
}) {
  return (
    <Tooltip title={title}>
      <Button
        type="text"
        size="small"
        onClick={onClick}
        className="!min-w-[32px]"
        style={{
          color: active ? c.accent : c.textMuted,
          background: active ? c.accentSoft : 'transparent',
        }}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

export function PromptRichEditor({ value, onChange, placeholder, minHeight = 280 }: Props) {
  const c = useAdminColors()

  const extensions = useMemo(
    () => [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    [placeholder],
  )

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value,
    editorProps: {
      attributes: {
        class: 'prompt-rich-editor__content outline-none',
      },
    },
    onUpdate: ({ editor: ed }) => {
      const md = (ed.storage as { markdown?: { getMarkdown: () => string } }).markdown?.getMarkdown()
      onChange(md ?? ed.getText())
    },
  })

  useEffect(() => {
    if (!editor) return
    const current =
      (editor.storage as { markdown?: { getMarkdown: () => string } }).markdown?.getMarkdown() ?? ''
    if (value !== current) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const run = useCallback(
    (fn: () => void) => () => {
      fn()
      editor?.chain().focus().run()
    },
    [editor],
  )

  if (!editor) return null

  return (
    <div
      className="prompt-rich-editor overflow-hidden"
      style={{ border: `1px solid ${c.border}`, background: c.cardBg, borderRadius: CHAT_SHELL.radius }}
    >
      <Flex
        wrap="wrap"
        gap={2}
        align="center"
        className="px-2 py-1.5"
        style={{ borderBottom: `1px solid ${c.border}`, background: c.borderLight }}
      >
        <ToolbarBtn
          c={c}
          title="Bold"
          active={editor.isActive('bold')}
          onClick={run(() => editor.chain().focus().toggleBold().run())}
        >
          <BoldOutlined />
        </ToolbarBtn>
        <ToolbarBtn
          c={c}
          title="Italic"
          active={editor.isActive('italic')}
          onClick={run(() => editor.chain().focus().toggleItalic().run())}
        >
          <ItalicOutlined />
        </ToolbarBtn>
        <ToolbarBtn
          c={c}
          title="Underline"
          active={editor.isActive('underline')}
          onClick={run(() => editor.chain().focus().toggleUnderline().run())}
        >
          <UnderlineOutlined />
        </ToolbarBtn>
        <ToolbarBtn
          c={c}
          title="Strikethrough"
          active={editor.isActive('strike')}
          onClick={run(() => editor.chain().focus().toggleStrike().run())}
        >
          <StrikethroughOutlined />
        </ToolbarBtn>
        <span className="w-px h-5 mx-1" style={{ background: c.border }} />
        <ToolbarBtn
          c={c}
          title="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={run(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
        >
          <span className="text-xs font-bold">H1</span>
        </ToolbarBtn>
        <ToolbarBtn
          c={c}
          title="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarBtn>
        <span className="w-px h-5 mx-1" style={{ background: c.border }} />
        <ToolbarBtn
          c={c}
          title="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={run(() => editor.chain().focus().toggleBulletList().run())}
        >
          <UnorderedListOutlined />
        </ToolbarBtn>
        <ToolbarBtn
          c={c}
          title="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={run(() => editor.chain().focus().toggleOrderedList().run())}
        >
          <OrderedListOutlined />
        </ToolbarBtn>
        <span className="w-px h-5 mx-1" style={{ background: c.border }} />
        <ToolbarBtn
          c={c}
          title="Align left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={run(() => editor.chain().focus().setTextAlign('left').run())}
        >
          <AlignLeftOutlined />
        </ToolbarBtn>
        <ToolbarBtn
          c={c}
          title="Align center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={run(() => editor.chain().focus().setTextAlign('center').run())}
        >
          <AlignCenterOutlined />
        </ToolbarBtn>
        <ToolbarBtn
          c={c}
          title="Align right"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={run(() => editor.chain().focus().setTextAlign('right').run())}
        >
          <AlignRightOutlined />
        </ToolbarBtn>
      </Flex>
      <div style={{ minHeight, padding: '16px 20px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
