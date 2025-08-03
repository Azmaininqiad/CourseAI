import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fmjhprfruwskmyualmip.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtamhwcmZydXdza215dWFsbWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTg2MTQsImV4cCI6MjA2OTIzNDYxNH0.chAK6FJb4oAFGO-amPkXOBrxh61Z4GW3Bdg3hx4F1yQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan: 'starter' | 'professional' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  user_id: string
  title: string
  description?: string
  topic: string
  status: 'draft' | 'generating' | 'completed' | 'published' | 'archived'
  thumbnail_url?: string
  estimated_duration?: number
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  description?: string
  order_index: number
  estimated_duration?: number
  created_at: string
  updated_at: string
}

export interface CourseLesson {
  id: string
  module_id: string
  course_id: string
  title: string
  content?: string
  content_type: 'text' | 'markdown' | 'video' | 'image' | 'audio' | 'document'
  order_index: number
  estimated_duration?: number
  video_url?: string
  thumbnail_url?: string
  attachments?: any[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CourseFile {
  id: string
  course_id: string
  lesson_id?: string
  file_name: string
  file_path: string
  file_type: string
  file_size?: number
  mime_type?: string
  bucket_name: string
  is_public: boolean
  metadata?: Record<string, any>
  created_at: string
}

export interface CourseGenerationLog {
  id: string
  course_id: string
  user_id: string
  status: 'started' | 'in_progress' | 'completed' | 'failed'
  progress: number
  current_step?: string
  error_message?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserCourseProgress {
  id: string
  user_id: string
  course_id: string
  lesson_id?: string
  completed: boolean
  progress_percentage: number
  time_spent: number
  last_accessed: string
  created_at: string
}

// Database helper functions
export const db = {
  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Course operations
  async getCourses(userId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getCourse(courseId: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()
    
    if (error) throw error
    return data
  },

  async createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteCourse(courseId: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
    
    if (error) throw error
  },

  // Course modules operations
  async getCourseModules(courseId: string): Promise<CourseModule[]> {
    const { data, error } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async createCourseModule(module: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>): Promise<CourseModule> {
    const { data, error } = await supabase
      .from('course_modules')
      .insert(module)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateCourseModule(moduleId: string, updates: Partial<CourseModule>): Promise<CourseModule> {
    const { data, error } = await supabase
      .from('course_modules')
      .update(updates)
      .eq('id', moduleId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteCourseModule(moduleId: string): Promise<void> {
    const { error } = await supabase
      .from('course_modules')
      .delete()
      .eq('id', moduleId)
    
    if (error) throw error
  },

  // Course lessons operations
  async getCourseLessons(moduleId: string): Promise<CourseLesson[]> {
    const { data, error } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async getCourseLesson(lessonId: string): Promise<CourseLesson | null> {
    const { data, error } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('id', lessonId)
      .single()
    
    if (error) throw error
    return data
  },

  async createCourseLesson(lesson: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>): Promise<CourseLesson> {
    const { data, error } = await supabase
      .from('course_lessons')
      .insert(lesson)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateCourseLesson(lessonId: string, updates: Partial<CourseLesson>): Promise<CourseLesson> {
    const { data, error } = await supabase
      .from('course_lessons')
      .update(updates)
      .eq('id', lessonId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteCourseLesson(lessonId: string): Promise<void> {
    const { error } = await supabase
      .from('course_lessons')
      .delete()
      .eq('id', lessonId)
    
    if (error) throw error
  },

  // Course files operations
  async getCourseFiles(courseId: string): Promise<CourseFile[]> {
    const { data, error } = await supabase
      .from('course_files')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createCourseFile(file: Omit<CourseFile, 'id' | 'created_at'>): Promise<CourseFile> {
    const { data, error } = await supabase
      .from('course_files')
      .insert(file)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteCourseFile(fileId: string): Promise<void> {
    const { error } = await supabase
      .from('course_files')
      .delete()
      .eq('id', fileId)
    
    if (error) throw error
  },

  // Generation logs operations
  async getGenerationLogs(courseId: string): Promise<CourseGenerationLog[]> {
    const { data, error } = await supabase
      .from('course_generation_logs')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createGenerationLog(log: Omit<CourseGenerationLog, 'id' | 'created_at' | 'updated_at'>): Promise<CourseGenerationLog> {
    const { data, error } = await supabase
      .from('course_generation_logs')
      .insert(log)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateGenerationLog(logId: string, updates: Partial<CourseGenerationLog>): Promise<CourseGenerationLog> {
    const { data, error } = await supabase
      .from('course_generation_logs')
      .update(updates)
      .eq('id', logId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get course with all content
  async getCourseWithContent(courseId: string): Promise<any> {
    const { data, error } = await supabase
      .rpc('get_course_with_content', { course_uuid: courseId })
    
    if (error) throw error
    return data
  }
}

// Storage helper functions
export const storage = {
  // Upload file to course-files bucket
  async uploadCourseFile(
    userId: string,
    courseId: string,
    file: File,
    fileName?: string
  ): Promise<{ path: string; url: string }> {
    const fileExt = file.name.split('.').pop()
    const finalFileName = fileName || `${Date.now()}.${fileExt}`
    const filePath = `${userId}/${courseId}/${finalFileName}`

    const { data, error } = await supabase.storage
      .from('course-files')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('course-files')
      .getPublicUrl(filePath)

    return { path: filePath, url: publicUrl }
  },

  // Upload thumbnail
  async uploadThumbnail(
    userId: string,
    courseId: string,
    file: File
  ): Promise<{ path: string; url: string }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `thumbnail-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${courseId}/${fileName}`

    const { data, error } = await supabase.storage
      .from('course-thumbnails')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('course-thumbnails')
      .getPublicUrl(filePath)

    return { path: filePath, url: publicUrl }
  },

  // Delete file
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  },

  // Get file URL
  getFileUrl(bucket: string, path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return publicUrl
  }
}