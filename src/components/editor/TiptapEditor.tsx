'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const ByteMdEditor: any = dynamic(async () => {
  const mod = await import('bytemd')
  // bytemd 的类型在 React 19 下可能不兼容，这里用 any 兜底
  return mod.Editor as any
}, { ssr: false })

export default function TiptapEditor({ content, onChange, placeholder = '开始写作...' }: TiptapEditorProps) {
  const plugins = useMemo(() => [gfm(), highlight()], [])

  return (
    <div className="min-h-[420px]">
      <ByteMdEditor
        value={content}
        plugins={plugins}
        placeholder={placeholder}
        onChange={(v: string) => onChange(v)}
      />
    </div>
  )
}
