'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import MarkdownRendererExample from './components/MarkdownRendererExample'

interface CourseModule {
  filename: string
  title: string
  content: string
  module_number: number
  enhanced?: boolean
  created_at?: number
}

interface ProgressData {
  session_id: string
  stage: string
  progress: number
  message: string
  current_module?: number
  total_modules?: number
  data?: any
  timestamp: number
}

export default function CoursePage() {
  const [topic, setTopic] = useState('')
  const [imagesPerModule, setImagesPerModule] = useState(1)
  const [videosPerModule, setVideosPerModule] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [modules, setModules] = useState<CourseModule[]>([])
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<CourseModule[]>([])
  const [progressMessages, setProgressMessages] = useState<ProgressData[]>([])
  const [activeTab, setActiveTab] = useState<'create' | 'modules' | 'courses'>('create')
  
  const wsRef = useRef<WebSocket | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Load existing courses on component mount
  useEffect(() => {
    fetchCourses()
  }, [])

  // Auto-scroll progress messages
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.scrollTop = progressRef.current.scrollHeight
    }
  }, [progressMessages])

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/courses')
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data.courses)
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load existing courses')
    }
  }

  const connectWebSocket = (sessionId: string) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionId}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setError(null)
    }

    ws.onmessage = (event) => {
      const data: ProgressData = JSON.parse(event.data)
      setProgress(data)
      
      // Add to progress messages
      setProgressMessages(prev => [...prev, data])

      // Handle completed modules
      if (data.stage === 'module_complete' || data.stage === 'module_enhanced') {
        if (data.data) {
          setModules(prev => {
            const existingIndex = prev.findIndex(m => m.filename === data.data.filename)
            if (existingIndex >= 0) {
              // Update existing module
              const updated = [...prev]
              updated[existingIndex] = data.data
              return updated
            } else {
              // Add new module
              return [...prev, data.data].sort((a, b) => a.module_number - b.module_number)
            }
          })
          
          // Auto-switch to modules tab when first module is ready
          if (data.stage === 'module_complete' && modules.length === 0) {
            setActiveTab('modules')
          }
        }
      }

      // Handle completion
      if (data.stage === 'complete') {
        setIsCreating(false)
        fetchCourses() // Refresh course list
        setActiveTab('courses')
      }

      // Handle errors
      if (data.stage === 'error') {
        setError(data.message)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setError('WebSocket connection error occurred')
    }
  }

  const startCourseCreation = async () => {
    if (!topic.trim()) {
      setError('Please enter a course topic')
      return
    }

    setError(null)
    setIsCreating(true)
    setProgress(null)
    setModules([])
    setSelectedModule(null)
    setProgressMessages([])
    setActiveTab('create')

    try {
      const response = await fetch('http://localhost:8000/api/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          images_per_module: imagesPerModule,
          videos_per_module: videosPerModule,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start course creation')
      }

      const data = await response.json()
      setSessionId(data.session_id)
      connectWebSocket(data.session_id)
    } catch (err) {
      setError('Failed to start course creation')
      setIsCreating(false)
    }
  }

  const stopCourseCreation = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    setIsCreating(false)
    setProgress(null)
  }

  const loadExistingCourse = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/course/${filename}`)
      if (!response.ok) throw new Error('Failed to load course')
      const data = await response.json()
      setSelectedModule(data)
    } catch (err) {
      setError('Failed to load course content')
    }
  }

  const getProgressColor = (stage: string) => {
    switch (stage) {
      case 'starting':
      case 'structure':
        return 'from-blue-500 to-blue-600'
      case 'keywords':
        return 'from-purple-500 to-purple-600'
      case 'media':
        return 'from-green-500 to-green-600'
      case 'content':
        return 'from-yellow-500 to-yellow-600'
      case 'enhancement':
        return 'from-orange-500 to-orange-600'
      case 'complete':
        return 'from-emerald-500 to-emerald-600'
      case 'error':
        return 'from-red-500 to-red-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'starting':
      case 'structure':
        return '🚀'
      case 'keywords':
        return '🔍'
      case 'media':
        return '🎬'
      case 'content':
        return '✍️'
      case 'enhancement':
        return '✨'
      case 'complete':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '⚡'
    }
  }

  const clearError = () => setError(null)

  return (
    <div className="min-h-screen bg-black">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 glass border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Course Creator
                </h1>
                <p className="text-sm text-gray-400">AI-Powered Course Generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="relative z-10 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <span className="text-red-200">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-300 hover:text-red-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl backdrop-blur-sm border border-gray-800">
            {[
              { id: 'create', label: 'Create Course', icon: '🚀' },
              { id: 'modules', label: `Current Modules (${modules.length})`, icon: '📚' },
              { id: 'courses', label: `All Courses (${courses.length})`, icon: '🎓' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Creation Form */}
            <div className="glass rounded-2xl p-8 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">✨</span>
                </div>
                <h2 className="text-xl font-semibold text-white">Create New Course</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Course Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter course topic..."
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                    disabled={isCreating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Images per Module
                    </label>
                    <input
                      type="number"
                      value={imagesPerModule}
                      onChange={(e) => setImagesPerModule(Number(e.target.value))}
                      min="1"
                      max="5"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Videos per Module
                    </label>
                    <input
                      type="number"
                      value={videosPerModule}
                      onChange={(e) => setVideosPerModule(Number(e.target.value))}
                      min="1"
                      max="5"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={startCourseCreation}
                    disabled={isCreating || !topic.trim()}
                    className="flex-1 gradient-primary text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </span>
                    ) : (
                      'Create Course'
                    )}
                  </button>
                  {isCreating && (
                    <button
                      onClick={stopCourseCreation}
                      className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="glass rounded-2xl p-8 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Creation Progress</h3>
              </div>
              
              {isCreating && progress && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getStageIcon(progress.stage)}</span>
                        <span className="text-gray-300 capitalize font-medium">
                          {progress.stage.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-white font-bold text-lg">{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(progress.stage)} progress-bar transition-all duration-500 ease-out`}
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    {progress.current_module && progress.total_modules && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          Module {progress.current_module} of {progress.total_modules}
                        </span>
                        <span className="text-blue-400 font-medium">
                          {Math.round((progress.current_module / progress.total_modules) * 100)}% Complete
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Messages */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
                  <span>📝</span>
                  <span>Progress Log</span>
                </h4>
                <div 
                  ref={progressRef}
                  className="bg-gray-900/30 rounded-xl p-4 h-64 overflow-y-auto border border-gray-800 backdrop-blur-sm"
                >
                  {progressMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 italic">
                      <div className="text-center">
                        <div className="text-3xl mb-2">⏳</div>
                        <div>{isCreating ? 'Waiting for updates...' : 'No active course creation'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {progressMessages.map((msg, index) => (
                        <div key={index} className="group">
                          <div className="flex items-start space-x-3">
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 bg-gradient-to-r ${getProgressColor(msg.stage)}`} />
                            <div className="flex-1">
                              <div className="text-gray-300 text-sm">{msg.message}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(msg.timestamp * 1000).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Module List */}
            <div className="glass rounded-2xl p-8 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📚</span>
                </div>
                <h2 className="text-xl font-semibold text-white">Current Session Modules</h2>
              </div>
              
              {modules.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📖</div>
                  <p className="text-gray-400 text-lg mb-2">No modules available</p>
                  <p className="text-gray-500 text-sm">Create a new course to see modules here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div
                      key={module.filename}
                      className="bg-gray-900/30 border border-gray-700 rounded-xl p-5 hover:bg-gray-800/50 cursor-pointer transition-all duration-200 hover:border-blue-500/50 hover-lift group"
                      onClick={() => setSelectedModule(module)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors">
                            {module.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 font-mono">{module.filename}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                            Module {module.module_number}
                          </span>
                          {module.enhanced && (
                            <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">
                              ✨ Enhanced
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Module Content */}
            <div className="glass rounded-2xl p-8 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📄</span>
                </div>
                <h2 className="text-xl font-semibold text-white">Module Content</h2>
              </div>
              
              {selectedModule ? (
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {selectedModule.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 font-mono">{selectedModule.filename}</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto prose prose-invert prose-sm max-w-none">
                    <MarkdownRendererExample content={selectedModule.content} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👆</div>
                  <p className="text-gray-400">Select a module to view its content</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course List */}
            <div className="glass rounded-2xl p-8 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎓</span>
                </div>
                <h2 className="text-xl font-semibold text-white">All Courses</h2>
              </div>
              
              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-gray-400 text-lg mb-2">No courses available</p>
                  <p className="text-gray-500 text-sm">Create your first course to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.filename}
                      className="bg-gray-900/30 border border-gray-700 rounded-xl p-5 hover:bg-gray-800/50 cursor-pointer transition-all duration-200 hover:border-purple-500/50 hover-lift group"
                      onClick={() => loadExistingCourse(course.filename)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 font-mono">{course.filename}</p>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                          {course.created_at ? new Date(course.created_at * 1000).toLocaleDateString() : 'Unknown date'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Course Content */}
            <div className="glass rounded-2xl p-8 hover-lift">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📖</span>
                </div>
                <h2 className="text-xl font-semibold text-white">Course Content</h2>
              </div>
              
              {selectedModule ? (
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {selectedModule.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 font-mono">{selectedModule.filename}</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto prose prose-invert prose-sm max-w-none">
                    <MarkdownRendererExample content={selectedModule.content} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👆</div>
                  <p className="text-gray-400">Select a course to view its content</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}