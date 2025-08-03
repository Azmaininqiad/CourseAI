'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react'

interface CourseModule {
  filename: string
  title: string
  content: string
  module_number?: number
  enhanced?: boolean
  created_at?: number
  topic_folder?: string
}

interface TopicFolder {
  name: string
  courses: CourseModule[]
}

interface FolderViewProps {
  topicFolders: Record<string, CourseModule[]>
  onSelectCourse: (course: CourseModule) => void
  selectedCourse?: CourseModule | null
}

export default function FolderView({ topicFolders, onSelectCourse, selectedCourse }: FolderViewProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() => {
    // Initialize with all folders closed
    const initialState: Record<string, boolean> = {}
    Object.keys(topicFolders).forEach(folderName => {
      initialState[folderName] = false
    })
    return initialState
  })

  const toggleFolder = (folderName: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }))
  }

  const formatFolderName = (name: string) => {
    if (name === 'uncategorized') return 'Uncategorized'
    
    // Convert snake_case to Title Case
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  const formatFileName = (filename: string) => {
    // Remove file extension
    const nameWithoutExtension = filename.replace(/\.md$/, '')
    
    // Remove any numeric prefixes like "01_" or "02_"
    const nameWithoutPrefix = nameWithoutExtension.replace(/^\d+_/, '')
    
    // Convert snake_case to readable format
    return nameWithoutPrefix
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-3">
      {Object.keys(topicFolders).length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No courses available</p>
          <p className="text-sm mt-2">Create your first course to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(topicFolders).map(([folderName, courses]) => (
            <div key={folderName} className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/30">
              {/* Folder Header */}
              <div 
                className="flex items-center w-full p-4 text-left hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => toggleFolder(folderName)}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <Folder className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-gray-200">{formatFolderName(folderName)}</span>
                  <span className="text-xs text-gray-500 ml-2">({courses.length})</span>
                </div>
                {openFolders[folderName] ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {/* Folder Content */}
              {openFolders[folderName] && (
                <div className="border-t border-gray-800">
                  {courses.map((course) => (
                    <div
                      key={`${folderName}-${course.filename}`}
                      className={`flex items-center p-3 pl-6 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                        selectedCourse?.filename === course.filename ? 'bg-blue-900/20 border-l-2 border-blue-500' : ''
                      }`}
                      onClick={() => onSelectCourse(course)}
                    >
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-300">{course.title}</div>
                        <div className="text-xs text-gray-500">{formatFileName(course.filename)}</div>
                      </div>
                      {course.created_at && (
                        <div className="text-xs text-gray-500">
                          {new Date(course.created_at * 1000).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}