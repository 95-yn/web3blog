'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import mammoth from 'mammoth'
import html2pdf from 'html2pdf.js'

export default function WordToPdfPage() {
  const { language, theme, mounted } = useLanguage()
  const isDark = mounted ? theme === 'dark' : true
  const [file, setFile] = useState<File | null>(null)
  const [htmlContent, setHtmlContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.docx')) {
      setError(language === 'zh' ? '请选择 .docx 格式的文件' : 'Please select a .docx file')
      return
    }

    setFile(selectedFile)
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      setHtmlContent(result.value)
    } catch (err: any) {
      setError(language === 'zh' ? `文件解析失败: ${err.message}` : `Failed to parse file: ${err.message}`)
      setHtmlContent('')
    } finally {
      setLoading(false)
    }
  }

  const convertToPdf = async () => {
    if (!contentRef.current) return

    setLoading(true)
    try {
      const opt = {
        margin: 10,
        filename: file?.name.replace('.docx', '.pdf') || 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }
      await html2pdf().set(opt).from(contentRef.current).save()
      setSuccess(true)
    } catch (err: any) {
      setError(language === 'zh' ? `PDF 生成失败: ${err.message}` : `Failed to generate PDF: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setHtmlContent('')
    setError('')
    setSuccess(false)
  }

  const t = {
    zh: { 
      title: 'Word 转 PDF', 
      desc: '将 Word 文档转换为 PDF 文件',
      selectFile: '选择文件',
      dragDrop: '或拖拽文件到此处',
      converting: '转换中...',
      download: '下载 PDF',
      reset: '重新选择',
      supported: '支持 .docx 格式',
      tip: '提示：转换基于客户端，可能会有些许格式差异'
    },
    en: { 
      title: 'Word to PDF', 
      desc: 'Convert Word documents to PDF',
      selectFile: 'Select File',
      dragDrop: 'or drag and drop file here',
      converting: 'Converting...',
      download: 'Download PDF',
      reset: 'Reset',
      supported: 'Supports .docx format',
      tip: 'Note: Conversion is client-side, there may be minor format differences'
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

        {!file && (
          <div className={`border-2 border-dashed rounded-xl p-12 text-center ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <input
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className={`cursor-pointer inline-flex flex-col items-center gap-2`}>
              <svg className={`w-12 h-12 ${textSub}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className={`${textMain}`}>{t.selectFile}</span>
              <span className={`text-sm ${textSub}`}>{t.dragDrop}</span>
              <span className={`text-xs ${textSub}`}>{t.supported}</span>
            </label>
          </div>
        )}

        {loading && (
          <div className={`text-center py-8 ${textMain}`}>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></div>
            <p className="mt-2">{t.converting}</p>
          </div>
        )}

        {error && (
          <div className={`p-4 mb-4 rounded-lg border ${isDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-100 border-red-300 text-red-700'}`}>
            {error}
          </div>
        )}

        {success && (
          <div className={`p-4 mb-4 rounded-lg border ${isDark ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-green-100 border-green-300 text-green-700'}`}>
            {language === 'zh' ? '✓ PDF 下载已开始' : '✓ PDF download started'}
          </div>
        )}

        {htmlContent && !loading && (
          <div className="flex gap-3 mb-4">
            <button onClick={convertToPdf} className={`px-4 py-2 rounded-lg border ${btnPrimary} transition-colors`}>
              {t.download}
            </button>
            <button onClick={reset} className={`px-4 py-2 rounded-lg border ${btnSecondary} transition-colors`}>
              {t.reset}
            </button>
          </div>
        )}

        {htmlContent && (
          <div ref={contentRef} className="pdf-content">
            <div 
              className={`p-8 rounded-xl border ${inputBg}`}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{ 
                maxWidth: '210mm',
                margin: '0 auto',
                minHeight: '297mm'
              }}
            />
          </div>
        )}

        {htmlContent && (
          <p className={`text-xs ${textSub} mt-4 text-center`}>{t.tip}</p>
        )}
      </div>
    </main>
  )
}
