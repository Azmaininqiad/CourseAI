'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, BookOpen, FileText, Folder, ChevronRight, ChevronDown, Play, Plus, Settings, Search } from 'lucide-react'
import FolderView from '@/components/FolderView'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface CourseModule {
  filename: string
  title: string
  content: string
  module_number?: number
  enhanced?: boolean
  created_at?: number
  topic_folder?: string
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

export default function DashboardPage() {
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
  const [topicFolders, setTopicFolders] = useState<Record<string, CourseModule[]>>({})
  const [progressMessages, setProgressMessages] = useState<ProgressData[]>([])
  const [activeTab, setActiveTab] = useState<'create' | 'modules' | 'courses'>('create')
  
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
      
      // If topic_folders is available in the response, use it
      if (data.topic_folders) {
        setTopicFolders(data.topic_folders)
      } else {
        // If not, create a default structure with all courses in "uncategorized"
        setTopicFolders({ uncategorized: data.courses })
      }
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load existing courses')
    }
  }

  const connectWebSocket = (sessionId: string) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionId}`)

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

    return ws
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
      const ws = connectWebSocket(data.session_id)
      
      return () => {
        ws.close()
      }
    } catch (err) {
      setError('Failed to start course creation')
      setIsCreating(false)
    }
  }

  const stopCourseCreation = () => {
    setIsCreating(false)
    setProgress(null)
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

  const clearError = () => setError(null)

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
              <Link href="/pricing" className="text-sm text-gray-300 hover:text-white">Pricing</Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="bg-gray-800/50 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48"
                />
              </div>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Settings className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 relative">
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
          <nav className="flex space-x-8 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              Create Course
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'modules'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              Current Modules ({modules.length})
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
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
            <div className="bg-[#1a103a]/30 rounded-xl p-6 shadow-lg border border-purple-900/30">
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">Create New Course</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter course topic..."
                    className="w-full px-4 py-3 bg-[#0c0c1d]/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                    disabled={isCreating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Images per Module
                    </label>
                    <input
                      type="number"
                      value={imagesPerModule}
                      onChange={(e) => setImagesPerModule(Number(e.target.value))}
                      min="1"
                      max="5"
                      className="w-full px-4 py-3 bg-[#0c0c1d]/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100"
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Videos per Module
                    </label>
                    <input
                      type="number"
                      value={videosPerModule}
                      onChange={(e) => setVideosPerModule(Number(e.target.value))}
                      min="1"
                      max="5"
                      className="w-full px-4 py-3 bg-[#0c0c1d]/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={startCourseCreation}
                    disabled={isCreating || !topic.trim()}
                    className={`flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Create Course
                      </>
                    )}
                  </button>
                  {isCreating && (
                    <button
                      onClick={stopCourseCreation}
                      className="bg-red-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:bg-red-700 transition-colors"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-[#1a103a]/30 rounded-xl p-6 shadow-lg border border-purple-900/30">
              <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">Creation Progress</h3>
              
              {isCreating && progress && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300 capitalize font-medium">{progress.stage.replace('_', ' ')}</span>
                      <span className="text-sm font-bold text-gray-200">{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-[#0c0c1d] rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor(progress.stage)}`}
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    {progress.current_module && progress.total_modules && (
                      <div className="text-sm text-gray-300 font-medium">
                        Module {progress.current_module} of {progress.total_modules}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Messages */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Progress Log</h4>
                <div 
                  ref={progressRef}
                  className="bg-[#0c0c1d]/80 rounded-lg p-4 h-64 overflow-y-auto border border-gray-800 scrollbar-thin"
                >
                  {progressMessages.length === 0 ? (
                    <div className="text-sm text-gray-500 italic">
                      {isCreating ? 'Waiting for updates...' : 'No active course creation'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {progressMessages.map((msg, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getProgressColor(msg.stage)}`} />
                            <span className="text-gray-300">{msg.message}</span>
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
            <div className="bg-[#1a103a]/30 rounded-xl p-6 shadow-lg border border-purple-900/30">
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">Current Session Modules</h2>
              
              {modules.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No modules available</p>
                  <p className="text-sm mt-2">Create a new course to see modules here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div
                      key={module.filename}
                      className="border border-gray-800 rounded-lg p-4 hover:bg-[#1a103a]/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedModule(module)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-200">{module.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{module.filename}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-md border border-blue-800">
                            Module {module.module_number}
                          </span>
                          {module.enhanced && (
                            <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-md border border-purple-800">
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
            <div className="bg-[#1a103a]/30 rounded-xl p-6 shadow-lg border border-purple-900/30">
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">Module Content</h2>
              
              {selectedModule ? (
                <div className="space-y-6">
                  <div className="border-b border-gray-800 pb-4">
                    <h3 className="text-xl font-bold text-gray-100">{selectedModule.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{selectedModule.filename}</p>
                  </div>
                  
                  <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                    <div className="prose prose-invert prose-sm max-w-none">
                      {selectedModule.content && <MarkdownRenderer content={selectedModule.content} />}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a module to view its content</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course List with Folders */}
            <div className="bg-[#1a103a]/30 rounded-xl p-6 shadow-lg border border-purple-900/30">
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">Course Library</h2>
              
              <FolderView 
                topicFolders={topicFolders} 
                onSelectCourse={(course) => {
                  if (course.topic_folder) {
                    // If the course has a topic folder, use the new API endpoint
                    fetch(`http://localhost:8000/api/course/${course.topic_folder}/${course.filename}`)
                      .then(response => {
                        if (!response.ok) throw new Error('Failed to load course');
                        return response.json();
                      })
                      .then(data => setSelectedModule(data))
                      .catch(err => {
                        console.error('Error loading course:', err);
                        setError('Failed to load course content');
                      });
                  } else {
                    // Fallback to the old endpoint for backward compatibility
                    fetch(`http://localhost:8000/api/course/${course.filename}`)
                      .then(response => {
                        if (!response.ok) throw new Error('Failed to load course');
                        return response.json();
                      })
                      .then(data => setSelectedModule(data))
                      .catch(err => {
                        console.error('Error loading course:', err);
                        setError('Failed to load course content');
                      });
                  }
                }}
                selectedCourse={selectedModule}
              />
            </div>

            {/* Course Content */}
            <div className="bg-[#1a103a]/30 rounded-xl p-6 shadow-lg border border-purple-900/30">
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">Course Content</h2>
              
              {selectedModule ? (
                <div className="space-y-6">
                  <div className="border-b border-gray-800 pb-4">
                    <h3 className="text-xl font-bold text-gray-100">{selectedModule.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      {selectedModule.topic_folder && (
                        <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-md border border-blue-800 mr-2">
                          {selectedModule.topic_folder}
                        </span>
                      )}
                      <span>{selectedModule.filename}</span>
                    </div>
                  </div>
                  
                  <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                    <div className="prose prose-invert prose-sm max-w-none">
                      {selectedModule.content && <MarkdownRenderer content={selectedModule.content} />}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a course to view its content</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0a0a1a]/80 py-8 mt-12">
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