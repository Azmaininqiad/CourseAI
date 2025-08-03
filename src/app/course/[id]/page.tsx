'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { db, Course, CourseModule, CourseLesson } from '@/lib/supabase'
import { CourseService } from '@/services/courseService'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { 
  Sparkles, 
  ArrowLeft,
  BookOpen, 
  Clock, 
  Users, 
  Play,
  ChevronRight,
  ChevronDown,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Share2,
  Edit,
  Settings,
  Loader2,
  CheckCircle,
  Circle
} from 'lucide-react'

interface CourseWithContent {
  course: Course
  modules: {
    module: CourseModule
    lessons: CourseLesson[]
  }[]
  files: any[]
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const courseId = params.id as string

  const [courseData, setCourseData] = useState<CourseWithContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [courseStats, setCourseStats] = useState({
    totalModules: 0,
    totalLessons: 0,
    totalDuration: 0,
    averageLessonDuration: 0
  })

  useEffect(() => {
    if (courseId && user) {
      loadCourse()
    }
  }, [courseId, user])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const data = await CourseService.getCourseWithContent(courseId)
      setCourseData(data)

      // Load course stats
      const stats = await CourseService.getCourseStats(courseId)
      setCourseStats(stats)

      // Expand first module and select first lesson by default
      if (data.modules && data.modules.length > 0) {
        const firstModule = data.modules[0]
        setExpandedModules(new Set([firstModule.module.id]))
        
        if (firstModule.lessons && firstModule.lessons.length > 0) {
          setSelectedLesson(firstModule.lessons[0])
        }
      }
    } catch (err) {
      console.error('Error loading course:', err)
      setError('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleExport = async (format: 'json' | 'markdown') => {
    try {
      await CourseService.exportCourse(courseId, format)
    } catch (err) {
      console.error('Error exporting course:', err)
      setError('Failed to export course')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c1d] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-[#0c0c1d] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course not found</h1>
          <p className="text-gray-400 mb-6">{error || 'The course you are looking for does not exist.'}</p>
          <Link 
            href="/dashboard" 
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-6 rounded-lg font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const { course, modules } = courseData

  return (
    <div className="min-h-screen bg-[#0c0c1d] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a1a]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-orange-500" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  CourseAI
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleExport('markdown')}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Export</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
              {course.description && (
                <p className="text-lg text-gray-300 mb-4">{course.description}</p>
              )}
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {courseStats.totalModules} modules
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {courseStats.totalLessons} lessons
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {Math.round(courseStats.totalDuration / 60)}h total
                </div>
                {course.difficulty_level && (
                  <div className="flex items-center">
                    <span className="capitalize">{course.difficulty_level}</span>
                  </div>
                )}
              </div>
            </div>
            {course.thumbnail_url && (
              <div className="ml-8">
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title}
                  className="w-48 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a103a]/30 rounded-xl p-6 border border-purple-900/30 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                Course Content
              </h2>
              
              <div className="space-y-2">
                {modules.map((moduleData, moduleIndex) => {
                  const { module, lessons } = moduleData
                  const isExpanded = expandedModules.has(module.id)
                  
                  return (
                    <div key={module.id} className="border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 bg-[#0c0c1d]/50 hover:bg-[#0c0c1d]/70 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-orange-400">
                            Module {moduleIndex + 1}
                          </span>
                          <span className="text-sm text-gray-300 font-medium">
                            {module.title}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-800">
                          {lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full flex items-center justify-between p-3 pl-8 hover:bg-[#1a103a]/50 transition-colors ${
                                selectedLesson?.id === lesson.id ? 'bg-[#1a103a]/70 border-r-2 border-orange-500' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  {lesson.video_url ? (
                                    <Video className="h-4 w-4 text-blue-400" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                                <span className="text-sm text-gray-300">
                                  {lessonIndex + 1}. {lesson.title}
                                </span>
                              </div>
                              {lesson.estimated_duration && (
                                <span className="text-xs text-gray-500">
                                  {lesson.estimated_duration}min
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a103a]/30 rounded-xl p-6 border border-purple-900/30">
              {selectedLesson ? (
                <div>
                  <div className="border-b border-gray-800 pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedLesson.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {selectedLesson.content_type}
                      </div>
                      {selectedLesson.estimated_duration && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {selectedLesson.estimated_duration} minutes
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedLesson.video_url && (
                    <div className="mb-6">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        {selectedLesson.video_url.includes('youtube.com') || selectedLesson.video_url.includes('youtu.be') ? (
                          <iframe
                            src={selectedLesson.video_url.replace('watch?v=', 'embed/')}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={selectedLesson.video_url}
                            controls
                            className="w-full h-full"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {selectedLesson.content && (
                    <div className="prose prose-invert prose-lg max-w-none">
                      <MarkdownRenderer content={selectedLesson.content} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a lesson</h3>
                  <p>Choose a lesson from the course content to view its details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}