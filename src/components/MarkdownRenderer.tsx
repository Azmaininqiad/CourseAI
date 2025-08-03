'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import YouTubeEmbed from './YouTubeEmbed'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Process content to handle YouTube links and remove markdown prefix
  const processContent = (content: string): string => {
    // Remove ```markdown prefix and suffix if present
    let processedContent = content
    if (processedContent.startsWith('```markdown')) {
      processedContent = processedContent.replace(/^```markdown\n/, '').replace(/\n```$/, '')
    }
    
    // Remove any triple backticks at the beginning or end of the content
    processedContent = processedContent.replace(/^```\s*\n/, '').replace(/\n```\s*$/, '')
    
    // Handle YouTube links in various formats
    
    // Format 1: Markdown links with YouTube URLs
    const markdownYoutubeRegex = /\[([^\]]+)\]\((https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})([^\)]*)|https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})([^\)]*))\)/g
    
    // Format 2: Raw YouTube URLs
    const rawYoutubeRegex = /(https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})([^\s]*)|https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})([^\s]*))/g
    
    // Process markdown YouTube links
    processedContent = processedContent.replace(markdownYoutubeRegex, (match, title, url) => {
      const videoId = getYouTubeId(url)
      if (videoId) {
        return `<div class="youtube-embed" data-title="${title}" data-video-id="${videoId}"></div>`
      }
      return match
    })
    
    // Process raw YouTube URLs (but not those already in markdown links)
    let lastIndex = 0
    let result = ''
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let markdownMatch
    
    // Collect all markdown link ranges to avoid processing URLs inside them
    const markdownLinkRanges: [number, number][] = []
    while ((markdownMatch = markdownLinkRegex.exec(processedContent)) !== null) {
      markdownLinkRanges.push([markdownMatch.index, markdownMatch.index + markdownMatch[0].length])
    }
    
    // Process raw YouTube URLs, skipping those in markdown links
    let rawMatch
    while ((rawMatch = rawYoutubeRegex.exec(processedContent)) !== null) {
      // Check if this URL is inside a markdown link
      const isInMarkdownLink = markdownLinkRanges.some(
        ([start, end]) => rawMatch.index >= start && rawMatch.index < end
      )
      
      if (!isInMarkdownLink) {
        const videoId = getYouTubeId(rawMatch[0])
        if (videoId) {
          result += processedContent.substring(lastIndex, rawMatch.index)
          result += `<div class="youtube-embed" data-title="YouTube Video" data-video-id="${videoId}"></div>`
          lastIndex = rawMatch.index + rawMatch[0].length
        }
      }
    }
    
    // Add the remaining content
    if (result) {
      result += processedContent.substring(lastIndex)
      return result
    }
    
    return processedContent
  }

  const processedContent = processContent(content)

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-700 text-gray-100" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-100" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-200" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-200" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-3 leading-relaxed text-gray-300" {...props} />
          ),
          a: ({ node, href, ...props }) => {
            // Check if this is a YouTube link
            if (href && (href.includes('youtube.com/watch') || href.includes('youtu.be/'))) {
              const videoId = getYouTubeId(href)
              if (videoId) {
                const title = typeof props.children?.[0] === 'string' ? props.children[0] : 'YouTube Video'
                return <YouTubeEmbed videoId={videoId} title={title} />
              }
            }
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:underline"
                {...props}
              />
            )
          },
          img: ({ node, src, alt, ...props }) => {
            // Fix hydration error by not nesting p inside p
            return (
              <span className="block my-4">
                <img 
                  src={src} 
                  alt={alt || ''} 
                  className="max-w-full h-auto rounded-lg border border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-200"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                  {...props}
                />
                {alt && <span className="block text-sm text-gray-400 mt-1 text-center">{alt}</span>}
              </span>
            )
          },
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-4 space-y-2 text-gray-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-4 space-y-2 text-gray-300" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 text-gray-300" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 py-1 my-4 italic bg-gray-800/50 rounded text-gray-300" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-200" {...props}>
                {children}
              </code>
            )
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-700 border border-gray-700 text-gray-300" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-800" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-gray-700 bg-gray-900/50" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-gray-800" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 text-sm text-gray-300" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-t border-gray-700" {...props} />
          ),
          // Handle custom YouTube embeds
          div: ({ node, className, ...props }: any) => {
            if (className === 'youtube-embed') {
              const videoId = node?.properties?.['data-video-id'] as string
              const title = node?.properties?.['data-title'] as string
              if (videoId) {
                return <YouTubeEmbed videoId={videoId} title={title} />
              }
            }
            return <div className={className} {...props} />
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}