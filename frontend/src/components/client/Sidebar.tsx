'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import CoursesPopup from './CoursesPopup';
import AccountPopup from './AccountPopup';
import { Course } from '@/lib/api';
import apiService from '@/lib/api';

// Icons
import {
  HomeIcon,
  AcademicCapIcon,
  CalendarIcon,
  InboxIcon,
  BookOpenIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const sidebarItems = [
  { name: 'Account', icon: UserCircleIcon, href: '/account' },
  { name: 'Dashboard', icon: HomeIcon, href: '/' },
  { name: 'Calendar', icon: CalendarIcon, href: '/calendar' },
  { name: 'Inbox', icon: InboxIcon, href: '/inbox' },
  { name: 'History', icon: ClockIcon, href: '/history' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showCoursesPopup, setShowCoursesPopup] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await apiService.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <div className="h-screen w-16 bg-[#2D3B45] flex flex-col items-center py-4">
        <div className="mb-6">
          <div className="h-10 w-10 bg-gray-500 rounded-full flex items-center justify-center text-white">
            <UserCircleIcon className="h-8 w-8" />
          </div>
        </div>
        
        <nav className="flex flex-col items-center space-y-6 flex-1">
          {/* Account Button */}
          <button
            onClick={() => setShowAccountPopup(true)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-md text-xs ${
              showAccountPopup
                ? 'text-white bg-[#0E6D95]'
                : 'text-gray-300 hover:text-white hover:bg-[#3D4C58]'
            }`}
          >
            <UserCircleIcon className="h-6 w-6 mb-1" />
            <span className="text-[10px]">Account</span>
          </button>

          {/* Dashboard */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-md text-xs ${
              pathname === '/'
                ? 'text-white bg-[#0E6D95]'
                : 'text-gray-300 hover:text-white hover:bg-[#3D4C58]'
            }`}
          >
            <HomeIcon className="h-6 w-6 mb-1" />
            <span className="text-[10px]">Dashboard</span>
          </Link>

          {/* Courses Button */}
          <button
            onClick={() => setShowCoursesPopup(true)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-md text-xs ${
              pathname.startsWith('/courses')
                ? 'text-white bg-[#0E6D95]'
                : 'text-gray-300 hover:text-white hover:bg-[#3D4C58]'
            }`}
          >
            <AcademicCapIcon className="h-6 w-6 mb-1" />
            <span className="text-[10px]">Courses</span>
          </button>

          {/* Other items */}
          {sidebarItems.slice(2).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-md text-xs ${
                pathname === item.href
                  ? 'text-white bg-[#0E6D95]'
                  : 'text-gray-300 hover:text-white hover:bg-[#3D4C58]'
              }`}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Courses Popup */}
      {showCoursesPopup && (
        <CoursesPopup
          courses={courses}
          onClose={() => setShowCoursesPopup(false)}
        />
      )}

      {/* Account Popup */}
      {showAccountPopup && (
        <AccountPopup
          userName="Nicolas Codet"
          onClose={() => setShowAccountPopup(false)}
        />
      )}
    </>
  );
} 