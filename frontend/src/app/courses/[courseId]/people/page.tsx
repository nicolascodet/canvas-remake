'use client';

import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function PeoplePage() {
  const people = {
    teachers: [
      {
        id: 1,
        name: "Dr. Meme Lord",
        role: "Professor of Memeology",
        lastActive: "Just now",
        email: "memelord@university.edu"
      },
      {
        id: 2,
        name: "Professor Sleepy",
        role: "Napping Expert",
        lastActive: "2 hours ago (probably napping)",
        email: "zzz@university.edu"
      }
    ],
    students: [
      {
        id: 1,
        name: "Professional Procrastinator",
        role: "Student",
        lastActive: "Deadline minus 5 minutes",
        email: "lastminute@university.edu"
      },
      {
        id: 2,
        name: "Pizza Philosopher",
        role: "Student",
        lastActive: "During dinner time",
        email: "pineapple@university.edu"
      },
      {
        id: 3,
        name: "Netflix Navigator",
        role: "Student",
        lastActive: "Currently binge-watching",
        email: "onemore@university.edu"
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Teachers Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Teachers</h2>
        <div className="bg-white rounded-lg border">
          {people.teachers.map((person) => (
            <div key={person.id} className="p-4 border-b last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">{person.name}</h3>
                  <p className="text-sm text-gray-600">{person.role}</p>
                  <p className="text-sm text-gray-500">
                    Last active: {person.lastActive}
                  </p>
                  <p className="text-sm text-blue-600">{person.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Students</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            + Add People
          </button>
        </div>
        <div className="bg-white rounded-lg border">
          {people.students.map((person) => (
            <div key={person.id} className="p-4 border-b last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium">{person.name}</h3>
                  <p className="text-sm text-gray-600">{person.role}</p>
                  <p className="text-sm text-gray-500">
                    Last active: {person.lastActive}
                  </p>
                  <p className="text-sm text-blue-600">{person.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 