'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Mail, Lock, EyeOff, Eye, Github, Twitter, Loader2, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { user, signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard-new')
    }
  }, [user, router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      if (isSignUp) {
        await signUp(email, password, fullName)
        // For sign up, user might need to verify email
        alert('Please check your email to verify your account')
      } else {
        await signIn(email, password)
        router.push('/dashboard-new')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0c0c1d] text-gray-100 flex flex-col">
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
              <Link href="/pricing" className="text-sm text-gray-300 hover:text-white">Pricing</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-gray-400">
              {isSignUp ? 'Sign up to get started with CourseAI' : 'Sign in to your account to continue'}
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-[#1a103a]/30 rounded-xl p-8 shadow-lg border border-purple-900/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required={isSignUp}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-[#0c0c1d]/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-[#0c0c1d]/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-[#0c0c1d]/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-700 rounded bg-[#0c0c1d]"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-orange-400 hover:text-orange-300">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      {isSignUp ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    isSignUp ? 'Create account' : 'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#1a103a] text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-[#0c0c1d]/80 text-sm font-medium text-gray-300 hover:bg-[#0c0c1d] transition-colors">
                  <Github className="h-5 w-5" />
                  <span className="ml-2">GitHub</span>
                </button>

                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-[#0c0c1d]/80 text-sm font-medium text-gray-300 hover:bg-[#0c0c1d] transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="ml-2">Twitter</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError(null)
                    setEmail('')
                    setPassword('')
                    setFullName('')
                  }}
                  className="font-medium text-orange-400 hover:text-orange-300"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}