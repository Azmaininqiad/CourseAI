'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, GraduationCap, Building, Users, ChevronRight, BookOpen, Code, Zap, CheckCircle, Lightbulb, Globe, School } from 'lucide-react'

export default function UseCasesPage() {
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
              <Link href="/use-cases" className="text-sm text-orange-400 border-b-2 border-orange-500">Use Cases</Link>
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
                  Use Cases
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Discover how CourseAI is transforming education across different sectors.
                From K-12 to higher education to corporate training, our AI-powered platform
                is making a difference.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a1a]">
          <div className="max-w-7xl mx-auto">
            {/* Higher Education */}
            <motion.div 
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="inline-block bg-[#1a103a] rounded-lg px-3 py-1 text-sm text-gray-400 mb-4">
                    HIGHER EDUCATION
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Empower professors and teaching assistants
                  </h2>
                  <p className="text-gray-300 mb-6">
                    CourseAI helps university faculty create comprehensive course materials in a fraction of the time.
                    Generate syllabi, lecture notes, assignments, and supplementary materials tailored to your curriculum.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Create discipline-specific content across departments</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Generate custom assignments with answer keys</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Develop supplementary materials for diverse learning needs</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/higher-education" 
                    className="text-orange-400 hover:text-orange-300 flex items-center"
                  >
                    Learn more about higher education solutions
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg blur-lg"></div>
                    <div className="relative bg-[#1a103a] rounded-lg p-6 border border-purple-900/50">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-lg font-medium text-white">University Case Study</span>
                      </div>
                      
                      <p className="text-gray-300 mb-4">
                        "CourseAI has revolutionized how we prepare course materials. What used to take weeks now takes hours, 
                        allowing our faculty to focus more on student interaction and research."
                      </p>
                      
                      <div className="text-sm text-gray-400">
                        — Dr. Sarah Chen, Computer Science Department Chair, Stanford University
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* K-12 Education */}
            <motion.div 
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="inline-block bg-[#1a103a] rounded-lg px-3 py-1 text-sm text-gray-400 mb-4">
                    K-12 EDUCATION
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Support teachers and curriculum developers
                  </h2>
                  <p className="text-gray-300 mb-6">
                    CourseAI helps K-12 educators create age-appropriate, standards-aligned content quickly.
                    Generate lesson plans, worksheets, and interactive activities that engage young learners.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Align content with state and national standards</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Create differentiated materials for diverse learning needs</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Generate engaging, age-appropriate activities</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/k12-education" 
                    className="text-orange-400 hover:text-orange-300 flex items-center"
                  >
                    Learn more about K-12 solutions
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg blur-lg"></div>
                    <div className="relative bg-[#1a103a] rounded-lg p-6 border border-purple-900/50">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                          <School className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-lg font-medium text-white">School District Case Study</span>
                      </div>
                      
                      <p className="text-gray-300 mb-4">
                        "Our teachers save 5-10 hours per week using CourseAI to create supplementary materials.
                        The ability to quickly generate content aligned with our curriculum standards has been invaluable."
                      </p>
                      
                      <div className="text-sm text-gray-400">
                        — Michael Johnson, Curriculum Director, Westlake School District
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Corporate Training */}
            <motion.div 
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="inline-block bg-[#1a103a] rounded-lg px-3 py-1 text-sm text-gray-400 mb-4">
                    CORPORATE TRAINING
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Accelerate employee development
                  </h2>
                  <p className="text-gray-300 mb-6">
                    CourseAI helps L&D teams create custom training materials tailored to your organization's needs.
                    Generate onboarding guides, skill development courses, and compliance training quickly and efficiently.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Create role-specific training materials</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Develop consistent onboarding experiences</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Generate compliance training with assessment tools</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/corporate-training" 
                    className="text-orange-400 hover:text-orange-300 flex items-center"
                  >
                    Learn more about corporate solutions
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg blur-lg"></div>
                    <div className="relative bg-[#1a103a] rounded-lg p-6 border border-purple-900/50">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-lg font-medium text-white">Enterprise Case Study</span>
                      </div>
                      
                      <p className="text-gray-300 mb-4">
                        "CourseAI reduced our training development time by 70%. We can now create custom training
                        for each department while maintaining consistent quality and messaging."
                      </p>
                      
                      <div className="text-sm text-gray-400">
                        — Lisa Rodriguez, Head of Learning & Development, Fortune 500 Company
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Online Learning Platforms */}
            <motion.div 
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="inline-block bg-[#1a103a] rounded-lg px-3 py-1 text-sm text-gray-400 mb-4">
                    ONLINE LEARNING PLATFORMS
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Scale your content creation
                  </h2>
                  <p className="text-gray-300 mb-6">
                    CourseAI helps online learning platforms rapidly expand their course catalog with high-quality content.
                    Generate courses across diverse subjects while maintaining your brand voice and quality standards.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Rapidly expand course offerings</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Maintain consistent quality across subjects</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-200">Customize content to match your platform's style</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/online-platforms" 
                    className="text-orange-400 hover:text-orange-300 flex items-center"
                  >
                    Learn more about platform solutions
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg blur-lg"></div>
                    <div className="relative bg-[#1a103a] rounded-lg p-6 border border-purple-900/50">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-lg font-medium text-white">Platform Case Study</span>
                      </div>
                      
                      <p className="text-gray-300 mb-4">
                        "With CourseAI, we expanded our course catalog from 200 to over 1,000 courses in just three months.
                        Our subject matter experts now focus on review rather than creation, dramatically improving efficiency."
                      </p>
                      
                      <div className="text-sm text-gray-400">
                        — Alex Thompson, Content Director, LearnEverything.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
                See how CourseAI can work for you
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Book a personalized demo to see how CourseAI can address your specific educational content needs.
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
                  href="/contact" 
                  className="bg-[#1a103a] text-gray-200 border border-purple-700/50 py-3 px-8 rounded-lg font-medium hover:bg-[#251352] transition-all duration-200 flex items-center justify-center"
                >
                  Request a demo
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