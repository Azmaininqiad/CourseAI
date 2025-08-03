import { db, storage, Course, CourseModule, CourseLesson, CourseFile, CourseGenerationLog } from '@/lib/supabase'

export interface GeneratedCourseData {
  title: string
  description: string
  modules: {
    title: string
    description: string
    lessons: {
      title: string
      content: string
      video_url?: string
      estimated_duration?: number
    }[]
  }[]
  estimated_duration: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

export class CourseService {
  // Generate course using your backend
  static async generateCourse(
    userId: string,
    topic: string,
    onProgress?: (progress: number, step: string) => void
  ): Promise<Course> {
    // Create initial course record
    const course = await db.createCourse({
      user_id: userId,
      title: `Course: ${topic}`,
      topic,
      status: 'generating',
      description: `AI-generated course on ${topic}`,
    })

    // Create generation log
    const log = await db.createGenerationLog({
      course_id: course.id,
      user_id: userId,
      status: 'started',
      progress: 0,
      current_step: 'Initializing course generation',
    })

    try {
      // Call your backend to generate course content
      const response = await fetch('http://localhost:8000/generate_course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`)
      }

      // Update progress
      await db.updateGenerationLog(log.id, {
        status: 'in_progress',
        progress: 25,
        current_step: 'Generating course content',
      })
      onProgress?.(25, 'Generating course content')

      const generatedData: GeneratedCourseData = await response.json()

      // Update progress
      await db.updateGenerationLog(log.id, {
        progress: 50,
        current_step: 'Processing course structure',
      })
      onProgress?.(50, 'Processing course structure')

      // Update course with generated data
      const updatedCourse = await db.updateCourse(course.id, {
        title: generatedData.title,
        description: generatedData.description,
        estimated_duration: generatedData.estimated_duration,
        difficulty_level: generatedData.difficulty_level,
        tags: generatedData.tags,
      })

      // Create modules and lessons
      let moduleOrderIndex = 0
      for (const moduleData of generatedData.modules) {
        const module = await db.createCourseModule({
          course_id: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order_index: moduleOrderIndex++,
        })

        let lessonOrderIndex = 0
        for (const lessonData of moduleData.lessons) {
          await db.createCourseLesson({
            module_id: module.id,
            course_id: course.id,
            title: lessonData.title,
            content: lessonData.content,
            content_type: 'markdown',
            order_index: lessonOrderIndex++,
            video_url: lessonData.video_url,
            estimated_duration: lessonData.estimated_duration,
          })
        }
      }

      // Update progress
      await db.updateGenerationLog(log.id, {
        progress: 90,
        current_step: 'Finalizing course',
      })
      onProgress?.(90, 'Finalizing course')

      // Mark course as completed
      const finalCourse = await db.updateCourse(course.id, {
        status: 'completed',
      })

      // Complete generation log
      await db.updateGenerationLog(log.id, {
        status: 'completed',
        progress: 100,
        current_step: 'Course generation completed',
      })
      onProgress?.(100, 'Course generation completed')

      return finalCourse

    } catch (error) {
      // Mark course and log as failed
      await db.updateCourse(course.id, { status: 'draft' })
      await db.updateGenerationLog(log.id, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  // Get course with all content
  static async getCourseWithContent(courseId: string) {
    return await db.getCourseWithContent(courseId)
  }

  // Upload course file
  static async uploadCourseFile(
    userId: string,
    courseId: string,
    file: File,
    lessonId?: string
  ): Promise<CourseFile> {
    // Upload to storage
    const { path, url } = await storage.uploadCourseFile(userId, courseId, file)

    // Create file record
    const courseFile = await db.createCourseFile({
      course_id: courseId,
      lesson_id: lessonId,
      file_name: file.name,
      file_path: path,
      file_type: file.type.split('/')[0], // 'image', 'video', etc.
      file_size: file.size,
      mime_type: file.type,
      bucket_name: 'course-files',
      is_public: false,
    })

    return courseFile
  }

  // Upload course thumbnail
  static async uploadCourseThumbnail(
    userId: string,
    courseId: string,
    file: File
  ): Promise<string> {
    const { url } = await storage.uploadThumbnail(userId, courseId, file)
    
    // Update course with thumbnail URL
    await db.updateCourse(courseId, {
      thumbnail_url: url,
    })

    return url
  }

  // Delete course and all associated files
  static async deleteCourse(courseId: string): Promise<void> {
    // Get all course files
    const files = await db.getCourseFiles(courseId)

    // Delete files from storage
    for (const file of files) {
      try {
        await storage.deleteFile(file.bucket_name, file.file_path)
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }

    // Delete course (cascade will handle related records)
    await db.deleteCourse(courseId)
  }

  // Export course to different formats
  static async exportCourse(courseId: string, format: 'json' | 'markdown' | 'pdf'): Promise<Blob> {
    const courseData = await this.getCourseWithContent(courseId)
    
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(courseData, null, 2)], {
          type: 'application/json',
        })
      
      case 'markdown':
        const markdown = this.convertToMarkdown(courseData)
        return new Blob([markdown], {
          type: 'text/markdown',
        })
      
      case 'pdf':
        // For PDF export, you might want to use a library like jsPDF or puppeteer
        throw new Error('PDF export not implemented yet')
      
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }

  // Convert course data to markdown
  private static convertToMarkdown(courseData: any): string {
    const course = courseData.course
    const modules = courseData.modules || []
    
    let markdown = `# ${course.title}\n\n`
    
    if (course.description) {
      markdown += `${course.description}\n\n`
    }
    
    if (course.tags && course.tags.length > 0) {
      markdown += `**Tags:** ${course.tags.join(', ')}\n\n`
    }
    
    if (course.difficulty_level) {
      markdown += `**Difficulty:** ${course.difficulty_level}\n\n`
    }
    
    if (course.estimated_duration) {
      markdown += `**Estimated Duration:** ${course.estimated_duration} minutes\n\n`
    }
    
    markdown += '---\n\n'
    
    modules.forEach((moduleData: any, moduleIndex: number) => {
      const module = moduleData.module
      const lessons = moduleData.lessons || []
      
      markdown += `## Module ${moduleIndex + 1}: ${module.title}\n\n`
      
      if (module.description) {
        markdown += `${module.description}\n\n`
      }
      
      lessons.forEach((lesson: any, lessonIndex: number) => {
        markdown += `### Lesson ${moduleIndex + 1}.${lessonIndex + 1}: ${lesson.title}\n\n`
        
        if (lesson.content) {
          markdown += `${lesson.content}\n\n`
        }
        
        if (lesson.video_url) {
          markdown += `**Video:** [Watch Video](${lesson.video_url})\n\n`
        }
        
        if (lesson.estimated_duration) {
          markdown += `**Duration:** ${lesson.estimated_duration} minutes\n\n`
        }
        
        markdown += '---\n\n'
      })
    })
    
    return markdown
  }

  // Search courses
  static async searchCourses(userId: string, query: string): Promise<Course[]> {
    // This is a simple implementation. For better search, consider using Supabase's full-text search
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,topic.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get course statistics
  static async getCourseStats(courseId: string) {
    const courseData = await this.getCourseWithContent(courseId)
    const modules = courseData.modules || []
    
    let totalLessons = 0
    let totalDuration = 0
    
    modules.forEach((moduleData: any) => {
      const lessons = moduleData.lessons || []
      totalLessons += lessons.length
      
      lessons.forEach((lesson: any) => {
        if (lesson.estimated_duration) {
          totalDuration += lesson.estimated_duration
        }
      })
    })
    
    return {
      totalModules: modules.length,
      totalLessons,
      totalDuration,
      averageLessonDuration: totalLessons > 0 ? Math.round(totalDuration / totalLessons) : 0,
    }
  }
}