'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Course } from '@/lib/api';
import apiService from '@/lib/api';
import {
  HomeIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await apiService.getCourse(params.courseId as string);
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  if (!course) return null;

  const navigation = [
    { name: 'Modules', href: `/courses/${course.id}` },
    { name: 'Assignments', href: `/courses/${course.id}/assignments` },
    { name: 'Discussions', href: `/courses/${course.id}/discussions` },
    { name: 'Quizzes', href: `/courses/${course.id}/quizzes` },
    { name: 'Grades', href: `/courses/${course.id}/grades` },
    { name: 'People', href: `/courses/${course.id}/people` },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Course Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-md">
            <HomeIcon className="h-6 w-6 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold">{course.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5" />
            <span>View Course Stream</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>View Course Calendar</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white flex items-center space-x-2">
            <BellIcon className="h-5 w-5" />
            <span>View Course Notifications</span>
          </button>
        </div>
      </div>

      {/* Course Navigation */}
      <nav className="flex space-x-6 border-b mb-6 text-sm">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`px-4 py-2 ${
              pathname === item.href
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
} 