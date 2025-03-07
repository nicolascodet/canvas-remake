'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { 
  CalendarIcon, 
  BellIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Dashboard, DashboardItem } from '@/lib/api';
import apiService from '@/lib/api';

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'EEEE, MMMM d');
  } catch (error) {
    console.error('Invalid date:', dateString);
    return 'Invalid date';
  }
};

const formatTime = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'h:mm a');
  } catch (error) {
    console.error('Invalid time:', dateString);
    return 'Invalid time';
  }
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiService.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Error Loading Dashboard</h1>
        <p>Unable to load your dashboard information. Please try again later.</p>
      </div>
    );
  }

  // Group upcoming items by date
  const itemsByDate: Record<string, DashboardItem[]> = {};
  
  dashboard.upcoming.forEach(item => {
    const date = item.type === 'event' 
      ? item.start_time 
      : item.type === 'assignment' 
        ? item.due_date 
        : item.date;
    
    const formattedDate = formatDate(date);
    
    if (!itemsByDate[formattedDate]) {
      itemsByDate[formattedDate] = [];
    }
    
    itemsByDate[formattedDate].push(item);
  });

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white">
            Today
          </button>
          <button className="text-gray-500 p-2">
            <PlusIcon className="h-6 w-6" />
          </button>
          <button className="text-gray-500 p-2">
            <CalendarIcon className="h-6 w-6" />
          </button>
          <button className="text-gray-500 p-2">
            <BellIcon className="h-6 w-6" />
          </button>
          <button className="text-gray-500 p-2">
            <EllipsisVerticalIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(itemsByDate).map(([date, items]) => (
          <div key={date} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{date}</h2>
            
            <div className="space-y-4">
              {items.map(item => {
                if (item.type === 'event') {
                  // Event item
                  const startTime = formatTime(item.start_time);
                  const endTime = formatTime(item.end_time);
                  const course = dashboard.courses.find(c => c.id === item.course_id);

                  return (
                    <div key={item.id} className="flex items-start border border-gray-200 rounded-md overflow-hidden">
                      <div className="w-16 h-16 bg-indigo-100 flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-indigo-500" />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="text-xs text-gray-500 uppercase mb-1">
                          {item.title} CALENDAR EVENT
                        </div>
                        <Link href={`/courses/${item.course_id}`} className="text-blue-600 hover:underline">
                          {item.title}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          {startTime} to {endTime}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.location}
                        </div>
                      </div>
                      <div className="px-4 flex items-center">
                        <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
                          Join
                        </button>
                      </div>
                    </div>
                  );
                } else if (item.type === 'assignment') {
                  // Assignment item
                  const course = dashboard.courses.find(c => c.id === item.course_id);
                  const dueTime = formatTime(item.due_date);

                  return (
                    <div key={item.id} className="flex items-start border border-gray-200 rounded-md overflow-hidden">
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-500">
                          {item.status === 'graded' && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                        </div>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="text-xs text-gray-500 uppercase mb-1">
                          {course?.code} ASSIGNMENT
                        </div>
                        <Link href={`/courses/${item.course_id}/assignments/${item.id}`} className="text-blue-600 hover:underline">
                          {item.title}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          Due: {dueTime}
                        </div>
                      </div>
                      <div className="px-4 py-4 flex items-center">
                        {item.status === 'graded' ? (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{item.points}</div>
                            <div className="text-xs text-gray-500">pts</div>
                            <div className="text-xs text-gray-500">
                              DUE: {formatTime(item.due_date)}
                            </div>
                          </div>
                        ) : (
                          <div className="border border-gray-300 px-3 py-1 rounded-md text-gray-600">
                            {item.status || 'Not Submitted'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else if (item.type === 'announcement') {
                  // Announcement item
                  return (
                    <div key={item.id} className="flex items-start border border-gray-200 rounded-md overflow-hidden">
                      <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
                        <div className="text-sm text-center text-blue-600">
                          <div>College</div>
                          <div>Homeroom</div>
                        </div>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="text-xs text-gray-500 uppercase mb-1">
                          {item.source} ANNOUNCEMENT
                        </div>
                        <Link href="#" className="text-blue-600 hover:underline">
                          {item.title}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.content}
                        </div>
                      </div>
                      <div className="px-4 py-4 text-right">
                        <div className="text-sm text-gray-500">
                          {formatTime(item.date)}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
