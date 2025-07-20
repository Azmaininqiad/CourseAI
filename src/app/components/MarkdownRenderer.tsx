import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-6 text-white bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-8 mb-5 text-blue-300 border-b border-blue-500/30 pb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-medium mt-6 mb-4 text-purple-300">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-medium mt-5 mb-3 text-indigo-300">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-medium mt-4 mb-3 text-blue-400">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-medium mt-4 mb-2 text-purple-400">
              {children}
            </h6>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 text-gray-300 leading-relaxed text-base">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="mb-4 space-y-2 text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-2 text-gray-300 list-decimal list-inside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300 transition-all duration-200 font-medium"
            >
              {children}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ),
          
          // Images
          img: ({ src, alt }) => (
            <div className="my-8">
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-xl border border-gray-700 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              {alt && (
                <p className="text-center text-sm text-gray-500 mt-3 italic">
                  {alt}
                </p>
              )}
            </div>
          ),
          
          // Code blocks
          code: ({ inline, className, children }) => {
            if (inline) {
              return (
                <code className="bg-gray-800/60 text-blue-300 px-2 py-1 rounded-md text-sm font-mono border border-gray-700">
                  {children}
                </code>
              )
            }
            return (
              <div className="my-6">
                <pre className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 overflow-x-auto backdrop-blur-sm">
                  <code className={`text-sm font-mono ${className || ''}`}>
                    {children}
                  </code>
                </pre>
              </div>
            )
          },
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-500/10 pl-6 py-4 my-6 rounded-r-lg backdrop-blur-sm">
              <div className="text-blue-100 italic">
                {children}
              </div>
            </blockquote>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto">
              <table className="w-full border-collapse bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-blue-600/20 to-purple-600/20">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-6 py-4 text-left text-sm font-semibold text-white border-b border-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 text-sm text-gray-300 border-b border-gray-800">
              {children}
            </td>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          ),
          
          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-bold text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-blue-300">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}