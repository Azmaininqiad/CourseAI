'use client'

import Link from 'next/link'
import { Sparkles, Layers, ChevronRight, CheckCircle } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0c0c1d] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a1a]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-orange-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                CourseAI
              </h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/features" className="text-sm text-gray-300 hover:text-white">Features</Link>
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
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-1/2 mb-12 lg:mb-0">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                    AI-powered education
                  </span>
                  <br />
                  <span className="text-white">
                    and expert mentorship
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                  Create comprehensive courses with AI-generated content, images, and videos.
                  Connect with expert mentors for personalized guidance and skill testing. Your complete learning ecosystem.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-8 rounded-lg font-medium shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center group"
                  >
                    Create AI Courses
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="https://temp-psi-jet.vercel.app/dashboard"
                    className="bg-[#1a103a] text-gray-200 border border-purple-700/50 py-3 px-8 rounded-lg font-medium hover:bg-[#251352] transition-all duration-200 flex items-center justify-center"
                  >
                    Find Mentors
                  </Link>
                </div>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded-lg opacity-75 blur-lg"></div>
                  <div className="relative bg-[#0c0c1d] rounded-lg p-1">
                    <img
                      src="/course-preview.png"
                      alt="CourseAI Preview"
                      className="rounded-lg shadow-2xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400/1a103a/ffffff?text=CourseAI+Preview';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section - Revolutionizing Education */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                Complete learning ecosystem in one platform
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Generate AI-powered courses with rich media content, then connect with expert mentors for personalized guidance. From content creation to skill mastery.
              </p>
              <div className="mt-4 text-gray-400">
                Skeptical? <Link href="/demo" className="text-orange-400 hover:underline">Try it out</Link>, and see for yourself.
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-8 rounded-lg font-medium shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
              >
                Start building
              </Link>
            </div>
          </div>
        </section>

        {/* Third Section - AI Working in Education */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0c0c1d]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-gray-200">Two powerful systems</span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  working together
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <div className="bg-[#1a103a]/50 rounded-xl p-8 border border-purple-900/50">
                <h3 className="text-2xl font-bold text-white mb-4">
                  CourseAI: Intelligent Content Creation
                </h3>
                <p className="text-gray-300 mb-6">
                  Generate comprehensive courses with AI-powered content creation.
                  Automatically embed relevant images, YouTube videos, and structured learning modules in minutes.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300"
                >
                  Create Course <ChevronRight className="ml-1 h-4 w-4" />
                </Link>

                <div className="mt-8 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>15 structured modules per course</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Auto-embedded images and videos</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>3+ hours of learning content</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a103a]/50 rounded-xl p-8 border border-purple-900/50">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Mentor-Test: Expert Guidance & Assessment
                </h3>
                <p className="text-gray-300 mb-6">
                  Connect with verified mentors for personalized sessions, skill assessments, and career guidance.
                  Book sessions, track progress, and get expert feedback on your learning journey.
                </p>

                <div className="mt-8 bg-[#0c0c1d] rounded-lg p-4 border border-gray-800">
                  <div className="text-sm text-gray-300 mb-2">
                    <span className="text-orange-400">Session Type:</span> 1-on-1 Mentorship Session
                  </div>
                  <div className="text-sm text-gray-300 mb-4">
                    <span className="text-purple-400">Available:</span> Video calls, chat sessions, skill assessments, and progress tracking with calendar integration.
                  </div>

                  <div className="text-xs text-gray-500">
                    Verified mentors with ratings and reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fourth Section - Self-hosting */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-[#1a103a] rounded-lg px-3 py-1 text-sm text-gray-400 mb-4">
                  INTEGRATED PLATFORM
                </div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  From course creation —<br />
                  to expert mentorship
                </h2>
                <p className="text-gray-300 mb-8">
                  Create AI-powered courses with rich media content, then connect with expert mentors for personalized guidance.
                  Complete your learning journey from content to mastery.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-200">AI-generated courses with media</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-200">Expert mentor matching system</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-200">Session booking and progress tracking</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg blur-lg"></div>
                <div className="relative bg-[#1a103a] rounded-lg p-6 border border-purple-900/50">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg font-medium text-white">Dual Platform</span>
                  </div>

                  <p className="text-gray-300 mb-4">
                    CourseAI creates comprehensive learning materials with embedded media, while Mentor-Test connects you with expert guidance.
                    Complete learning ecosystem in one platform.
                  </p>

                  <div className="flex justify-end">
                    <Link
                      href="/self-hosting"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fifth Section - Automation for Education */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0c0c1d] relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent opacity-70"></div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 rounded-full px-4 py-1 text-sm text-white mb-4">
                Complete Learning Solution
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Learn, create,<br />and get mentored
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Start with AI-generated courses featuring rich media content, then connect with expert mentors for personalized guidance.
                Your complete learning journey from content creation to skill mastery.
              </p>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-200"
                >
                  Try CourseAI
                </Link>
                <Link
                  href="https://temp-psi-jet.vercel.app/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-200"
                >
                  Find Mentors
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