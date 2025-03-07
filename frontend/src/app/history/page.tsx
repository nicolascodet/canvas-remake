'use client';

import { useState } from 'react';
import Link from 'next/link';
import { XMarkIcon, HomeIcon, DocumentIcon, AcademicCapIcon, VideoCameraIcon, ClockIcon } from '@heroicons/react/24/outline';

interface HistoryItem {
  id: string;
  type: 'course' | 'video' | 'document' | 'quiz';
  title: string;
  course: {
    id: string;
    code: string;
    name: string;
  };
  timestamp: string;
  icon: any;
  link: string;
}

const sampleHistory: HistoryItem[] = [
  {
    id: '1',
    type: 'course',
    title: 'Course Home',
    course: {
      id: 'MEME-420',
      code: 'MEME-420',
      name: 'Advanced Memeology'
    },
    timestamp: '19 minutes ago',
    icon: HomeIcon,
    link: '/courses/MEME-420'
  },
  {
    id: '2',
    type: 'video',
    title: 'Video Lecture - Representation & Magazines',
    course: {
      id: 'JMS200',
      code: 'JMS200-01',
      name: 'Introduction to Contemporary Media'
    },
    timestamp: '5 hours ago',
    icon: VideoCameraIcon,
    link: '/courses/JMS200/modules/video-lecture'
  },
  {
    id: '3',
    type: 'document',
    title: 'JMS200Spr25 Representation:Magazines.docx',
    course: {
      id: 'JMS200',
      code: 'JMS200-01',
      name: 'Introduction to Contemporary Media'
    },
    timestamp: '5 hours ago',
    icon: DocumentIcon,
    link: '/courses/JMS200/files/magazines'
  },
  {
    id: '4',
    type: 'video',
    title: 'Video Lecture - Magazines Current Stuff',
    course: {
      id: 'JMS200',
      code: 'JMS200-01',
      name: 'Introduction to Contemporary Media'
    },
    timestamp: '5 hours ago',
    icon: VideoCameraIcon,
    link: '/courses/JMS200/modules/magazines'
  },
  {
    id: '5',
    type: 'quiz',
    title: 'Quiz #2 - Thurs March 6',
    course: {
      id: 'JMS200',
      code: 'JMS200-01',
      name: 'Introduction to Contemporary Media'
    },
    timestamp: '5 hours ago',
    icon: AcademicCapIcon,
    link: '/courses/JMS200/quizzes/2'
  },
  {
    id: '6',
    type: 'quiz',
    title: 'Midterm',
    course: {
      id: 'ENS122',
      code: 'ENS122-01',
      name: 'Sailing'
    },
    timestamp: 'Feb 28, 2025 5:40PM',
    icon: AcademicCapIcon,
    link: '/courses/ENS122/quizzes/midterm'
  }
];

export default function HistoryPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const displayedHistory = showAll ? sampleHistory : sampleHistory.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-semibold">Recent History</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:underline text-sm"
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="divide-y">
          {displayedHistory.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="flex items-start p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mr-4">
                <item.icon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {item.title}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {item.course.code} • {item.course.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {!showAll && sampleHistory.length > 3 && (
          <div className="p-4 text-center border-t">
            <button
              onClick={() => setShowAll(true)}
              className="text-blue-600 hover:underline text-sm"
            >
              Show {sampleHistory.length - 3} more items
            </button>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 -z-10"
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
} 