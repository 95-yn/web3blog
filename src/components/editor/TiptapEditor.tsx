'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { 
  Bold, Italic, Strikethrough, Code, List, ListOrdered, 
  Quote, Undo, Redo, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, ImageIcon, Link as LinkIcon,
  Code2
} from 'lucide-react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function TiptapEditor({ content, onChange, placeholder = '开始写作...' }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3 tiptap-editor',
        spellcheck: 'false',
      },
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt('输入链接地址:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('输入图片地址:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run()
  }

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-900">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-gray-800">
        {/* 标题 */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="标题 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="标题 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="标题 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* 文本样式 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('bold') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="加粗"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('italic') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="斜体"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('strike') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="删除线"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('code') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="行内代码"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* 列表 */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="无序列表"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="有序列表"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('blockquote') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="引用"
        >
          <Quote className="w-4 h-4" />
        </button>

        {/* 代码块按钮 */}
        <button
          onClick={addCodeBlock}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('codeBlock') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="代码块"
        >
          <Code2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* 对齐 */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="左对齐"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="居中对齐"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="右对齐"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* 插入 */}
        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('link') ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          title="插入链接"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
          title="插入图片"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* 撤销/重做 */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="撤销"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="重做"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* 编辑器内容 */}
      <EditorContent editor={editor} />
    </div>
  )
}
