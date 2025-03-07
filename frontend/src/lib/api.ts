import axios from 'axios';

// API base URL - will be different in development and production
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Types based on backend models
export interface Course {
  id: string;
  code: string;
  name: string;
  color?: string;
  section?: string;
  term?: string;
  description?: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  due_date: string; // ISO date string
  points?: number;
  status?: 'graded' | 'submitted' | 'not submitted';
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  start_time: string; // ISO date string
  end_time: string; // ISO date string
  location?: string;
  course_id?: string;
  description?: string;
}

export interface Announcement {
  id: string;
  source: string;
  title: string;
  content: string;
  date: string; // ISO date string
}

export interface DiscussionPost {
  id: string;
  course_id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  replies_count: number;
}

export interface DiscussionReply {
  id: string;
  post_id: string;
  content: string;
  author: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: number;
  points: number;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  due_date: string;
  time_limit_minutes?: number;
  questions: QuizQuestion[];
  total_points: number;
}

export interface QuizSubmission {
  quiz_id: string;
  student_id: string;
  answers: number[];
  score?: number;
  submitted_at: string;
}

export type DashboardItem = 
  | ({ type: 'assignment' } & Assignment)
  | ({ type: 'event' } & Event)
  | ({ type: 'announcement' } & Announcement);

export interface Dashboard {
  courses: Course[];
  upcoming: DashboardItem[];
}

// API functions
export const apiService = {
  // Courses
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourse: async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Assignments
  getAssignments: async (): Promise<Assignment[]> => {
    const response = await api.get('/assignments');
    return response.data;
  },

  getAssignment: async (id: string): Promise<Assignment> => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  // Events
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },

  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    const response = await api.get('/announcements');
    return response.data;
  },

  // Dashboard
  getDashboard: async (): Promise<Dashboard> => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Discussion methods
  getCourseDiscussions: async (courseId: string): Promise<DiscussionPost[]> => {
    const response = await fetch(`${apiBaseUrl}/courses/${courseId}/discussions`);
    return response.json();
  },

  getDiscussionReplies: async (postId: string): Promise<DiscussionReply[]> => {
    const response = await fetch(`${apiBaseUrl}/discussions/${postId}/replies`);
    return response.json();
  },

  createDiscussion: async (courseId: string, title: string, content: string): Promise<DiscussionPost> => {
    const response = await fetch(`${apiBaseUrl}/courses/${courseId}/discussions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    return response.json();
  },

  createReply: async (postId: string, content: string): Promise<DiscussionReply> => {
    const response = await fetch(`${apiBaseUrl}/discussions/${postId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // Quiz methods
  getCourseQuizzes: async (courseId: string): Promise<Quiz[]> => {
    const response = await fetch(`${apiBaseUrl}/courses/${courseId}/quizzes`);
    return response.json();
  },

  getQuiz: async (quizId: string): Promise<Quiz> => {
    const response = await fetch(`${apiBaseUrl}/quizzes/${quizId}`);
    return response.json();
  },

  submitQuiz: async (quizId: string, answers: number[]): Promise<QuizSubmission> => {
    const response = await fetch(`${apiBaseUrl}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    return response.json();
  },
};

export default apiService; 