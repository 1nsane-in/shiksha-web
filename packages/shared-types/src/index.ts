export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'admin' | 'counselor'
}

export interface Application {
  id: string
  userId: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}
