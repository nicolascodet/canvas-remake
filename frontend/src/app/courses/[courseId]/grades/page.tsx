'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Assignment } from '@/lib/api';
import apiService from '@/lib/api';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function GradesPage() {
  const params = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await apiService.getAssignments();
        setAssignments(data.filter(a => a.course_id === params.courseId));
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [params.courseId]);

  const totalPoints = assignments.reduce((sum, a) => sum + (a.points || 0), 0);
  const earnedPoints = assignments
    .filter(a => a.status === 'graded')
    .reduce((sum, a) => sum + (a.points || 0), 0);
  const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-2">Course Grade</h2>
        <div className="text-3xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
        <div className="text-sm text-gray-600">
          {earnedPoints} out of {totalPoints} points
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold">Assignment Grades</h3>
        </div>
        {assignments.map((assignment) => (
          <div key={assignment.id} className="p-4 border-b last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {assignment.status === 'graded' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {assignment.status === 'graded' ? (
                    <span className="text-green-600">{assignment.points} pts</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  out of {assignment.points} pts
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 