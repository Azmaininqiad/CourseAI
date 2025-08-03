'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { db, Course } from '@/lib/supabase'
import { CourseService } from '@/services/courseService'
import { 
  Sparkles, 
  Plus, 
  BookOpen, 
  Clock, 
  Users, 
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Play,
  Edit,
  Trash2,
  Download,
  Share2,
  Settings,
  Bell,
  User,
  Loader2,
  FileText,
  Video,
  Image as ImageIcon,
  Tag,
  Calendar,
  BarChart3
} from 'lucide-react'

interface CourseStats {
  totalCourses: number
  totalModules: number
  totalLessons: number
  totalDuration: number
}

interface GenerationProgress {
  courseId: string
  progress: number
  step: string
  isGenerating: boolean
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [stats, setStats] = useState<CourseStats>({
    totalCourses: 0,
    totalModules: 0,
    totalLessons: 0,
    totalDuration: 0
  })
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCourseTopic, setNewCourseTopic] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Load courses when user is authenticated
  useEffect(() => {
    if (user && !authLoading) {
      loadCourses()
      loadStats()
    }
  }, [user, authLoading])

  const loadCourses = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const coursesData = await db.getCourses(user.id)
      setCourses(coursesData)
    } catch (err) {
      console.error('Error loading courses:', err)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    if (!user) return
    
    try {
      const coursesData = await db.getCourses(user.id)
      let totalModules = 0
      let totalLessons = 0
      let totalDuration = 0

      for (const course of coursesData) {
        const modules = await db.getCourseModules(course.id)
        totalModules += modules.length

        for (const module of modules) {
          const lessons = await db.getCourseLessons(module.id)
          totalLessons += lessons.length
          totalDuration += lessons.reduce((sum, lesson) => sum + (lesson.estimated_duration || 0), 0)
        }
      }

      setStats({
        totalCourses: coursesData.length,
        totalModules,
        totalLessons,
        totalDuration
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const handleCreateCourse = async () => {
    if (!user || !newCourseTopic.trim()) return

    try {
      setGenerationProgress({
        courseId: '',
        progress: 0,
        step: 'Starting course generation...',
        isGenerating: true
      })

      const course = await CourseService.generateCourse(
        user.id,
        newCourseTopic,
        (progress, step) => {
          setGenerationProgress(prev => prev ? {
            ...prev,
            progress,
            step
          } : null)
        }
      )

      setGenerationProgress(null)
      setShowCreateModal(false)
      setNewCourseTopic('')
      await loadCourses()
      await loadStats()
    } catch (err) {
      console.error('Error creating course:', err)
      setError('Failed to create course')
      setGenerationProgress(null)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      await CourseService.deleteCourse(courseId)
      await loadCourses()
      await loadStats()
    } catch (err) {
      console.error('Error deleting course:', err)
      setError('Failed to delete course')
    }
  }

  const handleExportCourse = async (courseId: string, format: 'json' | 'markdown') => {
    try {
      const blob = await CourseService.exportCourse(courseId, format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `course-${courseId}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting course:', err)
      setError('Failed to export course')
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.topic.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500'
      case 'generating': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'published': return 'bg-purple-500'
      case 'archived': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-900/30 border-green-700'
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700'
      case 'advanced': return 'text-red-400 bg-red-900/30 border-red-700'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-700'
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c1d] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c0c1d] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to continue</h1>
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-6 rounded-lg font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

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
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48"
                />
              </div>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Bell className="h-5 w-5 text-gray-300" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">{profile?.full_name || user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a103a]/30 rounded-xl p-6 border border-purple-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Courses</p>
                <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-[#1a103a]/30 rounded-xl p-6 border border-purple-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Modules</p>
                <p className="text-2xl font-bold text-white">{stats.totalModules}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-[#1a103a]/30 rounded-xl p-6 border border-purple-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Lessons</p>
                <p className="text-2xl font-bold text-white">{stats.totalLessons}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-[#1a103a]/30 rounded-xl p-6 border border-purple-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Duration</p>
                <p className="text-2xl font-bold text-white">{Math.round(stats.totalDuration / 60)}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Generation Progress */}
        {generationProgress && (
          <div className="bg-[#1a103a]/30 rounded-xl p-6 border border-purple-900/30 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generating Course</h3>
              <span className="text-sm text-gray-400">{generationProgress.progress}%</span>
            </div>
            <div className="w-full bg-[#0c0c1d] rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${generationProgress.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-300">{generationProgress.step}</p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </button>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="generating">Generating</option>
              <option value="completed">Completed</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No courses found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first course to get started'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-6 rounded-lg font-medium"
              >
                Create Your First Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a103a]/30 rounded-xl p-6 border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="relative">
                    <button className="p-1 rounded-full hover:bg-gray-800 transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)} text-white`}>
                    {course.status}
                  </span>
                  {course.difficulty_level && (
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${getDifficultyColor(course.difficulty_level)}`}>
                      {course.difficulty_level}
                    </span>
                  )}
                </div>

                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {course.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{course.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    {course.estimated_duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {Math.round(course.estimated_duration / 60)}h
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(course.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/course/${course.id}`}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium text-center hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
                  >
                    View Course
                  </Link>
                  <button
                    onClick={() => handleExportCourse(course.id, 'markdown')}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Export as Markdown"
                  >
                    <Download className="h-4 w-4 text-gray-300" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 bg-red-900/50 hover:bg-red-900/70 rounded-lg transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a103a] rounded-xl p-6 w-full max-w-md mx-4 border border-purple-900/50">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Course</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Topic
                </label>
                <input
                  type="text"
                  value={newCourseTopic}
                  onChange={(e) => setNewCourseTopic(e.target.value)}
                  placeholder="Enter course topic..."
                  className="w-full px-4 py-3 bg-[#0c0c1d]/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateCourse}
                  disabled={!newCourseTopic.trim() || generationProgress?.isGenerating}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generationProgress?.isGenerating ? (
                    <>
                      <Loader2 className="inline h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}