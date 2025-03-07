'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Course } from '@/lib/api';

interface CoursesPopupProps {
  courses: Course[];
  onClose: () => void;
}

export default function CoursesPopup({ courses, onClose }: CoursesPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Courses</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <Link 
            href="/courses" 
            className="text-blue-600 hover:underline block mb-4"
          >
            All Courses
          </Link>
          
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="border-b pb-4 last:border-b-0">
                <Link
                  href={`/courses/${course.id}`}
                  className="text-blue-600 hover:underline block mb-1"
                >
                  {course.name}
                </Link>
                <div className="text-sm text-gray-600">
                  {course.section}
                </div>
                <div className="text-sm text-gray-600">
                  Term: {course.term}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 text-sm text-gray-600 border-t">
          Welcome to your courses! To customize the list of courses, click on the "All Courses" link and star the courses to display.
        </div>
      </div>
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 -z-10"
        onClick={onClose}
      />
    </div>
  );
} 