'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Assignment } from '@/lib/api';
import apiService from '@/lib/api';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function AssignmentsPage() {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assignments</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          + Assignment
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="p-4 border-b last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                <ClipboardDocumentListIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-600">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Due: {new Date(assignment.due_date).toLocaleDateString()} | Points: {assignment.points}
                </p>
                <p className="text-sm text-gray-600">{assignment.description}</p>
                <div className="mt-2">
                  <span className={`text-sm px-2 py-1 rounded ${
                    assignment.status === 'graded' 
                      ? 'bg-green-100 text-green-800'
                      : assignment.status === 'submitted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 