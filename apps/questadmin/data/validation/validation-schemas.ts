// Input validation schemas for API endpoints
import { z } from 'zod'
import { UserRole } from '../config/firebase-auth'

/**
 * User validation schemas
 */
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT)
})

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  displayName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  department: z.string().max(100).optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional()
})

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

/**
 * Course validation schemas
 */
export const CreateCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(200),
  description: z.string().max(2000).optional(),
  instructorId: z.string().min(1, 'Instructor ID is required'),
  category: z.string().max(50).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  price: z.number().min(0).max(10000).optional(),
  duration: z.number().min(1).max(1000).optional(), // hours
  maxEnrollments: z.number().min(1).max(10000).optional(),
  prerequisites: z.array(z.string().max(100)).max(10).optional(),
  learningObjectives: z.array(z.string().max(200)).max(20).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  isPublished: z.boolean().default(false),
  
  // Language Configuration Fields
  primaryLanguage: z.string().min(2).max(5).optional(), // Language code (e.g., 'en', 'te')
  supportedLanguages: z.array(z.string().min(2).max(5)).min(1).max(10).optional(), // Array of language codes
  enableTranslation: z.boolean().default(false),
  
  // Multilingual Content Fields (optional - for future use)
  multilingualTitle: z.record(z.string().min(2).max(5), z.string().min(1).max(200)).optional(),
  multilingualDescription: z.record(z.string().min(2).max(5), z.string().max(2000)).optional(),
  multilingualTags: z.record(z.string().min(2).max(5), z.array(z.string().max(50))).optional(),
  multilingualSkills: z.record(z.string().min(2).max(5), z.array(z.string().max(100))).optional(),
  multilingualPrerequisites: z.record(z.string().min(2).max(5), z.array(z.string().max(100))).optional(),
  multilingualWhatYouWillLearn: z.record(z.string().min(2).max(5), z.array(z.string().max(200))).optional(),
  multilingualTargetAudience: z.record(z.string().min(2).max(5), z.array(z.string().max(100))).optional(),
})

export const UpdateCourseSchema = CreateCourseSchema.partial().omit({
  instructorId: true // Cannot change instructor via update
})

/**
 * Course topic validation schemas
 */
export const CreateTopicSchema = z.object({
  title: z.string().min(1, 'Topic title is required').max(200),
  description: z.string().max(2000).optional(),
  order: z.number().min(1).max(100).default(1),
  duration: z.number().min(1).max(600).optional(), // minutes
  videoUrl: z.string().url().or(z.literal('')).optional(),
  materials: z.array(z.object({
    type: z.enum(['pdf', 'video', 'audio', 'document', 'link']),
    title: z.string().min(1).max(100),
    url: z.string().url(),
    description: z.string().max(500).optional(),
    // Multilingual material fields
    multilingualTitle: z.record(z.string().min(2).max(5), z.string().min(1).max(100)).optional(),
    multilingualDescription: z.record(z.string().min(2).max(5), z.string().max(500)).optional(),
  })).max(10).optional(),
  isPublished: z.boolean().default(false),
  prerequisites: z.array(z.string().uuid()).max(5).optional(),
  learningObjectives: z.array(z.string().max(200)).max(10).optional(),
  
  // Multilingual Content Fields (optional - for future use)
  multilingualTitle: z.record(z.string().min(2).max(5), z.string().min(1).max(200)).optional(),
  multilingualDescription: z.record(z.string().min(2).max(5), z.string().max(2000)).optional(),
  multilingualLearningObjectives: z.record(z.string().min(2).max(5), z.array(z.string().max(200))).optional(),
  multilingualSummary: z.record(z.string().min(2).max(5), z.string().max(1000)).optional(),
  multilingualNotes: z.record(z.string().min(2).max(5), z.string().max(2000)).optional(),
})

export const UpdateTopicSchema = CreateTopicSchema.partial()

/**
 * Query parameter validation schemas
 */
export const PaginationSchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(0)).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1)).optional()
})

export const SearchSchema = z.object({
  search: z.string().max(100).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  category: z.string().max(50).optional()
})

export const CourseQuerySchema = PaginationSchema.merge(SearchSchema).extend({
  instructorId: z.string().uuid().optional(),
  stats: z.string().regex(/^(true|false)$/).transform(val => val === 'true').optional()
})

export const UserQuerySchema = PaginationSchema.extend({
  search: z.string().max(100).optional(),
  role: z.nativeEnum(UserRole).optional(),
  stats: z.string().regex(/^(true|false)$/).transform((val: string) => val === 'true').optional()
})

/**
 * Validation helper functions
 */
export function validateRequestBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`)
      return { success: false, error: messages.join(', ') }
    }
    return { success: false, error: 'Invalid request data' }
  }
}

export function validateQueryParams<T>(schema: z.ZodSchema<T>, params: URLSearchParams): { success: true; data: T } | { success: false; error: string } {
  try {
    const data: Record<string, string> = {}
    params.forEach((value, key) => {
      data[key] = value
    })
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`)
      return { success: false, error: messages.join(', ') }
    }
    return { success: false, error: 'Invalid query parameters' }
  }
}

/**
 * Sanitization functions
 */
export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - replace with proper library like DOMPurify in production
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 255)
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}
