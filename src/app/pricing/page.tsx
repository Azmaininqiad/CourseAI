'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Check, ChevronRight, HelpCircle } from 'lucide-react'

export default function PricingPage() {
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
              <Link href="/docs" className="text-sm text-gray-300 hover:text-white">Docs</Link>
              <Link href="/pricing" className="text-sm text-orange-400 border-b-2 border-orange-500">Pricing</Link>
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
                  Simple, Transparent Pricing
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Choose the plan that's right for you. All plans include core features with different usage limits.
              </p>
              
              <div className="inline-flex items-center bg-[#1a103a]/50 rounded-full p-1 border border-purple-900/30 mb-12">
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium">
                  Monthly
                </button>
                <button className="px-6 py-2 rounded-full text-gray-300 hover:text-white">
                  Annual (Save 20%)
                </button>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <motion.div 
                className="bg-[#1a103a]/30 rounded-xl overflow-hidden border border-purple-900/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                  <p className="text-gray-400 mb-6">Perfect for getting started</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                  
                  <Link 
                    href="/signup" 
                    className="block w-full bg-[#1a103a] text-gray-200 border border-purple-700/50 py-2 px-4 rounded-lg font-medium hover:bg-[#251352] transition-all duration-200 text-center mb-6"
                  >
                    Get Started
                  </Link>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">5 courses per month</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Basic markdown support</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">1 image per module</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Community support</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Pro Plan */}
              <motion.div 
                className="bg-[#1a103a]/30 rounded-xl overflow-hidden border border-orange-500/50 relative transform scale-105 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
                
                <div className="p-8 pt-12">
                  <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                  <p className="text-gray-400 mb-6">For professional educators</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-white">$29</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                  
                  <Link 
                    href="/signup/pro" 
                    className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 text-center mb-6"
                  >
                    Get Started
                  </Link>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Unlimited courses</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Advanced markdown with code highlighting</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">5 images per module</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">3 videos per module</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Priority email support</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">API access</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Enterprise Plan */}
              <motion.div 
                className="bg-[#1a103a]/30 rounded-xl overflow-hidden border border-purple-900/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                  <p className="text-gray-400 mb-6">For organizations and institutions</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-white">Custom</span>
                  </div>
                  
                  <Link 
                    href="/contact" 
                    className="block w-full bg-[#1a103a] text-gray-200 border border-purple-700/50 py-2 px-4 rounded-lg font-medium hover:bg-[#251352] transition-all duration-200 text-center mb-6"
                  >
                    Contact Sales
                  </Link>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Everything in Pro</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Self-hosting option</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Custom integrations</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Dedicated account manager</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">24/7 priority support</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Custom AI model training</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a1a]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div className="bg-[#1a103a]/50 rounded-xl p-6 border border-purple-900/50">
                <h3 className="text-xl font-bold text-white mb-3">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-300">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
                </p>
              </div>
              
              <div className="bg-[#1a103a]/50 rounded-xl p-6 border border-purple-900/50">
                <h3 className="text-xl font-bold text-white mb-3">Do you offer educational discounts?</h3>
                <p className="text-gray-300">
                  Yes, we offer special pricing for educational institutions. Please contact our sales team for more information.
                </p>
              </div>
              
              <div className="bg-[#1a103a]/50 rounded-xl p-6 border border-purple-900/50">
                <h3 className="text-xl font-bold text-white mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-300">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                </p>
              </div>
              
              <div className="bg-[#1a103a]/50 rounded-xl p-6 border border-purple-900/50">
                <h3 className="text-xl font-bold text-white mb-3">Is there a refund policy?</h3>
                <p className="text-gray-300">
                  We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, you can request a full refund within 14 days of your purchase.
                </p>
              </div>
              
              <div className="bg-[#1a103a]/50 rounded-xl p-6 border border-purple-900/50">
                <h3 className="text-xl font-bold text-white mb-3">Do you offer a free trial?</h3>
                <p className="text-gray-300">
                  Our Free plan serves as an unlimited trial with limited features. You can use it to test the platform before upgrading to a paid plan.
                </p>
              </div>
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
                Start creating AI-powered courses today with our free plan.
                No credit card required.
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
                  Contact Sales
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