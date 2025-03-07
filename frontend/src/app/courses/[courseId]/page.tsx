'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Course, Assignment } from '@/lib/api';
import apiService from '@/lib/api';
import {
  ChevronDownIcon,
  DocumentIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export default function CoursePage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseData = await apiService.getCourse(params.courseId as string);
        const assignmentsData = await apiService.getAssignments();
        setCourse(courseData);
        setAssignments(assignmentsData.filter(a => a.course_id === params.courseId));
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [params.courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p>Unable to load course information. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Course Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Important Course Resources */}
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-t-lg">
              <h2 className="font-semibold flex items-center">
                <ChevronDownIcon className="h-5 w-5 mr-2" />
                Important Course Resources
              </h2>
            </div>
            <div className="border rounded-b-lg p-4">
              <div className="flex items-center space-x-2 text-blue-600 hover:underline mb-2">
                <DocumentIcon className="h-5 w-5" />
                <Link href="#">{course.code} Syllabus {course.term}.pdf</Link>
              </div>
              <div className="flex items-center space-x-2 text-blue-600 hover:underline">
                <DocumentIcon className="h-5 w-5" />
                <Link href="#">TEXTBOOK {course.name}.pdf</Link>
              </div>
            </div>
          </div>

          {/* Course Modules */}
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-t-lg">
              <h2 className="font-semibold flex items-center">
                <ChevronDownIcon className="h-5 w-5 mr-2" />
                {course.name} Content
              </h2>
            </div>
            <div className="border rounded-b-lg">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border-b last:border-b-0">
                  <Link 
                    href={`/courses/${course.id}/assignments/${assignment.id}`}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                      <DocumentIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-blue-600 hover:underline">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Due: {new Date(assignment.due_date).toLocaleDateString()} | Points: {assignment.points}
                      </p>
                      <p className="text-sm text-gray-600">{assignment.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h2 className="font-semibold mb-4">To Do</h2>
            {assignments
              .filter(a => a.status === 'not submitted')
              .map(assignment => (
                <div key={assignment.id} className="flex items-start space-x-2 mb-2">
                  <DocumentIcon className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <Link href={`/courses/${course.id}/assignments/${assignment.id}`} className="text-blue-600 hover:underline">
                      {assignment.title}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {assignment.points} points | Due {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h2 className="font-semibold mb-4">Recent Feedback</h2>
            {assignments
              .filter(a => a.status === 'graded')
              .map(assignment => (
                <div key={assignment.id} className="flex items-start space-x-2 mb-2">
                  <DocumentIcon className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <Link href={`/courses/${course.id}/assignments/${assignment.id}`} className="text-blue-600 hover:underline">
                      {assignment.title}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {assignment.points} out of {assignment.points} points
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 