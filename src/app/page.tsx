'use client'

import { useState, useEffect, useRef } from 'react'

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
        return 'bg-blue-500'
      case 'keywords':
        return 'bg-purple-500'
      case 'media':
        return 'bg-green-500'
      case 'content':
        return 'bg-yellow-500'
      case 'enhancement':
        return 'bg-orange-500'
      case 'complete':
        return 'bg-green-600'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatContent = (content: string) => {
    // Split content into lines and format for display
    const lines = content.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-800">{line.replace('# ', '')}</h1>
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-gray-700">{line.replace('## ', '')}</h2>
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-600">{line.replace('### ', '')}</h3>
      } else if (line.startsWith('![')) {
        const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
        if (match) {
          return (
            <img 
              key={index} 
              src={match[2]} 
              alt={match[1]} 
              className="max-w-full h-auto my-4 rounded-lg border"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          )
        }
      } else if (line.startsWith('[') && line.includes('](')) {
        const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (match) {
          return (
            <a 
              key={index} 
              href={match[2]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline block my-2"
            >
              {match[1]}
            </a>
          )
        }
      } else if (line.trim() && !line.startsWith('#')) {
        return <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>
      }
      return null
    }).filter(Boolean)
  }

  const clearError = () => setError(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Course Creator</h1>
            <div className="text-sm text-gray-500">
              AI-Powered Course Generation
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={clearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Course
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'modules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Modules ({modules.length})
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Courses ({courses.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Creation Form */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Create New Course</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter course topic..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isCreating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images per Module
                    </label>
                    <input
                      type="number"
                      value={imagesPerModule}
                      onChange={(e) => setImagesPerModule(Number(e.target.value))}
                      min="1"
                      max="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Videos per Module
                    </label>
                    <input
                      type="number"
                      value={videosPerModule}
                      onChange={(e) => setVideosPerModule(Number(e.target.value))}
                      min="1"
                      max="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={startCourseCreation}
                    disabled={isCreating || !topic.trim()}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreating ? 'Creating...' : 'Create Course'}
                  </button>
                  {isCreating && (
                    <button
                      onClick={stopCourseCreation}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Creation Progress</h3>
              
              {isCreating && progress && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize font-medium">{progress.stage.replace('_', ' ')}</span>
                      <span className="text-sm font-bold">{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor(progress.stage)}`}
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    {progress.current_module && progress.total_modules && (
                      <div className="text-sm text-gray-600 font-medium">
                        Module {progress.current_module} of {progress.total_modules}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Messages */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Progress Log</h4>
                <div 
                  ref={progressRef}
                  className="bg-gray-50 rounded-md p-3 h-64 overflow-y-auto border"
                >
                  {progressMessages.length === 0 ? (
                    <div className="text-sm text-gray-500 italic">
                      {isCreating ? 'Waiting for updates...' : 'No active course creation'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {progressMessages.map((msg, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getProgressColor(msg.stage)}`} />
                            <span className="text-gray-700">{msg.message}</span>
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            {new Date(msg.timestamp * 1000).toLocaleTimeString()}
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Current Session Modules</h2>
              
              {modules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No modules available</p>
                  <p className="text-sm mt-2">Create a new course to see modules here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div
                      key={module.filename}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedModule(module)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{module.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{module.filename}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Module {module.module_number}
                          </span>
                          {module.enhanced && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Enhanced
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Module Content</h2>
              
              {selectedModule ? (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">{selectedModule.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedModule.filename}</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none">
                    {formatContent(selectedModule.content)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a module to view its content</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course List */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">All Courses</h2>
              
              {courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No courses available</p>
                  <p className="text-sm mt-2">Create your first course to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.filename}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => loadExistingCourse(course.filename)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{course.filename}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {course.created_at ? new Date(course.created_at * 1000).toLocaleDateString() : 'Unknown date'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Course Content</h2>
              
              {selectedModule ? (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">{selectedModule.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedModule.filename}</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none">
                    {formatContent(selectedModule.content)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a course to view its content</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}