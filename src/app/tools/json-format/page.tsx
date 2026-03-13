'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function JsonFormatPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const formatJson = () => {
    if (!input.trim()) {
      setError(language === 'zh' ? '请输入 JSON 内容' : 'Please enter JSON content')
      setIsValid(false)
      return
    }
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
      setIsValid(true)
    } catch (e: any) {
      setError(e.message)
      setOutput('')
      setIsValid(false)
    }
  }

  const minifyJson = () => {
    if (!input.trim()) {
      setError(language === 'zh' ? '请输入 JSON 内容' : 'Please enter JSON content')
      setIsValid(false)
      return
    }
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
      setIsValid(true)
    } catch (e: any) {
      setError(e.message)
      setOutput('')
      setIsValid(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setIsValid(null)
  }

  const t = {
    zh: { 
      title: 'JSON 格式化工具', 
      desc: '在线 JSON 格式化、压缩、验证',
      inputPlaceholder: '请输入 JSON 内容...',
      format: '格式化',
      minify: '压缩',
      copy: '复制',
      clear: '清空',
      validJson: '✓ 有效的 JSON',
      invalidJson: '✗ 无效的 JSON'
    },
    en: { 
      title: 'JSON Formatter', 
      desc: 'Format, minify and validate JSON online',
      inputPlaceholder: 'Enter JSON content...',
      format: 'Format',
      minify: 'Minify',
      copy: 'Copy',
      clear: 'Clear',
      validJson: '✓ Valid JSON',
      invalidJson: '✗ Invalid JSON'
    }
  }[language]

  const bg = isDark ? 'bg-[#000000]' : 'bg-[#f8f8f8]'
  const inputBg = isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600'
  const hoverColor = isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'
  const btnPrimary = isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-cyan-500/30' : 'bg-blue-500 text-white hover:bg-blue-600'
  const btnSecondary = isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-8`}>
      <div className="max-w-4xl mx-auto">
        <a href="/tools" className={`inline-flex items-center gap-1 text-sm ${textSub} ${hoverColor} mb-4`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'zh' ? '返回工具列表' : 'Back to Tools'}
        </a>
        <h1 className={`text-3xl font-bold ${textMain} mb-2`}>{t.title}</h1>
        <p className={`text-sm ${textSub} mb-8`}>{t.desc}</p>

        <div className="flex gap-3 mb-4">
          <button onClick={formatJson} className={`px-4 py-2 rounded-lg border ${btnPrimary} transition-colors`}>
            {t.format}
          </button>
          <button onClick={minifyJson} className={`px-4 py-2 rounded-lg border ${btnPrimary} transition-colors`}>
            {t.minify}
          </button>
          <button onClick={copyToClipboard} disabled={!output} className={`px-4 py-2 rounded-lg border ${btnSecondary} transition-colors disabled:opacity-50`}>
            {t.copy}
          </button>
          <button onClick={clearAll} className={`px-4 py-2 rounded-lg border ${btnSecondary} transition-colors`}>
            {t.clear}
          </button>
        </div>

        {isValid === true && (
          <div className={`p-3 mb-4 rounded-lg border ${isDark ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-green-100 border-green-300 text-green-700'}`}>
            {t.validJson}
          </div>
        )}

        {isValid === false && error && (
          <div className={`p-3 mb-4 rounded-lg border ${isDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-100 border-red-300 text-red-700'}`}>
            <p className="font-medium">{t.invalidJson}</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`text-sm ${textSub} mb-2`}>Input</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className={`w-full h-96 p-4 rounded-xl border ${inputBg} ${textMain} font-mono text-sm resize-none`}
            />
          </div>
          <div>
            <p className={`text-sm ${textSub} mb-2`}>Output</p>
            <textarea
              value={output}
              readOnly
              placeholder={t.inputPlaceholder}
              className={`w-full h-96 p-4 rounded-xl border ${inputBg} ${textMain} font-mono text-sm resize-none`}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
