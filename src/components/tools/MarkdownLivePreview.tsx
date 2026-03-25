'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import 'highlight.js/styles/github-dark.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)

marked.setOptions({ gfm: true, breaks: true })

export interface MarkdownLivePreviewProps {
  initialValue?: string
  placeholder?: string
  className?: string
  isDark?: boolean
  /** 受控模式：传入 value 与 onChange 则完全受控 */
  value?: string
  onChange?: (value: string) => void
}

const DEFAULT_PLACEHOLDER = `# 在这里输入 Markdown

- 支持 **粗体**、*斜体*、\`代码\`
- 列表、引用、表格
- 代码块会实时高亮
`

export default function MarkdownLivePreview({
  initialValue = '',
  placeholder = DEFAULT_PLACEHOLDER,
  className = '',
  isDark = true,
  value: controlledValue,
  onChange: controlledOnChange,
}: MarkdownLivePreviewProps) {
  const isControlled = controlledValue !== undefined && controlledOnChange !== undefined
  const [internalValue, setInternalValue] = useState(initialValue)
  const value = isControlled ? controlledValue : internalValue
  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v)
      controlledOnChange?.(v)
    },
    [isControlled, controlledOnChange]
  )

  const [html, setHtml] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  // Markdown -> HTML
  useEffect(() => {
    const raw = (value || '').trim()
    if (!raw) {
      setHtml('<p class="text-gray-500">预览将在此处显示…</p>')
      return
    }
    const parsed = marked.parse(raw) as string
    setHtml(DOMPurify.sanitize(parsed))
  }, [value])

  // 代码高亮
  useEffect(() => {
    if (!previewRef.current || !html) return
    const blocks = previewRef.current.querySelectorAll('pre code')
    blocks.forEach((el) => {
      const node = el as HTMLElement
      if (node.dataset.hljs === 'yes') return
      try {
        hljs.highlightElement(node)
        node.dataset.hljs = 'yes'
      } catch {
        // ignore
      }
    })
  }, [html])

  const bg = isDark ? 'bg-gray-900' : 'bg-gray-50'
  const border = isDark ? 'border-gray-700' : 'border-gray-200'
  const inputBg = isDark ? 'bg-black/40 text-gray-100' : 'bg-white text-gray-900'
  const previewBg = isDark ? 'bg-black/30' : 'bg-white'
  const previewText = isDark ? '' : 'text-gray-800' // 浅色模式下需要深色文字

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-12rem)] min-h-[420px] ${className}`}>
      <div className={`flex flex-col rounded-xl border ${border} overflow-hidden ${bg}`}>
        <div className={`px-3 py-2 border-b ${border} text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
          Markdown
        </div>
        <textarea
          className={`flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-0 ${inputBg} placeholder:opacity-60`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className={`flex flex-col rounded-xl border ${border} overflow-hidden ${bg}`}>
        <div className={`px-3 py-2 border-b ${border} text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
          实时预览
        </div>
        <div
          ref={previewRef}
          className={`flex-1 overflow-auto p-4 prose prose-sm max-w-none ${previewBg} ${previewText} ${isDark ? 'prose-invert' : ''} markdown-preview`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
