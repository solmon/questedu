import { Timestamp } from 'firebase-admin/firestore'

// Course data model interface
export interface Course {
  id?: string
  title: string
  description: string
  instructor: string
  instructorId: string
  category: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  price?: number
  currency?: string
  duration?: number // Duration in hours
  status: 'draft' | 'published' | 'archived'
  isPublished: boolean
  featured?: boolean
  rating?: number
  ratingCount?: number
  enrollmentCount?: number
  tags?: string[]
  skills?: string[]
  prerequisites?: string[]
  objectives?: string[]
  syllabus?: string
  image?: string
  videoUrl?: string
  resources?: CourseResource[]
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
  createdBy?: string
}

export interface CourseResource {
  id: string
  title: string
  type: 'pdf' | 'video' | 'link' | 'document'
  url: string
  description?: string
}

export interface CreateCourseRequest {
  title: string
  description: string
  instructorId: string
  category: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  price?: number
  currency?: string
  duration?: number
  status?: 'draft' | 'published'
  featured?: boolean
  tags?: string[]
  skills?: string[]
  prerequisites?: string[]
  objectives?: string[]
  syllabus?: string
  image?: string
  videoUrl?: string
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string
  isPublished?: boolean
}

export interface CourseStats {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  archivedCourses: number
  totalEnrollments: number
  averageRating: number
  coursesByCategory: Record<string, number>
  coursesByLevel: Record<string, number>
}

export interface CourseSearchFilters {
  search?: string
  instructorId?: string
  category?: string
  level?: string
  status?: string
  featured?: boolean
  limit?: number
  browsing?: boolean
}
