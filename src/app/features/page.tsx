'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Brain, Layers, Rocket, ChevronRight, BookOpen, Code, Zap, Users, CheckCircle, Lightbulb, Database, Shield, Workflow } from 'lucide-react'

export default function FeaturesPage() {
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
              <Link href="/features" className="text-sm text-orange-400 border-b-2 border-orange-500">Features</Link>
              <Link href="/use-cases" className="text-sm text-gray-300 hover:text-white">Use Cases</Link>
              <Link href="/docs" className="text-sm text-gray-300 hover:text-white">Docs</Link>
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

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c1d] via-[#1a103a] to-[#0c0c1d] opacity-90"></div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                CourseAI combines cutting-edge AI technology with intuitive design to revolutionize 
                how educational content is created, organized, and delivered.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                className="bg-[#1a103a]/50 rounded-xl p-8 border border-purple-900/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI-Powered Content Generation
                </h3>
                <p className="text-gray-300 mb-6">
                  Create comprehensive, structured courses on any topic in minutes. 
                  Our advanced AI understands context, builds logical progression, and ensures educational value.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Customizable depth and complexity</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Fact-checked content</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Curriculum-aligned options</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                className="bg-[#1a103a]/50 rounded-xl p-8 border border-purple-900/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Rich Media Integration
                </h3>
                <p className="text-gray-300 mb-6">
                  Automatically enhance your courses with relevant images, videos, and interactive elements.
                  Engage learners with visual content that reinforces key concepts.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>YouTube video embedding</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Responsive image galleries</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Interactive diagrams</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                className="bg-[#1a103a]/50 rounded-xl p-8 border border-purple-900/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6">
                  <Workflow className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Organized Course Structure
                </h3>
                <p className="text-gray-300 mb-6">
                  Keep your educational content neatly organized with our intuitive folder system.
                  Group related courses by topic for easy navigation and management.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Topic-based organization</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Intuitive navigation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Searchable content</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div 
                className="bg-[#1a103a]/50 rounded-xl p-8 border border-purple-900/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Advanced Markdown Support
                </h3>
                <p className="text-gray-300 mb-6">
                  Create beautifully formatted content with our enhanced markdown rendering.
                  Support for code blocks, tables, and complex formatting makes technical content shine.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Syntax highlighting</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Mathematical equations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Responsive tables</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature 5 */}
              <motion.div 
                className="bg-[#1a103a]/50 rounded-xl p-8 border border-purple-900/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Self-Hosting Options
                </h3>
                <p className="text-gray-300 mb-6">
                  Deploy CourseAI on your own infrastructure for complete control over your data.
                  Perfect for educational institutions with strict privacy requirements.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Docker deployment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Local AI model support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Enterprise security</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature 6 */}
              <motion.div 
                className="bg-[#1a103a]/50 rounded-xl p-8 border border-purple-900/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  API Integration
                </h3>
                <p className="text-gray-300 mb-6">
                  Connect CourseAI with your existing systems through our comprehensive API.
                  Seamlessly integrate with LMS platforms, content management systems, and more.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>RESTful API endpoints</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Webhook support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Custom integrations</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0c0c1d] relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent opacity-70"></div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to transform your educational content?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Join thousands of educators and content creators who are already using CourseAI
                to create engaging, comprehensive courses in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/dashboard" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-8 rounded-lg font-medium shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center group"
                >
                  Get started for free
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <Link 
                  href="/demo" 
                  className="bg-[#1a103a] text-gray-200 border border-purple-700/50 py-3 px-8 rounded-lg font-medium hover:bg-[#251352] transition-all duration-200 flex items-center justify-center"
                >
                  Watch demo
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="border-t border-gray-800 bg-[#0a0a1a] py-12">
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
      </main>
    </div>
  )
}