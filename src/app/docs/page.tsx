'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, BookOpen, Code, FileText, ChevronRight, Search, ExternalLink, ChevronDown, Hash } from 'lucide-react'

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')
  
  return (
    <div className="min-h-screen bg-[#0c0c1d] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a1a]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-orange-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  CourseAI
                </h1>
              </Link>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/features" className="text-sm text-gray-300 hover:text-white">Features</Link>
              <Link href="/use-cases" className="text-sm text-gray-300 hover:text-white">Use Cases</Link>
              <Link href="/docs" className="text-sm text-orange-400 border-b-2 border-orange-500">Docs</Link>
              <Link href="/pricing" className="text-sm text-gray-300 hover:text-white">Pricing</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm text-gray-300 hover:text-white">Sign in</Link>
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Documentation Header */}
        <div className="mb-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Everything you need to know about using CourseAI to create and manage educational content.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a103a]/50 border border-purple-900/50 rounded-lg py-3 pl-12 pr-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Documentation Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a103a]/30 rounded-xl p-6 shadow-lg border border-purple-900/30 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Documentation</h3>
              
              <nav className="space-y-1">
                <div className="mb-4">
                  <button 
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md ${activeCategory === 'getting-started' ? 'bg-purple-900/50 text-white' : 'text-gray-300 hover:bg-[#1a103a]/70'}`}
                    onClick={() => setActiveCategory('getting-started')}
                  >
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Getting Started
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeCategory === 'getting-started' ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {activeCategory === 'getting-started' && (
                    <div className="mt-1 ml-6 space-y-1">
                      <Link href="/docs/introduction" className="block px-3 py-2 text-sm text-orange-400 rounded-md">
                        Introduction
                      </Link>
                      <Link href="/docs/installation" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        Installation
                      </Link>
                      <Link href="/docs/quick-start" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        Quick Start Guide
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <button 
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md ${activeCategory === 'features' ? 'bg-purple-900/50 text-white' : 'text-gray-300 hover:bg-[#1a103a]/70'}`}
                    onClick={() => setActiveCategory('features')}
                  >
                    <span className="flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Features
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeCategory === 'features' ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {activeCategory === 'features' && (
                    <div className="mt-1 ml-6 space-y-1">
                      <Link href="/docs/course-creation" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        Course Creation
                      </Link>
                      <Link href="/docs/markdown-support" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        Markdown Support
                      </Link>
                      <Link href="/docs/media-integration" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        Media Integration
                      </Link>
                      <Link href="/docs/folder-organization" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        Folder Organization
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <button 
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-md ${activeCategory === 'api' ? 'bg-purple-900/50 text-white' : 'text-gray-300 hover:bg-[#1a103a]/70'}`}
                    onClick={() => setActiveCategory('api')}
                  >
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      API Reference
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeCategory === 'api' ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {activeCategory === 'api' && (
                    <div className="mt-1 ml-6 space-y-1">
                      <Link href="/docs/api-overview" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        API Overview
                      </Link>
                      <Link href="/docs/authentication" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        Authentication
                      </Link>
                      <Link href="/docs/endpoints" className="block px-3 py-2 text-sm text-gray-300 hover:text-white rounded-md">
                        Endpoints
                      </Link>
                    </div>
                  )}
                </div>
                
                <Link 
                  href="/docs/faq" 
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1a103a]/70 hover:text-white rounded-md"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  FAQ
                </Link>
                
                <Link 
                  href="/docs/troubleshooting" 
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-[#1a103a]/70 hover:text-white rounded-md"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Troubleshooting
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#1a103a]/30 rounded-xl p-8 shadow-lg border border-purple-900/30">
              <div className="prose prose-invert prose-lg max-w-none">
                <h1>Introduction to CourseAI</h1>
                
                <div className="bg-[#0c0c1d]/80 border border-purple-900/30 rounded-lg p-4 my-6">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-orange-400">Note:</strong> This documentation is for CourseAI version 2.0. 
                    If you're using an earlier version, some features may not be available.
                  </p>
                </div>
                
                <p>
                  CourseAI is a powerful platform that leverages artificial intelligence to streamline the creation of educational content.
                  Whether you're a teacher, professor, corporate trainer, or content creator, CourseAI can help you generate comprehensive,
                  media-rich courses on any topic in minutes.
                </p>
                
                <h2>Key Features</h2>
                
                <ul>
                  <li>
                    <strong>AI-Powered Content Generation</strong> - Create comprehensive, structured courses on any topic in minutes
                  </li>
                  <li>
                    <strong>Rich Media Integration</strong> - Automatically enhance your courses with relevant images and videos
                  </li>
                  <li>
                    <strong>Advanced Markdown Support</strong> - Create beautifully formatted content with enhanced markdown rendering
                  </li>
                  <li>
                    <strong>Folder Organization</strong> - Keep your educational content neatly organized by topic
                  </li>
                  <li>
                    <strong>Self-Hosting Options</strong> - Deploy CourseAI on your own infrastructure for complete control
                  </li>
                </ul>
                
                <h2>Getting Started</h2>
                
                <p>
                  To get started with CourseAI, you'll need to:
                </p>
                
                <ol>
                  <li>Create an account or sign in</li>
                  <li>Navigate to the dashboard</li>
                  <li>Enter a course topic</li>
                  <li>Configure your media preferences</li>
                  <li>Click "Create Course"</li>
                </ol>
                
                <p>
                  CourseAI will then generate a complete course structure, including modules, content, and media.
                  You can preview and edit the generated content before finalizing your course.
                </p>
                
                <div className="bg-[#0c0c1d]/80 border border-purple-900/30 rounded-lg p-6 my-8">
                  <h3 className="text-xl font-bold text-white mb-4">Ready to create your first course?</h3>
                  <p className="text-gray-300 mb-4">
                    Follow our quick start guide to create your first AI-generated course in minutes.
                  </p>
                  <Link 
                    href="/docs/quick-start" 
                    className="inline-flex items-center text-orange-400 hover:text-orange-300"
                  >
                    Read the Quick Start Guide
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                
                <h2>System Requirements</h2>
                
                <p>
                  CourseAI is a web-based platform that works in modern browsers. For optimal performance, we recommend:
                </p>
                
                <ul>
                  <li>Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+</li>
                  <li>Stable internet connection</li>
                  <li>Minimum 4GB RAM</li>
                  <li>1280×720 screen resolution or higher</li>
                </ul>
                
                <h2>Next Steps</h2>
                
                <p>
                  Now that you understand the basics of CourseAI, you might want to explore:
                </p>
                
                <ul>
                  <li>
                    <Link href="/docs/installation" className="text-orange-400 hover:text-orange-300">
                      Installation Guide
                    </Link> - For self-hosted deployments
                  </li>
                  <li>
                    <Link href="/docs/course-creation" className="text-orange-400 hover:text-orange-300">
                      Course Creation
                    </Link> - Learn about the course generation process
                  </li>
                  <li>
                    <Link href="/docs/markdown-support" className="text-orange-400 hover:text-orange-300">
                      Markdown Support
                    </Link> - Discover advanced formatting options
                  </li>
                  <li>
                    <Link href="/docs/api-overview" className="text-orange-400 hover:text-orange-300">
                      API Reference
                    </Link> - Integrate CourseAI with your systems
                  </li>
                </ul>
                
                <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-800">
                  <div></div>
                  <Link 
                    href="/docs/installation" 
                    className="flex items-center text-orange-400 hover:text-orange-300"
                  >
                    Next: Installation
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0a0a1a] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                CourseAI
              </span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} CourseAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}